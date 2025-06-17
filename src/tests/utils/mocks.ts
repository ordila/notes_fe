import {
  GET_NOTES,
  DELETE_NOTE,
  CREATE_NOTE,
  UPDATE_NOTE,
} from "../../graphql/operations";

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

export const getNotesSuccessMock = {
  request: {
    query: GET_NOTES,
  },
  result: {
    data: {
      notes: mockNotes,
    },
  },
};

export const getNotesLoadingMock = {
  request: {
    query: GET_NOTES,
  },
  result: {
    data: {
      notes: [],
    },
  },
  delay: 100,
};

export const getNotesErrorMock = {
  request: {
    query: GET_NOTES,
  },
  error: new Error("Помилка завантаження"),
};

export const deleteNoteMock = {
  request: {
    query: DELETE_NOTE,
    variables: { id: "1" },
  },
  result: {
    data: {
      deleteNote: true,
    },
  },
};

export const createNoteMock = {
  request: {
    query: CREATE_NOTE,
    variables: {
      input: {
        title: "Test Note",
        content: "Test Content",
        tags: ["test", "example"],
      },
    },
  },
  result: {
    data: {
      createNote: {
        id: "1",
        title: "Test Note",
        content: "Test Content",
        tags: ["test", "example"],
      },
    },
  },
};
export const updateNoteMock = {
  request: {
    query: UPDATE_NOTE,
    variables: {
      id: "1",
      input: {
        title: "Updated Note",
        content: "Updated Content",
        tags: ["updated"],
      },
    },
  },
  result: {
    data: {
      updateNote: {
        id: "1",
        title: "Updated Note",
        content: "Updated Content",
        tags: ["updated"],
      },
    },
  },
};
