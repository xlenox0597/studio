
"use client";

import type { Note } from "@/types";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Eye, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FONT_OPTIONS } from "@/lib/fonts";

interface NoteItemProps {
  note: Note;
}

function stripHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

export function NoteItem({ note }: NoteItemProps) {
  const plainTextContent = stripHtml(note.content);
  const snippet = plainTextContent.substring(0, 100) + (plainTextContent.length > 100 ? "..." : "");
  
  const noteStyle = {
    fontFamily: note.font || FONT_OPTIONS[0].value,
    backgroundImage: note.backgroundImage ? `url(${note.backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const cardClasses = `flex flex-col h-full transition-all duration-300 ease-in-out hover:shadow-lg ${note.backgroundImage ? 'text-white' : ''}`;


  return (
    <Card className={cardClasses} style={noteStyle}>
      <CardHeader className={note.backgroundImage ? 'bg-black/30 rounded-t-lg' : ''}>
        <CardTitle className="truncate text-lg">{note.title}</CardTitle>
        <CardDescription className={note.backgroundImage ? 'text-gray-200' : ''}>
          Last updated: {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent className={`flex-grow ${note.backgroundImage ? 'bg-black/20' : ''}`}>
        <p className="text-sm opacity-90 break-words">{snippet}</p>
      </CardContent>
      <CardFooter className={`flex flex-col items-start gap-4 ${note.backgroundImage ? 'bg-black/30 rounded-b-lg' : ''}`}>
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant={note.backgroundImage ? "default" : "secondary"} className={note.backgroundImage ? 'bg-white/20 text-white border-white/30' : ''}>
                {tag}
              </Badge>
            ))}
            {note.tags.length > 3 && <Badge variant="outline">+{note.tags.length - 3}</Badge>}
          </div>
        )}
        <div className="flex gap-2 w-full">
          <Link href={`/notes/${note.id}/view`} passHref legacyBehavior>
            <Button variant="outline" size="sm" className={`flex-1 ${note.backgroundImage ? 'bg-white/20 text-white hover:bg-white/30 border-white/30' : ''}`}>
              <Eye className="mr-2 h-4 w-4" /> View
            </Button>
          </Link>
          <Link href={`/notes/${note.id}`} passHref legacyBehavior>
            <Button variant="default" size="sm" className={`flex-1 ${note.backgroundImage ? 'bg-primary/80 hover:bg-primary text-primary-foreground' : ''}`}>
              <Edit3 className="mr-2 h-4 w-4" /> Edit
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
