
import { generateTrainingPlan } from "./server/src/lib/ai";
import { UserProfile } from "./server/types";

async function testAI() {
    const profile: UserProfile = {
        goal: "bulk",
        experience: "beginner",
        days_per_week: 3,
        session_length: 45,
        equipment: "full_gym",
        injuries: null,
        preferred_split: "full_body"
    };

    console.log("Testing AI generation...");
    try {
        const plan = await generateTrainingPlan(profile);
        console.log("AI Generation Successful!");
        console.log(JSON.stringify(plan, null, 2));
    } catch (error) {
        console.error("AI Generation Failed:");
        console.error(error);
    }
}

testAI();
