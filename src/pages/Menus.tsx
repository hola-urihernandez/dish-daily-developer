
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MenuList from '@/components/menus/MenuList';
import { useLanguage } from '@/context/LanguageContext';
import { Menu } from '@/types';

const Menus = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const { t } = useLanguage();

  // Load menus from localStorage on component mount
  useEffect(() => {
    const storedMenus = localStorage.getItem('menus');
    if (storedMenus) {
      try {
        const parsedMenus = JSON.parse(storedMenus);
        
        // Convert date strings back to Date objects
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
  }, []);

  // Save menus to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('menus', JSON.stringify(menus));
  }, [menus]);

  // Add a new menu
  const handleAddMenu = (menu: Menu) => {
    setMenus((prevMenus) => [...prevMenus, menu]);
  };

  // Update an existing menu
  const handleUpdateMenu = (updatedMenu: Menu) => {
    setMenus((prevMenus) =>
      prevMenus.map((menu) => (menu.id === updatedMenu.id ? updatedMenu : menu))
    );
  };

  // Delete a menu
  const handleDeleteMenu = (id: string) => {
    setMenus((prevMenus) => prevMenus.filter((menu) => menu.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container max-w-6xl mx-auto px-4 pt-24 pb-12">
        <div className="py-6">
          <h1 className="text-3xl font-bold tracking-tight mb-6">
            {t({ en: 'Menu Management', es: 'Gestión de Menús', ca: 'Gestió de Menús' })}
          </h1>
          
          <MenuList
            menus={menus}
            onAdd={handleAddMenu}
            onUpdate={handleUpdateMenu}
            onDelete={handleDeleteMenu}
          />
        </div>
      </main>
    </div>
  );
};

export default Menus;
