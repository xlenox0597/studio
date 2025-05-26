
"use client";

import type { Note } from "@/types";
import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { v4 as uuidv4 } from "uuid"; // Needs: npm install uuid && npm install --save-dev @types/uuid

interface NoteContextType {
  notes: Note[];
  addNote: (noteData: Omit<Note, "id" | "createdAt" | "updatedAt">) => Note;
  updateNote: (updatedNote: Note) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
  isLoading: boolean;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "pocketQuillNotes";

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error("Failed to load notes from localStorage:", error);
      // Fallback or error handling
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) { // Only save to localStorage after initial load
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
      } catch (error) {
        console.error("Failed to save notes to localStorage:", error);
      }
    }
  }, [notes, isLoading]);

  const addNote = useCallback((noteData: Omit<Note, "id" | "createdAt" | "updatedAt">): Note => {
    const now = new Date().toISOString();
    const newNote: Note = {
      ...noteData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    return newNote;
  }, []);

  const updateNote = useCallback((updatedNote: Note) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === updatedNote.id ? { ...updatedNote, updatedAt: new Date().toISOString() } : note
      )
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  }, []);

  const getNoteById = useCallback((id: string): Note | undefined => {
    return notes.find((note) => note.id === id);
  }, [notes]);

  return (
    <NoteContext.Provider value={{ notes, addNote, updateNote, deleteNote, getNoteById, isLoading }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => {
  const context = React.useContext(NoteContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NoteProvider");
  }
  return context;
};
