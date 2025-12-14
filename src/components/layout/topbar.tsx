"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Activity, Users, UserCircle, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  currentPage: "homePage" | "friendsPage" | "profilePage";
}

export default function Topbar({ currentPage }: Props) {
  const navItemClass = (page: Props["currentPage"]) =>
    `flex items-center justify-center px-4 py-2 border-b-2 transition-colors
     ${
       currentPage === page
         ? "border-primary text-primary"
         : "border-transparent text-muted-foreground hover:text-primary"
     }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/assets/logo.png" alt="logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-primary">Global</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className={navItemClass("homePage")}>
            <Activity className="h-5 w-5" />
          </Link>

          <Link href="/connect" className={navItemClass("friendsPage")}>
            <Users className="h-5 w-5" />
          </Link>

          <Link href="/profile" className={navItemClass("profilePage")}>
            <UserCircle className="h-5 w-5" />
          </Link>
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <UserCircle className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}