"use client";

import * as React from "react";
import { format, parseISO, isBefore, startOfToday } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerDemo({ date, setDate }) {
    const parsedDate = date ? parseISO(date) : null;
    const today = startOfToday();
    
    const handleDateSelect = (selectedDate) => {
        if (selectedDate && !isBefore(selectedDate, today)) {
            setDate(format(selectedDate, "yyyy-MM-dd"));
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[240px] md:w-[280px] justify-start text-left font-normal",
                        !parsedDate && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {parsedDate ? format(parsedDate, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={parsedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                    disabled={(date) => isBefore(date, today)}  // Disable past dates
                />
            </PopoverContent>
        </Popover>
    );
}
