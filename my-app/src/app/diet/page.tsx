// page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import type React from "react";

export default function Diet() {
  // Meal plan state stores a JSON object with keys as cuisines and values as arrays of meal recipes.
  const [mealPlan, setMealPlan] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [calorieGoal, setCalorieGoal] = useState("");
  const [hasSubmittedPreferences, setHasSubmittedPreferences] = useState(false);

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [goal, setGoal] = useState("");
  const [cuisinePreferences, setCuisinePreferences] = useState<string[]>([]);

  const cuisineFlagMap: { [key: string]: string } = {
    Chinese: "/china.png",
    French: "/france.png",
    Greek: "/greek.png",
    Indian: "/india.png",
    Italian: "/italy.png",
    Japanese: "/japan.png",
    Mexican: "/mexico.png",
    Korean: "/south-korea.png",
    Thai: "/thailand.png",
    American: "/united-states.png",
  };

  const dietaryOptions = [
    "No Restrictions",
    "Vegetarian",
    "Nut-Free",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Keto-Friendly",
    "Low-Carb",
  ];

  // On mount, load profile data from localStorage.
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const savedProfile = JSON.parse(localStorage.getItem(`profile_${currentUser}`) || "{}");
      if (savedProfile) {
        setHeight(savedProfile.height || "");
        setWeight(savedProfile.weight || "");
        setAge(savedProfile.age || "");
        setGoal(savedProfile.goal || "");
        setCuisinePreferences(savedProfile.cuisinePreferences || []);
      }
    }
  }, []);

  // Submit handler to generate the meal plan.
  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dietaryRestrictions || !calorieGoal) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/meal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Generate my meal plan" }],
          dietaryRestrictions,
          calorieGoal,
          cuisinePreferences,
          height,
          weight,
          age,
          goal,
        }),
      });

      // Since the API outputs valid JSON, we parse it directly.
      const data = await response.json();
      setMealPlan(data);
      setHasSubmittedPreferences(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-[#97a683]/60 via-[#97a683]/30 to-white text-[#2f2226] font-mono overflow-hidden">
      <div
        className="fixed inset-0 w-full h-full z-0"
        style={{
          backgroundImage:
            "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fernframe-gEXNhsyz2Ooo9B2jUQdPp2TXz1B13e.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 1.0,
        }}
      />

      <header className="flex justify-between items-center fixed top-6 left-6 right-6 z-10">
        <Link
          href="/dashboard"
          className="block w-fit cursor-pointer flex items-center bg-[#2f2226] text-white font-mono font-thin text-lg py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors duration-300"
        >
          <ChevronLeft className="mr-2" size={20} />
          Back to Dashboard
        </Link>
      </header>

      <main className="relative z-10 p-8 max-w-4xl mx-auto min-h-screen flex items-center">
        <div className="w-full">
          {!hasSubmittedPreferences ? (
            <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-md border border-[#97a683]/30 rounded-3xl p-8 shadow-lg">
              <h1 className="text-3xl font-thin mb-6 text-center text-[#2f2226]">
                Custom Meal Plan Generator
              </h1>
              <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2 text-[#2f2226] font-thin">Daily Calorie Goal</label>
                  <input
                    type="number"
                    min="1200"
                    max="3000"
                    step="50"
                    value={calorieGoal}
                    onChange={(e) => setCalorieGoal(e.target.value)}
                    className="w-full p-2 border border-[#97a683]/30 rounded-lg text-[#2f2226] bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-[#2f2226] font-thin">Dietary Restrictions/Preferences</label>
                  <select
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                    className="w-full p-2 border border-[#97a683]/30 rounded-lg bg-white text-[#2f2226]"
                    required
                  >
                    <option value="">Select your dietary preference</option>
                    {dietaryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-[#2f2226] font-thin">
                    Preferred Cuisines (From Profile)
                  </label>
                  <div className="p-2 border border-[#97a683]/30 rounded-lg bg-white/50 text-[#2f2226] flex flex-wrap gap-2">
                    {cuisinePreferences.length > 0 ? (
                      cuisinePreferences.map((cuisine) => (
                        <div key={cuisine} className="flex items-center space-x-2">
                          <Image
                            src={cuisineFlagMap[cuisine] || "/placeholder.svg"}
                            alt={`${cuisine} Flag`}
                            width={30}
                            height={20}
                            className="rounded"
                          />
                          <span className="font-thin">{cuisine}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[#2f2226]/70 font-thin">No cuisines selected in profile</span>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center bg-[#2f2226] text-white font-mono font-thin text-lg py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors duration-300"
                >
                  {isLoading ? "Generating Plan..." : "Generate Meal Plan"}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-md border border-[#97a683]/30 rounded-3xl p-8 shadow-lg">
              <h1 className="text-3xl font-thin mb-6 text-center text-[#2f2226]">Your Adapted Meal Plan</h1>
              {cuisinePreferences.map((cuisine) => (
                <div key={cuisine} className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Image
                      src={cuisineFlagMap[cuisine] || "/placeholder.svg"}
                      alt={`${cuisine} Flag`}
                      width={40}
                      height={30}
                      className="rounded"
                    />
                    <span className="text-xl font-thin text-[#2f2226]">{cuisine}</span>
                  </div>
                  <div className="space-y-4">
                    {mealPlan[cuisine] && mealPlan[cuisine].map((meal, index) => (
                      <div key={index} className="p-4 rounded-lg bg-white/50 text-[#2f2226] border border-[#97a683]/30">
                        <h2 className="font-bold text-lg">
                          {meal.mealName} — {meal.totalCalories} kcal
                        </h2>
                        <p><strong>Ingredients:</strong> {meal.ingredients}</p>
                        <p><strong>Calories per Serving:</strong> {meal.caloriesPerServing}</p>
                        <p>
                          <strong>Macros:</strong> Protein: {meal.macros.protein}, Carbs: {meal.macros.carbs}, Fats: {meal.macros.fats}
                        </p>
                        <p><strong>Note:</strong> {meal.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  setHasSubmittedPreferences(false);
                  setMealPlan({});
                }}
                className="w-full flex items-center justify-center bg-[#2f2226] text-white font-mono font-thin text-lg py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors duration-300"
              >
                Generate New Plan
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}