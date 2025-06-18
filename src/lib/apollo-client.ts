import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

// Автоматично визначаємо URL бекенду
const getBackendUrl = () => {
  // Якщо в development режимі, використовуємо локальний сервер
  if (process.env.NODE_ENV === "development") {
    return process.env.REACT_APP_BACKEND_URL || "http://localhost:3000/graphql";
  }
  // В production використовуємо Railway
  return "https://notesbe-production.up.railway.app";
};

const httpLink = createHttpLink({
  uri: getBackendUrl(),
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
  },
});
