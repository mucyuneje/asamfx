"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ThemeToggleButton from "@/components/ThemeToggle";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert(errorData.error || "Login failed");
      return;
    }

    // Fetch logged-in user info from cookie
    const userRes = await fetch("/api/auth/me");
    if (!userRes.ok) {
      alert("Failed to get user info");
      return;
    }

    const userData = await userRes.json();

    if (userData.role === "ADMIN") router.push("/dashboard/admin");
    else router.push("/dashboard/user");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <ThemeToggleButton />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>
          <Button type="submit" className="w-full mt-2">Sign In</Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
