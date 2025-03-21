
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Menu } from '@/types';
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
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/LanguageContext';
import { v4 as uuidv4 } from 'uuid';

interface MenuFormProps {
  menu?: Menu;
  onSubmit: (menu: Menu) => void;
}

// Create a UUID generator function
const generateId = () => uuidv4();

const MenuForm: React.FC<MenuFormProps> = ({ menu, onSubmit }) => {
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
    descriptionEn: z.string().optional(),
    descriptionEs: z.string().optional(),
    descriptionCa: z.string().optional(),
  });

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameEn: menu?.name.en || '',
      nameEs: menu?.name.es || '',
      nameCa: menu?.name.ca || '',
      descriptionEn: menu?.description?.en || '',
      descriptionEs: menu?.description?.es || '',
      descriptionCa: menu?.description?.ca || '',
    },
  });

  // Handle form submission
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const now = new Date();
    
    // Create or update menu
    const updatedMenu: Menu = {
      id: menu?.id || generateId(),
      name: {
        en: values.nameEn,
        es: values.nameEs,
        ca: values.nameCa,
      },
      description: {
        en: values.descriptionEn || '',
        es: values.descriptionEs || '',
        ca: values.descriptionCa || '',
      },
      createdAt: menu?.createdAt || now,
      updatedAt: now,
    };
    
    onSubmit(updatedMenu);
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
                <Input {...field} placeholder="Weekly Menu" />
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
                <Input {...field} placeholder="Menú Semanal" />
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
                <Input {...field} placeholder="Menú Setmanal" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="descriptionEn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t({ en: 'Description (English)', es: 'Descripción (Inglés)', ca: 'Descripció (Anglès)' })}
              </FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder={t({ 
                    en: 'Description of this menu (optional)', 
                    es: 'Descripción de este menú (opcional)', 
                    ca: 'Descripció d\'aquest menú (opcional)' 
                  })}
                  className="resize-none"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="descriptionEs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t({ en: 'Description (Spanish)', es: 'Descripción (Español)', ca: 'Descripció (Espanyol)' })}
              </FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder={t({ 
                    en: 'Description of this menu (optional)', 
                    es: 'Descripción de este menú (opcional)', 
                    ca: 'Descripció d\'aquest menú (opcional)' 
                  })}
                  className="resize-none"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="descriptionCa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t({ en: 'Description (Catalan)', es: 'Descripción (Catalán)', ca: 'Descripció (Català)' })}
              </FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder={t({ 
                    en: 'Description of this menu (optional)', 
                    es: 'Descripción de este menú (opcional)', 
                    ca: 'Descripció d\'aquest menú (opcional)' 
                  })}
                  className="resize-none"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-3">
          <Button type="submit" className="w-full sm:w-auto">
            {menu
              ? t({ en: 'Update Menu', es: 'Actualizar Menú', ca: 'Actualitzar Menú' })
              : t({ en: 'Add Menu', es: 'Añadir Menú', ca: 'Afegir Menú' })}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MenuForm;
