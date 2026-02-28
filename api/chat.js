export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ reply: "Method not allowed" });
    }

    const key = process.env.GROQ_API_KEY;

    if (!key) {
      console.error("GROQ_API_KEY is undefined");
      return res.status(200).json({
        reply: "Assistant is temporarily unavailable."
      });
    }

    const { message, history = [] } = req.body || {};

    if (!message) {
      return res.status(200).json({
        reply: "Please ask a question."
      });
    }

    const systemPrompt = `
You are a professional assistant answering questions about Ansh Verma's resume.
Be concise and professional.
If you don't know something, say so.
Do not mention internal errors or technical details.
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.3,
          max_tokens: 600,
          messages: [
            { role: "system", content: systemPrompt },
            ...history.slice(-6),
            { role: "user", content: message }
          ]
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", errText);
      return res.status(200).json({
        reply: "Assistant is temporarily unavailable."
      });
    }

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Server crash:", error);
    return res.status(200).json({
      reply: "Assistant is temporarily unavailable."
    });
  }
}