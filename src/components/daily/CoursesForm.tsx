
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dish, Menu } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import DishSelector from './DishSelector';

interface CoursesFormProps {
  date: Date | undefined;
  selectedMenuId: string | null;
  selectedFirstCourse: string | null;
  selectedSecondCourse: string | null;
  selectedDessert: string | null;
  currentMenuId: string | null;
  dishes: Dish[];
  menus: Menu[];
  onFirstCourseSelect: (dishId: string | null) => void;
  onSecondCourseSelect: (dishId: string | null) => void;
  onDessertSelect: (dishId: string | null) => void;
  onSave: () => void;
}

const CoursesForm: React.FC<CoursesFormProps> = ({
  date,
  selectedMenuId,
  selectedFirstCourse,
  selectedSecondCourse,
  selectedDessert,
  currentMenuId,
  dishes,
  menus,
  onFirstCourseSelect,
  onSecondCourseSelect,
  onDessertSelect,
  onSave,
}) => {
  const { t, language } = useLanguage();

  // Filter dishes by type
  const getDishesByType = (type: 'first' | 'second' | 'dessert') => {
    return dishes.filter(dish => dish.type === type);
  };

  // Selected menu name
  const selectedMenuName = selectedMenuId 
    ? menus.find(menu => menu.id === selectedMenuId)?.name[language] 
    : '';

  if (!date) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">
            {t({ 
              en: 'Please select a date from the calendar to plan your menu', 
              es: 'Por favor selecciona una fecha del calendario para planificar tu menú', 
              ca: 'Si us plau selecciona una data del calendari per planificar el teu menú' 
            })}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{format(date, 'PPPP')}</span>
          {selectedMenuId && <Badge>{selectedMenuName}</Badge>}
        </CardTitle>
        <CardDescription>
          {currentMenuId ? (
            t({ 
              en: 'Edit dishes for each course', 
              es: 'Editar platos para cada curso', 
              ca: 'Editar plats per a cada curs' 
            })
          ) : (
            t({ 
              en: 'Select dishes for each course', 
              es: 'Selecciona platos para cada curso', 
              ca: 'Selecciona plats per a cada curs' 
            })
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">
            {t({ en: 'First Course', es: 'Primer Plato', ca: 'Primer Plat' })}
          </h3>
          <DishSelector
            dishes={getDishesByType('first')}
            selectedDishId={selectedFirstCourse}
            onSelectDish={onFirstCourseSelect}
            placeholder={t({ 
              en: 'Select first course', 
              es: 'Selecciona primer plato', 
              ca: 'Selecciona primer plat' 
            })}
          />
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-sm font-medium mb-3">
            {t({ en: 'Second Course', es: 'Segundo Plato', ca: 'Segon Plat' })}
          </h3>
          <DishSelector
            dishes={getDishesByType('second')}
            selectedDishId={selectedSecondCourse}
            onSelectDish={onSecondCourseSelect}
            placeholder={t({ 
              en: 'Select second course', 
              es: 'Selecciona segundo plato', 
              ca: 'Selecciona segon plat' 
            })}
          />
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-sm font-medium mb-3">
            {t({ en: 'Dessert', es: 'Postre', ca: 'Postres' })}
          </h3>
          <DishSelector
            dishes={getDishesByType('dessert')}
            selectedDishId={selectedDessert}
            onSelectDish={onDessertSelect}
            placeholder={t({ 
              en: 'Select dessert', 
              es: 'Selecciona postre', 
              ca: 'Selecciona postres' 
            })}
          />
        </div>
        
        <div className="pt-4">
          <Button onClick={onSave} className="w-full sm:w-auto">
            {currentMenuId ? (
              t({ en: 'Update Daily Menu', es: 'Actualizar Menú Diario', ca: 'Actualitzar Menú Diari' })
            ) : (
              t({ en: 'Save Daily Menu', es: 'Guardar Menú Diario', ca: 'Guardar Menú Diari' })
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoursesForm;
