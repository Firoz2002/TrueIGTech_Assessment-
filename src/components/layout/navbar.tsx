import { Search } from "lucide-react"

export default function Navbar() {
  return (
    <div className="flex items-center justify-between">
      <div className="navbarLeft">
          <ul className="mx-0 my-7.5 p-0 flex list-none">
              <li className="p-2 mr-7.5 border-b-2 border-[#FF4B2B]">
                  <h3 className="text-lg font-bold">All Updates</h3>
              </li>
              <li className="p-2 mr-7.5">
                  <h3 className="text-lg font-bold">Likes</h3>
              </li>
          </ul>
      </div>
      <div className="navbarRight">
          <div className="h-7.5 w-full flex items-center border-2 bg-white rounded-lg border-[#eeedeb]">
              <Search color="#c3c3c3" className="mx-2.5 cursor-pointer"/>
              <input type="text" className="border-[none] text-[medium] outline-none rounded-lg" placeholder="Search Feed"/>
          </div>
      </div>
    </div>
  )
}
