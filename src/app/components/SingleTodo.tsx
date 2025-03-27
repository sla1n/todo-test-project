"use client";

import { useEffect, useState } from "react";
import { Todo } from "../entities/Todo";
import { UseMutationResult } from "@tanstack/react-query";
import { Trash } from "lucide-react";

interface Props {
  todo: Todo;
  deleteMutation: UseMutationResult<
    number,
    Error,
    number,
    {
      previousTodos: Todo[] | undefined;
    }
  >;
}

function SingleTodo({ todo, deleteMutation }: Props) {
  const { title, completed, id } = todo;
  const [isChecked, setIsChecked] = useState(completed);

  useEffect(() => {
    setIsChecked(completed);
  }, [completed]);

  return (
    <div className="flex w-full mx-auto justify-between items-center gap-4 p-1.5 bg-gray-100 rounded-lg shadow-sm lg:min-w-2 md:min-w-4">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id={`todo-${id}`}
          checked={isChecked}
          className=" accent-emerald-800 cursor-pointer"
          onChange={() => setIsChecked((prev) => !prev)}
        />
        <label
          htmlFor={`todo-${id}`}
          className={`text-gray-800 lg:text-lg cursor-pointer transition ${
            isChecked ? "line-through text-gray-500" : ""
          }`}
        >
          {title}
        </label>
      </div>

      <button
        className="p-2 rounded-full hover:bg-red-100 transition"
        onClick={() => deleteMutation.mutate(id)}
      >
        <Trash className="text-red-600 w-5 h-5" />
      </button>
    </div>
  );
}
export default SingleTodo;
