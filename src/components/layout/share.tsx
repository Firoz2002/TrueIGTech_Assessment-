"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Camera, Image, Video, FileText, X } from "lucide-react";
import { User } from "../../../generated/prisma";

interface Props {
  createPostHandler: (post: any) => void;
  user: User;
}

export default function Share({ createPostHandler, user }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);

    if (selected.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim() && !file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("content", content);
    if (file) formData.append("file", file);

    const res = await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      createPostHandler(data.data);
      setContent("");
      setFile(null);
      setPreview(null);
    } else {
      alert(data.message || "Failed to create post");
    }

    setLoading(false);
  };

  return (
    <div className="mt-5 w-full rounded-2xl border-2 border-[#eeedeb] bg-white">
      <div className="m-5 flex items-center">
        <img
          className="mr-2 h-12 w-12 rounded-full object-cover"
          src={
            user?.image ||
            "https://res.cloudinary.com/dhlsmeyw1/image/upload/v1729425848/CloudinaryDemo/ze0moba23397vhmmwgyp.png"
          }
          alt="user"
        />
        <input
          type="text"
          placeholder={`Share what's on your mind, ${user.name || "User"}...`}
          className="h-12 w-full border-none text-lg outline-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {preview && (
        <div className="relative mx-5 mb-3">
          <img
            src={preview}
            alt="preview"
            className="max-h-64 w-full rounded-xl object-cover"
          />
          <button
            type="button"
            onClick={removeFile}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <form
        onSubmit={submitHandler}
        className="relative flex items-center rounded-b-[15px] border-t-2 border-[#eeedeb] bg-[#faf9f7] p-5"
      >
        <div className="ml-5 flex space-x-4">
          <label className="cursor-pointer">
            <Camera className="text-[#FF4B2B]" />
          </label>

          <label className="cursor-pointer">
            <Image className="text-[#FF4B2B]" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <label className="cursor-pointer">
            <Video className="text-[#FF4B2B]" />
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <label className="cursor-pointer">
            <FileText className="text-[#FF4B2B]" />
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="absolute right-5 rounded-md bg-[#FF4B2B] px-4 py-1.5 font-medium text-white disabled:opacity-60"
        >
          {loading ? "Sharing..." : "Share"}
        </button>
      </form>
    </div>
  );
}
