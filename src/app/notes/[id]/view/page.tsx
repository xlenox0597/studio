
"use client";

import { useNotes } from "@/contexts/NoteContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit3, Loader2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Note } from "@/types";
import { FONT_OPTIONS } from "@/lib/fonts";
import { format } from "date-fns"; // For date formatting

export default function ViewNotePage({ params }: { params: { id: string } }) {
  const { getNoteById, isLoading } = useNotes();
  const router = useRouter();
  const [note, setNote] = useState<Note | undefined | null>(null); // null initially, then Note or undefined

  useEffect(() => {
    if (!isLoading) { // Wait for notes to be loaded
      const foundNote = getNoteById(params.id);
      setNote(foundNote);
    }
  }, [params.id, getNoteById, isLoading]);

  if (isLoading || note === null) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!note) {
    return (
      <Card className="max-w-2xl mx-auto mt-10 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertTriangle className="mr-2 h-6 w-6" /> Note Not Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>The note you are looking for does not exist or may have been deleted.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Notes
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const noteStyle = {
    fontFamily: note.font || FONT_OPTIONS[0].value,
    backgroundImage: note.backgroundImage ? `url(${note.backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
  
  const contentContainerClass = note.backgroundImage ? "bg-background/80 p-4 rounded-md shadow" : "";
  const textColorClass = note.backgroundImage ? "text-foreground" : ""; // Ensure text is readable on image

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl break-words" style={noteStyle}>
        <CardHeader className={note.backgroundImage ? 'bg-black/30 rounded-t-lg' : ''}>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className={`text-3xl font-bold ${note.backgroundImage ? 'text-white' : ''}`}>{note.title}</CardTitle>
              <CardDescription className={`mt-1 ${note.backgroundImage ? 'text-gray-200' : ''}`}>
                Created: {format(new Date(note.createdAt), "PPP p")} | Last Updated: {format(new Date(note.updatedAt), "PPP p")}
              </CardDescription>
            </div>
            <Button onClick={() => router.push("/")} variant="outline" size="sm" className={note.backgroundImage ? 'bg-white/20 text-white hover:bg-white/30 border-white/30' : ''}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>
        </CardHeader>
        <CardContent className={`prose dark:prose-invert max-w-none py-6 ${note.backgroundImage ? 'bg-black/20' : ''} ${textColorClass}`}>
          <div className={contentContainerClass} dangerouslySetInnerHTML={{ __html: note.content }} />
        </CardContent>
        <CardFooter className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${note.backgroundImage ? 'bg-black/30 rounded-b-lg' : ''}`}>
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <Badge key={tag} variant={note.backgroundImage ? "default" : "secondary"} className={note.backgroundImage ? 'bg-white/20 text-white border-white/30' : ''}>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <Button onClick={() => router.push(`/notes/${note.id}`)} className={note.backgroundImage ? 'bg-primary/80 hover:bg-primary text-primary-foreground' : ''}>
            <Edit3 className="mr-2 h-4 w-4" /> Edit Note
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
