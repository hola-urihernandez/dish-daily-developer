
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import DishList from '@/components/dishes/DishList';
import { useLanguage } from '@/context/LanguageContext';
import { Dish } from '@/types';

const Dishes = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const { t } = useLanguage();

  // Load dishes from localStorage on component mount
  useEffect(() => {
    const storedDishes = localStorage.getItem('dishes');
    if (storedDishes) {
      try {
        const parsedDishes = JSON.parse(storedDishes);
        
        // Convert date strings back to Date objects
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
  }, []);

  // Save dishes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dishes', JSON.stringify(dishes));
  }, [dishes]);

  // Add a new dish
  const handleAddDish = (dish: Dish) => {
    setDishes((prevDishes) => [...prevDishes, dish]);
  };

  // Update an existing dish
  const handleUpdateDish = (updatedDish: Dish) => {
    setDishes((prevDishes) =>
      prevDishes.map((dish) => (dish.id === updatedDish.id ? updatedDish : dish))
    );
  };

  // Delete a dish
  const handleDeleteDish = (id: string) => {
    setDishes((prevDishes) => prevDishes.filter((dish) => dish.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container max-w-6xl mx-auto px-4 pt-24 pb-12">
        <div className="py-6">
          <h1 className="text-3xl font-bold tracking-tight mb-6">
            {t({ en: 'Dish Management', es: 'Gestión de Platos', ca: 'Gestió de Plats' })}
          </h1>
          
          <DishList
            dishes={dishes}
            onAdd={handleAddDish}
            onUpdate={handleUpdateDish}
            onDelete={handleDeleteDish}
          />
        </div>
      </main>
    </div>
  );
};

export default Dishes;
