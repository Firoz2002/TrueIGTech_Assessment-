"use client";

import Image from "next/image";
import { useState, ChangeEvent, FormEvent } from "react";
import { ImageIcon, Video, FileText, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { User } from "@/types/user";
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
    if (selected.type.startsWith("image/")) setPreview(URL.createObjectURL(selected));
    else setPreview(null);
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

    const res = await fetch("/api/posts", { method: "POST", body: formData });
    const data = await res.json();

    if (res.ok) {
      createPostHandler(data.data);
      setContent("");
      removeFile();
    } else {
      alert(data.message || "Failed to create post");
    }
    setLoading(false);
  };

  return (
    <div className="mt-5 w-full rounded-2xl border-2 border-[#eeedeb] bg-white">
      <div className="flex items-center">
        <Image
          width={48}
          height={48}
          className="mr-2 m-4 h-12 w-12 rounded-full object-cover"
          src={
            user?.image ||
            "https://res.cloudinary.com/dhlsmeyw1/image/upload/v1729425848/CloudinaryDemo/ze0moba23397vhmmwgyp.png"
          }
          alt="user"
        />
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Share what's on your mind, ${user.name || "User"}...`}
          className="h-20 w-full border-none text-lg outline-none z-10"
        />
      </div>

      {preview && (
        <div className="relative mx-5 mb-3">
          <img
            src={preview}
            alt="preview"
            className="max-h-64 w-full rounded-xl object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            onClick={removeFile}
            className="absolute right-2 top-2 p-1"
          >
            <X size={16} />
          </Button>
        </div>
      )}

      <form
        onSubmit={submitHandler}
        className="relative flex items-center justify-between rounded-b-[15px] border-t-2 border-[#eeedeb] bg-[#faf9f7] p-5"
      >
        <div className="flex space-x-4">
          <Label className="cursor-pointer flex items-center">
            <ImageIcon className="text-[#FF4B2B]" />
            <Input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </Label>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Sharing..." : "Share"}
        </Button>
      </form>
    </div>
  );
}