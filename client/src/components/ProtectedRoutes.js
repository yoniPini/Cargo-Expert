import { useUserData } from "./UserDataProvider";
import { Login } from "./Auth/Login";
import { Outlet } from "react-router-dom";

export const ProtectedRoutes = () => {
	const { isLoggedIn } = useUserData();
	return isLoggedIn ? <Outlet /> : <Login />;
};
