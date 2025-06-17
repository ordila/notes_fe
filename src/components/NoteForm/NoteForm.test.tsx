import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "../../tests/utils/test-utils";
import userEvent from "@testing-library/user-event";
import NoteForm from "./NoteForm";
import { createNoteMock, updateNoteMock } from "../../tests/utils/mocks";

describe("NoteForm", () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty form for new note", () => {
    render(<NoteForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    expect(screen.getByText("Нова нотатка")).toBeInTheDocument();
    expect(screen.getByLabelText(/назва нотатки/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/зміст/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/теги/i)).toBeInTheDocument();
  });

  it("renders form with existing note data", () => {
    const existingNote = {
      id: "1",
      title: "Existing Note",
      content: "Existing Content",
      tags: ["existing"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    render(
      <NoteForm
        note={existingNote}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText("Редагувати нотатку")).toBeInTheDocument();
    expect(screen.getByLabelText(/назва нотатки/i)).toHaveValue(
      "Existing Note"
    );
    expect(screen.getByLabelText(/зміст/i)).toHaveValue("Existing Content");
    expect(screen.getByLabelText(/теги/i)).toHaveValue("existing");
  });

  it("handles form submission for new note", async () => {
    render(<NoteForm onSave={mockOnSave} onCancel={mockOnCancel} />, {
      mocks: [createNoteMock],
    });

    await userEvent.type(screen.getByLabelText(/назва нотатки/i), "Test Note");
    await userEvent.type(screen.getByLabelText(/зміст/i), "Test Content");
    await userEvent.type(screen.getByLabelText(/теги/i), "test, example");

    fireEvent.click(screen.getByText("Створити"));

    await waitFor(() => {
      expect(createNoteMock.request.variables).toEqual({
        input: {
          title: "Test Note",
          content: "Test Content",
          tags: ["test", "example"],
        },
      });
    });
  });

  it("handles form submission for existing note", async () => {
    const existingNote = {
      id: "1",
      title: "Existing Note",
      content: "Existing Content",
      tags: ["existing"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    render(
      <NoteForm
        note={existingNote}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />,
      { mocks: [updateNoteMock] }
    );

    await userEvent.clear(screen.getByLabelText(/назва нотатки/i));
    await userEvent.type(
      screen.getByLabelText(/назва нотатки/i),
      "Updated Note"
    );
    await userEvent.clear(screen.getByLabelText(/зміст/i));
    await userEvent.type(screen.getByLabelText(/зміст/i), "Updated Content");
    await userEvent.clear(screen.getByLabelText(/теги/i));
    await userEvent.type(screen.getByLabelText(/теги/i), "updated");

    fireEvent.click(screen.getByText("Оновити"));

    await waitFor(() => {
      expect(updateNoteMock.request.variables).toEqual({
        id: "1",
        input: {
          title: "Updated Note",
          content: "Updated Content",
          tags: ["updated"],
        },
      });
    });
  });

  it("shows validation error for empty fields", async () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<NoteForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByText("Створити"));

    expect(alertMock).toHaveBeenCalledWith("Заповніть назву та зміст нотатки");
    expect(mockOnSave).not.toHaveBeenCalled();
    alertMock.mockRestore();
  });

  it("handles cancel button click", () => {
    render(<NoteForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByText("Скасувати"));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
