import { getQueryClient } from "./get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import TodosComponent from "./components/TodosComponent";

export default async function App() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=10"
      );
      return await res.json();
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TodosComponent />
    </HydrationBoundary>
  );
}
