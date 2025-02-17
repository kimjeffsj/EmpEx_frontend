import { useAuthStore } from "@/store/auth.store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { User } from "@/types/features/auth.types";

interface UserNavProps {
  user: User;
}

export function UserNav({ user }: UserNavProps) {
  const { logout } = useAuthStore();

  const router = useRouter();

  const handleLogout = async () => {
    try {
      // First, navigate to login page
      router.push("/login");

      // Then perform logout
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      // Ensure we're on login page even if logout fails
      router.push("/login");
    }
  };

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
