
import { Link } from 'react-router-dom';
import { ArrowRight, Book, Calendar, Utensils } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';

const Index = () => {
  const { t } = useLanguage();

  // Define the features with their icons and routes
  const features = [
    {
      title: { en: 'Dish Management', es: 'Gestión de Platos', ca: 'Gestió de Plats' },
      description: {
        en: 'Add, edit, and delete dishes in multiple languages',
        es: 'Añade, edita y elimina platos en múltiples idiomas',
        ca: 'Afegeix, edita i elimina plats en múltiples idiomes',
      },
      icon: Utensils,
      route: '/dishes',
    },
    {
      title: { en: 'Menu Management', es: 'Gestión de Menús', ca: 'Gestió de Menús' },
      description: {
        en: 'Create and manage different types of menus',
        es: 'Crea y gestiona diferentes tipos de menús',
        ca: 'Crea i gestiona diferents tipus de menús',
      },
      icon: Book,
      route: '/menus',
    },
    {
      title: { en: 'Daily Planner', es: 'Planificador Diario', ca: 'Planificador Diari' },
      description: {
        en: 'Assign menus and dishes to specific dates',
        es: 'Asigna menús y platos a fechas específicas',
        ca: 'Assigna menús i plats a dates específiques',
      },
      icon: Calendar,
      route: '/daily-planner',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container max-w-6xl mx-auto px-4 pt-24 pb-12">
        <section className="py-12 md:py-16 text-center">
          <div className="mx-auto max-w-3xl px-4 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {t({
                en: 'Daily Menu Planner',
                es: 'Planificador de Menús Diarios',
                ca: 'Planificador de Menús Diaris',
              })}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t({
                en: 'Easily manage your dishes and menus in multiple languages',
                es: 'Gestiona fácilmente tus platos y menús en múltiples idiomas',
                ca: 'Gestiona fàcilment els teus plats i menús en múltiples idiomes',
              })}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/dishes">
                  {t({ en: 'Get Started', es: 'Comenzar', ca: 'Començar' })}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              {t({
                en: 'Key Features',
                es: 'Características Principales',
                ca: 'Característiques Principals',
              })}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              {t({
                en: 'Everything you need to manage your daily menu planning',
                es: 'Todo lo que necesitas para gestionar la planificación de tu menú diario',
                ca: 'Tot el que necessites per gestionar la planificació del teu menú diari',
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="h-full transition-all duration-200 hover:shadow-lg">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>{t(feature.title)}</CardTitle>
                  <CardDescription>{t(feature.description)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    to={feature.route}
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    {t({
                      en: 'Get started',
                      es: 'Comenzar',
                      ca: 'Començar',
                    })}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {t({
              en: 'Daily Menu Planner. All rights reserved.',
              es: 'Planificador de Menús Diarios. Todos los derechos reservados.',
              ca: 'Planificador de Menús Diaris. Tots els drets reservats.',
            })}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
