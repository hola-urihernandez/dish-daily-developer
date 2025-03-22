
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  
  if (!user) {
    return (
      <Button variant="outline" asChild>
        <Link to="/auth">
          {t({ en: "Sign In", es: "Iniciar Sesión", ca: "Iniciar Sessió" })}
        </Link>
      </Button>
    );
  }

  // Get initials for avatar fallback
  const email = user.email || "";
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.user_metadata?.avatar_url || ""} alt={email} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.email}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.user_metadata?.username || email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer flex w-full items-center">
            <User className="mr-2 h-4 w-4" />
            <span>{t({ en: "Profile", es: "Perfil", ca: "Perfil" })}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer flex w-full items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>{t({ en: "Settings", es: "Configuración", ca: "Configuració" })}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => signOut()}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t({ en: "Sign out", es: "Cerrar sesión", ca: "Tancar sessió" })}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
