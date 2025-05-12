// Updated posts library with Google Drive integration
import { loadFromDrive, saveToDrive, isSignedIn, isDriveAvailable } from "./drive-storage"

export interface PostSection {
  type: "text" | "code"
  content: string
  language?: string
}

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  tags?: string[]
  content: PostSection[]
}

// Sample initial posts data
const initialPosts: Post[] = [
  {
    slug: "getting-started-with-nextjs",
    title: "Getting Started with Next.js",
    date: "2023-05-10",
    excerpt: "Today I learned how to set up a Next.js project and explored its file-based routing system.",
    tags: ["Next.js", "React", "Web Development"],
    content: [
      {
        type: "text",
        content:
          "Today I started learning Next.js and I'm really impressed with how easy it is to get started. The file-based routing system is intuitive and powerful.",
      },
      {
        type: "text",
        content: "To create a new Next.js project, you can use the following command:",
      },
      {
        type: "code",
        language: "bash",
        content: "npx create-next-app@latest my-next-app",
      },
      {
        type: "text",
        content:
          "The file structure is very intuitive. For example, to create a new page, you just need to add a new file to the pages directory:",
      },
      {
        type: "code",
        language: "jsx",
        content: `// pages/about.js
export default function About() {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is the about page</p>
    </div>
  )
}`,
      },
      {
        type: "text",
        content: "I'm excited to learn more about Next.js and build more complex applications with it!",
      },
    ],
  },
  // Other initial posts...
]

// In-memory cache of posts
let postsCache: Post[] | null = null

// Load posts from storage (Drive or localStorage)
export const loadPosts = async (): Promise<Post[]> => {
  // Return cached posts if available
  if (postsCache) {
    return postsCache
  }

  try {
    // Try to load from Google Drive first if available and signed in
    if (typeof window !== "undefined" && isDriveAvailable() && isSignedIn()) {
      const drivePosts = await loadFromDrive()
      if (drivePosts && drivePosts.length > 0) {
        postsCache = drivePosts
        return drivePosts
      }
    }

    // Fall back to localStorage if Drive fails or user is not signed in
    if (typeof window !== "undefined") {
      const savedPosts = localStorage.getItem("blog_posts")
      if (savedPosts) {
        const posts = JSON.parse(savedPosts)
        postsCache = posts
        return posts
      }
    }

    // If no posts in storage, use initial posts
    if (typeof window !== "undefined") {
      localStorage.setItem("blog_posts", JSON.stringify(initialPosts))
    }
    postsCache = initialPosts
    return initialPosts
  } catch (error) {
    console.error("Error loading posts:", error)
    postsCache = initialPosts
    return initialPosts
  }
}

// Save posts to storage (Drive and localStorage)
export const savePosts = async (posts: Post[]): Promise<void> => {
  if (typeof window === "undefined") return

  // Update cache
  postsCache = posts

  try {
    // Save to localStorage as backup
    localStorage.setItem("blog_posts", JSON.stringify(posts))

    // Save to Google Drive if available and signed in
    if (isDriveAvailable() && isSignedIn()) {
      await saveToDrive(posts)
    }
  } catch (error) {
    console.error("Error saving posts:", error)
  }
}

// Get all posts sorted by date (newest first)
export async function getAllPosts(): Promise<Post[]> {
  const posts = await loadPosts()
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Get a single post by slug
export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await loadPosts()
  return posts.find((post) => post.slug === slug)
}

// Add a new post
export async function addPost(post: Post): Promise<void> {
  const posts = await loadPosts()

  // Check if a post with this slug already exists
  const existingPostIndex = posts.findIndex((p) => p.slug === post.slug)

  if (existingPostIndex >= 0) {
    // Update existing post
    posts[existingPostIndex] = post
  } else {
    // Add new post
    posts.unshift(post) // Add to beginning of array
  }

  // Save to storage
  await savePosts(posts)

  // Dispatch event for UI updates
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("postsUpdated"))
  }
}

// Export posts to a JSON file for backup
export function exportPosts(): void {
  if (typeof window === "undefined") return

  const posts = JSON.parse(localStorage.getItem("blog_posts") || "[]")
  const blob = new Blob([JSON.stringify(posts, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = "code-like-a-pro-posts-backup.json"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Import posts from a JSON file
export function importPosts(file: File): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string
        const posts = JSON.parse(content)

        // Validate that the imported data is an array of posts
        if (!Array.isArray(posts) || !posts.every(isValidPost)) {
          reject(new Error("Invalid posts data format"))
          return
        }

        // Save the imported posts
        await savePosts(posts)

        // Update UI
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("postsUpdated"))
        }

        resolve(true)
      } catch (error) {
        console.error("Error importing posts:", error)
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error("Failed to read file"))
    }

    reader.readAsText(file)
  })
}

// Validate post structure
function isValidPost(post: any): boolean {
  return (
    typeof post === "object" &&
    typeof post.slug === "string" &&
    typeof post.title === "string" &&
    typeof post.date === "string" &&
    typeof post.excerpt === "string" &&
    Array.isArray(post.content)
  )
}
