"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [userCredentials, setUserCredentials] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      return alert("You have entered an incorrect password");
    }

    const res = await signIn("credentials", {
      redirect: false,
      email: userCredentials,
      password,
    });

    if (res?.ok) {
      router.push("/");
    } else {
      alert(`Login failed: ${res?.error}`);
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/home" });
  };

  const handleSignUpRedirect = () => {
    router.push("/register");
  };

  return (
    <div className="w-screen h-screen bg-[#f0f2f5] flex items-center justify-center">
      <div className="w-full h-full flex">

        {/* Left panel */}
        <div className="text-[white] w-2/5 bg-[#FF4B2B] flex flex-col justify-between">
          <div className="p-[20px] flex flex-col items-center justify-center">
            <img src="assets/logo-2.png" alt="logo-img" className="w-[150px] h-[150px]" />
            <h1 className="text-[45px]">Global</h1>
          </div>
          <div className="flex flex-col items-end">
            <button
              className="border-none text-white text-xlarge font-bold p-[20px] cursor-pointer bg-inherit"
              onClick={handleSignUpRedirect}
            >
              Sign-Up
            </button>
            <button
              className="border-none text-xlarge font-bold p-[20px] cursor-pointer !text-[#FF4B2B] !bg-[#faf9f7] rounded-tl-[35px] rounded-bl-[35px]"
            >
              Sign-In
            </button>
          </div>
        </div>

        {/* Right panel: Login form */}
        <div className="w-3/5 flex items-center justify-center bg-[#faf9f7]">
          <form
            className="loginForm flex flex-col items-center"
            onSubmit={handleLogin}
          >
            <div className="min-w-[350px] flex items-center my-[30px] pb-[5px] border-b border-gray-400">
              <Mail className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Email or Username"
                value={userCredentials}
                onChange={(e) => setUserCredentials(e.target.value)}
                className="border-none pl-[5px] text-lg h-[30px] w-full bg-inherit focus:outline-none"
                required
              />
            </div>

            <div className="min-w-[350px] flex items-center my-[30px] pb-[5px] border-b border-gray-400">
              <Lock className="text-gray-500 mr-2" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-none pl-[5px] text-lg h-[30px] w-full bg-inherit focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-[40px] border-none text-white text-lg rounded-[5px] bg-[#FF4B2B] mb-3"
            >
              Get Back
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-[40px] border-none text-white text-lg rounded-[5px] bg-[#4285F4]"
            >
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
