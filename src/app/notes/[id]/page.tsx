
"use client";

import { NoteEditor } from "@/components/notes/NoteEditor";
import { useNotes } from "@/contexts/NoteContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Note } from "@/types";
import { FONT_OPTIONS } from "@/lib/fonts";

export default function EditNotePage({ params }: { params: { id: string } }) {
  return <NoteEditor noteId={params.id} />;
}
