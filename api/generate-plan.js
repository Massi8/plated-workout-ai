import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { answers, tier } = req.body;

  if (!answers) {
    return res.status(400).json({ error: "Missing answers" });
  }

  try {
    const systemPrompt = `You are an expert personal trainer and workout program designer. 
Generate a structured training program in JSON format based on user answers.
${
  tier === "pro"
    ? `This is a PRO user - include exercise substitutions, deload guidance, and advanced progression strategies.`
    : `This is a BASIC user - provide essential information only.`
}

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "programName": "string",
  "summary": "string (2-3 sentences)",
  "safetyNote": "string or null",
  "days": [
    {
      "day": "string (e.g., 'Monday — Upper Body')",
      "warmup": "string",
      "exercises": [
        {
          "name": "string",
          "sets": number,
          "reps": "string (e.g., '6-10')",
          "rest_seconds": number,
          "notes": "string or null",
          "substitutions": ["string"] ${tier === "pro" ? "// Array of alternative exercises" : "// Empty array for basic"}
        }
      ]
    }
  ],
  "progressionNote": "string",
  "deloadNote": "string or null"
}`;

    const userPrompt = `Create a personalized ${answers.days}-day per week training program with these specifications:
- Goal: ${answers.goal}
- Experience: ${answers.experience}
- Session Duration: ${answers.duration}
- Equipment Available: ${answers.equipment}
- Preferred Split: ${answers.split}
- Dislikes: ${answers.dislikes || "None"}
- Limitations: ${answers.limitations || "None"}
- Age Range: ${answers.age}

Design a ${answers.days}-week program that builds progressively. Include proper warm-ups, exact sets/reps/rest times, and clear progression guidelines.`;

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    let plan;
    try {
      plan = JSON.parse(responseText);
    } catch (e) {
      // Try to extract JSON if it's wrapped in markdown
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        plan = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Invalid JSON response from Claude");
      }
    }

    res.status(200).json({ plan });
  } catch (error) {
    console.error("Plan generation error:", error);
    res.status(500).json({
      error:
        error.message || "Failed to generate plan. Please try again later.",
    });
  }
}
