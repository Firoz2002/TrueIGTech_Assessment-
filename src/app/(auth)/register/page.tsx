"use client";

import { useState, useRef, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Camera, User, Mail, Lock } from "lucide-react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [userProfile, setUserProfile] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = useCallback(() => inputRef.current?.click(), []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUserProfile(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    if (username.length < 5 || username.length > 30) {
      return alert("Username must be 5-30 characters");
    }
    if (email.length < 10) {
      return alert("Invalid email");
    }
    if (password.length < 6) {
      return alert("Password must be at least 6 characters");
    }
    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    let profile_picture: string | null = null;

    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const data = await uploadRes.json();
        alert(data.message || "Failed to upload image");
        return;
      }

      profile_picture = await uploadRes.text();
    }

    // Register user via Credentials API route
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
        profile_picture,
      }),
    });

    if (res.ok) {
      // Auto-login after registration
      await signIn("credentials", { email, password, redirect: false });
      router.push("/");
    } else {
      const error = await res.json();
      alert(error.message || "Registration failed");
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <div className="w-screen h-screen bg-white flex items-center justify-center">
      <div className="w-full h-full flex">

        {/* Left Panel */}
        <div className="w-2/5 bg-[#FF4B2B] flex flex-col justify-between text-white">
          <div className="p-5 flex flex-col items-center justify-center">
            <img src="assets/logo-2.png" alt="logo" className="w-[150px] h-[150px]" />
            <h1 className="text-[45px]">Global</h1>
          </div>
          <div className="flex flex-col items-end">
            <button className="text-[#FF4B2B] bg-[#faf9f7] p-5 rounded-tl-[35px] rounded-bl-[35px] font-bold text-xlarge">
              Sign-Up
            </button>
            <button
              className="text-white p-5 font-bold text-xlarge"
              onClick={handleLoginRedirect}
            >
              Sign-In
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-3/5 flex items-center justify-center bg-[#faf9f7]">
          <form
            className="registerForm flex flex-col items-center"
            onSubmit={handleRegister}
          >
            {/* Profile Image */}
            <div className="flex justify-center mb-5">
              <img
                src={userProfile || "assets/defaultUserImg.png"}
                alt="profile"
                className="w-[150px] h-[150px] rounded-full border border-black object-cover"
              />
              <button
                type="button"
                className="ml-[-40px] mt-[110px]"
                onClick={handleClick}
              >
                <Camera className="text-black" />
              </button>
              <input
                type="file"
                ref={inputRef}
                hidden
                accept="image/*"
                onChange={handleProfileChange}
              />
            </div>

            {/* Username */}
            <div className="inputWrapper mb-5 flex items-center border-b border-gray-400 min-w-[350px]">
              <User className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-none pl-2 bg-inherit w-full focus:outline-none h-[30px]"
                required
              />
            </div>

            {/* Email */}
            <div className="inputWrapper mb-5 flex items-center border-b border-gray-400 min-w-[350px]">
              <Mail className="text-gray-500 mr-2" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-none pl-2 bg-inherit w-full focus:outline-none h-[30px]"
                required
              />
            </div>

            {/* Password */}
            <div className="inputWrapper mb-5 flex items-center border-b border-gray-400 min-w-[350px]">
              <Lock className="text-gray-500 mr-2" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-none pl-2 bg-inherit w-full focus:outline-none h-[30px]"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="inputWrapper mb-5 flex items-center border-b border-gray-400 min-w-[350px]">
              <Lock className="text-gray-500 mr-2" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-none pl-2 bg-inherit w-full focus:outline-none h-[30px]"
                required
              />
            </div>

            {/* Buttons */}
            <button
              type="submit"
              className="w-full h-[40px] bg-[#FF4B2B] text-white rounded-md mb-3"
            >
              Get Started
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-[40px] bg-[#4285F4] text-white rounded-md"
            >
              Sign up with Google
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
