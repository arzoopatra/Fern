"use client"

import React, { useEffect, useState, useRef, createContext } from "react"
import { ChevronLeft, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { JSX } from "react/jsx-runtime"


// Interfaces
interface Exercise {
  name: string
  sets: number
  reps: string
  rest: string
  intensity: string
}

interface DayPlan {
  bodyParts: string
  exercises: Exercise[]
  notes: string
}

interface WorkoutPlan {
  workoutSplit: string
  schedule: {
    [day: string]: DayPlan
  }
  recovery: string
}

interface Card {
  category: string
  title: string
  content: React.ReactNode
}

// Context
const CarouselContext = createContext<{
  onCardClose: (index: number) => void
  currentIndex: number
}>({
  onCardClose: () => {},
  currentIndex: 0,
})

// Components
const Carousel = ({ items }: { items: JSX.Element[] }) => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    checkScrollability()
  }, [])

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth)
    }
  }

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = window.innerWidth < 768 ? 230 : 384
      const gap = window.innerWidth < 768 ? 4 : 8
      const scrollPosition = (cardWidth + gap) * (index + 1)
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
      setCurrentIndex(index)
    }
  }

  return (
    <CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex }}>
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto py-5 md:py-10 scroll-smooth [scrollbar-width:none]"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div className="flex flex-row justify-start gap-4 pl-4 max-w-7xl mx-auto">
            {items.map((item, index) => (
              <div key={`card${index}`} className="last:pr-[5%] md:last:pr-[33%] rounded-3xl">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 mr-10">
          <button
            className="relative z-40 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <ArrowLeft className="h-6 w-6 text-gray-500" />
          </button>
          <button
            className="relative z-40 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50"
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <ArrowRight className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  )
}

const Card = ({ card }: { card: Card; index: number }) => {
  return (
    <div className="rounded-3xl bg-[#f5f5dc] text-[#2f2226] h-80 w-56 md:h-[40rem] md:w-96 overflow-hidden flex flex-col items-start justify-start relative z-10 p-6 font-mono font-thin">
      <h3 className="text-xl md:text-2xl mb-4">{card.category}</h3>
      <h4 className="text-lg md:text-xl mb-2">{card.title}</h4>
      <div className="overflow-y-auto flex-grow text-[#2f2226]">{card.content}</div>
    </div>
  )
}

// Main Component
export default function Workout() {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [daysPerWeek, setDaysPerWeek] = useState("")
  const [timePerDay, setTimePerDay] = useState("")
  const [exerciseConstraints, setExerciseConstraints] = useState("")
  const [hasSubmittedPreferences, setHasSubmittedPreferences] = useState(false)

  // User profile data
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [age, setAge] = useState("")
  const [goal, setGoal] = useState("")

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const savedProfile = JSON.parse(localStorage.getItem(`profile_${currentUser}`) || "{}")
      if (savedProfile) {
        setHeight(savedProfile.height || "")
        setWeight(savedProfile.weight || "")
        setAge(savedProfile.age || "")
        setGoal(savedProfile.goal || "")
      }
    }
  }, [])

  const constraintOptions = [
    "Gym Access (Full Equipment)",
    "Home Gym (Bands & Dumbbells)",
    "Dumbbells Only",
    "Bodyweight Only",
    "Resistance Bands Only",
  ]

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!daysPerWeek || !timePerDay || !exerciseConstraints) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Generate my workout plan" }],
          daysPerWeek,
          timePerDay,
          exerciseConstraints,
          height,
          weight,
          age,
          goal,
        }),
      })

      const data = await response.json()
      setWorkoutPlan(data)
      setHasSubmittedPreferences(true)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-12"
      style={{
        backgroundImage:
          "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-hpj89LUXiAqqpKjY3DAoYSjwbMKFS1.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <header className="flex justify-between items-center fixed top-6 left-6 right-6 z-10">
        <Link
          href="/dashboard"
          className="flex items-center bg-[#2f2226] text-white font-mono font-thin text-lg py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors duration-300"
        >
          <ChevronLeft className="mr-2" size={20} />
          Back to Dashboard
        </Link>
      </header>

      <div className="bg-white bg-opacity-15 backdrop-filter backdrop-blur-md border border-white border-opacity-30 rounded-3xl p-8 max-w-5xl w-full mx-auto relative z-10 overflow-y-auto max-h-[80vh]">
        {!hasSubmittedPreferences ? (
          <>
            <h1 className="text-3xl font-mono font-thin mb-6 text-[#2f2226] text-center">Custom PCOS Workout Plan</h1>

            <form onSubmit={handlePreferencesSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 font-mono font-thin text-[#2f2226]">
                  How many times per week would you like to work out?
                </label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(e.target.value)}
                  className="w-full p-2 rounded-md font-mono font-thin text-[#2f2226] border border-[#2f2226] bg-white bg-opacity-50"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-mono font-thin text-[#2f2226]">
                  How many minutes per day would you like to work out?
                </label>
                <input
                  type="number"
                  min="10"
                  max="180"
                  value={timePerDay}
                  onChange={(e) => setTimePerDay(e.target.value)}
                  className="w-full p-2 rounded-md font-mono font-thin text-[#2f2226] border border-[#2f2226] bg-white bg-opacity-50"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-mono font-thin text-[#2f2226]">
                  What equipment do you have available?
                </label>
                <select
                  value={exerciseConstraints}
                  onChange={(e) => setExerciseConstraints(e.target.value)}
                  className="w-full p-2 rounded-md font-mono font-thin text-[#2f2226] border border-[#2f2226] bg-white bg-opacity-50 appearance-none"
                  required
                >
                  <option value="">Select your equipment</option>
                  {constraintOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2f2226] text-white font-mono font-thin text-lg py-2 px-8 rounded-full hover:bg-opacity-80 transition-colors duration-300 disabled:opacity-50"
              >
                {isLoading ? "Generating Plan..." : "Generate Workout Plan"}
              </button>
            </form>
          </>
        ) : workoutPlan ? (
          <>
            <h1 className="text-3xl font-mono font-thin mb-6 text-[#2f2226] text-center">Your Workout Plan</h1>
            <p className="font-mono font-bold text-[#2f2226] mb-4 text-center text-2xl">
              <strong>Workout Split:</strong> {workoutPlan.workoutSplit}
            </p>
            <Carousel
              items={Object.entries(workoutPlan.schedule).map(([day, details], index) => (
                <Card
                  key={day}
                  card={{
                    category: day,
                    title: details.bodyParts,
                    content: (
                      <div className="space-y-4 text-sm md:text-base">
                        <div>
                          <strong className="text-[#2f2226]">Exercises:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {details.exercises.map((exercise, idx) => (
                              <li key={idx}>
                                {exercise.name} – {exercise.sets} sets of {exercise.reps} reps, rest: {exercise.rest},
                                intensity: {exercise.intensity}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <p>
                          <strong className="text-[#2f2226]">Notes:</strong> {details.notes}
                        </p>
                      </div>
                    ),
                  }}
                  index={index}
                />
              ))}
            />
            <div className="mt-6 p-4 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30">
              <h2 className="text-xl font-mono font-bold text-[#2f2226] mb-2">Recovery & Stress Management</h2>
              <p className="font-mono font-thin text-[#2f2226]">{workoutPlan.recovery}</p>
            </div>
            <button
              onClick={() => {
                setHasSubmittedPreferences(false)
                setWorkoutPlan(null)
              }}
              className="w-full mt-6 bg-[#2f2226] text-white font-mono font-thin text-lg py-2 px-8 rounded-full hover:bg-opacity-80 transition-colors duration-300"
            >
              Generate New Plan
            </button>
          </>
        ) : null}
      </div>
      <style jsx global>{`
        body {
          font-family: monospace;
          font-weight: 300;
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: monospace;
          font-weight: 300;
        }
        .workout-card h3 {
          color: #ffffff;
          font-weight: 300;
        }
        .workout-card p, .workout-card ul {
          color: #2f2226;
          font-weight: 300;
        }
        .workout-card strong {
          font-weight: 400;
        }
      `}</style>
    </div>
  )
}