import type * as React from "react"
import { cn } from "@/lib/utils"

interface StepsProps {
  children: React.ReactNode
  className?: string
}

export function Steps({ children, className }: StepsProps) {
  return <div className={cn("space-y-8", className)}>{children}</div>
}

interface StepProps {
  number: number
  title: string
  children: React.ReactNode
  className?: string
}

export function Step({ number, title, children, className }: StepProps) {
  return (
    <div className={cn("relative pl-8 pb-8 border-l last:border-l-0", className)}>
      <div className="absolute left-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground -translate-x-1/2 text-sm font-medium">
        {number}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="text-muted-foreground">{children}</div>
    </div>
  )
}
