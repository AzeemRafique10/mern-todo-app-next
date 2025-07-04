"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Todo } from "@/lib/db";

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TodoCard({ todo, onToggle, onDelete }: TodoCardProps) {
  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <Card
      className={`transition-all duration-200 ${
        todo.completed ? "opacity-60" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => onToggle(todo.id)}
            />
            <CardTitle
              className={`text-lg ${
                todo.completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {todo.title}
            </CardTitle>
          </div>
          <Badge className={priorityColors[todo.priority]}>
            {todo.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p
          className={`text-sm text-muted-foreground mb-4 ${
            todo.completed ? "line-through" : ""
          }`}
        >
          {todo.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Created: {new Date(todo.created_at).toLocaleDateString()}
          </span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/todos/${todo.id}`}>
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(todo.id)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
