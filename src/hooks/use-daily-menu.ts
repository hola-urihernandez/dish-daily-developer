
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { DailyMenu, Dish, Menu } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

// Create a UUID generator function
const generateId = () => uuidv4();

interface UseDailyMenuProps {
  menus: Menu[];
  dishes: Dish[];
  dailyMenus: DailyMenu[];
  onSaveDailyMenu: (dailyMenu: DailyMenu) => void;
}

export const useDailyMenu = ({
  menus,
  dishes,
  dailyMenus,
  onSaveDailyMenu,
}: UseDailyMenuProps) => {
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedFirstCourse, setSelectedFirstCourse] = useState<string | null>(null);
  const [selectedSecondCourse, setSelectedSecondCourse] = useState<string | null>(null);
  const [selectedDessert, setSelectedDessert] = useState<string | null>(null);
  const [currentMenuId, setCurrentMenuId] = useState<string | null>(null);
  
  const { t } = useLanguage();
  const { toast } = useToast();

  // Create a Map of dates with daily menus for calendar highlighting
  const datesWithMenus = useMemo(() => {
    const dateMap = new Map<string, boolean>();
    dailyMenus.forEach(menu => {
      const dateStr = format(new Date(menu.date), 'yyyy-MM-dd');
      dateMap.set(dateStr, true);
    });
    return dateMap;
  }, [dailyMenus]);

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
        setCurrentMenuId(existingMenu.id);
      } else {
        // Reset selections if no existing menu
        setSelectedMenuId(null);
        setSelectedFirstCourse(null);
        setSelectedSecondCourse(null);
        setSelectedDessert(null);
        setCurrentMenuId(null);
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
      id: currentMenuId || generateId(),
      date: new Date(date),
      menuId: selectedMenuId,
      firstCourse: selectedFirstCourse,
      secondCourse: selectedSecondCourse,
      dessert: selectedDessert,
      createdAt: existingMenu?.createdAt || now,
      updatedAt: now,
    };
    
    onSaveDailyMenu(dailyMenu);
    
    const isUpdate = !!existingMenu;
    
    toast({
      title: t({ 
        en: isUpdate ? "Daily menu updated" : "Daily menu saved", 
        es: isUpdate ? "Menú diario actualizado" : "Menú diario guardado", 
        ca: isUpdate ? "Menú diari actualitzat" : "Menú diari guardat" 
      }),
      description: t({ 
        en: isUpdate ? "The daily menu has been successfully updated" : "The daily menu has been successfully saved", 
        es: isUpdate ? "El menú diario ha sido actualizado con éxito" : "El menú diario ha sido guardado con éxito", 
        ca: isUpdate ? "El menú diario ha estat actualitzat amb èxit" : "El menú diari ha estat guardat amb èxit" 
      }),
    });
  };

  return {
    selectedMenuId,
    setSelectedMenuId,
    date,
    selectedFirstCourse,
    setSelectedFirstCourse,
    selectedSecondCourse,
    setSelectedSecondCourse,
    selectedDessert,
    setSelectedDessert,
    currentMenuId,
    datesWithMenus,
    handleDateChange,
    handleSave,
  };
};
