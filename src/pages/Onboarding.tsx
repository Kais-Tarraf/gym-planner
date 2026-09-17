import { RedirectToSignIn, SignedIn } from "@neondatabase/neon-js/auth/react";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/Card";
import { Select } from "../components/ui/Select";
import {
	daysOptions,
	equipmentOptions,
	experienceOptions,
	goalOptions,
	sessionOptions,
	splitOptions,
} from "../constants";
import { useState } from "react";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { ArrowRight } from "lucide-react";
import type { UserProfile } from "../types";

const Onboarding = () => {
	const [formData, setFormData] = useState({
		goal: "bulk",
		experience: "intermediate",
		daysPerWeek: "4",
		sessionLength: "60",
		equipment: "full_gym",
		injuries: "",
		preferredSplit: "upper_lower",
	});
	const { user, saveProfile } = useAuth();
	if (!user) {
		return <RedirectToSignIn />;
	}

	function updateForm(field: string, value: string) {
		setFormData((prev) => ({ ...prev, [field]: value }));
	}
	async function handleQuestionnaireSubmit(e: React.SubmitEvent) {
		e.preventDefault();
		const profile: Omit<UserProfile, "userId" | "updatedAt"> = {
			goal: formData.goal as UserProfile["goal"],
			experience: formData.experience as UserProfile["experience"],
			daysPerWeek: formData.daysPerWeek,
			sessionLength:  formData.sessionLength,
			equipment: formData.equipment as UserProfile["equipment"],
			injuries: formData.injuries || undefined,
			preferredSplit: formData.preferredSplit as UserProfile["preferredSplit"],
		};
		saveProfile(profile);
	}
	return (
		<SignedIn>
			<div className="min-h-screen pt-24 pb-12 px-6">
				<div className="max-w-xl mx-auto">
					{/* Progress Indicator */}
					{/* Step 1: Questionnaire */}
					<Card variant="bordered">
						<h1 className="text-2xl font-bold mb-2">Tell Us About Yourself</h1>
						<p className="text-muted  mb-2">
							Help us create the perfect plan for you.
						</p>
						<form className="space-y-2" onSubmit={handleQuestionnaireSubmit}>
							<Select
								id="goal"
								label="What is your goal?"
								options={goalOptions}
								value={formData.goal}
								onChange={(e) => updateForm("goal", e.target.value)}
							/>
							<Select
								id="experience"
								label="Training Experience"
								options={experienceOptions}
								value={formData.experience}
								onChange={(e) => updateForm("experience", e.target.value)}
							/>
							<div className="grid grid-cols-2 gap-4">
								<Select
									id="daysPerWeek"
									label="Days Per Week"
									options={daysOptions}
									value={formData.daysPerWeek}
									onChange={(e) => updateForm("daysPerWeek", e.target.value)}
								/>
								<Select
									id="sessionLength"
									label="Session Length"
									options={sessionOptions}
									value={formData.sessionLength}
									onChange={(e) => updateForm("sessionLength", e.target.value)}
								/>
							</div>
							<Select
								id="equipment"
								label="Equipment"
								options={equipmentOptions}
								value={formData.equipment}
								onChange={(e) => updateForm("equipment", e.target.value)}
							/>
							<Select
								id="PreferredSplit"
								label="Preferred Split"
								options={splitOptions}
								value={formData.preferredSplit}
								onChange={(e) => updateForm("preferredSplit", e.target.value)}
							/>
							<Textarea
								id="injuries"
								label="Any injuries or limitations? (optional)"
								placeholder="E.g., lower back issues, shoulder impingement..."
								rows={3}
								value={formData.injuries}
								onChange={(e) => updateForm("injuries", e.target.value)}
							/>
							<div className="flex gap-3 pt-2">
								<Button type="submit" className="flex-1 gap-2">
									Generate My Plan <ArrowRight className="w-4 h-4" />
								</Button>
							</div>
						</form>
					</Card>
					{/* Step 2: Generating */}
				</div>
			</div>
		</SignedIn>
	);
};

export default Onboarding;
