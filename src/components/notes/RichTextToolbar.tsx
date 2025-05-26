
"use client";

import { Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Image as ImageIcon, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface RichTextToolbarProps {
  onCommand: (command: string, value?: string) => void;
  onInsertImage: () => void;
}

export function RichTextToolbar({ onCommand, onInsertImage }: RichTextToolbarProps) {
  const commands = [
    { cmd: "bold", icon: <Bold className="h-4 w-4" />, label: "Bold" },
    { cmd: "italic", icon: <Italic className="h-4 w-4" />, label: "Italic" },
  ];

  const headingCommands = [
    { cmd: "formatBlock", value: "h1", icon: <Heading1 className="h-4 w-4" />, label: "Heading 1" },
    { cmd: "formatBlock", value: "h2", icon: <Heading2 className="h-4 w-4" />, label: "Heading 2" },
    { cmd: "formatBlock", value: "h3", icon: <Heading3 className="h-4 w-4" />, label: "Heading 3" },
  ];

  const listCommands = [
    { cmd: "insertUnorderedList", icon: <List className="h-4 w-4" />, label: "Unordered List" },
    { cmd: "insertOrderedList", icon: <ListOrdered className="h-4 w-4" />, label: "Ordered List" },
  ];
  
  const clearFormattingCommand = { cmd: "removeFormat", icon: <Minus className="h-4 w-4" />, label: "Clear Formatting" };


  return (
    <div className="flex flex-wrap items-center gap-1 border border-input rounded-md p-2 bg-card shadow-sm">
      {commands.map(({ cmd, icon, label }) => (
        <Button key={cmd} variant="ghost" size="icon" onClick={() => onCommand(cmd)} title={label} type="button">
          {icon}
        </Button>
      ))}
      <Separator orientation="vertical" className="h-6" />
      {headingCommands.map(({ cmd, value, icon, label }) => (
        <Button key={value} variant="ghost" size="icon" onClick={() => onCommand(cmd, value)} title={label} type="button">
          {icon}
        </Button>
      ))}
      <Separator orientation="vertical" className="h-6" />
      {listCommands.map(({ cmd, icon, label }) => (
        <Button key={cmd} variant="ghost" size="icon" onClick={() => onCommand(cmd)} title={label} type="button">
          {icon}
        </Button>
      ))}
      <Separator orientation="vertical" className="h-6" />
      <Button variant="ghost" size="icon" onClick={onInsertImage} title="Insert Image" type="button">
        <ImageIcon className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <Button variant="ghost" size="icon" onClick={() => onCommand(clearFormattingCommand.cmd)} title={clearFormattingCommand.label} type="button">
        {clearFormattingCommand.icon}
      </Button>
    </div>
  );
}
