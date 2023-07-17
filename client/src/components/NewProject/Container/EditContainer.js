import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { StandardContainers } from "./StandardContainers";

export const EditContainer = ({
	setNewStage,
	container,
	setContainer,
	setCustomizedError,
}) => {
	const [width, height, length] = container;

	const [formWidth, setFormWidth] = useState(width);
	const [formHeight, setFormHeight] = useState(height);
	const [formLength, setFormLength] = useState(length);

	const validateContainer = () => {
		if (isNaN(formWidth) || isNaN(formHeight) || isNaN(formLength)) {
			return false;
		}
		if (formWidth <= 0 || formHeight <= 0 || formLength <= 0) {
			return false;
		}
		return true;
	};

	const handleEditContainer = () => {
		if (validateContainer()) {
			setContainer([
				parseInt(formWidth),
				parseInt(formHeight),
				parseInt(formLength),
			]);
			setNewStage(1);
		} else {
			setCustomizedError("Problem with container");
		}
	};

	const setStandardContainer = (w, h, l) => {
		setFormWidth(w);
		setFormHeight(h);
		setFormLength(l);
	};

	return (
		<div>
			<p
				style={{
					fontSize: "16px",
				}}
				className="m-0"
			>
				Choose a standard size or enter a size of your own!
			</p>
			<StandardContainers setStandardContainer={setStandardContainer} />

			<form className="d-flex flex-column">
				<label>Width: </label>
				<TextField
					className="mb-3"
					type="number"
					id="width"
					value={formWidth}
					onChange={(e) => {
						setFormWidth(e.target.value);
					}}
				/>
				<label>Height:</label>
				<TextField
					className="mb-3"
					type="number"
					id="height"
					value={formHeight}
					onChange={(e) => {
						setFormHeight(e.target.value);
					}}
				/>
				<label>Length</label>
				<TextField
					className="mb-3"
					type="number"
					id="length"
					value={formLength}
					onChange={(e) => {
						setFormLength(e.target.value);
					}}
				/>

				<div className="d-flex justify-content-between">
					<Button onClick={() => setNewStage(-1)}>Back</Button>
					<Button onClick={handleEditContainer}>Continue</Button>
				</div>
			</form>
		</div>
	);
};
