import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Field = Tables<'fields'>;
export type FieldInsert = TablesInsert<'fields'>;

export const useFields = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: fields = [], isLoading, error, refetch } = useQuery({
    queryKey: ['fields', user?.id],
    queryFn: async () => {
      // Fallback mock data if not authenticated or for demonstration
      const mockFields: Field[] = [
        {
          id: 'mock-field-1',
          name: 'North Valley Corn',
          crop_type: 'Corn',
          area: 45.2,
          user_id: user?.id || 'guest',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          planting_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          geometry: null
        },
        {
          id: 'mock-field-2',
          name: 'South Slope Wheat',
          crop_type: 'Wheat',
          area: 32.8,
          user_id: user?.id || 'guest',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          planting_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          geometry: null
        },
        {
          id: 'mock-field-3',
          name: 'East Meadow Soy',
          crop_type: 'Soybeans',
          area: 28.5,
          user_id: user?.id || 'guest',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          geometry: null
        }
      ];

      if (!user?.id) return mockFields;

      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch failed, using mock fields:', error);
        return mockFields;
      }

      return data && data.length > 0 ? data : mockFields;
    },
    enabled: true, // Always enable to allow mock data
  });

  const createField = useMutation({
    mutationFn: async (field: Omit<FieldInsert, 'user_id'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('fields')
        .insert({ ...field, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
    },
  });

  const updateField = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Field> & { id: string }) => {
      const { data, error } = await supabase
        .from('fields')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
    },
  });

  const deleteField = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('fields')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
    },
  });

  const getTotalArea = () => {
    return fields.reduce((sum, field) => sum + (field.area || 0), 0);
  };

  return {
    fields,
    isLoading,
    error,
    refetch,
    createField,
    updateField,
    deleteField,
    getTotalArea,
  };
};
