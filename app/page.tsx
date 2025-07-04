"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { TodoCard } from "@/components/todo-card";
import type { TodoType } from "@/lib/db";

export default function HomePage() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos");
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
      });
      if (response.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this todo?")) {
      try {
        const response = await fetch(`/api/todos/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchTodos();
        }
      } catch (error) {
        console.error("Error deleting todo:", error);
      }
    }
  };

  const filteredTodos = todos.filter(
    (todo) =>
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Todo Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your tasks efficiently. {completedCount} of {totalCount}{" "}
              completed.
            </p>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search todos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button asChild>
              <Link href="/add">
                <Plus className="w-4 h-4 mr-2" />
                Add Todo
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900">
                Total Tasks
              </h3>
              <p className="text-3xl font-bold text-blue-600">{totalCount}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
              <p className="text-3xl font-bold text-green-600">
                {completedCount}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900">Remaining</h3>
              <p className="text-3xl font-bold text-orange-600">
                {totalCount - completedCount}
              </p>
            </div>
          </div>

          {/* Todos Grid */}
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Plus className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? "No todos found" : "No todos yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Get started by creating your first todo"}
              </p>
              {!searchTerm && (
                <Button asChild>
                  <Link href="/add">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Todo
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTodos.map((todo) => (
                <TodoCard
                  key={todo._id}
                  todo={todo}
                  onToggle={() => handleToggle(todo._id)}
                  onDelete={() => handleDelete(todo._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
