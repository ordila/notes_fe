import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_NOTE, UPDATE_NOTE } from "../../graphql/operations";
import { Note, CreateNoteInput, UpdateNoteInput } from "../../types";
import "./NoteForm.css";

interface NoteFormProps {
  note?: Note | null;
  onSave: () => void;
  onCancel: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [createNote] = useMutation(CREATE_NOTE);
  const [updateNote] = useMutation(UPDATE_NOTE);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTagsInput(note.tags?.join(", ") || "");
    }
  }, [note]);

  const parseTags = (tagsString: string): string[] => {
    return tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Заповніть назву та зміст нотатки");
      return;
    }

    setLoading(true);

    try {
      const tags = parseTags(tagsInput);

      if (note) {
        const input: UpdateNoteInput = {
          title: title.trim(),
          content: content.trim(),
          tags: tags.length > 0 ? tags : [],
        };
        await updateNote({ variables: { id: note.id, input } });
      } else {
        const input: CreateNoteInput = {
          title: title.trim(),
          content: content.trim(),
          tags: tags.length > 0 ? tags : [],
        };
        await createNote({ variables: { input } });
      }

      onSave();
    } catch (error) {
      console.error("Помилка збереження:", error);
      alert("Не вдалося зберегти нотатку");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{note ? "Редагувати нотатку" : "Нова нотатка"}</h3>
        <button type="button" className="btn btn-close" onClick={onCancel}>
          ✕
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="title">Назва нотатки:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введіть назву нотатки..."
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Зміст:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Введіть зміст нотатки..."
          rows={6}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="tags">Теги (через кому):</label>
        <input
          id="tags"
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="наприклад: робота, важливо, ідея"
        />
        <small>Розділіть теги комами</small>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Скасувати
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Збереження..." : note ? "Оновити" : "Створити"}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
