
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import DishList from '@/components/dishes/DishList';
import { useLanguage } from '@/context/LanguageContext';
import { Dish } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Dishes = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check for authentication and fetch dishes on component mount
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchDishes();
  }, [user, navigate]);
  
  // Fetch dishes from Supabase
  const fetchDishes = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Transform data to match the application's Dish type
        const formattedDishes: Dish[] = data.map(dish => ({
          id: dish.id,
          name: {
            en: dish.name_en,
            es: dish.name_es,
            ca: dish.name_ca
          },
          type: dish.type as 'first' | 'second' | 'dessert',
          createdAt: new Date(dish.created_at),
          updatedAt: new Date(dish.updated_at)
        }));
        
        setDishes(formattedDishes);
      }
    } catch (error) {
      console.error('Error fetching dishes:', error);
      toast({
        title: t({ 
          en: "Error loading dishes", 
          es: "Error al cargar los platos", 
          ca: "Error en carregar els plats" 
        }),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new dish
  const handleAddDish = async (dish: Dish) => {
    try {
      // Transform the dish to match Supabase table structure
      const { data, error } = await supabase
        .from('dishes')
        .insert({
          name_en: dish.name.en,
          name_es: dish.name.es,
          name_ca: dish.name.ca,
          type: dish.type,
          user_id: user?.id // Add the user_id field
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        // Add the new dish to state with proper formatting
        const newDish: Dish = {
          id: data.id,
          name: {
            en: data.name_en,
            es: data.name_es,
            ca: data.name_ca
          },
          type: data.type as 'first' | 'second' | 'dessert',
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        };
        
        setDishes(prevDishes => [newDish, ...prevDishes]);
      }
    } catch (error) {
      console.error('Error adding dish:', error);
      toast({
        title: t({ 
          en: "Error adding dish", 
          es: "Error al añadir el plato", 
          ca: "Error en afegir el plat" 
        }),
        variant: "destructive"
      });
    }
  };

  // Update an existing dish
  const handleUpdateDish = async (updatedDish: Dish) => {
    try {
      const { error } = await supabase
        .from('dishes')
        .update({
          name_en: updatedDish.name.en,
          name_es: updatedDish.name.es,
          name_ca: updatedDish.name.ca,
          type: updatedDish.type
        })
        .eq('id', updatedDish.id);
        
      if (error) {
        throw error;
      }
      
      // Update the dish in state
      setDishes(prevDishes =>
        prevDishes.map(dish => (dish.id === updatedDish.id ? updatedDish : dish))
      );
    } catch (error) {
      console.error('Error updating dish:', error);
      toast({
        title: t({ 
          en: "Error updating dish", 
          es: "Error al actualizar el plato", 
          ca: "Error en actualitzar el plat" 
        }),
        variant: "destructive"
      });
    }
  };

  // Delete a dish
  const handleDeleteDish = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dishes')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Remove the dish from state
      setDishes(prevDishes => prevDishes.filter(dish => dish.id !== id));
    } catch (error) {
      console.error('Error deleting dish:', error);
      toast({
        title: t({ 
          en: "Error deleting dish", 
          es: "Error al eliminar el plato", 
          ca: "Error en eliminar el plat" 
        }),
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container max-w-6xl mx-auto px-4 pt-24 pb-12">
        <div className="py-6">
          <h1 className="text-3xl font-bold tracking-tight mb-6">
            {t({ en: 'Dish Management', es: 'Gestión de Platos', ca: 'Gestió de Plats' })}
          </h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DishList
              dishes={dishes}
              onAdd={handleAddDish}
              onUpdate={handleUpdateDish}
              onDelete={handleDeleteDish}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dishes;
