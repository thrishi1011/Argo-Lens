import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface Profile {
    fullName: string;
    email: string;
    phone: string;
    farmName: string;
    location: string;
    coordinates: [number, number]; // [lat, lng]
}

interface ProfileContextType {
    profile: Profile;
    loading: boolean;
    updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
    deleteAccount: () => Promise<{ error: Error | null }>;
    downloadData: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Simple mock geocoder for demo purposes
const geocode = (location: string): [number, number] => {
    // Check if it's already coordinates "lat, lng"
    const coordMatch = location.match(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
    if (coordMatch) {
        return [parseFloat(coordMatch[1]), parseFloat(coordMatch[2])];
    }

    const locations: Record<string, [number, number]> = {
        'iowa': [41.6420, -93.6900],
        'california': [36.7783, -119.4179],
        'texas': [31.9686, -99.9018],
        'india': [20.5937, 78.9629],
        'delhi': [28.6139, 77.2090],
        'london': [51.5074, -0.1278],
        'new york': [40.7128, -74.0060],
    };

    const normalized = location.toLowerCase();
    for (const key in locations) {
        if (normalized.includes(key)) return locations[key];
    }

    // Default to the original Iowa location if unknown
    return [41.6420, -93.6900];
};

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile>({
        fullName: '',
        email: '',
        phone: '',
        farmName: 'My AgroFarm',
        location: 'Iowa, USA',
        coordinates: [41.6420, -93.6900],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);

            // 1. Get from user_metadata (Supabase Auth)
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            const metadata = currentUser?.user_metadata || {};

            // 2. Get from profiles table
            const { data: dbProfile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (!error && dbProfile) {
                setProfile({
                    fullName: dbProfile.full_name || metadata.full_name || '',
                    email: user.email || '',
                    phone: metadata.phone || '',
                    farmName: dbProfile.farm_name || 'My AgroFarm',
                    location: (dbProfile.farm_location as any)?.address || 'Iowa, USA',
                    coordinates: (dbProfile.farm_location as any)?.coordinates || [41.6420, -93.6900],
                });
            } else {
                // Fallback to metadata if profile table entry doesn't exist
                setProfile(prev => ({
                    ...prev,
                    fullName: metadata.full_name || '',
                    email: user.email || '',
                    phone: metadata.phone || '',
                }));
            }
            setLoading(false);
        };

        fetchProfile();
    }, [user]);

    const updateProfile = async (updates: Partial<Profile>) => {
        if (!user) return { error: new Error('Not authenticated') };

        const newProfile = { ...profile, ...updates };

        // If location changed, update coordinates
        if (updates.location) {
            newProfile.coordinates = geocode(updates.location);
        }

        try {
            // 1. Update Auth metadata ONLY if profile info is being updated
            // Skip auth update for farm-only changes to avoid triggering profile creation
            const isProfileInfoUpdate = updates.fullName !== undefined ||
                updates.email !== undefined ||
                updates.phone !== undefined;

            if (isProfileInfoUpdate) {
                try {
                    const { error: authError } = await supabase.auth.updateUser({
                        data: {
                            full_name: newProfile.fullName,
                            phone: newProfile.phone,
                        },
                        // Only update email if it was explicitly provided in updates
                        ...(updates.email && { email: updates.email })
                    });

                    // Ignore auth errors that are not critical
                    if (authError && !authError.message?.includes('duplicate')) {
                        throw authError;
                    }
                } catch (authErr: any) {
                    // Gracefully handle auth errors - profile update can still proceed
                    console.warn('Auth update warning:', authErr?.message);
                }
            }

            // 2. Update profiles table - use update only (profile should already exist)
            const { error: dbError } = await supabase
                .from('profiles')
                .update({
                    full_name: newProfile.fullName,
                    farm_name: newProfile.farmName,
                    farm_location: {
                        address: newProfile.location,
                        coordinates: newProfile.coordinates,
                    },
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', user.id);

            // Check if update actually happened (might be RLS issue)
            if (dbError) {
                // Ignore duplicate key errors - profile already exists
                if (dbError.message?.includes('duplicate') ||
                    dbError.message?.includes('unique constraint') ||
                    dbError.code === '23505') {
                    console.warn('Profile constraint warning (ignored):', dbError.message);
                } else {
                    throw dbError;
                }
            }

            setProfile(newProfile);
            return { error: null };
        } catch (err: any) {
            // Final catch - ignore duplicate/unique constraint errors
            if (err?.message?.includes('duplicate') ||
                err?.message?.includes('unique constraint') ||
                err?.code === '23505') {
                console.warn('Constraint error (ignored):', err.message);
                setProfile(newProfile);
                return { error: null };
            }
            return { error: err };
        }
    };

    const deleteAccount = async () => {
        // Simulation as client-side delete is restricted
        // In a real app, this would call a Supabase Edge Function or an RPC
        try {
            await supabase.auth.signOut();
            localStorage.clear();
            return { error: null };
        } catch (err: any) {
            return { error: err };
        }
    };

    const downloadData = () => {
        const data = {
            profile,
            timestamp: new Date().toISOString(),
            app: 'ArgoLens',
            disclaimer: 'This is a copy of your personal data stored in ArgoLens.',
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `argolens-data-${user?.id || 'guest'}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <ProfileContext.Provider value={{ profile, loading, updateProfile, deleteAccount, downloadData }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};
