import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import type { User, UserProfile } from "../types";
import { authClient } from "../lib/auth";
import { api } from "../lib/api";
interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	saveProfile: (
		profile: Omit<UserProfile, "userId" | "updatedAt">,
	) => Promise<void>;
}
const AuthContext = createContext<AuthContextType | null>(null);
export default function AuthProvider({ children }: { children: ReactNode }) {
	const [neonUser, setNeonUser] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		const loadUser = async () => {
			try {
				const result = await authClient.getSession();
				if (result && result.data?.user) {
					setNeonUser(result.data.user);
				} else {
					setNeonUser(null);
				}
			} catch (err) {
				console.error(err);
				setNeonUser(null);
			} finally {
				setIsLoading(false);
			}
		};
		loadUser();
	}, []);
	async function saveProfile(
		profileData: Omit<UserProfile, "userId" | "updatedAt">,
	) {
		if (!neonUser) {
			throw new Error("User must be authenticated to save profile");
		}
		return api.saveProfile(neonUser.id, profileData);
	}
	return (
		<AuthContext.Provider value={{ user: neonUser, isLoading, saveProfile }}>
			{children}
		</AuthContext.Provider>
	);
}
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
