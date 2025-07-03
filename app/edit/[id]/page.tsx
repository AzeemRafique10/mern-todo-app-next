"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Todo } from "@/lib/db";

export default function EditTodoPage({ params }: { params: { id: string } }) {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchTodo();
  }, []);

  const fetchTodo = async () => {
    try {
      const response = await fetch(`/api/todos/${params.id}`);
      if (response.ok) {
        const todoData = await response.json();
        setTodo(todoData);
        setTitle(todoData.title);
        setDescription(todoData.description);
        setPriority(todoData.priority);
        setCompleted(todoData.completed);
      } else {
        alert("Todo not found");
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching todo:", error);
      alert("Failed to load todo");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a title for your todo");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/todos/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          priority,
          completed,
        }),
      });

      if (response.ok) {
        router.push("/");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update todo");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      alert("Failed to update todo");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading todo...</p>
        </div>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Todo Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The todo you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Todo</h1>
            <p className="text-gray-600">Update your task details.</p>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Edit className="w-5 h-5 mr-2" />
                Todo Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Title *
                  </label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter todo title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Enter todo description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="priority"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Priority
                  </label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="completed"
                    checked={completed}
                    onCheckedChange={(checked) =>
                      setCompleted(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="completed"
                    className="text-sm font-medium text-gray-700"
                  >
                    Mark as completed
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? "Updating..." : "Update Todo"}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Todo Info */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(todo.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>Last Updated:</strong>{" "}
                  {new Date(todo.updated_at).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
