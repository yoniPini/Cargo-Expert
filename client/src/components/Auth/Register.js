import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../UserDataProvider.js";
import { AuthForm } from "./AuthForm.js";

export const Register = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const [isRegistered, setIsRegistered] = useState(false);
	const { createUser, isLoading, setCustomizedError } = useUserData();

	useEffect(() => {
		if (isRegistered) {
			navigate("/");
		}
	}, [isRegistered, navigate]);

	const handleRegister = async (e) => {
		setIsRegistered(false);
		if (email.length === 0) {
			setCustomizedError("Invalid Email!");
		} else if (password.length === 0) {
			setCustomizedError("Invalid Password!");
		} else {
			await createUser({ email, password, setIsRegistered });
		}
	};

	return (
		<AuthForm
			email={email}
			password={password}
			isLoading={isLoading}
			setEmail={setEmail}
			setPassword={setPassword}
			handleAction={handleRegister}
			actionText="Register"
		/>
	);
};
