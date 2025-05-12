"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getPostBySlug } from "@/lib/posts"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Calendar } from "lucide-react"
import CodeBlock from "@/components/code-block"
import type { Post } from "@/lib/posts"

export default function PostPage() {
  const { slug } = useParams() as { slug: string }
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const foundPost = await getPostBySlug(slug)
        setPost(foundPost || null)
      } catch (error) {
        console.error("Error fetching post:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()

    // Add event listener for storage events to update post when it changes
    const handleStorageChange = () => {
      fetchPost()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("postsUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("postsUpdated", handleStorageChange)
    }
  }, [slug])

  if (loading) {
    return <div className="flex justify-center py-12">Loading post...</div>
  }

  if (!post) {
    return notFound()
  }

  return (
    <article className="max-w-3xl mx-auto">
      <Button variant="ghost" className="mb-6 pl-0" asChild>
        <Link href="/daily-log">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Daily Log
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
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
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        {post.content.map((section, index) => {
          if (section.type === "text") {
            return <p key={index}>{section.content}</p>
          } else if (section.type === "code") {
            return <CodeBlock key={index} language={section.language || "javascript"} code={section.content} />
          }
          return null
        })}
      </div>
    </article>
  )
}
