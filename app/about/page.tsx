import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "About | Code Like a Pro",
  description: "Learn more about the author and the purpose of this developer blog",
}

export default function AboutPage() {
  const skills = ["Python", "MATLAB", "AutoCad", "MS-Office", "Git", "GitHub"]

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">About Me</h1>
        <p className="text-muted-foreground">The person behind Code Like a Pro and my journey in programming.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="relative w-48 h-48 rounded-full overflow-hidden">
            <Image
              src="https://scontent.fktm17-1.fna.fbcdn.net/v/t39.30808-1/299998219_1219235362259874_3461131236352982343_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=102&ccb=1-7&_nc_sid=e99d92&_nc_ohc=ZJ4t8PYWTmsQ7kNvwHTPqvW&_nc_oc=AdnyQJjIRFDJ_NcsUm6dInU5IJgkSI3IJGm39dBdmrHiTawf41ckVJ4YvELK-6zhI94&_nc_zt=24&_nc_ht=scontent.fktm17-1.fna&_nc_gid=C2llgVwW1TgsWyppS4TUow&oh=00_AfI7oopSCFRrvuAL3pvp7sCtL_S5HFqczoolu2MLI2f9qQ&oe=68268ADD"
              alt="Profile picture"
              width={192}
              height={192}
              className="object-cover"
            />
          </div>
        </div>

        <div className="w-full md:w-2/3 space-y-4">
          <h2 className="text-2xl font-bold">Hello, I'm Amrit Khanal</h2>
          <p>
            I'm a passionate developer who believes in learning in public and documenting my journey. This blog serves
            as my digital garden where I share what I learn each day in the world of programming.
          </p>
          <p>
            My goal is to become a better developer by consistently learning and sharing my knowledge. By documenting my
            daily discoveries, challenges, and solutions, I hope to create a valuable resource for myself and others on
            similar journeys.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-xl font-bold mb-4">Skills & Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">About This Blog</h3>
        <p>
          "Code Like a Pro" is my personal learning journal where I document my daily programming experiences. Each post
          captures what I've learned, challenges I've faced, and solutions I've discovered.
        </p>
        <p>The site features:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Daily log entries with detailed explanations</li>
          <li>Code snippets with syntax highlighting</li>
          <li>A clean, developer-friendly design</li>
          <li>Dark mode support for comfortable reading</li>
          <li>Responsive layout for all devices</li>
        </ul>
      </div>
    </div>
  )
}
