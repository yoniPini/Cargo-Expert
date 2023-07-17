import { Button } from "@mui/material";

export const FileIndicator = ({ fileName, handleDelete }) => {
	return (
		<div className="d-flex m-1 justify-content-center align-items-center">
			<p className="m-3">Current File: {fileName}</p>
			{fileName ? (
				<Button onClick={() => handleDelete(null)}>Delete File</Button>
			) : null}
		</div>
	);
};
