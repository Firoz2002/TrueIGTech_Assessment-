import Link from "next/link";
import { useEffect, useState } from "react";
import { Activity, Users, UserCircle } from "lucide-react";

interface Props {
  currentPage: string;
}

export default function Topbar({ currentPage }: Props) {
  const [activePage, setActivePage] = useState("");

  useEffect(() => {
    setActivePage(currentPage);
  }, [currentPage]);

  return (
    <div className="top-0 w-full h-16.25 p-2.5 flex sticky items-center bg-white border-b-2 z-50">
      <div className="flex-3 flex items-center relative">
        <img src="assets/logo.png" alt="logo" className="h-10 w-10 ml-5" />
        <span className="-left-5 text-[24px] ml-5 font-bold text-[#f0793d] cursor-pointer relative">
          Global
        </span>
      </div>

      <div className="flex items-center justify-evenly flex-6">
        <div
          className={
            activePage === "homePage"
              ? "p-5 border-b-2 border-black"
              : "p-5"
          }
        >
          <Link href="/">
            <Activity size={24} />
          </Link>
        </div>

        <div
          className={
            activePage === "friendsPage"
              ? "p-5 border-b-2 border-black"
              : "p-5"
          }
        >
          <Link href="/connect">
            <Users size={24} />
          </Link>
        </div>

        <div
          className={
            activePage === "profilePage"
              ? "p-5 border-b-2 border-black"
              : "p-5"
          }
        >
          <Link href="/profile">
            <UserCircle size={24} />
          </Link>
        </div>
      </div>

      <div className="flex-3"></div>
    </div>
  );
}
