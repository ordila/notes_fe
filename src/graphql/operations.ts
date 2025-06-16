import { gql } from "@apollo/client";

export const NOTE_FRAGMENT = gql`
  fragment NoteFields on Note {
    id
    title
    content
    tags
    createdAt
    updatedAt
  }
`;

export const GET_NOTES = gql`
  ${NOTE_FRAGMENT}
  query GetNotes {
    notes {
      ...NoteFields
    }
  }
`;

export const GET_NOTE = gql`
  ${NOTE_FRAGMENT}
  query GetNote($id: ID!) {
    note(id: $id) {
      ...NoteFields
    }
  }
`;

export const CREATE_NOTE = gql`
  ${NOTE_FRAGMENT}
  mutation CreateNote($input: CreateNoteInput!) {
    createNote(input: $input) {
      ...NoteFields
    }
  }
`;

export const UPDATE_NOTE = gql`
  ${NOTE_FRAGMENT}
  mutation UpdateNote($id: ID!, $input: UpdateNoteInput!) {
    updateNote(id: $id, input: $input) {
      ...NoteFields
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation DeleteNote($id: ID!) {
    deleteNote(id: $id)
  }
`;

export const TEST_SUPABASE = gql`
  query TestSupabase {
    testSupabase
  }
`;
