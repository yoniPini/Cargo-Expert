import { useUserData } from "../UserDataProvider.js";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthForm } from "./AuthForm.js";

export const Login = () => {
	const navigate = useNavigate();
	const {
		email,
		setEmail,
		password,
		setPassword,
		readUser,
		isLoading,
		setCustomizedError,
		isLoggedIn,
	} = useUserData();

	useEffect(() => {
		if (isLoggedIn) {
			navigate("/home");
		}
	}, [isLoggedIn, navigate]);

	const handleLogin = async (e) => {
		if (email.length === 0) {
			setCustomizedError("Invalid Email!");
		} else if (password.length === 0) {
			setCustomizedError("Invalid Password!");
		} else {
			await readUser();
		}
	};

	return (
		<AuthForm
			email={email}
			password={password}
			isLoading={isLoading}
			setEmail={setEmail}
			setPassword={setPassword}
			handleAction={handleLogin}
			actionText="Login"
		/>
	);
};
