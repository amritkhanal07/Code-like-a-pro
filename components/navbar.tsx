"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, PenSquare, Settings } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const routes = [
    { href: "/", label: "Home" },
    { href: "/daily-log", label: "Daily Log" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {routes.map((route) => (
                  <Button
                    key={route.href}
                    variant={pathname === route.href ? "default" : "ghost"}
                    asChild
                    onClick={() => setOpen(false)}
                    className="justify-start"
                  >
                    <Link href={route.href}>{route.label}</Link>
                  </Button>
                ))}
                <Button
                  variant={pathname === "/admin" ? "default" : "ghost"}
                  asChild
                  onClick={() => setOpen(false)}
                  className="justify-start"
                >
                  <Link href="/admin">
                    <PenSquare className="mr-2 h-4 w-4" />
                    Add Post
                  </Link>
                </Button>
                <Button
                  variant={pathname === "/settings" ? "default" : "ghost"}
                  asChild
                  onClick={() => setOpen(false)}
                  className="justify-start"
                >
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="font-bold text-xl">
            Code Like a Pro
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {routes.map((route) => (
            <Button key={route.href} variant={pathname === route.href ? "default" : "ghost"} asChild>
              <Link href={route.href}>{route.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="hidden md:flex">
            <Link href="/admin" aria-label="Add new post">
              <PenSquare className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="hidden md:flex">
            <Link href="/settings" aria-label="Settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
