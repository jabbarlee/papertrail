"use client";

import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MY_RESUME } from "@/lib/my-context";

export function ResumeViewer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          View My Resume Context
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>My Resume Context</SheetTitle>
          <SheetDescription>
            This is the context that will be used to generate personalized responses.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
          <pre className="text-sm whitespace-pre-wrap font-mono text-muted-foreground leading-relaxed">
            {MY_RESUME}
          </pre>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

