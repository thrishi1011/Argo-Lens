import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import { useCallback } from 'react';

export type SatelliteData = Tables<'satellite_data'>;

// NDVI/EVI calculation functions
export const calculateNDVI = (nir: number, red: number): number => {
  if (nir + red === 0) return 0;
  return (nir - red) / (nir + red);
};

export const calculateEVI = (nir: number, red: number, blue: number): number => {
  const denominator = nir + 6 * red - 7.5 * blue + 1;
  if (denominator === 0) return 0;
  return 2.5 * ((nir - red) / denominator);
};

export const useSatelliteData = (fieldId?: string) => {
  const { user } = useAuth();

  const { data: satelliteData = [], isLoading, error, refetch } = useQuery({
    queryKey: ['satellite-data', fieldId, user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      let query = supabase
        .from('satellite_data')
        .select('*, fields!inner(user_id)')
        .order('captured_at', { ascending: false })
        .limit(30);

      if (fieldId) {
        query = query.eq('field_id', fieldId);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return (data || []).filter((r: any) => r.fields?.user_id === user.id);
    },
    enabled: !!user?.id,
  });

  // Get latest health data
  const getLatestHealth = useCallback((forFieldId?: string) => {
    const fieldData = forFieldId 
      ? satelliteData.filter(d => d.field_id === forFieldId)
      : satelliteData;
    
    if (fieldData.length === 0) {
      // Return simulated data if no real data
      const nir = 0.7 + Math.random() * 0.25;
      const red = 0.1 + Math.random() * 0.15;
      const blue = 0.05 + Math.random() * 0.1;
      
      const ndvi = calculateNDVI(nir, red);
      const evi = calculateEVI(nir, red, blue);
      const healthScore = Math.round(Math.min(100, Math.max(0, (ndvi * 80 + evi * 40))));
      
      return { ndvi, evi, healthScore };
    }

    const latest = fieldData[0];
    return {
      ndvi: latest.ndvi || 0,
      evi: latest.evi || 0,
      healthScore: latest.health_score || 0,
    };
  }, [satelliteData]);

  // Get NDVI trend for charts
  const getNDVITrend = useCallback((days = 30) => {
    if (satelliteData.length === 0) {
      // Generate mock trend data
      return Array.from({ length: days }, (_, i) => ({
        date: `Day ${i + 1}`,
        value: 0.65 + Math.random() * 0.25,
      }));
    }

    return satelliteData.slice(0, days).map((d) => ({
      date: new Date(d.captured_at).toLocaleDateString(),
      value: d.ndvi || 0,
    })).reverse();
  }, [satelliteData]);

  // Calculate average health across all fields
  const getAverageHealth = useCallback(() => {
    if (satelliteData.length === 0) return 75;
    
    const avg = satelliteData.reduce((sum, d) => sum + (d.health_score || 0), 0) / satelliteData.length;
    return Math.round(avg);
  }, [satelliteData]);

  return {
    satelliteData,
    isLoading,
    error,
    refetch,
    getLatestHealth,
    getNDVITrend,
    getAverageHealth,
  };
};
