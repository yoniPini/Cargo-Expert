import { useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	DialogActions,
	Button,
} from "@mui/material";

export const ChangeNamePopup = ({
	text,
	id,
	onSubmit,
	onClose,
	setCustomizedError,
}) => {
	const [name, setName] = useState("");

	const handleSubmit = () => {
		if (name && name.trim().length !== 0) {
			onSubmit(id, name);
		} else {
			setCustomizedError("Name can not be empty");
		}
		onClose();
	};

	return (
		<Dialog
			open={true}
			onClose={onClose}
		>
			<DialogTitle>{text}</DialogTitle>
			<DialogContent>
				<TextField
					className="mt-2"
					label="New Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</DialogContent>
			<DialogActions className="d-flex justify-content-center">
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSubmit}>Save</Button>
			</DialogActions>
		</Dialog>
	);
};
