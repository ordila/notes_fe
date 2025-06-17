import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./lib/apollo-client";

import NotesApp from "./components/NotesApp/NotesApp";

import "./App.css";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="App">
        <header className="app-header">
          <h1>📝 Система нотаток</h1>
          <p>GraphQL + NestJS + Supabase</p>
        </header>
        <main className="app-main">
          <NotesApp />
        </main>
      </div>
    </ApolloProvider>
  );
}

export default App;
