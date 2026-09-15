export interface User {
	id: string;
	email: string;
	createdAt: string;
}
export interface AuthContextType {
	user: User | null;
}
