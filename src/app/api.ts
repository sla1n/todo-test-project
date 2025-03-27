export async function getTodos() {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/todos?_limit=10"
  );
  return await res.json();
}

export async function addTodo(title: string, id: number) {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: 20,
      id,
      title,
      completed: false,
    }),
  });
  return res.json();
}

export async function deleteTodo(id: number) {
  await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
    method: "DELETE",
  });
  return id;
}
