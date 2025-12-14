"use client";
import Image from "next/image";
import { useState, useRef, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { signIn, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const openFile = () => fileRef.current?.click();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (!res.ok) {
      const err = await res.json();
      return alert(err.message || "Registration failed");
    }

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await signIn("credentials", { email, password, redirect: false });
    router.push("/");
  };

  if (status === "loading") return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Create account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative flex justify-center">
              <Image
                width={112}
                height={112}
                src={preview || "/avatar.png"}
                className="h-28 w-28 rounded-full object-cover border"
                alt="profile"
              />
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-[calc(50%-56px)] translate-x-full"
                onClick={openFile}
              >
                <Camera size={16} />
              </Button>
              <input
                ref={fileRef}
                name="image"
                type="file"
                hidden
                accept="image/*"
                onChange={(e) =>
                  e.target.files &&
                  setPreview(URL.createObjectURL(e.target.files[0]))
                }
              />
            </div>

            <Input name="name" placeholder="Username" required minLength={5} />
            <Input name="email" type="email" placeholder="Email" required />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
              minLength={6}
            />

            <Button className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Get Started"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              Continue with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}