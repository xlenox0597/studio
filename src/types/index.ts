
export interface Note {
  id: string;
  title: string;
  content: string; // HTML content from rich text editor
  tags: string[];
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  font?: string;
  backgroundImage?: string; // URL for background image
  // For simplicity, color settings will rely on theme rather than per-note.
}

export type NoteSortOption = "createdAt_desc" | "createdAt_asc" | "updatedAt_desc" | "title_asc" | "title_desc";

export interface NoteFilters {
  searchTerm?: string;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
}
