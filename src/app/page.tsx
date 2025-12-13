"use client";

import { useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { ResumeViewer } from "@/components/resume-viewer";
import { AnswerDisplay } from "@/components/answer-display";

type Tone = "professional" | "casual" | "confident";

export default function Home() {
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [question, setQuestion] = useState("");
  const [tone, setTone] = useState<Tone>("professional");

  const { complete, completion, isLoading } = useCompletion({
    api: "/api/generate",
  });

  const handleGenerate = async () => {
    if (!companyName || !jobDescription || !question) return;

    await complete(question, {
      body: {
        companyName,
        jobDescription,
        question,
        tone,
      },
    });
  };

  const isFormValid = companyName && jobDescription && question;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              PaperTrail
            </h1>
            <p className="text-sm text-muted-foreground">
              Tailored answers based on your actual resume.
            </p>
          </div>
          <ResumeViewer />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-base font-medium">
                Company Name
              </Label>
              <Input
                id="company"
                placeholder="e.g., Google, Stripe, OpenAI..."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jd" className="text-base font-medium">
                Job Description
              </Label>
              <Textarea
                id="jd"
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[280px] bg-white resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone" className="text-base font-medium">
                Tone
              </Label>
              <Select
                value={tone}
                onValueChange={(value: Tone) => setTone(value)}
              >
                <SelectTrigger id="tone" className="bg-white">
                  <SelectValue placeholder="Select a tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">💼 Professional</SelectItem>
                  <SelectItem value="casual">😊 Casual</SelectItem>
                  <SelectItem value="confident">💪 Confident</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Column - Question & Output */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="question" className="text-base font-medium">
                The Question
              </Label>
              <Textarea
                id="question"
                placeholder='e.g., "Why do you want to work here?", "Tell me about yourself", "Describe a challenging project..."'
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[140px] bg-white resize-none"
              />
            </div>

            <Button
              size="lg"
              className="w-full gap-2 h-12 text-base"
              onClick={handleGenerate}
              disabled={isLoading || !isFormValid}
            >
              <Sparkles className="h-5 w-5" />
              {isLoading ? "Generating..." : "Generate Answer"}
            </Button>

            <Separator />

            <div className="space-y-2">
              <Label className="text-base font-medium text-muted-foreground">
                Generated Answer
              </Label>
              <AnswerDisplay completion={completion} isLoading={isLoading} />

              {!completion && !isLoading && (
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
                  <p className="text-muted-foreground text-sm">
                    Your personalized answer will appear here...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
