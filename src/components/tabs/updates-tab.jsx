"use client";

import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

const updates = [
  { img: "/assets/2.webp", text: "Jhon posted an update", time: "a year ago" },
  { img: "/assets/img2.jpg", text: "Jhon posted an update", time: "a year ago" },
  { img: "/assets/img3.png", text: "Jhon posted an update", time: "a year ago" },
  { img: "/assets/img2.jpg", text: "Jhon posted an update", time: "a year ago" },
  { img: "/assets/img2.jpg", text: "Jhon posted an update", time: "a year ago" },
];

export default function UpdatesTab() {
  return (
    <div className="max-w-90">
      <ScrollArea className="sticky h-101.25 rounded-lg border-2 border-[#eeedeb] bg-white p-5">
        <div className="text-xl font-semibold">Latest updates</div>

        <div className="mt-6 flex flex-col gap-6">
          {updates.map(({ img, text, time }, i) => (
            <div key={i} className="flex items-start">
              <div className="relative mr-3 h-12.5 w-12.5 rounded-full overflow-hidden">
                <Image src={img} alt="user-profile" fill style={{ objectFit: "cover" }} />
              </div>
              <div>
                <span className="font-medium">{text}</span>
                <br />
                <span className="text-[#969799]">{time}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
