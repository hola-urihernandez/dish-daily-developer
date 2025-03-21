
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Dish } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import { v4 as uuidv4 } from 'uuid';

interface DishFormProps {
  dish?: Dish;
  onSubmit: (dish: Dish) => void;
}

// Create a UUID generator function
const generateId = () => uuidv4();

const DishForm: React.FC<DishFormProps> = ({ dish, onSubmit }) => {
  const { t } = useLanguage();
  
  // Define the form schema
  const formSchema = z.object({
    nameEn: z.string().min(1, {
      message: t({ en: 'Name in English is required', es: 'El nombre en inglés es obligatorio', ca: 'El nom en anglès és obligatori' }),
    }),
    nameEs: z.string().min(1, {
      message: t({ en: 'Name in Spanish is required', es: 'El nombre en español es obligatorio', ca: 'El nom en espanyol és obligatori' }),
    }),
    nameCa: z.string().min(1, {
      message: t({ en: 'Name in Catalan is required', es: 'El nombre en catalán es obligatorio', ca: 'El nom en català és obligatori' }),
    }),
    type: z.enum(['first', 'second', 'dessert'], {
      required_error: t({ en: 'Type is required', es: 'El tipo es obligatorio', ca: 'El tipus és obligatori' }),
    }),
  });

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameEn: dish?.name.en || '',
      nameEs: dish?.name.es || '',
      nameCa: dish?.name.ca || '',
      type: dish?.type || 'first',
    },
  });

  // Handle form submission
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const now = new Date();
    
    // Create or update dish
    const updatedDish: Dish = {
      id: dish?.id || generateId(),
      name: {
        en: values.nameEn,
        es: values.nameEs,
        ca: values.nameCa,
      },
      type: values.type,
      createdAt: dish?.createdAt || now,
      updatedAt: now,
    };
    
    onSubmit(updatedDish);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="nameEn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t({ en: 'Name (English)', es: 'Nombre (Inglés)', ca: 'Nom (Anglès)' })}
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Paella" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="nameEs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t({ en: 'Name (Spanish)', es: 'Nombre (Español)', ca: 'Nom (Espanyol)' })}
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Paella" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="nameCa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t({ en: 'Name (Catalan)', es: 'Nombre (Catalán)', ca: 'Nom (Català)' })}
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Paella" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t({ en: 'Type', es: 'Tipo', ca: 'Tipus' })}
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t({ en: 'Select type', es: 'Seleccionar tipo', ca: 'Seleccionar tipus' })} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="first">
                    {t({ en: 'First Course', es: 'Primer Plato', ca: 'Primer Plat' })}
                  </SelectItem>
                  <SelectItem value="second">
                    {t({ en: 'Second Course', es: 'Segundo Plato', ca: 'Segon Plat' })}
                  </SelectItem>
                  <SelectItem value="dessert">
                    {t({ en: 'Dessert', es: 'Postre', ca: 'Postres' })}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-3">
          <Button type="submit" className="w-full sm:w-auto">
            {dish
              ? t({ en: 'Update Dish', es: 'Actualizar Plato', ca: 'Actualitzar Plat' })
              : t({ en: 'Add Dish', es: 'Añadir Plato', ca: 'Afegir Plat' })}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DishForm;
