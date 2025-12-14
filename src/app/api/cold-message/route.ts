import { streamText, smoothStream } from "ai";
import { openai } from "@ai-sdk/openai";
import { MY_RESUME } from "@/lib/my-context";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { companyName, personName, personRole, goal, tone, context } =
    await req.json();

  const goalGuide = {
    "coffee-chat":
      "The goal is to secure a casual 15-minute informational chat to learn about their experience.",
    referral:
      "The goal is to build rapport and eventually ask for a referral to an open position.",
    advice:
      "The goal is to seek genuine career advice and mentorship insights.",
    opportunity:
      "The goal is to express interest in potential opportunities at their company.",
  };

  const toneGuide = {
    friendly:
      "Use a warm, personable tone like you're reaching out to a potential friend.",
    professional: "Use a polished, respectful tone that demonstrates maturity.",
    enthusiastic: "Use an energetic, excited tone that shows genuine passion.",
  };

  const systemPrompt = `You are an expert at crafting cold LinkedIn messages that get responses. Your messages are concise, personalized, and compelling.

## YOUR TASK
Write a LinkedIn cold message (MAXIMUM 170 words) that will capture the recipient's attention and get a response.

## SENDER'S BACKGROUND
${MY_RESUME}

## RECIPIENT DETAILS
Name: ${personName}
Role/Background: ${personRole}
Company: ${companyName}
${context ? `Additional Context: ${context}` : ""}

## MESSAGE REQUIREMENTS
1. ${goalGuide[goal as keyof typeof goalGuide]}
2. ${toneGuide[tone as keyof typeof toneGuide]}
3. MUST be under 200 words - LinkedIn messages that are too long don't get read.
4. Start with a personalized hook that shows you've done your research.
5. Briefly mention 1-2 relevant things from your background that connect to their work.
6. Make a clear, specific ask (not vague like "I'd love to connect").
7. Keep it genuine - avoid sounding like a template.
8. Don't be overly flattering or sycophantic.
9. Include a greeting with their first name and a brief sign-off with your name (Amil).
10. Make it easy for them to say yes - suggest a specific time frame or format.

## WHAT MAKES GREAT COLD MESSAGES
- They feel personal, not mass-produced
- They show genuine curiosity about the person's work
- They demonstrate value you might bring to the conversation
- They respect the person's time with brevity
- They have a clear call-to-action

Generate a compelling LinkedIn message:`;

  const result = streamText({
    model: openai("gpt-4o-mini"),
    prompt: systemPrompt,
    temperature: 0.8,
    maxOutputTokens: 300,
    experimental_transform: smoothStream(),
  });

  return result.toTextStreamResponse({
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
