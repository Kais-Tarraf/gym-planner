import { Router, type Request, type Response } from "express";
import { prisma } from "../lib/prisma";

export const profileRouter = Router();

profileRouter.post("/", async (req: Request, res: Response) => {
	try {
		const { userId, ...profileData } = req.body;
		if (!userId) {
			return res.status(400).json({ error: "User ID is required" });
		}
		let {
			goal,
			experience,
			daysPerWeek,
			sessionLength,
			equipment,
			injuries,
			preferredSplit,
		} = profileData;

		if (
			!goal ||
			!experience ||
			!daysPerWeek ||
			!sessionLength ||
			!equipment ||
			!preferredSplit
		) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		// Convert to integers
		daysPerWeek = parseInt(daysPerWeek);
		sessionLength = parseInt(sessionLength);

		if (isNaN(daysPerWeek) || isNaN(sessionLength)) {
			return res.status(400).json({ error: "Invalid numeric values" });
		}
		console.log("Saving profile for user:", userId);
		console.log("Profile data:", {
			goal,
			experience,
			days_per_week: daysPerWeek,
			session_length: sessionLength,
			equipment,
			injuries,
			preferred_split: preferredSplit,
		});
		await prisma.user_profiles.upsert({
			where: { user_id: userId },
			update: {
				goal,
				experience,
				days_per_week: daysPerWeek,
				session_length: sessionLength,
				equipment,
				injuries: injuries || null,
				preferred_split: preferredSplit,
				updated_at: new Date(),
			},
			create: {
				user_id: userId,
				goal,
				experience,
				days_per_week: daysPerWeek,
				session_length: sessionLength,
				equipment,
				injuries: injuries || null,
				preferred_split: preferredSplit,
			},
		});
		res.json({ success: true, message: "Profile saved successfully" });
	} catch (error: any) {
		console.error("Error saving profile: ", error);
		res.status(500).json({ error: error.message || "Failed to save profile" });
	}
});
