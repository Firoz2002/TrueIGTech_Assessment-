"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Feed from "@/components/layout/feed";
import Topbar from "@/components/layout/topbar";
import Sidebar from "@/components/layout/sidebar";
import Rightbar from "@/components/layout/rightbar";

import { User } from "@/types/user";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [user, setUser] = useState<User | null>(null);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser(session.user as User);
    }

    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, router]);

  if (status === "loading" || !user) {
    return null;
  }

  return (
    <>
      <Topbar currentPage="homePage" />
      <div className="flex">
        {width >= 800 && <Sidebar width={width} />}
        <Feed user={user} />
        {width >= 1200 && <Rightbar />}
      </div>
    </>
  );
}
