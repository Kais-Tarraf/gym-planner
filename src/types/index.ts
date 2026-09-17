export interface User {
	id: string;
	email: string;
	createdAt: string;
}
export interface AuthContextType {
	user: User | null;
}
export interface UserProfile {
	userId: string;
	goal: "cut" | "bulk" | "recomp" | "strength" | "endurance";
	experience: "beginner" | "intermediate" | "advanced";
	daysPerWeek: string;
	sessionLength: string;
	equipment: "full_gym" | "home" | "dumbbells";
	injuries?: string | null;
	preferredSplit: "upper_lower" | "ppl" | "full_body" | "custom";
	updatedAt?: Date;
}
