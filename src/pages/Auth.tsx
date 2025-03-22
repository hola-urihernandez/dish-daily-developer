
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/Header";

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signUp(email, password);
      // Don't navigate automatically after signup as they need to verify email
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container max-w-md mx-auto px-4 pt-24 pb-12">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">
              {t({ en: "Sign In", es: "Iniciar Sesión", ca: "Iniciar Sessió" })}
            </TabsTrigger>
            <TabsTrigger value="signup">
              {t({ en: "Sign Up", es: "Registrarse", ca: "Registrar-se" })}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t({ en: "Sign In", es: "Iniciar Sesión", ca: "Iniciar Sessió" })}
                </CardTitle>
                <CardDescription>
                  {t({
                    en: "Enter your email and password to access your account",
                    es: "Ingresa tu correo y contraseña para acceder a tu cuenta",
                    ca: "Introdueix el teu correu i contrasenya per accedir al teu compte"
                  })}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">
                      {t({ en: "Email", es: "Correo", ca: "Correu" })}
                    </Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">
                      {t({ en: "Password", es: "Contraseña", ca: "Contrasenya" })}
                    </Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? 
                      t({ en: "Signing in...", es: "Iniciando sesión...", ca: "Iniciant sessió..." }) : 
                      t({ en: "Sign In", es: "Iniciar Sesión", ca: "Iniciar Sessió" })}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t({ en: "Create Account", es: "Crear Cuenta", ca: "Crear Compte" })}
                </CardTitle>
                <CardDescription>
                  {t({
                    en: "Enter your email and create a password to set up your account",
                    es: "Ingresa tu correo y crea una contraseña para configurar tu cuenta",
                    ca: "Introdueix el teu correu i crea una contrasenya per configurar el teu compte"
                  })}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">
                      {t({ en: "Email", es: "Correo", ca: "Correu" })}
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">
                      {t({ en: "Password", es: "Contraseña", ca: "Contrasenya" })}
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      {t({
                        en: "Password must be at least 6 characters",
                        es: "La contraseña debe tener al menos 6 caracteres",
                        ca: "La contrasenya ha de tenir almenys 6 caràcters"
                      })}
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? 
                      t({ en: "Creating account...", es: "Creando cuenta...", ca: "Creant compte..." }) : 
                      t({ en: "Create Account", es: "Crear Cuenta", ca: "Crear Compte" })}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Auth;
