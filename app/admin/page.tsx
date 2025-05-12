"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Code, AlignLeft, Plus } from "lucide-react"
import { addPost } from "@/lib/posts"

type ContentBlock = {
  type: "text" | "code"
  content: string
  language?: string
}

export default function AdminPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([{ type: "text", content: "" }])
  const contentEndRef = useRef<HTMLDivElement>(null)

  const formRef = useRef<HTMLFormElement>(null)

  // Generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    setSlug(
      newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    )
  }

  // Add a tag
  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput])
      setTagInput("")
    }
  }

  // Remove a tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  // Add a content block
  const addContentBlock = (type: "text" | "code") => {
    const newBlock: ContentBlock = {
      type,
      content: "",
      ...(type === "code" ? { language: "python" } : {}),
    }
    setContentBlocks([...contentBlocks, newBlock])

    // Scroll to the bottom after adding a new block
    setTimeout(() => {
      contentEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  // Update a content block
  const updateContentBlock = (index: number, field: keyof ContentBlock, value: string) => {
    const updatedBlocks = [...contentBlocks]
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      [field]: value,
    }
    setContentBlocks(updatedBlocks)
  }

  // Remove a content block
  const removeContentBlock = (index: number) => {
    const updatedBlocks = [...contentBlocks]
    updatedBlocks.splice(index, 1)
    setContentBlocks(updatedBlocks.length ? updatedBlocks : [{ type: "text", content: "" }])
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!title || !slug || contentBlocks.some((block) => !block.content)) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create excerpt from first text block or truncate first code block
      const excerpt =
        contentBlocks.find((block) => block.type === "text")?.content.slice(0, 150) ||
        contentBlocks[0].content.slice(0, 150) + "..."

      // Format today's date as YYYY-MM-DD
      const today = new Date()
      const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
        today.getDate(),
      ).padStart(2, "0")}`

      // Add the post
      await addPost({
        slug,
        title,
        date,
        excerpt,
        tags,
        content: contentBlocks,
      })

      toast({
        title: "Post created!",
        description: "Your new post has been added successfully.",
      })

      // Reset form
      if (formRef.current) {
        formRef.current.reset()
      }
      setTitle("")
      setSlug("")
      setTags([])
      setContentBlocks([{ type: "text", content: "" }])

      // Redirect to the new post
      router.push(`/posts/${slug}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem creating your post.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">Add New Post</h1>
        <p className="text-muted-foreground">Create a new daily achievement post to share what you've learned.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} ref={formRef}>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
            <CardDescription>Fill in the details for your new post.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title and Slug */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="What I learned today..."
                  value={title}
                  onChange={handleTitleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  placeholder="url-friendly-title"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This will be used in the URL: /posts/{slug || "your-post-slug"}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 rounded-full hover:bg-muted p-1"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tag} tag</span>
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  Add
                </Button>
              </div>
            </div>

            {/* Content Blocks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Content</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => addContentBlock("text")}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <AlignLeft className="h-4 w-4" />
                    Add Text
                  </Button>
                  <Button
                    type="button"
                    onClick={() => addContentBlock("code")}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Code className="h-4 w-4" />
                    Add Code
                  </Button>
                </div>
              </div>

              {contentBlocks.map((block, index) => (
                <div key={index} className="space-y-2 border rounded-md p-4 relative">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant={block.type === "text" ? "outline" : "secondary"}>
                      {block.type === "text" ? "Text" : "Code"}
                    </Badge>
                    <Button
                      type="button"
                      onClick={() => removeContentBlock(index)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 absolute top-2 right-2"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove block</span>
                    </Button>
                  </div>

                  {block.type === "code" && (
                    <div className="mb-2">
                      <Label htmlFor={`language-${index}`}>Language</Label>
                      <Select
                        value={block.language || "javascript"}
                        onValueChange={(value) => updateContentBlock(index, "language", value)}
                      >
                        <SelectTrigger id={`language-${index}`}>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="matlab">MATLAB</SelectItem>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="jsx">JSX</SelectItem>
                          <SelectItem value="tsx">TSX</SelectItem>
                          <SelectItem value="css">CSS</SelectItem>
                          <SelectItem value="html">HTML</SelectItem>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="bash">Bash</SelectItem>
                          <SelectItem value="c">C</SelectItem>
                          <SelectItem value="cpp">C++</SelectItem>
                          <SelectItem value="csharp">C#</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                          <SelectItem value="php">PHP</SelectItem>
                          <SelectItem value="ruby">Ruby</SelectItem>
                          <SelectItem value="go">Go</SelectItem>
                          <SelectItem value="rust">Rust</SelectItem>
                          <SelectItem value="swift">Swift</SelectItem>
                          <SelectItem value="kotlin">Kotlin</SelectItem>
                          <SelectItem value="sql">SQL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Textarea
                    value={block.content}
                    onChange={(e) => updateContentBlock(index, "content", e.target.value)}
                    placeholder={block.type === "text" ? "Enter your text here..." : "Enter your code here..."}
                    className={`min-h-32 ${block.type === "code" ? "font-mono text-sm" : ""}`}
                    required
                  />
                </div>
              ))}

              {/* Bottom content block buttons */}
              <div className="flex justify-center gap-3 pt-2" ref={contentEndRef}>
                <Button
                  type="button"
                  onClick={() => addContentBlock("text")}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Text Block
                </Button>
                <Button
                  type="button"
                  onClick={() => addContentBlock("code")}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Code Block
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Post..." : "Create Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
