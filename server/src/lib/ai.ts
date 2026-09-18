import { OpenAI } from "openai";
import dotenv from "dotenv";
import { TrainingPlan, UserProfile } from "../../types";
dotenv.config();
export async function generateTrainingPlan(
	profile: UserProfile | Record<string, any>,
): Promise<Omit<TrainingPlan, "id" | "userId" | "version" | "createdAt">> {
	// Normalize profile data
	const normalizedProfile: UserProfile = {
		goal: profile.goal || "bulk",
		experience: profile.experience || "intermediate",
		days_per_week: profile.days_per_week || 4,
		session_length: profile.session_length || 60,
		equipment: profile.equipment || "full_gym",
		injuries: profile.injuries || null,
		preferred_split: profile.preferred_split || "upper_lower",
	};
	const apikey = process.env.OPEN_ROUTER_KEY;
	if (!apikey) {
		throw new Error("Open router key is not set in environment variable.");
	}
	const openai = new OpenAI({
		apiKey: apikey,
		baseURL: "https://openrouter.ai/api/v1",
		defaultHeaders: {
			"HTTP-Referer": process.env.BASE_URL || "http://localhost:3001",
			"X-Title": "GymAI Plan Generator",
		},
	});
	// Build the prompt
	const prompt = buildPrompt(normalizedProfile);
	try {
		const completion = await openai.chat.completions.create({
			model: "google/gemma-4-26b-a4b-it:free",
			messages: [
				{
					role: "system",
					content:
						"You are an expert fitness trainer and program designer. You must respond with valid JSON only. Do not include any markdown, reasoning, or additional text.",
				},
				{
					role: "user",
					content: prompt,
				},
			],
			temperature: 0.7,
			response_format: { type: "json_object" },
		});
		const content = completion.choices[0].message.content;
		if (!content) {
			console.error(
				"[AI] No content in AI response: ",
				JSON.stringify(completion, null, 2),
			);
			throw new Error("No content in AI response");
		}
		const planData = JSON.parse(content);
		return formatPlanResponse(planData, normalizedProfile);
	} catch (err) {
		console.error("[AI] Error generating training plan: ", err);
		throw err;
	}
}
function formatPlanResponse(
	aiResponse: any,
	profile: UserProfile,
): Omit<TrainingPlan, "id" | "userId" | "version" | "createdAt"> {
	const plan: Omit<TrainingPlan, "id" | "userId" | "version" | "createdAt"> = {
		overview: {
			goal: aiResponse.overview?.goal || `Customized ${profile.goal} program`,
			frequency:
				aiResponse.overview?.frequency ||
				`${profile.days_per_week} days per week`,
			split: aiResponse.overview?.split || profile.preferred_split,
			notes:
				aiResponse.overview?.notes ||
				"Follow the program consistently for best results.",
		},
		weeklySchedule: (aiResponse.weeklySchedule || []).map((day: any) => ({
			day: day.day || "Day",
			focus: day.focus || "Full Body",
			exercises: (day.exercises || []).map((ex: any) => ({
				name: ex.name || "Exercise",
				sets: ex.sets || 3,
				reps: ex.reps || "8-12",
				rest: ex.rest || "60-90 sec",
				rpe: ex.rpe || 7,
				notes: ex.notes,
				alternatives: ex.alternatives,
			})),
		})),
		progression:
			aiResponse.progression ||
			"Increase weight by 2.5-5lbs when you can complete all sets with good form. Track your progress weekly.",
	};
	return plan;
}

function buildPrompt(profile: UserProfile): string {
	const goalMap: Record<string, string> = {
		bulk: "build muscle and gain size",
		cut: "lose fat and maintain muscle",
		recomp: "simultaneously lose fat and build muscle",
		strength: "build maximum strength",
		endurance: "improve cardiovascular endurance and stamina",
	};

	const experienceMap: Record<string, string> = {
		beginner: "beginner (0-1 years of training experience)",
		intermediate: "intermediate (1-3 years of training experience)",
		advanced: "advanced (3+ years of training experience)",
	};

	const equipmentMap: Record<string, string> = {
		full_gym: "full gym access with all equipment",
		home: "home gym with limited equipment",
		dumbbells: "only dumbbells available",
	};

	const splitMap: Record<string, string> = {
		full_body: "full body workouts",
		upper_lower: "upper/lower split",
		ppl: "push/pull/legs split",
		custom: "best split for their goals",
	};

	return `You are a strict JSON generator. Produce a personalized ${profile.days_per_week}-day per week training plan based on this user profile:

- Goal: ${goalMap[profile.goal] || profile.goal}
- Experience: ${experienceMap[profile.experience] || profile.experience}
- Session Length: ${profile.session_length} minutes
- Equipment: ${equipmentMap[profile.equipment] || profile.equipment}
- Preferred Split: ${splitMap[profile.preferred_split] || profile.preferred_split}
${profile.injuries ? `- Injuries/Limitations: ${profile.injuries}` : ""}

CRITICAL INSTRUCTIONS:
1. Output MUST be valid, raw JSON only.
2. Do NOT wrap the output in markdown fences (do NOT use \`\`\`json or \`\`\`).
3. Do NOT include any intro, outro, explanations, or commentary.
4. Start your response directly with '{' and end with '}'.

OUTPUT FORMAT (JSON SCHEMA):
{
  "overview": {
    "goal": "string",
    "frequency": "string",
    "split": "string",
    "notes": "string"
  },
  "weeklySchedule": [
    {
      "day": "string",
      "focus": "string",
      "exercises": [
        {
          "name": "string",
          "sets": 4,
          "reps": "string",
          "rest": "string",
          "rpe": 8,
          "notes": "string",
          "alternatives": ["string"]
        }
      ]
    }
  ],
  "progression": "string"
}

Create exactly ${profile.days_per_week} workout days fitting the parameters above. Generate valid JSON now:`;
}
