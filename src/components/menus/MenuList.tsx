
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Menu } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import MenuForm from './MenuForm';
import { useToast } from '@/hooks/use-toast';

interface MenuListProps {
  menus: Menu[];
  onAdd: (menu: Menu) => void;
  onUpdate: (menu: Menu) => void;
  onDelete: (id: string) => void;
}

const MenuList: React.FC<MenuListProps> = ({ menus, onAdd, onUpdate, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<Menu | null>(null);
  const { t, language } = useLanguage();
  const { toast } = useToast();

  // Filter menus based on search query
  const filteredMenus = menus.filter((menu) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      menu.name.en.toLowerCase().includes(searchLower) ||
      menu.name.es.toLowerCase().includes(searchLower) ||
      menu.name.ca.toLowerCase().includes(searchLower) ||
      (menu.description?.en.toLowerCase().includes(searchLower) || false) ||
      (menu.description?.es.toLowerCase().includes(searchLower) || false) ||
      (menu.description?.ca.toLowerCase().includes(searchLower) || false)
    );
  });

  // Handle edit menu
  const handleEditClick = (menu: Menu) => {
    setEditingMenu(menu);
    setIsEditDialogOpen(true);
  };

  // Handle delete menu
  const handleDeleteClick = (menu: Menu) => {
    setMenuToDelete(menu);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (menuToDelete) {
      onDelete(menuToDelete.id);
      toast({
        title: t({ 
          en: "Menu deleted", 
          es: "Menú eliminado", 
          ca: "Menú eliminat" 
        }),
        description: t({ 
          en: "The menu has been successfully deleted", 
          es: "El menú ha sido eliminado con éxito", 
          ca: "El menú ha estat eliminat amb èxit" 
        }),
      });
      setIsDeleteDialogOpen(false);
      setMenuToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t({ en: 'Search menus...', es: 'Buscar menús...', ca: 'Cercar menús...' })}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              {t({ en: 'Add Menu', es: 'Añadir Menú', ca: 'Afegir Menú' })}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {t({ en: 'Add New Menu', es: 'Añadir Nuevo Menú', ca: 'Afegir Nou Menú' })}
              </DialogTitle>
            </DialogHeader>
            <MenuForm
              onSubmit={(menu) => {
                onAdd(menu);
                setIsAddDialogOpen(false);
                toast({
                  title: t({ 
                    en: "Menu added", 
                    es: "Menú añadido", 
                    ca: "Menú afegit" 
                  }),
                  description: t({ 
                    en: "The menu has been successfully added", 
                    es: "El menú ha sido añadido con éxito", 
                    ca: "El menú ha estat afegit amb èxit" 
                  }),
                });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {t({ en: 'Edit Menu', es: 'Editar Menú', ca: 'Editar Menú' })}
            </DialogTitle>
          </DialogHeader>
          {editingMenu && (
            <MenuForm
              menu={editingMenu}
              onSubmit={(menu) => {
                onUpdate(menu);
                setIsEditDialogOpen(false);
                setEditingMenu(null);
                toast({
                  title: t({ 
                    en: "Menu updated", 
                    es: "Menú actualizado", 
                    ca: "Menú actualitzat" 
                  }),
                  description: t({ 
                    en: "The menu has been successfully updated", 
                    es: "El menú ha sido actualizado con éxito", 
                    ca: "El menú ha estat actualitzat amb èxit" 
                  }),
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              {t({ en: 'Delete Menu', es: 'Eliminar Menú', ca: 'Eliminar Menú' })}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              {t({
                en: 'Are you sure you want to delete this menu?',
                es: '¿Estás seguro de que quieres eliminar este menú?',
                ca: 'Estàs segur que vols eliminar aquest menú?',
              })}
            </p>
            {menuToDelete && (
              <p className="font-medium mt-2">
                {menuToDelete.name[language]}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {t({ en: 'Cancel', es: 'Cancelar', ca: 'Cancel·lar' })}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t({ en: 'Delete', es: 'Eliminar', ca: 'Eliminar' })}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Menus Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMenus.length === 0 ? (
          <div className="col-span-full flex justify-center items-center p-8">
            <div className="text-center text-muted-foreground">
              <BookOpen className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium">
                {searchQuery
                  ? t({
                      en: 'No menus found',
                      es: 'No se encontraron menús',
                      ca: 'No s\'han trobat menús',
                    })
                  : t({
                      en: 'No menus yet',
                      es: 'Aún no hay menús',
                      ca: 'Encara no hi ha menús',
                    })}
              </h3>
              <p className="mt-1">
                {searchQuery
                  ? t({
                      en: 'Try adjusting your search',
                      es: 'Intenta ajustar tu búsqueda',
                      ca: 'Intenta ajustar la teva cerca',
                    })
                  : t({
                      en: 'Add your first menu to get started',
                      es: 'Añade tu primer menú para comenzar',
                      ca: 'Afegeix el teu primer menú per començar',
                    })}
              </p>
            </div>
          </div>
        ) : (
          filteredMenus.map((menu) => (
            <Card key={menu.id} className="overflow-hidden card-hover">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-base">{menu.name[language]}</h3>
                    {menu.description && menu.description[language] && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {menu.description[language]}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 ml-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditClick(menu)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteClick(menu)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MenuList;
