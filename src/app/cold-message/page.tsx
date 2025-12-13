"use client";

import { useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { Sparkles, MessageCircle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

import { ResumeViewer } from "@/components/resume-viewer";
import { AnswerDisplay } from "@/components/answer-display";

type Tone = "friendly" | "professional" | "enthusiastic";
type Goal = "referral" | "coffee-chat" | "advice" | "opportunity";

const BOILERPLATE_MESSAGE = `Hi Sarah! I came across your profile while researching engineers at Stripe and was really impressed by your work on the payments infrastructure team.

I'm a CS student at North American University, and I recently built FocusBee—a real-time productivity app using WebSockets and PostgreSQL. Your experience scaling distributed systems is exactly the kind of work I'm excited about.

I'd love to hear about your journey at Stripe and any advice you might have for someone breaking into fintech. Would you be open to a quick 15-minute chat?

Thanks so much for your time!

Best,
Amil`;

export default function ColdMessagePage() {
  const [companyName, setCompanyName] = useState("");
  const [personName, setPersonName] = useState("");
  const [personRole, setPersonRole] = useState("");
  const [goal, setGoal] = useState<Goal>("coffee-chat");
  const [tone, setTone] = useState<Tone>("friendly");
  const [context, setContext] = useState("");

  const { complete, completion, isLoading } = useCompletion({
    api: "/api/cold-message",
  });

  const handleGenerate = async () => {
    if (!companyName || !personName || !personRole) return;

    await complete(personName, {
      body: {
        companyName,
        personName,
        personRole,
        goal,
        tone,
        context,
      },
    });
  };

  const isFormValid = companyName && personName && personRole;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  PaperTrail
                </h1>
                <Badge variant="secondary" className="text-xs">
                  Cold Outreach
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Craft attention-grabbing LinkedIn messages in 200 words or less.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Application Answers
              </Button>
            </Link>
            <ResumeViewer />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-base font-medium">
                  Company
                </Label>
                <Input
                  id="company"
                  placeholder="e.g., Stripe, Google..."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="personName" className="text-base font-medium">
                  Person's Name
                </Label>
                <Input
                  id="personName"
                  placeholder="e.g., Sarah Chen"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="personRole" className="text-base font-medium">
                Their Role / Background
              </Label>
              <Input
                id="personRole"
                placeholder="e.g., Senior Software Engineer, ex-Meta, works on payments"
                value={personRole}
                onChange={(e) => setPersonRole(e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal" className="text-base font-medium">
                  Your Goal
                </Label>
                <Select
                  value={goal}
                  onValueChange={(value: Goal) => setGoal(value)}
                >
                  <SelectTrigger id="goal" className="bg-white">
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coffee-chat">☕ Coffee Chat</SelectItem>
                    <SelectItem value="referral">🎯 Get a Referral</SelectItem>
                    <SelectItem value="advice">💡 Ask for Advice</SelectItem>
                    <SelectItem value="opportunity">🚀 Explore Opportunity</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">😊 Friendly</SelectItem>
                    <SelectItem value="professional">💼 Professional</SelectItem>
                    <SelectItem value="enthusiastic">🔥 Enthusiastic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="context" className="text-base font-medium">
                Additional Context{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                id="context"
                placeholder="Any specific things to mention? e.g., 'We both went to same university', 'Saw their talk at a conference', 'Interested in their open-source project'..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
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
              {isLoading ? "Crafting Message..." : "Generate Message"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Messages are crafted to be under 200 words for maximum impact.
            </p>
          </div>

          {/* Right Column - Output */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium text-muted-foreground">
                LinkedIn Message
              </Label>
              <Badge variant="outline" className="text-xs">
                ~200 words max
              </Badge>
            </div>

            <AnswerDisplay
              completion={completion || BOILERPLATE_MESSAGE}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

