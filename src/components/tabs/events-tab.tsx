export default function EventsTab() {
  const events = [
    { img: "assets/img4.png", text: "Tackle Your closest Spring Cleaning", date: "May 14 2019" },
    { img: "assets/img6.png", text: "The Truth About Business Blogging", date: "May 14 2019" },
    { img: "assets/img5.png", text: "10 Tips to stay healthy when...", date: "May 14 2019" },
    { img: "assets/img7.png", text: "Visiting Amsterdam on a Budget", date: "May 14 2019" },
    { img: "assets/img1.png", text: "OMA completes renovation of Sotheby's New...", date: "May 14 2019" },
  ];

  return (
    <div className="p-5 rounded-lg bg-white border-2  border-[#eeedeb] sticky overflow-y-scroll max-h-122.5 mb-6">
      <h1 className="font-semibold text-2xl">
          Events
      </h1>
      <div className="eventsTabCenter">
        {events.map(({ img, text, date }, i) => (
          <div key={i} className="flex items-center pt-2.5">
            <img src={img} alt="user-profile" className="h-12.5 w-12.5 rounded-[5px] mr-2.5 object-cover" />
            <div className="updateText">
              <span className="font-medium">{text}</span>
              <br/>
              <span className="text-[#969799]">{date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
