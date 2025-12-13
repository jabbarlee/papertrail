"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface AnswerDisplayProps {
  completion: string;
  isLoading: boolean;
}

export function AnswerDisplay({ completion, isLoading }: AnswerDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!completion) return;

    await navigator.clipboard.writeText(completion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-100 min-h-[400px]">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[95%]" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[85%]" />
          <Skeleton className="h-4 w-[92%]" />
          <Skeleton className="h-4 w-[75%]" />
        </CardContent>
      </Card>
    );
  }

  if (!completion) {
    return null;
  }

  return (
    <Card className="bg-slate-100 relative min-h-[400px]">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 h-8 w-8 hover:bg-slate-200"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="sr-only">Copy to clipboard</span>
      </Button>
      <CardContent className="p-6 pr-12">
        <p className="font-[family-name:var(--font-display)] text-[16px] leading-[1.85] whitespace-pre-wrap text-slate-700">
          {completion}
        </p>
      </CardContent>
    </Card>
  );
}
