"use client";

import { useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { Sparkles, Send } from "lucide-react";
import Link from "next/link";

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

import { ResumeViewer } from "@/components/resume-viewer";
import { AnswerDisplay } from "@/components/answer-display";

type Tone = "professional" | "casual" | "confident";
type Length = "short" | "medium" | "long";

const BOILERPLATE_ANSWER = `I'm genuinely excited about the opportunity to join your team as a Software Engineering Intern. What draws me most to this role is the chance to work on products that impact millions of users while learning from world-class engineers.

During my time building FocusBee, I architected a real-time synchronization system using WebSockets that enabled instant cross-device session pairing with under 50ms latency. This experience taught me the importance of building scalable, user-centric solutions—values I see reflected in your engineering culture.

I'm particularly interested in your team's approach to developer experience and infrastructure. Having optimized PostgreSQL queries to reduce API response times by 40%, I understand the impact that thoughtful backend decisions have on product quality.

Beyond technical skills, I bring a collaborative mindset shaped by leading the Dialogue Student Association and mentoring students at Horizon Leadership Academy. I believe great software is built by teams that communicate well and support each other's growth.

I'm eager to contribute, learn, and grow with your team.`;

export default function Home() {
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [question, setQuestion] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [length, setLength] = useState<Length>("medium");

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
        length,
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
          <div className="flex items-center gap-3">
            <Link href="/cold-message">
              <Button variant="outline" size="sm" className="gap-2">
                <Send className="h-4 w-4" />
                Cold Outreach
              </Button>
            </Link>
            <ResumeViewer />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - All Inputs */}
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
                className="min-h-[180px] bg-white resize-y"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                    <SelectItem value="professional">
                      💼 Professional
                    </SelectItem>
                    <SelectItem value="casual">😊 Casual</SelectItem>
                    <SelectItem value="confident">💪 Confident</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="length" className="text-base font-medium">
                  Length
                </Label>
                <Select
                  value={length}
                  onValueChange={(value: Length) => setLength(value)}
                >
                  <SelectTrigger id="length" className="bg-white">
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">📝 Short</SelectItem>
                    <SelectItem value="medium">📄 Medium</SelectItem>
                    <SelectItem value="long">📜 Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question" className="text-base font-medium">
                The Question
              </Label>
              <Textarea
                id="question"
                placeholder='e.g., "Why do you want to work here?", "Tell me about yourself", "Describe a challenging project..."'
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[100px] bg-white resize-y"
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
          </div>

          {/* Right Column - Answer Only */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-muted-foreground">
              Generated Answer
            </Label>

            <AnswerDisplay
              completion={completion || BOILERPLATE_ANSWER}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
