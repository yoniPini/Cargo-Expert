import { Button, TextField, CircularProgress } from "@mui/material";

export const AuthForm = ({
	email,
	password,
	isLoading,
	setEmail,
	setPassword,
	handleAction,
	actionText,
}) => {
	return (
		<div className="text-center">
			<h1 className="m-0 p-5 display-1 mt-5">Cargo Expert</h1>
			<form
				style={{ width: "20%" }}
				className="d-flex flex-column mx-auto align-items-center"
			>
				<TextField
					id="email"
					label="Email"
					variant="outlined"
					value={email}
					type="text"
					placeholder="Email..."
					required
					onChange={(e) => setEmail(e.target.value.trim())}
					fullWidth
				/>
				<TextField
					className="mt-4"
					id="password"
					label="Password"
					variant="outlined"
					value={password}
					type="password"
					placeholder="Password..."
					required
					onChange={(e) => setPassword(e.target.value.trim())}
					fullWidth
				/>
				{isLoading ? (
					<CircularProgress className="mt-2" />
				) : (
					<Button
						className="mt-3 px-3"
						color="primary"
						variant="outlined"
						onClick={handleAction}
					>
						{actionText}
					</Button>
				)}
			</form>
		</div>
	);
};
