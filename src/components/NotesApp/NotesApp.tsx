import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_NOTES } from "../../graphql/operations";
import { Note } from "../../types";
import NotesList from "../NotesList/NotesList";
import NoteForm from "../NoteForm/NoteForm";
import "./NotesApp.css";

const NotesApp: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_NOTES, {
    errorPolicy: "all",
  });

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsFormOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingNote(null);
  };

  const handleNoteChange = () => {
    refetch();
    handleCloseForm();
  };

  if (loading) return <div className="loading">⏳ Завантаження нотаток...</div>;
  if (error) return <div className="error">❌ Помилка: {error.message}</div>;

  const notes: Note[] = data?.notes || [];

  return (
    <div className="notes-app" data-testid="notes-container">
      <div className="notes-header">
        <h2>Мої нотатки ({notes.length})</h2>
        <button className="btn btn-primary" onClick={handleCreateNote}>
          ➕ Додати нотатку
        </button>
      </div>

      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <NoteForm
              note={editingNote}
              onSave={handleNoteChange}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}

      <NotesList
        notes={notes}
        onEdit={handleEditNote}
        onDelete={handleNoteChange}
      />
    </div>
  );
};

export default NotesApp;
