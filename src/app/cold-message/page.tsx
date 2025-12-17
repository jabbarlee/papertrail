"use client";

import { useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { Sparkles, MessageCircle, Search, User } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { AnswerDisplay } from "@/components/answer-display";

type Tone = "friendly" | "professional" | "enthusiastic";
type Goal = "referral" | "coffee-chat" | "advice" | "opportunity";

interface Candidate {
  id: string;
  name: string;
  headline: string;
}

// Placeholder candidates for UI mockup
const PLACEHOLDER_CANDIDATES: Candidate[] = [
  {
    id: "1",
    name: "Sarah Chen",
    headline: "Senior Software Engineer at Google • Ex-Meta • Stanford CS '19",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    headline: "Staff Engineer at Google • Cloud Infrastructure • 8+ years",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    headline: "Software Engineer II at Google • Android Team • MIT '21",
  },
  {
    id: "4",
    name: "David Kim",
    headline: "Engineering Manager at Google • Previously Stripe • Berkeley EECS",
  },
  {
    id: "5",
    name: "Priya Patel",
    headline: "Senior SWE at Google • Machine Learning • Carnegie Mellon PhD",
  },
];

export default function ColdMessagePage() {
  // Search state
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // Selected candidate & message generation state
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [goal, setGoal] = useState<Goal>("coffee-chat");
  const [tone, setTone] = useState<Tone>("friendly");

  const { complete, completion, isLoading } = useCompletion({
    api: "/api/cold-message",
    streamProtocol: "text",
  });

  const handleSearch = () => {
    if (!jobTitle || !companyName) return;
    // For now, show placeholder candidates
    setCandidates(PLACEHOLDER_CANDIDATES);
    setHasSearched(true);
    setSelectedCandidate(null);
  };

  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleGenerate = async () => {
    if (!selectedCandidate || !companyName) return;

    await complete(selectedCandidate.name, {
      body: {
        companyName,
        personName: selectedCandidate.name,
        personRole: selectedCandidate.headline,
        goal,
        tone,
        context: "",
      },
    });
  };

  const isSearchValid = jobTitle && companyName;

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
                Find professionals and craft personalized LinkedIn messages.
              </p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Application Answers
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Search & Candidates */}
          <div className="space-y-6">
            {/* Search Section */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Search Candidates</Label>
              
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Job Title (e.g., Software Engineer)"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Company (e.g., Google)"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={!isSearchValid}
                  className="gap-2"
                >
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>

            <Separator />

            {/* Candidates List */}
            <div className="space-y-3">
              <Label className="text-base font-medium text-muted-foreground">
                {hasSearched ? `Results for "${jobTitle}" at ${companyName}` : "Search results will appear here"}
              </Label>

              {hasSearched ? (
                <div className="space-y-3">
                  {candidates.map((candidate) => (
                    <Card
                      key={candidate.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedCandidate?.id === candidate.id
                          ? "ring-2 ring-primary bg-primary/5"
                          : "bg-white"
                      }`}
                      onClick={() => handleSelectCandidate(candidate)}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{candidate.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {candidate.headline}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={selectedCandidate?.id === candidate.id ? "default" : "outline"}
                          className="gap-1.5 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectCandidate(candidate);
                          }}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          {selectedCandidate?.id === candidate.id ? "Selected" : "Select"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">
                    Enter a job title and company to find candidates
                  </p>
                </div>
              )}
            </div>

            {/* Message Options - Show when candidate is selected */}
            {selectedCandidate && (
              <>
                <Separator />
                <div className="space-y-4">
                  <Label className="text-base font-medium">Message Options</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal" className="text-sm">Your Goal</Label>
                      <Select value={goal} onValueChange={(value: Goal) => setGoal(value)}>
                        <SelectTrigger id="goal" className="bg-white">
                          <SelectValue />
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
                      <Label htmlFor="tone" className="text-sm">Tone</Label>
                      <Select value={tone} onValueChange={(value: Tone) => setTone(value)}>
                        <SelectTrigger id="tone" className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="friendly">😊 Friendly</SelectItem>
                          <SelectItem value="professional">💼 Professional</SelectItem>
                          <SelectItem value="enthusiastic">🔥 Enthusiastic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="w-full gap-2 h-11"
                    onClick={handleGenerate}
                    disabled={isLoading}
                  >
                    <Sparkles className="h-5 w-5" />
                    {isLoading ? "Crafting Message..." : `Generate Message for ${selectedCandidate.name.split(" ")[0]}`}
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Right Column - Output */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium text-muted-foreground">
                LinkedIn Message
              </Label>
              <Badge variant="outline" className="text-xs">
                ~170 words max
              </Badge>
            </div>

            {completion || isLoading ? (
              <AnswerDisplay completion={completion} isLoading={isLoading} />
            ) : (
              <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                <MessageCircle className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-sm">
                  {selectedCandidate
                    ? `Ready to generate a message for ${selectedCandidate.name}`
                    : "Select a candidate to generate a personalized message"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
