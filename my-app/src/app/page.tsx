"use client"

import Image from "next/image"
import { ChevronDown, User, LogOut } from "lucide-react"
import { useRef, useEffect, useState } from "react"

const bounceAnimation = `
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}
`

//const features = [
//{ title: "Customized Diets", description: "Tailored meal plans for PCOS nutrition needs." },
//{ title: "Fitness Plans", description: "Personalized routines for your health goals." },
//{ title: "Symptom Tracker", description: "Monitor and analyze your PCOS symptoms." },
//];

const words = ["Nurture", "Balance", "Growth"]

export default function Page() {
  const aboutRef = useRef<HTMLDivElement>(null)
  const [isAboutVisible, setIsAboutVisible] = useState(false)
  const [tagline, setTagline] = useState("")
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    localStorage.removeItem("currentUser")
    setIsLoggedIn(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (aboutRef.current) {
        const rect = aboutRef.current.getBoundingClientRect()
        setIsAboutVisible(rect.top <= 0 && rect.bottom > 0)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1]
    setIsLoggedIn(!!token)
  }, [])

  useEffect(() => {
    if (isPaused) return

    const currentWord = words[wordIndex]
    const intervalDuration = isDeleting ? 50 : 150

    const timer = setInterval(() => {
      setTagline((prev) => {
        const updated =
          isDeleting ? currentWord.substring(0, prev.length - 1) : currentWord.substring(0, prev.length + 1)

        if (!isDeleting && updated === currentWord) {
          setIsPaused(true)
          setTimeout(() => {
            setIsPaused(false)
            setIsDeleting(true)
          }, 2000)
        }

        if (isDeleting && updated === "") {
          setIsDeleting(false)
          setWordIndex((prevIndex) => (prevIndex + 1) % words.length)
        }

        return updated
      })
    }, intervalDuration)

    return () => clearInterval(timer)
  }, [wordIndex, isDeleting, isPaused])

  return (
    <>
      <style jsx>{bounceAnimation}</style>
      <main
        className="h-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-NFrvBq0kFxQg9PEkRrdUilflhOhQV9.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Line Overlay */}
        <div
          className="absolute inset-0 z-50 pointer-events-none"
          style={{
            backgroundImage: "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lineframe-i2YFpjEaL78XnSiM7TKUy0r69m9sFx.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Background Logo */}
        <div className="absolute inset-0 flex items-center justify-center translate-y-10 pointer-events-none">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fernlogo-78ippMKqAzdjAACfaGumWnXUnVkqdP.png"
            alt="Fern Logo"
            width={800}
            height={240}
            className="w-4/5 max-w-4xl opacity-10"
            priority
          />
        </div>

        {/* Navbar */}
        <nav
          className={`fixed top-8 left-1/2 transform -translate-x-[48%] ${
            isAboutVisible ? "bg-[#2f2226]" : "bg-white bg-opacity-15 backdrop-filter backdrop-blur-md"
          } border border-white border-opacity-30 rounded-full px-10 py-4 z-30 transition-colors duration-300`}
        >
          <ul className="flex items-center space-x-12">
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className="text-white font-mono font-thin text-lg md:text-xl hover:opacity-75 transition-opacity duration-300"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (!isLoggedIn) {
                    scrollToAbout()
                  } else {
                    window.location.href = "/dashboard"
                  }
                }}
                className="text-white font-mono font-thin text-lg md:text-xl hover:opacity-75 transition-opacity duration-300"
              >
                {isLoggedIn ? "Dashboard" : "About"}
              </a>
            </li>
            {!isLoggedIn && (
              <li>
                <a
                  href="/signup"
                  className="text-white font-mono font-thin text-lg md:text-xl hover:opacity-75 transition-opacity duration-300"
                >
                  Register
                </a>
              </li>
            )}
            <li>
              {isLoggedIn ? (
                <div className="flex items-center space-x-8">
                  <a
                    href="/profile"
                    className="text-white font-mono font-thin text-lg md:text-xl hover:opacity-75 transition-opacity duration-300 flex items-center"
                  >
                    <User className="mr-2" size={20} />
                    My Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="text-white font-mono font-thin text-lg md:text-xl hover:opacity-75 transition-opacity duration-300 flex items-center"
                  >
                    <LogOut className="mr-2" size={20} />
                    Logout
                  </button>
                </div>
              ) : (
                <a
                  href="/login"
                  className="text-white font-mono font-thin text-lg md:text-xl hover:opacity-75 transition-opacity duration-300"
                >
                  Login
                </a>
              )}
            </li>
          </ul>
        </nav>

        {/* Fern logo white */}
        <div className="w-[97.65625%] max-w-[390px] mb-8 relative z-10 ml-8">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fernlogowhite-rsTpCgl74GhXANk8FNjt3jRRBZ1OwM.png"
            alt="Fern"
            width={400}
            height={120}
            priority
            className="w-full h-auto"
          />
        </div>

        {/* Tagline */}
        <p className="text-white font-mono font-thin text-center text-xl md:text-3xl max-w-[90%] tracking-wide leading-relaxed mb-8 relative z-10 mx-auto flex justify-center">
          <span className="inline-flex justify-end" style={{ width: "180px" }}>
            {tagline}
          </span>
          <span className="inline-flex" style={{ width: "20px" }} />
          <span>through</span>
          <span className="inline-flex" style={{ width: "20px" }} />
          <span>PCOS.</span>
        </p>

        {/* Learn More Button */}
        <button
          onClick={scrollToAbout}
          className="bg-[#2f2226] text-white font-mono font-thin text-lg md:text-xl py-2 px-8 rounded-full hover:bg-opacity-80 transition-colors duration-300 relative z-10 ml-6 block"
        >
          Learn More
        </button>

        {/* Chevron Scroll Button */}
        <button
          onClick={scrollToAbout}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-15 backdrop-filter backdrop-blur-md border border-white border-opacity-30 rounded-full p-2 hover:bg-opacity-25 transition-all duration-300 z-10"
          aria-label="Scroll to About section"
          style={{ animation: "bounce 2s infinite" }}
        >
          <ChevronDown className="text-white w-4 h-4" />
        </button>
      </main>

      {/* About Section */}
      <section
        id="about"
        ref={aboutRef}
        className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#97a683]/60 via-[#97a683]/30 to-white text-[#2f2226] relative overflow-hidden pt-20"
      >
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            backgroundImage:
              "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fernframe-xur1V20cJjF3PU1L82p4okxD36FhLM.png)",
            backgroundSize: "100% auto",
            backgroundPosition: "center bottom",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 -mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-3xl font-mono font-thin mb-4 text-[#2f2226]">About Us</h2>
              <p className="text-lg font-mono font-thin leading-relaxed">
                Fern is a platform supporting individuals on their PCOS journey. We offer personalized diet and fitness
                plans, along with an intuitive symptom tracker to empower your path to wellness.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-mono font-thin mb-4 text-[#2f2226]">What is PCOS?</h2>
              <p className="text-lg font-mono font-thin leading-relaxed">
                Polycystic Ovary Syndrome (PCOS) is a common hormonal disorder affecting women. It can cause irregular
                periods, excess hair growth, weight gain, and other symptoms. Fern provides personalized care to manage
                these symptoms.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}