"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Download, LogOut } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import jsPDF from "jspdf"

type DayMark = {
  day: number
  month: number
  year: number
  mark: "check" | "x"
  physicalNotes?: string
  emotionalNotes?: string
  isPeriod?: boolean
}

// Textarea component
const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={`flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = "Textarea"

export default function Dashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [markedDays, setMarkedDays] = useState<DayMark[]>([])
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [physicalNotes, setPhysicalNotes] = useState("")
  const [emotionalNotes, setEmotionalNotes] = useState("")
  const [isPeriod, setIsPeriod] = useState(false)
  const router = useRouter()

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1]

    if (!token) {
      router.push("/login")
    } else {
      setAuthenticated(true)
      try {
        const decoded = JSON.parse(atob(token))
        setUsername(decoded.username)
        localStorage.setItem("currentUser", decoded.username)
      } catch (error) {
        console.error("Error decoding token:", error)
      }
    }
  }, [router])

  useEffect(() => {
    const savedUsername = localStorage.getItem("currentUser")
    if (savedUsername) {
      setUsername(savedUsername)
      const savedProgress = localStorage.getItem(`progress_${savedUsername}`)
      if (savedProgress !== null) {
        setMarkedDays(JSON.parse(savedProgress))
      }
    }
  }, [])

  useEffect(() => {
    if (username) {
      localStorage.setItem(`progress_${username}`, JSON.stringify(markedDays))
    }
  }, [markedDays, username])

  // Load notes when a day is selected
  useEffect(() => {
    if (selectedDay) {
      const existingDay = markedDays.find(
        (d) => d.day === selectedDay && d.month === currentDate.getMonth() && d.year === currentDate.getFullYear(),
      )
      setPhysicalNotes(existingDay?.physicalNotes || "")
      setEmotionalNotes(existingDay?.emotionalNotes || "")
      setIsPeriod(existingDay?.isPeriod || false)
    } else {
      setPhysicalNotes("")
      setEmotionalNotes("")
      setIsPeriod(false)
    }
  }, [selectedDay, markedDays, currentDate])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const saveNotes = () => {
    if (selectedDay) {
      setMarkedDays((prev) => {
        const filtered = prev.filter(
          (d) => !(d.day === selectedDay && d.month === currentDate.getMonth() && d.year === currentDate.getFullYear()),
        )
        return [
          ...filtered,
          {
            day: selectedDay,
            month: currentDate.getMonth(),
            year: currentDate.getFullYear(),
            mark: "check",
            physicalNotes,
            emotionalNotes,
            isPeriod,
          },
        ]
      })
    }
  }

  const handleDayClick = (day: number) => {
    if (selectedDay === day) {
      setSelectedDay(null) // Close panel if same day is clicked
    } else {
      setSelectedDay(day) // Open panel with new day
    }
  }

  const changeMonth = (increment: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + increment)
      return newDate
    })
    setSelectedDay(null)
  }

  const changeYear = (increment: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setFullYear(prev.getFullYear() + increment)
      return newDate
    })
    setSelectedDay(null)
  }

  const exportMonthToPDF = () => {
    const pdf = new jsPDF()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    pdf.setFontSize(18)
    pdf.text(`Notes for ${months[currentMonth]} ${currentYear}`, 20, 20)

    pdf.setFontSize(12)
    let yOffset = 40

    markedDays
      .filter((day) => day.month === currentMonth && day.year === currentYear)
      .sort((a, b) => a.day - b.day)
      .forEach((day) => {
        const dayHeader = `Day ${day.day}:`
        pdf.setFont("Helvetica", "bold")
        pdf.text(dayHeader, 20, yOffset)
        pdf.setFont("Helvetica", "normal")
        yOffset += 10

        if (day.isPeriod) {
          pdf.text("Period day", 25, yOffset)
          yOffset += 7
        }

        if (day.physicalNotes) {
          pdf.text("Physical Notes:", 25, yOffset)
          yOffset += 7
          const physicalLines = pdf.splitTextToSize(day.physicalNotes, 160)
          pdf.text(physicalLines, 30, yOffset)
          yOffset += physicalLines.length * 7 + 5
        }

        if (day.emotionalNotes) {
          pdf.text("Emotional Notes:", 25, yOffset)
          yOffset += 7
          const emotionalLines = pdf.splitTextToSize(day.emotionalNotes, 160)
          pdf.text(emotionalLines, 30, yOffset)
          yOffset += emotionalLines.length * 7 + 5
        }

        yOffset += 10

        if (yOffset > 280) {
          pdf.addPage()
          yOffset = 20
        }
      })

    pdf.save(`notes_${months[currentMonth]}_${currentYear}.pdf`)
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return authenticated ? (
    <div className="min-h-screen flex">
      {/* Background image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage:
            "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PinkGreen.jpg-6YjmU6K4uYM7v3fPRcE1WLjgYeJeFm.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "saturate(110%)",
        }}
      />

      {/* Decorative floral frame overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          backgroundImage:
            "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/calendarframe-XJRSkXLsCl88Xn1e4flRjGrPBbYJ2P.png)",
          backgroundSize: "100% auto",
          backgroundPosition: "bottom right",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Sidebar */}
      <div className="w-64 backdrop-blur-md bg-white bg-opacity-20 p-6 flex flex-col shadow-lg z-20 fixed left-0 h-full">
        <div className="mb-8">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fernlogowhite-rsTpCgl74GhXANk8FNjt3jRRBZ1OwM.png"
            alt="Fern"
            width={200}
            height={60}
            priority
            className="w-full h-auto"
          />
        </div>
        <h1 className="text-xl font-mono font-thin text-[#2f2226] mb-6">
          Welcome, {username}!
        </h1>
        <h1 className="text-xl font-mono font-thin text-[#2f2226] mb-6">
        <p>Today&apos;s date is</p>{" "}
          {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.
        </h1>
        <div className="flex-grow"></div>
        <button
          onClick={exportMonthToPDF}
          className="mb-4 flex items-center justify-center bg-[#2f2226] text-white font-mono font-thin text-lg py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors duration-300"
        >
          <Download className="mr-2" size={20} />
          Export Month
        </button>
        <Link
          href="/dashboard"
          className="mb-4 flex items-center justify-center bg-white text-[#2f2226] font-mono font-thin text-lg py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors duration-300"
        >
          <ChevronLeft className="mr-2" size={20} />
          Dashboard
        </Link>
        <button
          onClick={() => {
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
            localStorage.removeItem("currentUser")
            router.push("/login")
          }}
          className="flex items-center justify-center bg-white text-[#2f2226] font-mono font-thin text-lg py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors duration-300"
        >
          <LogOut className="mr-2" size={20} />
          Logout
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 z-20 ml-64">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4 mr-8">
              <button
                onClick={() => changeMonth(-1)}
                className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
              >
                <ChevronLeft className="text-[#2f2226]" />
              </button>
              <span className="text-2xl font-mono font-thin text-[#2f2226] min-w-[140px] text-center">
                {months[currentDate.getMonth()]}
              </span>
              <button
                onClick={() => changeMonth(1)}
                className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
              >
                <ChevronRight className="text-[#2f2226]" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => changeYear(-1)}
                className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
              >
                <ChevronLeft className="text-[#2f2226]" />
              </button>
              <span className="text-2xl font-mono font-thin text-[#2f2226]">{currentDate.getFullYear()}</span>
              <button
                onClick={() => changeYear(1)}
                className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
              >
                <ChevronRight className="text-[#2f2226]" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center font-mono font-thin text-xs text-[#2f2226] p-1">
                {day}
              </div>
            ))}
            {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }, (_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {currentMonthDays.map((day) => {
              const markedDay = markedDays.find(
                (d) => d.day === day && d.month === currentDate.getMonth() && d.year === currentDate.getFullYear(),
              )
              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`aspect-square flex flex-col items-center justify-center text-[#2f2226] font-mono font-thin text-sm rounded-md relative
                             ${selectedDay === day ? "ring-2 ring-[#2f2226]" : ""}
                             ${markedDay?.isPeriod ? "ring-2 ring-red-700" : ""}
                             ${markedDay ? "bg-[#8ad489]" : "bg-white bg-opacity-50"}`}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Side panel */}
      {selectedDay && (
        <div className="w-64 backdrop-blur-md bg-white bg-opacity-20 p-6 shadow-lg z-30 flex flex-col h-full fixed right-0 top-0 bottom-0 overflow-y-auto">
          <h3 className="text-xl font-mono font-thin text-[#2f2226] mb-4">
            {months[currentDate.getMonth()]} {selectedDay}, {currentDate.getFullYear()}
          </h3>
          <div className="flex-grow space-y-4">
            <div>
              <label className="block text-sm font-mono font-thin text-[#2f2226] mb-1">Physical Notes:</label>
              <Textarea
                value={physicalNotes}
                onChange={(e) => setPhysicalNotes(e.target.value)}
                placeholder="Log your physical notes for this day such as cramps, nausea, breakouts, etc."
                className="min-h-[225px] bg-white bg-opacity-50 border-none text-[#2f2226] placeholder-[#2f2226]/50 font-mono font-thin resize-none w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-mono font-thin text-[#2f2226] mb-1">Emotional Notes:</label>
              <Textarea
                value={emotionalNotes}
                onChange={(e) => setEmotionalNotes(e.target.value)}
                placeholder="Log your emotional notes for this day such as mood swings, hormonal imbalances, etc."
                className="min-h-[225px] bg-white bg-opacity-50 border-none text-[#2f2226] placeholder-[#2f2226]/50 font-mono font-thin resize-none w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="periodCheckbox"
                checked={isPeriod}
                onChange={(e) => setIsPeriod(e.target.checked)}
                className="rounded text-[#2f2226] focus:ring-[#2f2226]"
              />
              <label htmlFor="periodCheckbox" className="text-sm font-mono font-thin text-[#2f2226]">
                Mark as on period
              </label>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => {
                saveNotes()
                setSelectedDay(null)
              }}
              className="bg-green-500 text-white font-mono font-thin text-sm py-2 px-4 rounded-full hover:bg-green-600 transition-colors duration-300"
            >
              Save
            </button>
            <button
              onClick={() => setSelectedDay(null)}
              className="bg-red-500 text-white font-mono font-thin text-sm py-2 px-4 rounded-full hover:bg-red-600 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  ) : null
}