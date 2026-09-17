import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
	const { user, isLoading } = useAuth();
	if (user && !isLoading)  return <Navigate to="/profile" replace />;
};

export default Home;
