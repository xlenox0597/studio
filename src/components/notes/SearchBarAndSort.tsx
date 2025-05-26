
"use client";

import React from "react";
import type { NoteSortOption, NoteFilters } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Filter, Search, ListFilter } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

interface SearchBarAndSortProps {
  onSortChange: (sortOption: NoteSortOption) => void;
  currentSort: NoteSortOption;
  onFiltersChange: (filters: NoteFilters) => void;
  currentFilters: NoteFilters;
  allTags: string[]; // To populate tag filter options
}

export function SearchBarAndSort({
  onSortChange,
  currentSort,
  onFiltersChange,
  currentFilters,
  allTags,
}: SearchBarAndSortProps) {
  
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...currentFilters, searchTerm: e.target.value });
  };

  const handleDateFromChange = (date?: Date) => {
    onFiltersChange({ ...currentFilters, dateFrom: date });
  };

  const handleDateToChange = (date?: Date) => {
    onFiltersChange({ ...currentFilters, dateTo: date });
  };
  
  const handleTagFilterChange = (selectedTags: string[]) => {
     onFiltersChange({ ...currentFilters, tags: selectedTags });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="mb-8 p-6 bg-card rounded-lg shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search notes by keyword..."
            value={currentFilters.searchTerm || ""}
            onChange={handleSearchTermChange}
            className="pl-10 w-full"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
        <Select value={currentSort} onValueChange={(value) => onSortChange(value as NoteSortOption)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updatedAt_desc">Recently Updated</SelectItem>
            <SelectItem value="createdAt_desc">Newest First</SelectItem>
            <SelectItem value="createdAt_asc">Oldest First</SelectItem>
            <SelectItem value="title_asc">Title (A-Z)</SelectItem>
            <SelectItem value="title_desc">Title (Z-A)</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 space-y-4">
            <div>
              <Label className="text-sm font-medium">Filter by Date Created</Label>
              <div className="grid gap-2 mt-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {currentFilters.dateFrom ? format(currentFilters.dateFrom, "PPP") : <span>From date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={currentFilters.dateFrom}
                      onSelect={handleDateFromChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                     <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {currentFilters.dateTo ? format(currentFilters.dateTo, "PPP") : <span>To date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={currentFilters.dateTo}
                      onSelect={handleDateToChange}
                      initialFocus
                      disabled={{ before: currentFilters.dateFrom }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {allTags.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Filter by Tags</Label>
                <Select
                  value={currentFilters.tags?.[0] || ""} // simplified for single tag selection for now for UI simplicity
                  onValueChange={(tag) => handleTagFilterChange(tag ? [tag] : [])}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Tags</SelectItem>
                    {allTags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* For multi-tag selection, you'd need a more complex component e.g. checkboxes or multi-select */}
              </div>
            )}

            <Button onClick={clearFilters} variant="ghost" className="w-full justify-center text-sm">Clear All Filters</Button>
          </PopoverContent>
        </Popover>
        </div>
      </div>
    </div>
  );
}

