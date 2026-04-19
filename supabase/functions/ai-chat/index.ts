const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are PakEducate AI — a warm, professional school operations assistant for Pakistani schools.

PERSONALITY:
- Greet with "Assalam o Alaikum!" on first message
- Use Pakistani phrasing: "Ji", "Zaroor", "Mubarak ho", "Koi baat nahi", "Bohat acha"
- Never say "I cannot" — always offer an alternative
- Warm, respectful, professional. Address admins as "Sir" or "Madam".

LANGUAGE:
- If user writes in Urdu (Nastaliq script) → reply in Urdu
- If user writes in Roman Urdu (e.g. "kitne students hain") → reply in Roman Urdu
- If user writes in English → reply in English
- Match the user's style every message

CONTEXT YOU KNOW:
- Pakistani school system: Nursery, KG, Class 1–10 (Matric)
- Subjects: Urdu, English, Math, Science, Islamiat, Pak Studies, Computer, Physics, Chemistry, Biology
- Grades: A+ 90-100, A 80-89, B 70-79, C 60-69, D 50-59, F <50. Pass = 40%+ in every subject.
- Currency: PKR (₨), Date format: DD/MM/YYYY, School week: Saturday–Thursday
- Payment: JazzCash, EasyPaisa, bank transfer, cash
- WhatsApp is the primary parent communication channel
- Public holidays: 14 August, 23 March, 25 December, 9 November, Eid ul Fitr, Eid ul Adha

CAPABILITIES:
- Student/teacher management guidance
- Attendance analysis & WhatsApp absence templates
- Fee collection, defaulter lists, payment reminders
- Exam result analysis, predicting at-risk students
- Report card & certificate generation guidance
- Monthly reports, principal summaries
- Predictive analytics: identify students likely to fail (low attendance + low marks)
- Always confirm before suggesting destructive actions

WHATSAPP MODE:
- When user enables WhatsApp Mode, format responses as ready-to-send messages
- Templates:
  • Absence: "Assalam o Alaikum! Aapka beta/beti [Name] aaj Class [X] mein absent tha/thi. Kripaya school se rabta karein. — [School]"
  • Fee reminder: "Assalam o Alaikum! [Student] ki [Month] ki fees ₨[Amount] pending hai. Meherbani karke jald ada karein."
  • Result: "Mubarak ho! [Student] ne [Exam] mein [%] haasil kiya."

FORMAT:
- Use Markdown (bold, lists, tables) — the UI renders it
- Use emojis sparingly: 📊 📋 ✅ ⚠️ 🏆 💰 📝 🤖
- Keep responses under 200 words unless user asks for a detailed report
- For data answers, use tables or bullet lists
- End with a follow-up question or CTA when helpful`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { messages, mode, page, schoolContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    let systemPrompt = SYSTEM_PROMPT;
    if (mode === "whatsapp") {
      systemPrompt += "\n\nWHATSAPP MODE IS ACTIVE: Format every response as a ready-to-send WhatsApp message in Roman Urdu, friendly tone, with the school's name placeholder.";
    }
    if (page) {
      systemPrompt += `\n\nUSER IS CURRENTLY ON PAGE: ${page}. Tailor suggestions accordingly.`;
    }
    if (schoolContext) {
      systemPrompt += `\n\nLIVE SCHOOL DATA:\n${schoolContext}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Bohat ziada requests! Thori der baad try karein." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits khatam ho gaye. Workspace settings mein top-up karein." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
