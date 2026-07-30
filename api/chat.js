export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "método não permitido" });
  }

  const { system, messages } = req.body || {};

  if (typeof system !== "string" || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ erro: "requisição inválida" });
  }
  if (messages.length > 50) {
    return res.status(400).json({ erro: "conversa muito longa" });
  }

  const limpas = messages
    .filter(m => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map(m => ({ role: m.role, content: m.content.slice(0, 1500) }));

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ erro: "chave não configurada" });
  }

  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.6,
        max_tokens: 600,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: system.slice(0, 6000) }, ...limpas]
      })
    });

    if (!r.ok) {
      const detalhe = await r.text();
      console.error("groq:", r.status, detalhe);
      return res.status(502).json({ erro: "falha na geração" });
    }

    const dados = await r.json();
    const texto = dados.choices?.[0]?.message?.content || "";
    return res.status(200).json({ texto });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ erro: "falha na geração" });
  }
}
