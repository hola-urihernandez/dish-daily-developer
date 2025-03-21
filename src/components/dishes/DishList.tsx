
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Utensils } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Dish } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import DishForm from './DishForm';
import { useToast } from '@/hooks/use-toast';

interface DishListProps {
  dishes: Dish[];
  onAdd: (dish: Dish) => void;
  onUpdate: (dish: Dish) => void;
  onDelete: (id: string) => void;
}

const DishList: React.FC<DishListProps> = ({ dishes, onAdd, onUpdate, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState<Dish | null>(null);
  const { t, language } = useLanguage();
  const { toast } = useToast();

  // Filter dishes based on search query
  const filteredDishes = dishes.filter((dish) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      dish.name.en.toLowerCase().includes(searchLower) ||
      dish.name.es.toLowerCase().includes(searchLower) ||
      dish.name.ca.toLowerCase().includes(searchLower)
    );
  });

  // Handle edit dish
  const handleEditClick = (dish: Dish) => {
    setEditingDish(dish);
    setIsEditDialogOpen(true);
  };

  // Handle delete dish
  const handleDeleteClick = (dish: Dish) => {
    setDishToDelete(dish);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (dishToDelete) {
      onDelete(dishToDelete.id);
      toast({
        title: t({ 
          en: "Dish deleted", 
          es: "Plato eliminado", 
          ca: "Plat eliminat" 
        }),
        description: t({ 
          en: "The dish has been successfully deleted", 
          es: "El plato ha sido eliminado con éxito", 
          ca: "El plat ha estat eliminat amb èxit" 
        }),
      });
      setIsDeleteDialogOpen(false);
      setDishToDelete(null);
    }
  };

  // Get type badge
  const getTypeBadge = (type: Dish['type']) => {
    switch (type) {
      case 'first':
        return (
          <Badge variant="secondary" className="ml-2">
            {t({ en: 'First', es: 'Primero', ca: 'Primer' })}
          </Badge>
        );
      case 'second':
        return (
          <Badge variant="secondary" className="ml-2">
            {t({ en: 'Second', es: 'Segundo', ca: 'Segon' })}
          </Badge>
        );
      case 'dessert':
        return (
          <Badge variant="secondary" className="ml-2">
            {t({ en: 'Dessert', es: 'Postre', ca: 'Postres' })}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t({ en: 'Search dishes...', es: 'Buscar platos...', ca: 'Cercar plats...' })}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              {t({ en: 'Add Dish', es: 'Añadir Plato', ca: 'Afegir Plat' })}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {t({ en: 'Add New Dish', es: 'Añadir Nuevo Plato', ca: 'Afegir Nou Plat' })}
              </DialogTitle>
            </DialogHeader>
            <DishForm
              onSubmit={(dish) => {
                onAdd(dish);
                setIsAddDialogOpen(false);
                toast({
                  title: t({ 
                    en: "Dish added", 
                    es: "Plato añadido", 
                    ca: "Plat afegit" 
                  }),
                  description: t({ 
                    en: "The dish has been successfully added", 
                    es: "El plato ha sido añadido con éxito", 
                    ca: "El plat ha estat afegit amb èxit" 
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
              {t({ en: 'Edit Dish', es: 'Editar Plato', ca: 'Editar Plat' })}
            </DialogTitle>
          </DialogHeader>
          {editingDish && (
            <DishForm
              dish={editingDish}
              onSubmit={(dish) => {
                onUpdate(dish);
                setIsEditDialogOpen(false);
                setEditingDish(null);
                toast({
                  title: t({ 
                    en: "Dish updated", 
                    es: "Plato actualizado", 
                    ca: "Plat actualitzat" 
                  }),
                  description: t({ 
                    en: "The dish has been successfully updated", 
                    es: "El plato ha sido actualizado con éxito", 
                    ca: "El plat ha estat actualitzat amb èxit" 
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
              {t({ en: 'Delete Dish', es: 'Eliminar Plato', ca: 'Eliminar Plat' })}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              {t({
                en: 'Are you sure you want to delete this dish?',
                es: '¿Estás seguro de que quieres eliminar este plato?',
                ca: 'Estàs segur que vols eliminar aquest plat?',
              })}
            </p>
            {dishToDelete && (
              <p className="font-medium mt-2">
                {dishToDelete.name[language]}
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

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDishes.length === 0 ? (
          <div className="col-span-full flex justify-center items-center p-8">
            <div className="text-center text-muted-foreground">
              <Utensils className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium">
                {searchQuery
                  ? t({
                      en: 'No dishes found',
                      es: 'No se encontraron platos',
                      ca: 'No s\'han trobat plats',
                    })
                  : t({
                      en: 'No dishes yet',
                      es: 'Aún no hay platos',
                      ca: 'Encara no hi ha plats',
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
                      en: 'Add your first dish to get started',
                      es: 'Añade tu primer plato para comenzar',
                      ca: 'Afegeix el teu primer plat per començar',
                    })}
              </p>
            </div>
          </div>
        ) : (
          filteredDishes.map((dish) => (
            <Card key={dish.id} className="overflow-hidden card-hover">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-base">{dish.name[language]}</h3>
                    <div className="flex items-center mt-1">
                      {getTypeBadge(dish.type)}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditClick(dish)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteClick(dish)}
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

export default DishList;
