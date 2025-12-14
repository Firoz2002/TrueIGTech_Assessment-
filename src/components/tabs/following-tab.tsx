"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function FollowingTab() {
  const [followingList, setFollowingList] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/users/following")
      .then((res) => res.json())
      .then((data) => setFollowingList(data.data || []));
  }, []);

  return (
    <div className="p-5 rounded-lg bg-white border-2 border-[#eeedeb] mb-6">
      <h1 className="font-semibold text-2xl mb-4">I'm Following</h1>

      <ScrollArea className="h-122.5 rounded-lg">
        {followingList.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {followingList.map((following) => (
              <div
                key={following.id}
                className="relative h-12 w-12 rounded-full overflow-hidden"
              >
                <Image
                  src={following.image || "/assets/2.webp"}
                  alt={following.name || "User"}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center gap-4">
            <p>You are not following anyone yet.</p>
            <Link href="/connect">
              <Button variant="default">Connect</Button>
            </Link>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}