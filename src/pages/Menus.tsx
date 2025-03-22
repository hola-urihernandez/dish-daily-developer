
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import MenuList from '@/components/menus/MenuList';
import { useLanguage } from '@/context/LanguageContext';
import { Menu } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Menus = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for authentication and fetch menus on component mount
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchMenus();
  }, [user, navigate]);
  
  // Fetch menus from Supabase
  const fetchMenus = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Transform data to match the application's Menu type
        const formattedMenus: Menu[] = data.map(menu => ({
          id: menu.id,
          name: {
            en: menu.name_en,
            es: menu.name_es,
            ca: menu.name_ca
          },
          description: {
            en: menu.description_en || '',
            es: menu.description_es || '',
            ca: menu.description_ca || ''
          },
          createdAt: new Date(menu.created_at),
          updatedAt: new Date(menu.updated_at)
        }));
        
        setMenus(formattedMenus);
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
      toast({
        title: t({ 
          en: "Error loading menus", 
          es: "Error al cargar los menús", 
          ca: "Error en carregar els menús" 
        }),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new menu
  const handleAddMenu = async (menu: Menu) => {
    try {
      // Transform the menu to match Supabase table structure
      const { data, error } = await supabase
        .from('menus')
        .insert({
          name_en: menu.name.en,
          name_es: menu.name.es,
          name_ca: menu.name.ca,
          description_en: menu.description?.en || '',
          description_es: menu.description?.es || '',
          description_ca: menu.description?.ca || '',
          user_id: user?.id // Add the user_id field
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        // Add the new menu to state with proper formatting
        const newMenu: Menu = {
          id: data.id,
          name: {
            en: data.name_en,
            es: data.name_es,
            ca: data.name_ca
          },
          description: {
            en: data.description_en || '',
            es: data.description_es || '',
            ca: data.description_ca || ''
          },
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        };
        
        setMenus(prevMenus => [newMenu, ...prevMenus]);
      }
    } catch (error) {
      console.error('Error adding menu:', error);
      toast({
        title: t({ 
          en: "Error adding menu", 
          es: "Error al añadir el menú", 
          ca: "Error en afegir el menú" 
        }),
        variant: "destructive"
      });
    }
  };

  // Update an existing menu
  const handleUpdateMenu = async (updatedMenu: Menu) => {
    try {
      const { error } = await supabase
        .from('menus')
        .update({
          name_en: updatedMenu.name.en,
          name_es: updatedMenu.name.es,
          name_ca: updatedMenu.name.ca,
          description_en: updatedMenu.description?.en || '',
          description_es: updatedMenu.description?.es || '',
          description_ca: updatedMenu.description?.ca || ''
        })
        .eq('id', updatedMenu.id);
        
      if (error) {
        throw error;
      }
      
      // Update the menu in state
      setMenus(prevMenus =>
        prevMenus.map(menu => (menu.id === updatedMenu.id ? updatedMenu : menu))
      );
    } catch (error) {
      console.error('Error updating menu:', error);
      toast({
        title: t({ 
          en: "Error updating menu", 
          es: "Error al actualizar el menú", 
          ca: "Error en actualitzar el menú" 
        }),
        variant: "destructive"
      });
    }
  };

  // Delete a menu
  const handleDeleteMenu = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menus')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Remove the menu from state
      setMenus(prevMenus => prevMenus.filter(menu => menu.id !== id));
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast({
        title: t({ 
          en: "Error deleting menu", 
          es: "Error al eliminar el menú", 
          ca: "Error en eliminar el menú" 
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
            {t({ en: 'Menu Management', es: 'Gestión de Menús', ca: 'Gestió de Menús' })}
          </h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <MenuList
              menus={menus}
              onAdd={handleAddMenu}
              onUpdate={handleUpdateMenu}
              onDelete={handleDeleteMenu}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Menus;
