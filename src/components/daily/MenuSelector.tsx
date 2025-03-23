
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Menu } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface MenuSelectorProps {
  menus: Menu[];
  selectedMenuId: string | null;
  onMenuSelect: (menuId: string) => void;
}

const MenuSelector: React.FC<MenuSelectorProps> = ({
  menus,
  selectedMenuId,
  onMenuSelect,
}) => {
  const { t, language } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t({ en: 'Select Menu', es: 'Seleccionar Menú', ca: 'Seleccionar Menú' })}
        </CardTitle>
        <CardDescription>
          {t({ 
            en: 'Choose a menu type and date', 
            es: 'Elige un tipo de menú y fecha', 
            ca: 'Escull un tipus de menú i data' 
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              {t({ en: 'Menu Type', es: 'Tipo de Menú', ca: 'Tipus de Menú' })}
            </label>
            <Select value={selectedMenuId || ''} onValueChange={onMenuSelect}>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuSelector;
