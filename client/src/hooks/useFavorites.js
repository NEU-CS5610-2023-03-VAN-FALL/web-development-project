import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
//这个是用来显示所有的list item，不用跟react 7-4那样用use effect

// this is a custom hook that fetches the todos items from the API
// custom hooks are a way to share logic between components
export default function useTodos() {
  const [todosItems, setTodosItems] = useState([]);
  const { accessToken } = useAuthToken();

  useEffect(() => {
    async function getTodosFromApi() {
      // fetch the todos from the API, passing the access token in the Authorization header
      const data = await fetch(`${process.env.REACT_APP_API_URL}/todos`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const todos = await data.json();

      setTodosItems(todos);
    }

    if (accessToken) {
      getTodosFromApi();
    }
  }, [accessToken]);

  return [todosItems, setTodosItems];
}
