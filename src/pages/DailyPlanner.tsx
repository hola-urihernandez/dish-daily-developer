
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import DailyPlanner from '@/components/daily/DailyPlanner';
import { useLanguage } from '@/context/LanguageContext';
import { DailyMenu, Dish, Menu } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const DailyPlannerPage = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [dailyMenus, setDailyMenus] = useState<DailyMenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for authentication and fetch data on component mount
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchData();
  }, [user, navigate]);

  // Fetch all required data from Supabase
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch dishes
      const { data: dishesData, error: dishesError } = await supabase
        .from('dishes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (dishesError) throw dishesError;
      
      // Fetch menus
      const { data: menusData, error: menusError } = await supabase
        .from('menus')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (menusError) throw menusError;
      
      // Fetch daily menus
      const { data: dailyMenusData, error: dailyMenusError } = await supabase
        .from('daily_menus')
        .select('*')
        .order('date', { ascending: false });
      
      if (dailyMenusError) throw dailyMenusError;
      
      // Transform data to match application types
      if (dishesData) {
        const formattedDishes: Dish[] = dishesData.map(dish => ({
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
      
      if (menusData) {
        const formattedMenus: Menu[] = menusData.map(menu => ({
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
      
      if (dailyMenusData) {
        const formattedDailyMenus: DailyMenu[] = dailyMenusData.map(dailyMenu => ({
          id: dailyMenu.id,
          date: new Date(dailyMenu.date),
          menuId: dailyMenu.menu_id || '',
          firstCourse: dailyMenu.first_course_id,
          secondCourse: dailyMenu.second_course_id,
          dessert: dailyMenu.dessert_id,
          createdAt: new Date(dailyMenu.created_at),
          updatedAt: new Date(dailyMenu.updated_at)
        }));
        setDailyMenus(formattedDailyMenus);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: t({ 
          en: "Error loading data", 
          es: "Error al cargar los datos", 
          ca: "Error en carregar les dades" 
        }),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save a daily menu (add or update)
  const handleSaveDailyMenu = async (dailyMenu: DailyMenu) => {
    try {
      // Check if this is an update or insert
      const existingIndex = dailyMenus.findIndex(menu => menu.id === dailyMenu.id);
      
      // Format date for Supabase (YYYY-MM-DD)
      const formattedDate = dailyMenu.date.toISOString().split('T')[0];
      
      if (existingIndex !== -1) {
        // Update existing menu
        const { error } = await supabase
          .from('daily_menus')
          .update({
            date: formattedDate,
            menu_id: dailyMenu.menuId || null,
            first_course_id: dailyMenu.firstCourse,
            second_course_id: dailyMenu.secondCourse,
            dessert_id: dailyMenu.dessert
          })
          .eq('id', dailyMenu.id);
          
        if (error) throw error;
        
        // Update in state
        setDailyMenus(prevDailyMenus => {
          const updatedMenus = [...prevDailyMenus];
          updatedMenus[existingIndex] = dailyMenu;
          return updatedMenus;
        });
      } else {
        // Insert new menu
        const { data, error } = await supabase
          .from('daily_menus')
          .insert({
            date: formattedDate,
            menu_id: dailyMenu.menuId || null,
            first_course_id: dailyMenu.firstCourse,
            second_course_id: dailyMenu.secondCourse,
            dessert_id: dailyMenu.dessert,
            user_id: user?.id // Add the user_id field
          })
          .select()
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Add to state with proper formatting
          const newDailyMenu: DailyMenu = {
            id: data.id,
            date: new Date(data.date),
            menuId: data.menu_id || '',
            firstCourse: data.first_course_id,
            secondCourse: data.second_course_id,
            dessert: data.dessert_id,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at)
          };
          
          setDailyMenus(prevDailyMenus => [...prevDailyMenus, newDailyMenu]);
        }
      }
      
      toast({
        title: t({ 
          en: "Daily menu saved", 
          es: "Menú diario guardado", 
          ca: "Menú diari guardat" 
        })
      });
    } catch (error) {
      console.error('Error saving daily menu:', error);
      toast({
        title: t({ 
          en: "Error saving daily menu", 
          es: "Error al guardar el menú diario", 
          ca: "Error en guardar el menú diari" 
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
            {t({ en: 'Daily Menu Planner', es: 'Planificador de Menú Diario', ca: 'Planificador de Menú Diari' })}
          </h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DailyPlanner
              dishes={dishes}
              menus={menus}
              dailyMenus={dailyMenus}
              onSaveDailyMenu={handleSaveDailyMenu}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default DailyPlannerPage;
