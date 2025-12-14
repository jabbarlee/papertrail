import { streamText, smoothStream } from "ai";
import { openai } from "@ai-sdk/openai";
import { MY_RESUME } from "@/lib/my-context";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { companyName, jobDescription, question, tone, length } =
    await req.json();

  const lengthGuide = {
    short: "Keep your response concise, around 100-150 words.",
    medium: "Aim for a balanced response, around 200-300 words.",
    long: "Provide a detailed response, around 400-500 words.",
  };

  const toneGuide = {
    professional:
      "Use a formal, polished tone that demonstrates maturity and competence.",
    casual: "Use a friendly, conversational tone while remaining respectful.",
    confident:
      "Use a bold, assertive tone that showcases achievements without arrogance.",
  };

  const systemPrompt = `You are an expert career coach helping a job applicant craft compelling answers to internship application questions.

## YOUR TASK
Generate a personalized, authentic response to the application question based on the candidate's real resume and experience.

## CANDIDATE'S RESUME
${MY_RESUME}

## GUIDELINES
1. ${lengthGuide[length as keyof typeof lengthGuide]}
2. ${toneGuide[tone as keyof typeof toneGuide]}
3. Only reference experiences, skills, and achievements that are in the resume.
4. Tailor the response specifically to the company and job description provided.
5. Be genuine and human - avoid generic phrases like "I am passionate about..." or "I would be honored to..."
6. Show, don't tell - use specific examples and metrics from the resume.
7. Connect the candidate's experience directly to what the company is looking for.
8. Write in first person as if you are the candidate.
9. Do NOT include any greeting or sign-off - just the answer content.

## COMPANY & JOB CONTEXT
Company: ${companyName}
Job Description: ${jobDescription}

## QUESTION TO ANSWER
${question}

Generate a compelling, personalized response:`;

  const result = streamText({
    model: openai("gpt-4o-mini"),
    prompt: systemPrompt,
    temperature: 0.7,
    maxOutputTokens: 1000,
    experimental_transform: smoothStream(),
  });

  return result.toTextStreamResponse({
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
