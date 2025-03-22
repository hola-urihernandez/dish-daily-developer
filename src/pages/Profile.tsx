
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getUserProfile, updateUserProfile } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const profile = await getUserProfile(user.id);
        if (profile) {
          setUsername(profile.username || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const result = await updateUserProfile(user.id, { username });
      
      if (result.error) {
        toast({
          title: t({ en: "Error", es: "Error", ca: "Error" }),
          description: result.error,
          variant: "destructive"
        });
      } else {
        toast({
          title: t({ en: "Success", es: "Éxito", ca: "Èxit" }),
          description: t({ 
            en: "Profile updated successfully", 
            es: "Perfil actualizado con éxito", 
            ca: "Perfil actualitzat amb èxit" 
          })
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: t({ en: "Error", es: "Error", ca: "Error" }),
        description: t({ 
          en: "Failed to update profile", 
          es: "Error al actualizar el perfil", 
          ca: "Error en actualitzar el perfil" 
        }),
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container max-w-md mx-auto px-4 pt-24 pb-12">
        <Card>
          <CardHeader>
            <CardTitle>
              {t({ en: "Profile", es: "Perfil", ca: "Perfil" })}
            </CardTitle>
            <CardDescription>
              {t({ 
                en: "Update your profile information", 
                es: "Actualiza la información de tu perfil", 
                ca: "Actualitza la informació del teu perfil" 
              })}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleUpdateProfile}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {t({ en: "Email", es: "Correo", ca: "Correu" })}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email || ""}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  {t({ 
                    en: "Your email address cannot be changed", 
                    es: "Tu dirección de correo no puede ser cambiada", 
                    ca: "La teva adreça de correu no pot ser canviada" 
                  })}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">
                  {t({ en: "Username", es: "Nombre de usuario", ca: "Nom d'usuari" })}
                </Label>
                <Input
                  id="username"
                  placeholder={t({ 
                    en: "Enter your username", 
                    es: "Ingresa tu nombre de usuario", 
                    ca: "Introdueix el teu nom d'usuari" 
                  })}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={isLoading || isSaving}>
                {isSaving ? 
                  t({ en: "Saving...", es: "Guardando...", ca: "Desant..." }) : 
                  t({ en: "Save Changes", es: "Guardar Cambios", ca: "Desar Canvis" })}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
