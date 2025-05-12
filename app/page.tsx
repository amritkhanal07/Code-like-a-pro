"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllPosts } from "@/lib/posts"
import { formatDate } from "@/lib/utils"
import { ArrowRight, Calendar } from "lucide-react"
import type { Post } from "@/lib/posts"

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getAllPosts()
        setPosts(allPosts.slice(0, 3))
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()

    // Add event listener for storage events to update posts when they change
    const handleStorageChange = () => {
      fetchPosts()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("postsUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("postsUpdated", handleStorageChange)
    }
  }, [])

  return (
    <div className="space-y-12">
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Code Like a Pro</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                A daily journal documenting my programming journey, discoveries, and learnings.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild>
                <Link href="/daily-log">View Daily Log</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/about">About Me</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start gap-4">
            <h2 className="text-2xl font-bold tracking-tighter md:text-3xl">Recent Posts</h2>

            {loading ? (
              <div className="w-full text-center py-12">Loading posts...</div>
            ) : posts.length === 0 ? (
              <Card className="w-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No posts yet. Start documenting your journey!</p>
                  <Button asChild>
                    <Link href="/admin">Create Your First Post</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
                  {posts.map((post) => (
                    <Card key={post.slug} className="flex flex-col h-full">
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(post.date)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-3">{post.excerpt}</p>
                      </CardContent>
                      <CardFooter className="mt-auto pt-4">
                        <Button variant="ghost" className="w-full" asChild>
                          <Link href={`/posts/${post.slug}`}>
                            Read More <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/daily-log">
                    View All Posts <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
