import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
	const { user, isLoading } = useAuth();
	const plan = false;
	if (!user && !isLoading) return <Navigate to="/auth/sign-in" replace />;
	if (!plan) return <Navigate to="/onboarding" replace />;
};

export default Profile;
