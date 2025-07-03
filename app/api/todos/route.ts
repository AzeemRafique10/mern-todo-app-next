import { type NextRequest, NextResponse } from "next/server"
import { getAllTodos, createTodo } from "@/lib/db"

export async function GET() {
  try {
    const todos = await getAllTodos()
    return NextResponse.json(todos)
  } catch (error) {
    console.error("Error fetching todos:", error)
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, priority } = await request.json()

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const todo = await createTodo(title, description || "", priority || "medium")
    return NextResponse.json(todo, { status: 201 })
  } catch (error) {
    console.error("Error creating todo:", error)
    return NextResponse.json({ error: "Failed to create todo" }, { status: 500 })
  }
}
