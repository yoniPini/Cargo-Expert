import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Login } from "./components/Auth/Login";
import { Register } from "./components/Auth/Register";
import { Home } from "./components/Home";
import { Product } from "./components/Product/Product";
import { NewProject } from "./components/NewProject/NewProject";
import { UserDataProvider } from "./components/UserDataProvider";
import { Header } from "./components/Header";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import { ErrorSnackbar } from "./components/ErrorSnackbar";
import { useUserData } from "./components/UserDataProvider";

const Screen = () => {
	const { open, setOpen, error } = useUserData();
	return (
		<>
			<Header />
			<Routes>
				<Route
					path="/"
					element={<Login />}
				/>
				<Route
					path="/register"
					element={<Register />}
				/>
				<Route element={<ProtectedRoutes />}>
					<Route
						path="/home"
						element={<Home />}
					/>
					<Route
						path="/product"
						element={<Product />}
					/>
					<Route
						path="/new_project"
						element={<NewProject />}
					/>
				</Route>
				<Route
					path="*"
					element={<Login />}
				/>
			</Routes>
			<ErrorSnackbar
				open={open}
				setOpen={setOpen}
				text={error}
			/>
		</>
	);
};

const App = () => {
	return (
		<div className="App ">
			<UserDataProvider>
				<Screen />
			</UserDataProvider>
		</div>
	);
};

export default App;
