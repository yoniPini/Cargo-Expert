import { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";

const formErrors = {
	orderError: "There is a problem with the box's order",
	widthError: "There is a problem with the box's width",
	heightError: "There is a problem with the box's height",
	lengthError: "There is a problem with the box's length",
	typeError: "There is a problem with the box's type",
};

export const BoxForm = ({
	setBoxes,
	boxes,
	selectedIds,
	editBox,
	setCustomizedError,
	setSelecetedIds,
}) => {
	const [formOrder, setFormOrder] = useState("");
	const [formWidth, setFormWidth] = useState("");
	const [formHeight, setFormHeight] = useState("");
	const [formLength, setFormLength] = useState("");
	const [formType, setFormType] = useState("");

	useEffect(() => {
		if (selectedIds.length === 0) {
			setFormOrder("");
			setFormWidth("");
			setFormHeight("");
			setFormLength("");
			setFormType("");
		}
		if (selectedIds.length === 1) {
			const filteredBoxes = boxes.filter((box) => {
				return box.id === selectedIds[0];
			});
			const box = filteredBoxes[0];
			setFormOrder(box.order);
			setFormWidth(box.width);
			setFormHeight(box.height);
			setFormLength(box.length);
			setFormType(box.type);
		}
	}, [selectedIds, boxes]);

	const isFormValid = () => {
		if (!formOrder || formOrder <= 0) {
			setCustomizedError(formErrors.orderError);
			return false;
		}
		if (!formWidth || formWidth <= 0) {
			setCustomizedError(formErrors.widthError);
			return false;
		}
		if (!formHeight || formHeight <= 0) {
			setCustomizedError(formErrors.heightError);
			return false;
		}
		if (!formLength || formLength <= 0) {
			setCustomizedError(formErrors.lengthError);
			return false;
		}
		if (!formType || formType.trim().length <= 0) {
			setCustomizedError(formErrors.typeError);
			return false;
		}
		return true;
	};

	const handleEditBox = (e) => {
		if (!selectedIds || selectedIds.length === 0) {
			return;
		}
		e.preventDefault();
		if (!isFormValid()) {
			return;
		}
		editBox({
			order: formOrder,
			width: formWidth,
			height: formHeight,
			length: formLength,
			type: formType,
		});
	};

	const deleteBoxes = () => {
		const newBoxes = boxes.filter((box) => {
			return !selectedIds.includes(box.id);
		});
		setBoxes(newBoxes);
		setSelecetedIds([]);
	};

	const addBox = () => {
		if (!isFormValid()) {
			return;
		}
		const existingIds = new Set(boxes.map((box) => box.id));
		let missingId = 0;
		while (existingIds.has(missingId)) {
			missingId++;
		}
		const newBox = {
			id: missingId,
			order: formOrder,
			type: formType,
			width: formWidth,
			height: formHeight,
			length: formLength,
			isIn: 0,
		};
		const newBoxes = [...boxes, newBox];
		setBoxes(newBoxes);
	};

	return (
		<form
			className="d-flex flex-column px-3"
			style={{
				border: "1px solid rgba(0,0,0,0.1)",
				borderRadius: "5px",
			}}
		>
			<label className="mt-3">Order:</label>
			<TextField
				className="mb-2"
				type="number"
				id="order"
				value={formOrder}
				placeholder="1"
				onChange={(e) => {
					if (!e.target.value || isNaN(e.target.value)) {
						setFormOrder("");
					} else {
						setFormOrder(parseFloat(e.target.value));
					}
				}}
			/>
			<label>Width:</label>
			<TextField
				className="mb-2"
				type="number"
				id="width"
				value={formWidth}
				placeholder="1"
				onChange={(e) => {
					if (!e.target.value || isNaN(e.target.value)) {
						setFormWidth("");
					} else {
						setFormWidth(parseFloat(e.target.value));
					}
				}}
			/>
			<label>Height:</label>
			<TextField
				className="mb-2"
				type="number"
				id="height"
				value={formHeight}
				placeholder="1"
				onChange={(e) => {
					if (!e.target.value || isNaN(e.target.value)) {
						setFormHeight("");
					} else {
						setFormHeight(parseFloat(e.target.value));
					}
				}}
			/>
			<label>Length:</label>
			<TextField
				className="mb-2"
				type="number"
				id="length"
				value={formLength}
				placeholder="1"
				onChange={(e) => {
					if (!e.target.value || isNaN(e.target.value)) {
						setFormLength("");
					} else {
						setFormLength(parseFloat(e.target.value));
					}
				}}
			/>
			<label>Type:</label>
			<TextField
				className="mb-2"
				type="text"
				id="type"
				value={formType}
				placeholder="Box 1"
				onChange={(e) => {
					if (!e.target.value || e.target.value.trim().length === 0) {
						setFormType("");
					} else {
						setFormType(e.target.value);
					}
				}}
			/>

			<div className="d-flex justify-content-between">
				<Button onClick={handleEditBox}>Edit</Button>
				<Button onClick={deleteBoxes}>Delete</Button>
				<Button onClick={addBox}>Add</Button>
			</div>
		</form>
	);
};
