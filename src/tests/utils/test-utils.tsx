import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

export const mockNotes = [
  {
    id: "1",
    title: "Тестова нотатка 1",
    content: "Зміст нотатки 1",
    tags: ["тест"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Тестова нотатка 2",
    content: "Зміст нотатки 2",
    tags: ["тест"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  mocks?: any[];
}

const customRender = (
  ui: ReactElement,
  { mocks = [], ...renderOptions }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MockedProvider mocks={mocks} addTypename={false}>
      {children}
    </MockedProvider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from "@testing-library/react";
export { customRender as render };
