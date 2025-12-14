interface Props{
  image: string,
  username: string,
  unfollow: Function
}

export default function UserCard({ image, username, unfollow }: Props) {
  return (
    <div className="bg-white flex items-center border-t-2 p-2">
        <img className="w-12.5 h-12.5 rounded-full object-cover mr-2.5" src={(image) ? image : "https://res.cloudinary.com/dhlsmeyw1/image/upload/v1729425848/CloudinaryDemo/ze0moba23397vhmmwgyp.png"} alt="user-profile-picture" />
        <h1 className="font-medium text-lg"> {username} </h1>
        <button onClick={() => unfollow()} className="ml-auto bg-red-600 px-3 py-1 font-semibold text-sm rounded-md hover:bg-red-700 transition-all duration-200 ease-in-out">Unfollow</button>
    </div>
  );
}