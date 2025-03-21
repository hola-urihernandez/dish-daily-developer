
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { DailyMenu, Dish, Menu } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import DishSelector from './DishSelector';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';

// Create a UUID generator function
const generateId = () => uuidv4();

interface DailyPlannerProps {
  menus: Menu[];
  dishes: Dish[];
  dailyMenus: DailyMenu[];
  onSaveDailyMenu: (dailyMenu: DailyMenu) => void;
}

const DailyPlanner: React.FC<DailyPlannerProps> = ({
  menus,
  dishes,
  dailyMenus,
  onSaveDailyMenu,
}) => {
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedFirstCourse, setSelectedFirstCourse] = useState<string | null>(null);
  const [selectedSecondCourse, setSelectedSecondCourse] = useState<string | null>(null);
  const [selectedDessert, setSelectedDessert] = useState<string | null>(null);
  
  const { t, language } = useLanguage();
  const { toast } = useToast();

  // Find existing daily menu for selected date
  const findExistingDailyMenu = (date?: Date): DailyMenu | undefined => {
    if (!date) return undefined;
    
    return dailyMenus.find(
      (menu) => format(new Date(menu.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  // Update state when date changes
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    
    // If date is selected, check for existing menu
    if (newDate) {
      const existingMenu = findExistingDailyMenu(newDate);
      if (existingMenu) {
        setSelectedMenuId(existingMenu.menuId);
        setSelectedFirstCourse(existingMenu.firstCourse);
        setSelectedSecondCourse(existingMenu.secondCourse);
        setSelectedDessert(existingMenu.dessert);
      } else {
        // Reset selections if no existing menu
        setSelectedMenuId(null);
        setSelectedFirstCourse(null);
        setSelectedSecondCourse(null);
        setSelectedDessert(null);
      }
    }
  };

  // Save daily menu
  const handleSave = () => {
    if (!date || !selectedMenuId) {
      toast({
        title: t({ 
          en: "Missing information", 
          es: "Información faltante", 
          ca: "Informació faltant" 
        }),
        description: t({ 
          en: "Please select a date and menu type", 
          es: "Por favor selecciona una fecha y tipo de menú", 
          ca: "Si us plau selecciona una data i tipus de menú" 
        }),
        variant: "destructive",
      });
      return;
    }

    const existingMenu = findExistingDailyMenu(date);
    const now = new Date();
    
    const dailyMenu: DailyMenu = {
      id: existingMenu?.id || generateId(),
      date: new Date(date),
      menuId: selectedMenuId,
      firstCourse: selectedFirstCourse,
      secondCourse: selectedSecondCourse,
      dessert: selectedDessert,
      createdAt: existingMenu?.createdAt || now,
      updatedAt: now,
    };
    
    onSaveDailyMenu(dailyMenu);
    
    toast({
      title: t({ 
        en: "Daily menu saved", 
        es: "Menú diario guardado", 
        ca: "Menú diari guardat" 
      }),
      description: t({ 
        en: "The daily menu has been successfully saved", 
        es: "El menú diario ha sido guardado con éxito", 
        ca: "El menú diari ha estat guardat amb èxit" 
      }),
    });
  };

  // Filter dishes by type
  const getDishesByType = (type: 'first' | 'second' | 'dessert') => {
    return dishes.filter(dish => dish.type === type);
  };

  // Selected menu name
  const selectedMenuName = selectedMenuId 
    ? menus.find(menu => menu.id === selectedMenuId)?.name[language] 
    : '';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {t({ en: 'Daily Menu Planner', es: 'Planificador de Menú Diario', ca: 'Planificador de Menú Diari' })}
          </CardTitle>
          <CardDescription>
            {t({ 
              en: 'Select a menu type and date to plan your daily menu', 
              es: 'Selecciona un tipo de menú y fecha para planificar tu menú diario', 
              ca: 'Selecciona un tipus de menú i data per planificar el teu menú diari' 
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                {t({ en: 'Menu Type', es: 'Tipo de Menú', ca: 'Tipus de Menú' })}
              </label>
              <Select value={selectedMenuId || ''} onValueChange={setSelectedMenuId}>
                <SelectTrigger>
                  <SelectValue placeholder={t({ 
                    en: 'Select a menu', 
                    es: 'Selecciona un menú', 
                    ca: 'Selecciona un menú' 
                  })} />
                </SelectTrigger>
                <SelectContent>
                  {menus.length === 0 ? (
                    <div className="py-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        {t({ 
                          en: 'No menus available. Create a menu first.', 
                          es: 'No hay menús disponibles. Crea un menú primero.', 
                          ca: 'No hi ha menús disponibles. Crea un menú primer.' 
                        })}
                      </p>
                    </div>
                  ) : (
                    menus.map(menu => (
                      <SelectItem key={menu.id} value={menu.id}>
                        {menu.name[language]}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                {t({ en: 'Date', es: 'Fecha', ca: 'Data' })}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : t({ 
                      en: 'Pick a date', 
                      es: 'Elige una fecha', 
                      ca: 'Tria una data' 
                    })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {date && selectedMenuId && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{format(date, 'PPPP')}</span>
              <Badge>{selectedMenuName}</Badge>
            </CardTitle>
            <CardDescription>
              {t({ 
                en: 'Select dishes for each course', 
                es: 'Selecciona platos para cada curso', 
                ca: 'Selecciona plats per a cada curs' 
              })}
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
                onSelectDish={setSelectedFirstCourse}
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
                onSelectDish={setSelectedSecondCourse}
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
                onSelectDish={setSelectedDessert}
                placeholder={t({ 
                  en: 'Select dessert', 
                  es: 'Selecciona postre', 
                  ca: 'Selecciona postres' 
                })}
              />
            </div>
            
            <div className="pt-4">
              <Button onClick={handleSave} className="w-full sm:w-auto">
                {t({ en: 'Save Daily Menu', es: 'Guardar Menú Diario', ca: 'Guardar Menú Diari' })}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DailyPlanner;
