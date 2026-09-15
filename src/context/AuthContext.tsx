import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import type { User } from "../types";
import { authClient } from "../lib/auth";
interface AuthContextType {
	user: User | null;
}
const AuthContext = createContext<AuthContextType | null>(null);
export default function AuthProvider({ children }: { children: ReactNode }) {
	const [neonUser, setNeonUser] = useState<any>(null);
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
			}
		};
		loadUser();
	}, []);
	return (
		<AuthContext.Provider value={{ user: neonUser }}>
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
