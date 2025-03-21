
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import DailyPlanner from '@/components/daily/DailyPlanner';
import { useLanguage } from '@/context/LanguageContext';
import { DailyMenu, Dish, Menu } from '@/types';

const DailyPlannerPage = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [dailyMenus, setDailyMenus] = useState<DailyMenu[]>([]);
  const { t } = useLanguage();

  // Load data from localStorage on component mount
  useEffect(() => {
    // Load dishes
    const storedDishes = localStorage.getItem('dishes');
    if (storedDishes) {
      try {
        const parsedDishes = JSON.parse(storedDishes);
        const dishesWithDates = parsedDishes.map((dish: any) => ({
          ...dish,
          createdAt: new Date(dish.createdAt),
          updatedAt: new Date(dish.updatedAt),
        }));
        setDishes(dishesWithDates);
      } catch (error) {
        console.error('Error parsing stored dishes:', error);
      }
    }

    // Load menus
    const storedMenus = localStorage.getItem('menus');
    if (storedMenus) {
      try {
        const parsedMenus = JSON.parse(storedMenus);
        const menusWithDates = parsedMenus.map((menu: any) => ({
          ...menu,
          createdAt: new Date(menu.createdAt),
          updatedAt: new Date(menu.updatedAt),
        }));
        setMenus(menusWithDates);
      } catch (error) {
        console.error('Error parsing stored menus:', error);
      }
    }

    // Load daily menus
    const storedDailyMenus = localStorage.getItem('dailyMenus');
    if (storedDailyMenus) {
      try {
        const parsedDailyMenus = JSON.parse(storedDailyMenus);
        const dailyMenusWithDates = parsedDailyMenus.map((dailyMenu: any) => ({
          ...dailyMenu,
          date: new Date(dailyMenu.date),
          createdAt: new Date(dailyMenu.createdAt),
          updatedAt: new Date(dailyMenu.updatedAt),
        }));
        setDailyMenus(dailyMenusWithDates);
      } catch (error) {
        console.error('Error parsing stored daily menus:', error);
      }
    }
  }, []);

  // Save daily menus to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dailyMenus', JSON.stringify(dailyMenus));
  }, [dailyMenus]);

  // Save a daily menu (add or update)
  const handleSaveDailyMenu = (dailyMenu: DailyMenu) => {
    setDailyMenus((prevDailyMenus) => {
      const existingIndex = prevDailyMenus.findIndex((menu) => menu.id === dailyMenu.id);
      
      if (existingIndex !== -1) {
        // Update existing menu
        const updatedMenus = [...prevDailyMenus];
        updatedMenus[existingIndex] = dailyMenu;
        return updatedMenus;
      } else {
        // Add new menu
        return [...prevDailyMenus, dailyMenu];
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container max-w-6xl mx-auto px-4 pt-24 pb-12">
        <div className="py-6">
          <h1 className="text-3xl font-bold tracking-tight mb-6">
            {t({ en: 'Daily Menu Planner', es: 'Planificador de Menú Diario', ca: 'Planificador de Menú Diari' })}
          </h1>
          
          <DailyPlanner
            dishes={dishes}
            menus={menus}
            dailyMenus={dailyMenus}
            onSaveDailyMenu={handleSaveDailyMenu}
          />
        </div>
      </main>
    </div>
  );
};

export default DailyPlannerPage;
