import { useState, createContext, useContext } from "react";
import {
	numOfItemsMetric,
	volumeMetric,
	orderMetric,
	overallMetric,
} from "./metrics.js";

const DEV = true;

const UserDataContext = createContext("");

export const UserDataProvider = ({ children }) => {
	const [open, setOpen] = useState(false);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [projects, setProjects] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const setCustomizedError = (error) => {
		setError(error);
		setOpen(true);
	};

	const createUser = async ({ email, password, setIsRegistered }) => {
		setError("");
		setIsLoading(true);
		try {
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: email,
					password: password,
				}),
			};
			let response;

			if (DEV) {
				response = await fetch(
					"http://localhost:1337/createUser",
					requestOptions
				);
			} else {
				response = await fetch(
					"https://cargoexpert.onrender.com/createUser",
					requestOptions
				);
			}

			if (response.status === 200) {
				setIsRegistered(true);
			} else {
				const data = await response.json();
				setCustomizedError(data.error);
			}
		} catch (error) {
			setCustomizedError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const readUser = async () => {
		setError("");
		setIsLoading(true);
		setIsLoggedIn(false);
		try {
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: email,
					password: password,
				}),
			};
			let response;

			if (DEV) {
				response = await fetch(
					"http://localhost:1337/readUser",
					requestOptions
				);
			} else {
				response = await fetch(
					"https://cargoexpert.onrender.com/readUser",
					requestOptions
				);
			}
			const data = await response.json();
			if (response.status === 200) {
				setProjects(data);
				setIsLoggedIn(true);
			} else {
				setCustomizedError(data.error);
			}
		} catch (error) {
			setCustomizedError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const updateUser = async (new_projects) => {
		setError("");
		setIsLoading(true);
		try {
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: email,
					password: password,
					newProjects: new_projects,
				}),
			};
			let response;
			if (DEV) {
				response = await fetch(
					"http://localhost:1337/updateUser",
					requestOptions
				);
			} else {
				response = await fetch(
					"https://cargoexpert.onrender.com/updateUser",
					requestOptions
				);
			}
			if (response.status === 200) {
				//console.log("User updated successfully");
			} else {
				//console.log("User NOT updated successfully");
				//throw new Error(`${response.status} ${response.statusText}`);
			}
		} catch (error) {
			setCustomizedError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	/*
	const deleteUser = async ({ email, password }) => {
		setError("");
		setIsLoading(true);
		try {
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: email,
					password: password,
				}),
			};
			let response;

			if (DEV) {
				response = await fetch(
					"http://localhost:1337/deleteUser",
					requestOptions
				);
			} else {
				response = await fetch(
					"https://cargoexpert.onrender.com/deleteUser",
					requestOptions
				);
			}

			if (response.status === 200) {
				console.log("User deleted successfully");
			} else {
				throw new Error(`${response.status} ${response.statusText}`);
			}
		} catch (error) {
			setCustomizedError(error);
		} finally {
			setIsLoading(false);
		}
	};
	*/

	const addProject = async (project) => {
		let container_data = {
			width: project.container[0],
			height: project.container[1],
			length: project.container[2],
		};

		const container_and_boxes = {
			boxes: project.boxes,
			container: container_data,
			project_data: project.project_data,
		};

		setError("");
		setIsLoading(true);
		try {
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(container_and_boxes),
			};
			let response;

			if (DEV) {
				response = await fetch(
					"http://localhost:1337/getSolutionsJS",
					requestOptions
				);
			} else {
				response = await fetch(
					"https://cargoexpert.onrender.com/getSolutionsJS",
					requestOptions
				);
			}

			const solutions = await response.json();
			if (response.status === 200) {
				let current_id = 0;
				if (projects.length !== 0) {
					current_id = projects[projects.length - 1].id + 1;
				}

				const new_projects = [
					...projects,
					{
						id: current_id,
						project_data: project.project_data,
						container: project.container,
						boxes: project.boxes,
						solutions: resetIds(Object.values(solutions)),
					},
				];
				setProjects(new_projects);
				updateUser(new_projects);
			} else {
				setCustomizedError(solutions.error);
			}
		} catch (error) {
			setCustomizedError(error);
		} finally {
			setIsLoading(false);
		}
	};

	const deleteProject = (id) => {
		let new_projects = projects.filter((project) => {
			return project.id !== id;
		});
		setProjects(new_projects);
		updateUser(new_projects);
	};

	const updateProject = (project) => {
		let new_projects = projects.map((current_project) => {
			return current_project.id === project.id
				? project
				: current_project;
		});
		setProjects(new_projects);
		updateUser(new_projects);
	};

	const improveSolution = async (projectId, solutionId) => {
		const project = projects.find((proj) => proj.id === projectId);
		let container_data = {
			width: project.container[0],
			height: project.container[1],
			length: project.container[2],
		};

		const solution = project.solutions.find((sol) => sol.id === solutionId);
		const container_and_boxes = {
			boxes: solution.boxes,
			container: container_data,
		};

		setError("");
		setIsLoading(true);
		try {
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(container_and_boxes),
			};
			let response;

			if (DEV) {
				response = await fetch(
					"http://localhost:1337/improveSolutionJS",
					requestOptions
				);
			} else {
				response = await fetch(
					"https://cargoexpert.onrender.com/improveSolutionJS",
					requestOptions
				);
			}

			const improvedSolution = await response.json();
			if (response.status === 200) {
				updateImprovedSolution(
					project.id,
					solutionId,
					improvedSolution.boxes,
					improvedSolution.solution_data
				);
			} else {
				setCustomizedError(improvedSolution.error);
			}
		} catch (error) {
			setCustomizedError(error);
		} finally {
			setIsLoading(false);
		}
	};

	const duplicateSolution = (projectId, solutionId) => {
		const removeIds = (obj) => {
			if (Array.isArray(obj)) {
				// if the object is an array, recursively remove ids from each element
				return obj.map((elem) => removeIds(elem));
			} else if (typeof obj === "object" && obj !== null) {
				// if the object is a non-null object, recursively remove ids from each key-value pair
				const newObj = {};
				Object.entries(obj).forEach(([key, value]) => {
					if (key !== "_id") {
						newObj[key] = removeIds(value);
					}
				});
				return newObj;
			} else {
				// otherwise, return the original value
				return obj;
			}
		};

		let project;
		for (let i = 0; i < projects.length; i++) {
			if (projects[i].id === projectId) {
				project = projects[i];
				break;
			}
		}

		let originalSolution;
		for (let i = 0; i < project.solutions.length; i++) {
			if (project.solutions[i].id === solutionId) {
				originalSolution = project.solutions[i];
				break;
			}
		}

		const originalSolutionNoIds = removeIds(originalSolution);

		const newSolution = {
			...originalSolutionNoIds,
			id: project.solutions.length,
			name: `${originalSolution.name} duplicated`,
		};

		addSolution(projectId, newSolution);
	};

	const addSolution = (projectId, solution) => {
		let project;
		for (let i = 0; i < projects.length; i++) {
			if (projects[i].id === projectId) {
				project = projects[i];
				break;
			}
		}
		let newSolutions = [...project.solutions, solution];
		newSolutions = resetIds(newSolutions);

		const newProject = {
			...project,
			solutions: newSolutions,
		};

		updateProject(newProject);
	};

	const updateSolutionName = (projectId, newSolution) => {
		let project;
		for (let i = 0; i < projects.length; i++) {
			if (projects[i].id === projectId) {
				project = projects[i];
				break;
			}
		}
		const newSolutions = project.solutions.filter(
			(solution) => solution.id !== newSolution.id
		);

		const newProject = {
			...project,
			solutions: [...newSolutions, newSolution],
		};

		updateProject(newProject);
	};

	const updateImprovedSolution = (
		project_id,
		solution_id,
		boxes,
		solution_data
	) => {
		let new_projects = projects.map((current_project) => {
			if (current_project.id === project_id) {
				let new_project = {
					...current_project,
					solutions: current_project.solutions.map(
						(current_solution) =>
							current_solution.id === solution_id
								? {
										...current_solution,
										solution_data: solution_data,
										boxes: boxes,
								  }
								: current_solution
					),
				};
				return new_project;
			} else {
				return current_project;
			}
		});
		setProjects(new_projects);
		updateUser(new_projects);
	};

	const updateSolution = (project_id, solution_id, inBoxes, outBoxes) => {
		const currentProject = projects.filter((current_project) => {
			return current_project.id === project_id;
		})[0];

		const isQuantity = currentProject.project_data.isQuantity;
		const container = currentProject.container;

		const solutionBoxes = inBoxes.concat(outBoxes);
		let updatedSolutionData = {
			capacity: volumeMetric(solutionBoxes),
			number_of_items: numOfItemsMetric(solutionBoxes),
			order_score: orderMetric(solutionBoxes, container),
			overall_score: 0,
		};

		let updatedSolutionDataWithOverall = {
			...updatedSolutionData,
			overall_score: overallMetric(
				solutionBoxes,
				container,
				updatedSolutionData,
				isQuantity
			),
		};

		let new_projects = projects.map((current_project) => {
			if (current_project.id === project_id) {
				let new_project = {
					...current_project,
					solutions: current_project.solutions.map(
						(current_solution) =>
							current_solution.id === solution_id
								? {
										...current_solution,
										boxes: solutionBoxes,
										solution_data:
											updatedSolutionDataWithOverall,
								  }
								: current_solution
					),
				};
				return new_project;
			} else {
				return current_project;
			}
		});
		setProjects(new_projects);
		updateUser(new_projects);
	};

	const deleteSolution = (projectId) => {
		return (solutionId) => {
			let project;
			for (let i = 0; i < projects.length; i++) {
				if (projects[i].id === projectId) {
					project = projects[i];
					break;
				}
			}
			let newSolutions = project.solutions.filter(
				(solution) => solution.id !== solutionId
			);
			newSolutions = resetIds(newSolutions);

			const newProject = {
				...project,
				solutions: newSolutions,
			};

			updateProject(newProject);
		};
	};

	const resetIds = (list) => {
		return list.map((item, index) => {
			return { ...item, id: index };
		});
	};

	return (
		<UserDataContext.Provider
			value={{
				email,
				setEmail,
				password,
				setPassword,
				projects,
				setProjects,
				addProject,
				deleteProject,
				updateSolution,
				readUser,
				isLoading,
				error,
				setError,
				setCustomizedError,
				createUser,
				isLoggedIn,
				setIsLoggedIn,
				updateProject,
				deleteSolution,
				duplicateSolution,
				updateSolutionName,
				improveSolution,
				open,
				setOpen,
			}}
		>
			{children}
		</UserDataContext.Provider>
	);
};

export const useUserData = () => useContext(UserDataContext);
