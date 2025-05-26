
"use client";

import type { SuggestTagsInput } from "@/ai/flows/smart-tagging";
import { suggestTags } from "@/ai/flows/smart-tagging";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SmartTagButtonProps {
  noteContent: string;
  onTagsSuggested: (tags: string[]) => void;
  currentTags: string[];
}

export function SmartTagButton({ noteContent, onTagsSuggested, currentTags }: SmartTagButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggestTags = async () => {
    if (!noteContent.trim()) {
      toast({
        title: "Cannot suggest tags",
        description: "Note content is empty.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const input: SuggestTagsInput = { noteContent };
      const result = await suggestTags(input);
      if (result.tags && result.tags.length > 0) {
        // Filter out tags that are already present
        const newTags = result.tags.filter(tag => !currentTags.includes(tag.toLowerCase()));
        if (newTags.length > 0) {
            onTagsSuggested(newTags);
            toast({
                title: "Tags Suggested",
                description: `${newTags.length} new tag(s) added.`,
            });
        } else {
             toast({
                title: "No New Tags",
                description: "AI couldn't find any new relevant tags.",
            });
        }
      } else {
        toast({
          title: "No Tags Suggested",
          description: "AI couldn't find relevant tags for this content.",
        });
      }
    } catch (error) {
      console.error("Error suggesting tags:", error);
      toast({
        title: "Error",
        description: "Failed to suggest tags. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleSuggestTags}
      disabled={isLoading}
      variant="outline"
      size="sm"
    >
      <Wand2 className="mr-2 h-4 w-4" />
      {isLoading ? "Suggesting..." : "Smart Tag"}
    </Button>
  );
}
