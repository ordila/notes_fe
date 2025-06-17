import React from "react";
import { useMutation } from "@apollo/client";
import { DELETE_NOTE } from "../../graphql/operations";
import { Note } from "../../types";
import "./NotesList.css";

interface NotesListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: () => void;
}

const NotesList: React.FC<NotesListProps> = ({ notes, onEdit, onDelete }) => {
  const [deleteNoteMutation] = useMutation(DELETE_NOTE);

  const handleDelete = async (id: string) => {
    if (window.confirm("Ви впевнені, що хочете видалити цю нотатку?")) {
      try {
        await deleteNoteMutation({ variables: { id } });
        onDelete();
      } catch (error) {
        console.error("Помилка видалення:", error);
        alert("Не вдалося видалити нотатку");
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("uk-UA");
  };

  const formatTags = (tags?: string[]) => {
    if (!tags || tags.length === 0) return "";
    return tags.map((tag) => `#${tag}`).join(" ");
  };

  if (notes.length === 0) {
    return (
      <div className="empty-state">
        <p>📝 Поки що нотаток немає</p>
        <p>Додайте першу нотатку, щоб почати!</p>
      </div>
    );
  }

  return (
    <div className="notes-list">
      {notes.map((note) => (
        <div key={note.id} className="note-card">
          <div className="note-header">
            <h3 className="note-title">{note.title}</h3>
            <div className="note-actions">
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => onEdit(note)}
              >
                ✏️ Редагувати
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(note.id)}
              >
                🗑️ Видалити
              </button>
            </div>
          </div>

          <div className="note-content">
            {note.content ? (
              <>
                {note.content.substring(0, 150)}
                {note.content.length > 150 && "..."}
              </>
            ) : (
              "Немає змісту"
            )}
          </div>

          {note.tags && note.tags.length > 0 && (
            <div className="note-tags">{formatTags(note.tags)}</div>
          )}

          <div className="note-meta">
            <small>
              Створено: {formatDate(note.createdAt)}
              {note.updatedAt !== note.createdAt &&
                ` • Оновлено: ${formatDate(note.updatedAt)}`}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesList;
