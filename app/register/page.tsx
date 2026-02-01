"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ThemeToggle from "@/components/ThemeToggle"
import { Progress } from "@/components/ui/progress"
import toast from "react-hot-toast" // ✅ import toast

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  const { data: session, status } = useSession()

  // Animate full-page progress while loading
  useEffect(() => {
    if (status === "loading" || loading) {
      setProgress(0)
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 100 : prev + Math.random() * 10))
      }, 100)
      return () => clearInterval(interval)
    }
  }, [status, loading])

  // Redirect immediately when authenticated
  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard")
  }, [status, router])

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Registration successful!") // ✅ success toast
        router.push("/login")
      } else {
        toast.error(data.error || "Registration failed") // ✅ error toast
      }
    } catch (err) {
      toast.error("Network error: " + err) // ✅ network error toast
    } finally {
      setLoading(false)
    }
  }

  // Full-page loader while session is loading or registration is in progress
  if (status === "loading" || loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <div className="w-3/4 md:w-1/2">
          <Progress value={progress} className="h-2 rounded-xl bg-white" />
        </div>
      </div>
    )
  }

  // Only show registration form if unauthenticated
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Register</CardTitle>
            <ThemeToggle />
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="flex items-center justify-center">
                Register
              </Button>
              <p className="text-sm text-center text-muted-foreground mt-2">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-blue-500 hover:underline font-medium"
                >
                  Sign In
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
