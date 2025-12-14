"use client";

import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function EventsTab() {
  const events = [
    { img: "/assets/img4.png", text: "Tackle Your closest Spring Cleaning", date: "May 14 2019" },
    { img: "/assets/img6.png", text: "The Truth About Business Blogging", date: "May 14 2019" },
    { img: "/assets/img5.png", text: "10 Tips to stay healthy when...", date: "May 14 2019" },
    { img: "/assets/img7.png", text: "Visiting Amsterdam on a Budget", date: "May 14 2019" },
    { img: "/assets/img1.png", text: "OMA completes renovation of Sotheby's New...", date: "May 14 2019" },
  ];

  return (
    <div className="p-5 rounded-lg bg-white border-2 border-[#eeedeb] mb-6">
      <h1 className="font-semibold text-2xl mb-4">Events</h1>

      <ScrollArea className="h-[490px] rounded-lg">
        <div className="flex flex-col space-y-3">
          {events.map(({ img, text, date }, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-[5px] overflow-hidden flex-shrink-0">
                <Image src={img} alt={text} fill style={{ objectFit: "cover" }} />
              </div>
              <div>
                <span className="font-medium">{text}</span>
                <br />
                <span className="text-[#969799] text-sm">{date}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}