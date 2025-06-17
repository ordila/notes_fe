import { render, screen } from "./tests/utils/test-utils";
import App from "./App";
import { getNotesLoadingMock } from "./tests/utils/mocks";

test("відображає заголовок додатку", () => {
  render(<App />, { mocks: [getNotesLoadingMock] });

  const headerElement = screen.getByText("📝 Система нотаток");
  expect(headerElement).toBeInTheDocument();

  const descriptionElement = screen.getByText("GraphQL + NestJS + Supabase");
  expect(descriptionElement).toBeInTheDocument();
});
