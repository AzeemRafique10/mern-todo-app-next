import mongoose, { Schema, model, models } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI in .env");
}

// Ensure the connection is reused
let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Define Todo schema
const todoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    completed: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true }
);

export const Todo = models.Todo || model("Todo", todoSchema);

// CRUD operations
export async function getAllTodos() {
  await connectToDatabase();
  return Todo.find().sort({ createdAt: -1 });
}

export async function getTodoById(id: string) {
  await connectToDatabase();
  return Todo.findById(id);
}

export async function createTodo(
  title: string,
  description: string,
  priority: string
) {
  await connectToDatabase();
  const todo = new Todo({ title, description, priority });
  return todo.save();
}

export async function updateTodo(
  id: string,
  title: string,
  description: string,
  priority: string,
  completed: boolean
) {
  await connectToDatabase();
  return Todo.findByIdAndUpdate(
    id,
    { title, description, priority, completed },
    { new: true }
  );
}

export async function deleteTodo(id: string) {
  await connectToDatabase();
  return Todo.findByIdAndDelete(id);
}

export async function toggleTodoComplete(id: string) {
  await connectToDatabase();
  const todo = await Todo.findById(id);
  if (!todo) throw new Error("Todo not found");
  todo.completed = !todo.completed;
  return todo.save();
}
