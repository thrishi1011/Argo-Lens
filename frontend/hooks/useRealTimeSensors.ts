import { useEffect, useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

export type SensorReading = Tables<'sensor_readings'>;

interface SensorStats {
  soilMoisture: number;
  temperature: number;
  humidity: number;
  phLevel: number;
  lightIntensity: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

export const useRealTimeSensors = (fieldId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLive, setIsLive] = useState(true);

  // Fetch latest sensor readings
  const { data: readings = [], isLoading, error, refetch } = useQuery({
    queryKey: ['sensor-readings', fieldId, user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      let query = supabase
        .from('sensor_readings')
        .select('*, fields!inner(user_id)')
        .order('recorded_at', { ascending: false })
        .limit(100);

      if (fieldId) {
        query = query.eq('field_id', fieldId);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Filter by user's fields
      return (data || []).filter((r: any) => r.fields?.user_id === user.id);
    },
    enabled: !!user?.id,
    refetchInterval: isLive ? 5000 : false,
  });

  // Real-time subscription
  useEffect(() => {
    if (!user?.id || !isLive) return;

    const channel = supabase
      .channel('sensor-readings-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_readings',
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['sensor-readings'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, isLive, queryClient]);

  // Calculate current stats from latest readings
  const getCurrentStats = useCallback((): SensorStats => {
    if (readings.length === 0) {
      // Return simulated data if no real data
      const hour = new Date().getHours();
      const tempBase = hour >= 10 && hour <= 16 ? 32 : 24;
      const humidityBase = hour >= 6 && hour <= 10 ? 75 : 55;
      
      return {
        soilMoisture: Math.round(35 + Math.random() * 30),
        temperature: Math.round(tempBase + (Math.random() * 6 - 3)),
        humidity: Math.round(humidityBase + (Math.random() * 20 - 10)),
        phLevel: Number((6.0 + Math.random() * 1.0).toFixed(1)),
        lightIntensity: hour >= 6 && hour <= 18 
          ? Math.round(40000 + Math.random() * 20000)
          : Math.round(100 + Math.random() * 200),
        nitrogen: Math.round(150 + Math.random() * 100),
        phosphorus: Math.round(30 + Math.random() * 30),
        potassium: Math.round(150 + Math.random() * 100),
      };
    }

    const latest = readings[0];
    return {
      soilMoisture: latest.soil_moisture || 0,
      temperature: latest.temperature || 0,
      humidity: latest.humidity || 0,
      phLevel: latest.ph_level || 6.5,
      lightIntensity: latest.light_intensity || 0,
      nitrogen: latest.nitrogen || 0,
      phosphorus: latest.phosphorus || 0,
      potassium: latest.potassium || 0,
    };
  }, [readings]);

  // Generate history for charts
  const getHistory = useCallback((metric: keyof SensorStats, limit = 24) => {
    return readings.slice(0, limit).map((reading) => ({
      date: new Date(reading.recorded_at).toLocaleTimeString(),
      value: reading[metric as keyof SensorReading] as number || 0,
    })).reverse();
  }, [readings]);

  return {
    readings,
    isLoading,
    error,
    refetch,
    isLive,
    setIsLive,
    getCurrentStats,
    getHistory,
    sensorData: getCurrentStats(),
  };
};
