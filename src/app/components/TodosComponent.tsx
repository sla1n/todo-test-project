"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Todo } from "../entities/Todo";
import SingleTodo from "./SingleTodo";
import { useState } from "react";
import cuid from "cuid";
import { addTodo, deleteTodo, getTodos } from "../api";

export default function TodosComponent() {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();

  const {
    data: todos,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
    initialData: queryClient.getQueryData(["todos"]),
  });

  const addTodoMutation = useMutation({
    mutationFn: async ({ title, id }: { title: string; id: number }) =>
      addTodo(title, id),

    onMutate: async ({ title }) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);

      const newId = previousTodos ? previousTodos.length + 1 : 1;

      queryClient.setQueryData(["todos"], (oldTodos: Todo[] = []) => [
        ...oldTodos,
        { id: newId, title, completed: false },
      ]);

      return { previousTodos };
    },

    onError: (_err, _newTodo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (id: number) => deleteTodo(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);

      queryClient.setQueryData(["todos"], (oldTodos: Todo[] | undefined) =>
        oldTodos ? oldTodos.filter((todo) => todo.id !== id) : []
      );

      return { previousTodos };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },
  });

  if (isPending) return <p>Loading..</p>;
  if (isError) return <p>Error fetching the data.</p>;

  return (
    <div className="w-full rounded-xl shadow-lg mx-auto bg-white p-2 flex flex-col items-center sm:w-3/4 sm:my-8 sm:p-4 lg:p-6 lg:w-3/4 lg:my-4">
      <div className="flex w-full mb-2 items-center gap-3 sm:mb-4 lg:mb-6">
        <label
          className="font-medium text-gray-700 sm:text-lg lg:text-xl"
          htmlFor="task-text"
        >
          Task:
        </label>
        <input
          className="py-1 px-2 sm:py-1.5 sm:px-4 lg:py-3 lg:px-6 bg-gray-100 border border-gray-300 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-emerald-400 "
          type="text"
          name="task-text"
          id="task-text"
          placeholder="Enter a new task..."
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          onKeyDown={(e) => {
            if (e.key === "Enter" && title.trim()) {
              addTodoMutation.mutate({ title, id: todos.length + 1 });
              setTitle("");
            }
          }}
        />
        <button
          className="py-1 px-2 sm:py-1.5 sm:px-4 lg:py-3 lg:px-6 lg:text-lg bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition disabled:bg-gray-300"
          onClick={() => {
            addTodoMutation.mutate({ title, id: todos.length + 1 });
            setTitle("");
          }}
          disabled={!title}
        >
          Add
        </button>
      </div>
      <div className="w-full grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 lg:gap-5">
        {todos
          .map((todo: Todo) => (
            <SingleTodo
              key={cuid()}
              todo={todo}
              deleteMutation={deleteTodoMutation}
            />
          ))
          .reverse()}
      </div>
    </div>
  );
}
