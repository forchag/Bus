"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FcGoogle } from "react-icons/fc"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.message || "Login failed")
        return
      }
      const data = await res.json()
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data))
      }
      router.push("/dashboard")
    } catch (err) {
      console.error("Login error", err)
      alert("Login failed")
    }
  }

  const handleGoogleLogin = () => {
    // In a real app, this would trigger Google OAuth
    console.log("Google login clicked")
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <Button variant="outline" type="button" className="w-full" onClick={handleGoogleLogin}>
              <FcGoogle className="mr-2 h-5 w-5" />
              Login with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-primary underline hover:text-primary/90">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
