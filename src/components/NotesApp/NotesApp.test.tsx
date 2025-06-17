import { render, screen } from "../../tests/utils/test-utils";
import NotesApp from "./NotesApp";
import NotesList from "../NotesList/NotesList";
import {
  mockNotes,
  getNotesLoadingMock,
  getNotesErrorMock,
  deleteNoteMock,
} from "../../tests/utils/mocks";

describe("NotesApp", () => {
  it("відображає повідомлення про завантаження", () => {
    render(<NotesApp />, { mocks: [getNotesLoadingMock] });
    expect(screen.getByText("⏳ Завантаження нотаток...")).toBeInTheDocument();
  });

  it("відображає повідомлення про помилку", async () => {
    render(<NotesApp />, { mocks: [getNotesErrorMock] });
    const errorMessage = await screen.findByText(/❌ Помилка:/);
    expect(errorMessage).toBeInTheDocument();
  });

  it("NotesList правильно відображає нотатки", () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    render(
      <NotesList
        notes={mockNotes}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />,
      { mocks: [deleteNoteMock] }
    );

    // Перевіряємо наявність заголовків нотаток
    expect(screen.getByText("Тестова нотатка 1")).toBeInTheDocument();
    expect(screen.getByText("Тестова нотатка 2")).toBeInTheDocument();

    // Перевіряємо наявність контенту
    expect(screen.getByText(/Зміст нотатки 1/)).toBeInTheDocument();
    expect(screen.getByText(/Зміст нотатки 2/)).toBeInTheDocument();
  });

  it("NotesList відображає порожній стан", () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    render(
      <NotesList notes={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
      { mocks: [] }
    );

    expect(screen.getByText("📝 Поки що нотаток немає")).toBeInTheDocument();
    expect(
      screen.getByText("Додайте першу нотатку, щоб почати!")
    ).toBeInTheDocument();
  });
});
