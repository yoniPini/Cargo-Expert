import { useState, createContext, useContext, useEffect } from "react";
import { useUserData } from "../UserDataProvider";

const ProjectContext = createContext("");

export const ProjectProvider = ({ children }) => {
	const [projectId, setProjectId] = useState(null);
	const [solutions, setSolutions] = useState(null);
	const [solutionId, setSolutionId] = useState(null);
	const [container, setContainer] = useState(null);
	const [boxes, setBoxes] = useState([]);
	const [previousBoxes, setPreviousBoxes] = useState(boxes);
	const [inBoxes, setInBoxes] = useState([]);
	const [previousInBoxes, setPreviousInBoxes] = useState(inBoxes);
	const [outBoxes, setOutBoxes] = useState([]);
	const [previousOutBoxes, setPreviousOutBoxes] = useState(outBoxes);
	const [boxIndices, setBoxIndices] = useState([]);

	const { projects, updateSolution, improveSolution } = useUserData();

	useEffect(() => {
		if (projectId !== null) {
			let index = projects.findIndex(
				(project) => project.id === projectId
			);
			setSolutions(projects[index].solutions);
			setContainer(projects[index].container);
		}
		// return function (projectId = null)?
	}, [projectId, projects]);

	useEffect(() => {
		if (
			solutions !== null &&
			Object.keys(solutions).length !== 0 &&
			solutionId !== null
		) {
			const solution = solutions.find(
				(solution) => solution.id === solutionId
			);

			const isInBoxes = solution.boxes.filter((box) => {
				return box.isIn === 1;
			});
			const isOutBoxes = solution.boxes.filter((box) => {
				return box.isIn === 0;
			});

			setBoxes(solution.boxes);
			setInBoxes(isInBoxes);
			setOutBoxes(isOutBoxes);
			setPreviousBoxes(solution.boxes);
			setPreviousInBoxes(isInBoxes);
			setPreviousOutBoxes(isOutBoxes);
			setBoxIndices([]);
		}
	}, [solutions, solutionId, projects]);

	const getCurrentProjectName = () => {
		if (projectId === null) {
			return "";
		} else {
			return projects.filter((project) => project.id === projectId)[0]
				.project_data.name;
		}
	};

	const getCurrentSolutionName = () => {
		if (solutionId === null) {
			return "";
		} else {
			return solutions.filter((solution) => solution.id === solutionId)[0]
				.name;
		}
	};

	// Change id access
	const getPreviousSolution = () => {
		let len = Object.keys(solutions).length;
		setSolutionId((((solutionId - 1) % len) + len) % len);
	};

	// Change id access
	const getNextSolution = () => {
		setSolutionId((solutionId + 1) % Object.keys(solutions).length);
	};

	const changeBoxIndices = (newId) => {
		if (boxIndices.includes(newId)) {
			setBoxIndices((boxIndices) => {
				return boxIndices.filter((id) => id !== newId);
			});
		} else {
			setBoxIndices([...boxIndices, newId]);
		}
	};

	const moveBox = ([a, b, c]) => {
		const newBoxes = inBoxes.map((box) => {
			if (boxIndices.includes(box.id)) {
				const [x, y, z] = box.position;
				return { ...box, position: [x + a, y + b, z + c] };
			} else return box;
		});
		setInBoxes(newBoxes);
	};

	const rotateBox = (axis) => {
		const newBoxes = inBoxes.map((box) => {
			if (boxIndices.includes(box.id)) {
				const [w, h, l] = box.size;
				if (axis === "x") {
					return { ...box, size: [w, l, h] };
				}
				if (axis === "y") {
					return { ...box, size: [l, h, w] };
				}
				if (axis === "z") {
					return { ...box, size: [h, w, l] };
				}
				return box;
			} else return box;
		});
		setInBoxes(newBoxes);
	};

	const resetBoxes = () => {
		deselectBoxes();
		setBoxes(previousBoxes);
		setInBoxes(previousInBoxes);
		setOutBoxes(previousOutBoxes);
	};

	const changeBoxById = (id, newBox) => {
		const newBoxes = inBoxes.map((box) => {
			if (box.id === id) {
				return newBox;
			} else {
				return box;
			}
		});
		setInBoxes(newBoxes);
	};

	const saveSolution = () => {
		updateSolution(projectId, solutionId, inBoxes, outBoxes);
	};

	const improveSolutionInView = () => {
		improveSolution(projectId, solutionId);
	};

	const deselectBoxes = () => {
		setBoxIndices([]);
	};

	const removeBoxes = () => {
		let allBoxes = inBoxes.concat(outBoxes);

		allBoxes = allBoxes.map((box) => {
			if (boxIndices.includes(box.id)) {
				return { ...box, isIn: 0 };
			} else {
				return box;
			}
		});

		const { newInBoxes, newOutBoxes } = allBoxes.reduce(
			(acc, box) => {
				if (box.isIn === 1) {
					acc.newInBoxes.push(box);
				} else {
					acc.newOutBoxes.push(box);
				}
				return acc;
			},
			{ newInBoxes: [], newOutBoxes: [] }
		);
		setInBoxes(newInBoxes);
		setOutBoxes(newOutBoxes);
		setBoxIndices([]);
	};

	const toggleIsIn = (id) => {
		let allBoxes = inBoxes.concat(outBoxes);
		allBoxes = allBoxes.map((box) => {
			if (box.id === id) {
				return { ...box, isIn: box.isIn === 1 ? 0 : 1 };
			} else {
				return box;
			}
		});

		const { newInBoxes, newOutBoxes } = allBoxes.reduce(
			(acc, box) => {
				if (box.isIn === 1) {
					acc.newInBoxes.push(box);
				} else {
					acc.newOutBoxes.push(box);
				}
				return acc;
			},
			{ newInBoxes: [], newOutBoxes: [] }
		);
		setInBoxes(newInBoxes);
		setOutBoxes(newOutBoxes);
	};

	return (
		<ProjectContext.Provider
			value={{
				boxes,
				inBoxes,
				outBoxes,
				boxIndices,
				moveBox,
				changeBoxIndices,
				changeBoxById,
				rotateBox,
				resetBoxes,
				getNextSolution,
				getPreviousSolution,
				setProjectId,
				solutions,
				setSolutionId,
				container,
				solutionId,
				projectId,
				saveSolution,
				deselectBoxes,
				improveSolutionInView,
				toggleIsIn,
				removeBoxes,
				getCurrentProjectName,
				getCurrentSolutionName,
			}}
		>
			{children}
		</ProjectContext.Provider>
	);
};

export const useProject = () => useContext(ProjectContext);
