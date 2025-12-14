import { useContext } from "react";

import EventsTab from "@/components/tabs/events-tab";
import UpdatesTab from "@/components/tabs/updates-tab";
import FollowingTab from "@/components/tabs/following-tab";

interface Props {
  width: number;
}

export default function Sidebar({ width }: Props) {
  return (
    <div className="m-5 flex-3">
      <EventsTab/>
      <FollowingTab/>
      { (width < 1200) ? <UpdatesTab/> : null }
    </div>
  )
}
