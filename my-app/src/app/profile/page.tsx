"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function ProfilePage() {
  const [username, setUsername] = useState("")
  const [height, setHeight] = useState({ feet: "", inches: "" })
  const [weight, setWeight] = useState("")
  const [age, setAge] = useState("")
  const [dietaryRestriction, setDietaryRestriction] = useState("No Restrictions")
  const [goal, setGoal] = useState("")
  const [cuisinePreferences, setCuisinePreferences] = useState<string[]>([])
  const [activityHistory, setActivityHistory] = useState("")
  const router = useRouter()

  const cuisineOptions = [
    "Italian",
    "Mexican",
    "Indian",
    "Chinese",
    "Japanese",
    "Greek",
    "French",
    "Thai",
    "Korean",
    "American",
  ]

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUsername(currentUser)

    const savedProfile = JSON.parse(localStorage.getItem(`profile_${currentUser}`) || "{}")
    if (savedProfile) {
      setHeight({
        feet: savedProfile.height?.feet || "",
        inches: savedProfile.height?.inches || "",
      })
      setWeight(savedProfile.weight || "")
      setAge(savedProfile.age || "")
      setDietaryRestriction(savedProfile.dietaryRestriction || "No Restrictions")
      setGoal(savedProfile.goal || "")
      setCuisinePreferences(savedProfile.cuisinePreferences || [])
      setActivityHistory(savedProfile.activityHistory || "")
    }
  }, [router])

  useEffect(() => {
    if (username) {
      localStorage.setItem(
        `profile_${username}`,
        JSON.stringify({ height, weight, age, dietaryRestriction, goal, cuisinePreferences, activityHistory }),
      )
    }
  }, [height, weight, age, dietaryRestriction, goal, cuisinePreferences, activityHistory, username])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-12"
      style={{
        backgroundImage:
          "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-NFrvBq0kFxQg9PEkRrdUilflhOhQV9.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lineframe-i2YFpjEaL78XnSiM7TKUy0r69m9sFx.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center justify-center bg-[#2f2226] text-white font-mono font-thin text-lg py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors duration-300 z-20"
      >
        <ChevronLeft className="mr-2" size={20} />
        Back to Home
      </Link>

      <div className="bg-white bg-opacity-15 backdrop-filter backdrop-blur-md border border-white border-opacity-30 rounded-3xl p-8 max-w-lg w-full mx-auto relative z-10">
        <h1 className="text-3xl font-mono font-thin mb-6 text-[#2f2226] text-center">Your Profile</h1>

        <div className="flex space-x-2 mb-4">
          <div className="flex-1">
            <label className="block mb-2 font-mono font-thin text-[#2f2226]">Height (ft):</label>
            <input
              type="number"
              value={height.feet}
              onChange={(e) => setHeight({ ...height, feet: e.target.value })}
              className="border border-[#2f2226] bg-white bg-opacity-50 p-2 w-full rounded-md font-mono font-thin text-[#2f2226]"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-mono font-thin text-[#2f2226]">Height (in):</label>
            <input
              type="number"
              value={height.inches}
              onChange={(e) => setHeight({ ...height, inches: e.target.value })}
              className="border border-[#2f2226] bg-white bg-opacity-50 p-2 w-full rounded-md font-mono font-thin text-[#2f2226]"
            />
          </div>
        </div>

        <label className="block mb-2 font-mono font-thin text-[#2f2226]">Weight (lb):</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="border border-[#2f2226] bg-white bg-opacity-50 p-2 w-full mb-4 rounded-md font-mono font-thin text-[#2f2226]"
        />

        <label className="block mb-2 font-mono font-thin text-[#2f2226]">Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="border border-[#2f2226] bg-white bg-opacity-50 p-2 w-full mb-4 rounded-md font-mono font-thin text-[#2f2226]"
        />

        <label className="block mb-2 font-mono font-thin text-[#2f2226]">Dietary Restriction:</label>
        <div className="relative">
          <select
            value={dietaryRestriction}
            onChange={(e) => setDietaryRestriction(e.target.value)}
            className="border border-[#2f2226] bg-white bg-opacity-50 p-2 w-full mb-4 rounded-md font-mono font-thin text-[#2f2226] appearance-none"
          >
            <option>No Restrictions</option>
            <option>Vegetarian</option>
            <option>Nut-Free</option>
            <option>Vegan</option>
            <option>Gluten-Free</option>
            <option>Dairy-Free</option>
            <option>Keto-Friendly</option>
            <option>Low-Carb</option>
          </select>
        </div>

        <label className="block mb-2 font-mono font-thin text-[#2f2226]">Goal:</label>
        <div className="mb-4 flex space-x-4">
          <button
            className={`p-2 rounded-lg font-mono font-thin ${goal === "Gain Weight" ? "bg-[#2f2226] text-white" : "bg-white bg-opacity-50 text-[#2f2226]"}`}
            onClick={() => setGoal("Gain Weight")}
          >
            Gain Weight
          </button>
          <button
            className={`p-2 rounded-lg font-mono font-thin ${goal === "Lose Weight" ? "bg-[#2f2226] text-white" : "bg-white bg-opacity-50 text-[#2f2226]"}`}
            onClick={() => setGoal("Lose Weight")}
          >
            Lose Weight
          </button>
        </div>

        <label className="block mb-2 font-mono font-thin text-[#2f2226]">Cuisine Preferences (Select up to 3):</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {cuisineOptions.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => {
                if (cuisinePreferences.includes(cuisine)) {
                  setCuisinePreferences(cuisinePreferences.filter((c) => c !== cuisine))
                } else if (cuisinePreferences.length < 3) {
                  setCuisinePreferences([...cuisinePreferences, cuisine])
                }
              }}
              className={`px-3 py-1 rounded-full font-mono font-thin text-sm ${
                cuisinePreferences.includes(cuisine)
                  ? "bg-[#2f2226] text-white"
                  : "bg-white bg-opacity-50 text-[#2f2226]"
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>

        <p className="text-white font-mono font-thin mb-4">Profile data is automatically saved!</p>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-[#2f2226] text-white font-mono font-thin text-lg py-2 px-8 rounded-full hover:bg-opacity-80 transition-colors duration-300"
        >
          To Dashboard
        </button>
      </div>
    </div>
  )
}