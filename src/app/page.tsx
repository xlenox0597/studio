
"use client";

import { useNotes } from "@/contexts/NoteContext";
import { NoteList } from "@/components/notes/NoteList";
import { SearchBarAndSort } from "@/components/notes/SearchBarAndSort";
import type { Note, NoteSortOption, NoteFilters } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useState, useMemo, useCallback } from "react";

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

export default function HomePage() {
  const { notes, isLoading } = useNotes();
  const [sortOption, setSortOption] = useState<NoteSortOption>("updatedAt_desc");
  const [filters, setFilters] = useState<NoteFilters>({});

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(note => note.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [notes]);

  const filteredAndSortedNotes = useMemo(() => {
    let processedNotes = [...notes];

    // Filtering
    if (filters.searchTerm) {
      const searchTermLower = filters.searchTerm.toLowerCase();
      processedNotes = processedNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTermLower) ||
          stripHtml(note.content).toLowerCase().includes(searchTermLower)
      );
    }
    if (filters.tags && filters.tags.length > 0) {
      processedNotes = processedNotes.filter((note) =>
        filters.tags!.every(tag => note.tags.includes(tag))
      );
    }
    if (filters.dateFrom) {
      processedNotes = processedNotes.filter(note => new Date(note.createdAt) >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      // Set time to end of day for dateTo comparison
      const dateToEOD = new Date(filters.dateTo);
      dateToEOD.setHours(23, 59, 59, 999);
      processedNotes = processedNotes.filter(note => new Date(note.createdAt) <= dateToEOD);
    }

    // Sorting
    switch (sortOption) {
      case "createdAt_asc":
        processedNotes.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "createdAt_desc":
        processedNotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "updatedAt_desc":
        processedNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case "title_asc":
        processedNotes.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title_desc":
        processedNotes.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }
    return processedNotes;
  }, [notes, sortOption, filters]);

  const handleSortChange = useCallback((newSortOption: NoteSortOption) => {
    setSortOption(newSortOption);
  }, []);

  const handleFiltersChange = useCallback((newFilters: NoteFilters) => {
    setFilters(newFilters);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">My Notes</h1>
        <Link href="/notes/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Note
          </Button>
        </Link>
      </div>

      <SearchBarAndSort
        onSortChange={handleSortChange}
        currentSort={sortOption}
        onFiltersChange={handleFiltersChange}
        currentFilters={filters}
        allTags={allTags}
      />

      <NoteList notes={filteredAndSortedNotes} />
    </div>
  );
}
