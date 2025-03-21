
import { useState } from 'react';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Dish } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface DishSelectorProps {
  dishes: Dish[];
  selectedDishId: string | null;
  onSelectDish: (dishId: string | null) => void;
  placeholder: string;
}

const DishSelector: React.FC<DishSelectorProps> = ({
  dishes,
  selectedDishId,
  onSelectDish,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);
  const { language, t } = useLanguage();

  const selectedDish = dishes.find(dish => dish.id === selectedDishId);

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <div className="flex-1 text-left truncate">
              {selectedDish ? selectedDish.name[language] : placeholder}
            </div>
            <div className="flex">
              {selectedDishId && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 -mr-1 hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDish(null);
                  }}
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="sr-only">Clear</span>
                </Button>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command className="w-full">
            <CommandInput
              placeholder={t({ 
                en: "Search dishes...", 
                es: "Buscar platos...", 
                ca: "Cercar plats..." 
              })}
              icon={<Search className="h-4 w-4" />}
            />
            <CommandEmpty>
              {t({ 
                en: "No dish found", 
                es: "No se encontró ningún plato", 
                ca: "No s'ha trobat cap plat" 
              })}
            </CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {dishes.map((dish) => (
                <CommandItem
                  key={dish.id}
                  value={dish.name[language]}
                  onSelect={() => {
                    onSelectDish(dish.id === selectedDishId ? null : dish.id);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedDishId === dish.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {dish.name[language]}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DishSelector;
