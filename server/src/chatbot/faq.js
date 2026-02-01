const faqEntries = [
  {
    keywords: ["demo", "practice", "free"],
    reply:
      "Click Free Demo, enter the code, then start practice. You can also pick a subject and topic to begin instantly."
  },
  {
    keywords: ["ncfm"],
    reply:
      "NCFM is NSE's certification program focused on financial market knowledge and skills."
  },
  {
    keywords: ["unlock", "full access", "subscription", "payment"],
    reply:
      "To unlock full access, upgrade in the Pricing or Checkout section. Subscriptions remove demo limits and unlock all questions."
  },
  {
    keywords: ["explain", "answer", "question"],
    reply:
      "Share the question or ask for an explanation and I will walk you through the correct answer step-by-step."
  }
];

const normalizeText = (text) => text.toLowerCase();

export const getFaqReply = (message) => {
  const text = normalizeText(message || "");
  const entry = faqEntries.find(({ keywords }) =>
    keywords.some((keyword) => text.includes(keyword))
  );
  if (entry) {
    return entry.reply;
  }
  return (
    "I can help with exam topics, practice steps, demo access, or subscriptions. What would you like to know?"
  );
};

export default faqEntries;
