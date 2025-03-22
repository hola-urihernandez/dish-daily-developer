
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const NotFound = () => {
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, loading, navigate]);

  // If not authenticated, don't render anything while redirecting
  if (!user && !loading) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-9xl font-extrabold text-primary">404</h1>
      <h2 className="mt-8 text-2xl font-semibold tracking-tight">
        {t({ en: 'Page Not Found', es: 'Página No Encontrada', ca: 'Pàgina No Trobada' })}
      </h2>
      <p className="mt-4 text-muted-foreground">
        {t({ 
          en: 'The page you are looking for doesn\'t exist or has been moved.', 
          es: 'La página que estás buscando no existe o ha sido movida.', 
          ca: 'La pàgina que estàs buscant no existeix o ha estat moguda.' 
        })}
      </p>
      <Button asChild className="mt-8">
        <Link to="/">
          {t({ en: 'Back to Home', es: 'Volver al Inicio', ca: 'Tornar a l\'Inici' })}
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
