
"use client";

import type { Note } from "@/types";
import { useNotes } from "@/contexts/NoteContext";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FONT_OPTIONS } from "@/lib/fonts";
import { SmartTagButton } from "./SmartTagButton";
import { TagInput } from "./TagInput";
import { RichTextToolbar } from "./RichTextToolbar";
import { Save, Trash2, FilePlus2, Eye } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const noteSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  content: z.string().min(1, "Content cannot be empty"),
  tags: z.array(z.string()).optional(),
  font: z.string().optional(),
  backgroundImage: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface NoteEditorProps {
  noteId?: string;
}

export function NoteEditor({ noteId }: NoteEditorProps) {
  const { addNote, updateNote, getNoteById, deleteNote: deleteNoteContext } = useNotes();
  const router = useRouter();
  const { toast } = useToast();
  const [initialNote, setInitialNote] = useState<Note | null>(null);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      font: FONT_OPTIONS[0].value,
      backgroundImage: "",
    },
  });

  const currentContent = watch("content");
  const currentTags = watch("tags") || [];

  useEffect(() => {
    if (noteId) {
      const note = getNoteById(noteId);
      if (note) {
        setInitialNote(note);
        reset({
          title: note.title,
          content: note.content,
          tags: note.tags,
          font: note.font || FONT_OPTIONS[0].value,
          backgroundImage: note.backgroundImage || "",
        });
        if (contentEditableRef.current) {
          contentEditableRef.current.innerHTML = note.content;
        }
      } else {
        toast({ title: "Note not found", variant: "destructive" });
        router.push("/");
      }
    } else {
       // For new notes, ensure contentEditable is empty or has a placeholder if desired
        if (contentEditableRef.current) {
          contentEditableRef.current.innerHTML = ""; 
        }
    }
  }, [noteId, getNoteById, reset, router, toast]);

  const onSubmit = (data: NoteFormData) => {
    const noteData = {
      ...data,
      tags: data.tags || [],
      content: contentEditableRef.current?.innerHTML || "", // Ensure content is from contentEditable
    };

    try {
      if (noteId && initialNote) {
        updateNote({ ...initialNote, ...noteData });
        toast({ title: "Note updated successfully!" });
      } else {
        const newNote = addNote(noteData);
        toast({ title: "Note created successfully!" });
        router.replace(`/notes/${newNote.id}`); // Use replace to avoid back button issues
      }
      // No router.push('/') here, stay on the editor page or redirect to view page
    } catch (error) {
      toast({ title: "Error saving note", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleDelete = () => {
    if (noteId) {
      deleteNoteContext(noteId);
      toast({ title: "Note deleted" });
      router.push("/");
    }
  };

  const handleContentEditableChange = () => {
    if (contentEditableRef.current) {
      setValue("content", contentEditableRef.current.innerHTML, { shouldValidate: true, shouldDirty: true });
    }
  };

  const handleToolbarCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentEditableRef.current?.focus();
    handleContentEditableChange(); // Update form state after command
  };

  const handleInsertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      document.execCommand("insertHTML", false, `<img src="${url}" alt="User image" style="max-width: 100%; height: auto;" />`);
      handleContentEditableChange();
    }
  };
  
  const selectedFont = watch("font") || FONT_OPTIONS[0].value;
  const noteStyle = {
    fontFamily: selectedFont,
    backgroundImage: watch("backgroundImage") ? `url(${watch("backgroundImage")})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <Card className="shadow-xl" style={noteStyle}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {noteId ? "Edit Note" : "Create New Note"}
          {noteId && (
             <Button variant="outline" size="sm" onClick={() => router.push(`/notes/${noteId}/view`)} title="View Note">
                <Eye className="mr-2 h-4 w-4" /> View
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} className="mt-1 bg-background/80" />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label>Content</Label>
            <RichTextToolbar onCommand={handleToolbarCommand} onInsertImage={handleInsertImage} />
            <div
              id="content"
              ref={contentEditableRef}
              contentEditable
              onInput={handleContentEditableChange}
              className="mt-1 min-h-[200px] w-full rounded-md border border-input bg-background/80 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: initialNote?.content || "" }}
            />
            {errors.content && <p className="text-sm text-destructive mt-1">{errors.content.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="font">Font</Label>
              <Controller
                name="font"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="font" className="mt-1 bg-background/80">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_OPTIONS.map((font) => (
                        <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                          {font.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="backgroundImage">Background Image URL</Label>
              <Input
                id="backgroundImage"
                {...register("backgroundImage")}
                placeholder="https://example.com/image.png"
                className="mt-1 bg-background/80"
              />
              {errors.backgroundImage && <p className="text-sm text-destructive mt-1">{errors.backgroundImage.message}</p>}
            </div>
          </div>
          
          <div>
            <Label>Tags</Label>
            <div className="flex items-center gap-2 mt-1">
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TagInput
                    tags={field.value || []}
                    onTagsChange={(newTags) => field.onChange(newTags)}
                    placeholder="Add tags..."
                  />
                )}
              />
            </div>
            <div className="mt-2">
              <SmartTagButton
                  noteContent={contentEditableRef.current?.innerText || ""}
                  onTagsSuggested={(suggested) => {
                    const newTags = Array.from(new Set([...currentTags, ...suggested]));
                    setValue("tags", newTags, { shouldDirty: true });
                  }}
                  currentTags={currentTags}
                />
            </div>
          </div>

          <CardFooter className="flex flex-col sm:flex-row justify-between p-0 pt-6 gap-2">
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting || !isDirty} className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Note"}
              </Button>
              {!noteId && (
                <Button type="button" variant="outline" onClick={() => {
                  reset();
                  if (contentEditableRef.current) contentEditableRef.current.innerHTML = "";
                }} className="w-full sm:w-auto">
                  <FilePlus2 className="mr-2 h-4 w-4" />
                  New Blank Note
                </Button>
              )}
            </div>
            {noteId && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" className="w-full sm:w-auto">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Note
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your note.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
