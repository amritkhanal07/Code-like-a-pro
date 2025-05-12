"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAllPosts } from "@/lib/posts"
import { formatDate } from "@/lib/utils"
import { ArrowRight, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Post } from "@/lib/posts"

export default function DailyLogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getAllPosts()
        setPosts(allPosts)
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

  if (loading) {
    return <div className="flex justify-center py-12">Loading posts...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">Daily Log</h1>
        <p className="text-muted-foreground">
          A chronological record of my programming journey, challenges, and discoveries.
        </p>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No posts yet. Start documenting your journey!</p>
            <Button asChild>
              <Link href="/admin">Create Your First Post</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <Card key={post.slug}>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  <Link href={`/posts/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.date)}
                  </span>
                  {post.tags && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">{post.excerpt}</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" asChild>
                  <Link href={`/posts/${post.slug}`}>
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
