import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "About | Code Like a Pro",
  description: "Learn more about the author and the purpose of this developer blog",
}

export default function AboutPage() {
  const skills = [
    "Python",
    "Machine Learning",
    "MATLAB",
    "AutoCad_Plant_3D",
    "MS-Office",
    "Aspen Plus",
    "Git",
    "GitHub",
  ]

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

        <div className="w-full md:w-2/3">
          <div className="bg-sky-100 border-l-4 border-sky-500 p-6 rounded-2xl shadow-lg space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Hello, I'm <span className="text-yellow-700 font-extrabold">Amrit Khanal</span>
            </h2>
            <p className="text-gray-700">
              I'm a <span className="font-semibold">Chemical Engineer</span> with a strong passion for programming and
              lifelong learning. During my academic journey, I've explored areas like machine learning, which deepened
              my curiosity about the world of programming.
            </p>
            <p className="text-gray-700">
              This website is my digital garden—a personal space where I document what I learn each day, manage my code,
              and reflect on my growth. But it's not just for me.{" "}
              <span className="font-medium">
                Anyone can create their own private blog on this platform to track their coding journey.
              </span>
            </p>
            <p className="text-gray-700">
              Each user's blog is completely personal—<span className="font-semibold">only you</span> can see your own
              content. You can write daily entries, manage code snippets, and record your progress in one place. We use{" "}
              <span className="font-semibold">Firebase</span> to securely store your blogs and code.
            </p>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <strong className="font-bold">⚠️ Important:</strong>
              <span className="block sm:inline">
                {" "}
                Your blog data is stored in the browser's local storage, which will be lost if you clear your browsing
                history, data, or cache. To prevent data loss, connect your app to Firebase to save your blogs securely
                in the cloud, eliminating the need for manual backups. If you cannot connect to Firebase, export your
                blogs as a JSON file before clearing your browser data and import the file later when needed.
              </span>
            </div>
            <p className="text-gray-700">
              This space is designed to help you stay consistent, focused, and continuously improving.
            </p>
          </div>
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
