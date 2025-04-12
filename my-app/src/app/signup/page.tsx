/* eslint-disable @next/next/no-html-link-for-pages */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()

    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // Check if username already exists
    if (users.find((user: { username: string }) => user.username === username)) {
      setError("User already exists")
      return
    }

    // Save new user in localStorage
    users.push({ username, password })
    localStorage.setItem("users", JSON.stringify(users))

    setSuccess("Account created! Redirecting to login...")
    setTimeout(() => router.push("/login"), 2000)
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage:
          "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-NFrvBq0kFxQg9PEkRrdUilflhOhQV9.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <a
        href="/"
        className="absolute top-4 left-4 text-white font-mono font-thin text-sm hover:opacity-80 transition-opacity duration-300 z-20"
      >
        ← Back to Home
      </a>
      {/* Large centered background logo with low opacity */}
      <div className="absolute inset-0 flex items-center justify-center translate-y-10 pointer-events-none">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fernlogo-78ippMKqAzdjAACfaGumWnXUnVkqdP.png"
          alt=""
          width={800}
          height={240}
          className="w-4/5 max-w-4xl opacity-10"
          priority
        />
      </div>

      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 w-full max-w-md relative z-20 border border-white border-opacity-20">
        <div className="w-[60%] max-w-[200px] mx-auto mb-8">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fernlogowhite-rsTpCgl74GhXANk8FNjt3jRRBZ1OwM.png"
            alt="Fern"
            width={400}
            height={120}
            priority
            className="w-full h-auto"
          />
        </div>

        <h2 className="text-2xl font-mono font-thin text-white mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSignup} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-white bg-opacity-10 border border-white border-opacity-20 p-3 rounded-lg text-white placeholder-white placeholder-opacity-60 font-mono font-thin focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white bg-opacity-10 border border-white border-opacity-20 p-3 rounded-lg text-white placeholder-white placeholder-opacity-60 font-mono font-thin focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20"
          />
          <button
            type="submit"
            className="bg-[#2f2226] text-white font-mono font-thin text-lg py-2 px-8 rounded-full hover:bg-opacity-80 transition-colors duration-300 mt-4"
          >
            Sign Up
          </button>
        </form>
        {error && <p className="text-red-300 font-mono font-thin text-center mt-4">{error}</p>}
        {success && <p className="text-[#ffffff] font-mono font-thin text-center mt-4">{success}</p>}
        <p className="text-white font-mono font-thin text-center mt-6 text-sm opacity-70">
          Already have an account?{" "}
          <a href="/login" className="underline hover:opacity-80 transition-opacity duration-300">
            Log In
          </a>
        </p>
      </div>
    </div>
  )
}