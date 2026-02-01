import { getFaqReply } from "./faq.js";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

const buildPrompt = ({ message, context }) => {
  const contextLines = [];

  if (context?.page === "practice") {
    if (context.subject) contextLines.push(`Subject: ${context.subject}`);
    if (context.topic) contextLines.push(`Topic: ${context.topic}`);
    if (context.question) contextLines.push(`Question: ${context.question}`);
    if (context.explanation) contextLines.push(`Explanation: ${context.explanation}`);
  }

  const contextBlock = contextLines.length
    ? `Context:\n${contextLines.join("\n")}`
    : "";

  return `${contextBlock}\nUser: ${message}`.trim();
};

export const getChatbotReply = async ({ message, context }) => {
  if (!process.env.OPENAI_API_KEY) {
    return getFaqReply(message);
  }

  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are Pass4Sure Assistant, helping learners with exam topics, practice instructions, demo access, and subscriptions. Keep responses concise, supportive, and practical."
          },
          {
            role: "user",
            content: buildPrompt({ message, context })
          }
        ],
        temperature: 0.4,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI error", errorText);
      return getFaqReply(message);
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    return reply || getFaqReply(message);
  } catch (error) {
    console.error("OpenAI request failed", error);
    return getFaqReply(message);
  }
};
