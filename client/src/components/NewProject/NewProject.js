import { FileUpload } from "./FileUpload/FileUpload";
import { EditContainer } from "./Container/EditContainer";
import { ProjectSettings } from "./ProjectSettings/ProjectSettings";
import { EditBoxes } from "./Boxes/EditBoxes";
import { useState } from "react";
import { Wizard } from "./Wizard";
import { useUserData } from "../UserDataProvider";
import { useNavigate } from "react-router-dom";
import { Modal, Box, Typography, LinearProgress } from "@mui/material";

const CREATE_PROJECT_MODAL_TEXT =
	"We are creating your project, it might take a few moments :)";

const stringToColour = (str) => {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	let colour = "#";
	for (let i = 0; i < 3; i++) {
		let value = (hash >> (i * 8)) & 0xff;
		colour += ("00" + value.toString(16)).substr(-2);
	}
	return colour;
};

const validateBox = (box) => {
	if (Object.values(box).includes(null)) {
		return false;
	}
	if (Object.values(box).includes(undefined)) {
		return false;
	}
	if (isNaN(box.order) || box.order <= 0) {
		return false;
	}
	if (
		!validateNumberProperty(box.width) ||
		!validateNumberProperty(box.height) ||
		!validateNumberProperty(box.length)
	) {
		return false;
	}
	if (!box.type || box.type.trim().length === 0) {
		return false;
	}
	return true;
};

const validateNumberProperty = (property) => {
	if (isNaN(property)) {
		return false;
	}
	if (parseFloat(property) <= 0) {
		return false;
	}
	return true;
};

export const NewProject = () => {
	const [container, setContainer] = useState([0, 0, 0]);
	const [boxes, setBoxes] = useState([]);
	const [name, setName] = useState("");
	const [stage, setStage] = useState(0);
	const [orderQuantity, setOrderQuantity] = useState("Quantity");
	const [timeQuality, setTimeQuality] = useState("Time");
	const { addProject, isLoading, setError, setCustomizedError } =
		useUserData();
	const [openModal, setOpenModal] = useState(false);

	const navigate = useNavigate();

	const setNewStage = (dir) => {
		setError("");
		setStage((prevStage) => prevStage + dir * 1);
	};

	const validateBoxes = () => {
		for (let i = 0; i < boxes.length; i++) {
			let box = boxes[i];
			if (!validateBox(box)) {
				return false;
			}
		}
		return true;
	};

	const handleAddProject = async () => {
		setError("");
		if (!validateBoxes()) {
			//TODO: change this to error from file to be created...
			setCustomizedError("Problem with boxes");
		} else {
			setOpenModal(true);
			let project_boxes = boxes.map((box) => {
				return { ...box, color: stringToColour(box.type), isIn: 0 };
			});

			const project_data = {
				name: name,
				isQuantity: orderQuantity === "Quantity" ? 1 : 0,
				isQuality: timeQuality === "Quality" ? 1 : 0,
			};

			try {
				await addProject({
					project_data: project_data,
					container: container,
					boxes: project_boxes,
					solutions: [],
				});
				navigate("/home");
			} catch (err) {
				setCustomizedError(err);
			}
		}
	};

	return (
		<>
			<Wizard stage={stage} />
			<h1
				style={{ textAlign: "center" }}
				className="m-0 pt-5 mb-4 display-4"
			>
				{stage === 0 ? "Project Settings" : null}
				{stage === 1 ? "File Upload (Optional)" : null}
				{stage === 2 ? "Edit Container" : null}
				{stage === 3 ? "Edit Boxes" : null}
			</h1>
			<div className="w-100 d-flex flex-column justify-content-center mx-auto align-items-center">
				{stage === 0 ? (
					<ProjectSettings
						name={name}
						setName={setName}
						setNewStage={setNewStage}
						orderQuantity={orderQuantity}
						setOrderQuantity={setOrderQuantity}
						timeQuality={timeQuality}
						setTimeQuality={setTimeQuality}
						setCustomizedError={setCustomizedError}
					/>
				) : null}

				{stage === 1 ? (
					<FileUpload
						setNewStage={setNewStage}
						setContainer={setContainer}
						setBoxes={setBoxes}
						setCustomizedError={setCustomizedError}
					/>
				) : null}

				{stage === 2 ? (
					<EditContainer
						setNewStage={setNewStage}
						container={container}
						setContainer={setContainer}
						setCustomizedError={setCustomizedError}
					/>
				) : null}

				{stage === 3 ? (
					<EditBoxes
						setNewStage={setNewStage}
						boxes={boxes}
						setBoxes={setBoxes}
						handleAddProject={handleAddProject}
						isLoading={isLoading}
						setCustomizedError={setCustomizedError}
					/>
				) : null}
				<Modal
					open={openModal}
					onClose={() => setOpenModal(false)}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box
						sx={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							width: "20%",
							bgcolor: "background.paper",
							color: "#1976d2",
							border: "2px solid rgba(0,0,0,0.5)",
							borderRadius: "10px",
							boxShadow: 0,
							p: 3,
						}}
					>
						<Typography
							id="modal-modal-description"
							sx={{ mt: 2 }}
						>
							{CREATE_PROJECT_MODAL_TEXT}
						</Typography>
						<LinearProgress className="mt-1" />
					</Box>
				</Modal>
			</div>
		</>
	);
};
