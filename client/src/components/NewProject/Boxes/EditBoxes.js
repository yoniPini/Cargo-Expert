import { useState } from "react";
import { BoxesTable } from "./BoxesTable.js";
import { BoxForm } from "./BoxForm";
import { Button } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { ExplanationIcon } from "../../ExplanationIcon.js";

const EDIT_BOXES_EXPLANATION_TEXT = `Boxes Table:
- You can view the boxes you uploaded.
- You can select one or multiple boxes and edit them in the form on the right.
Boxes Form:
- After selecting one or mulptiple boxes you can edit and delete them via the matching buttons.
- You can add a new box by entering the new box's details in the form and click 'ADD'
- Bottom Buttons:
- You can go back to the previous steps and edit your new project.
- You can create a new project by presing the CREATE PROJECT! button.
`;

export const EditBoxes = ({
	setNewStage,
	boxes,
	setBoxes,
	handleAddProject,
	isLoading,
	setCustomizedError,
}) => {
	const [selectedIds, setSelecetedIds] = useState([]);

	const editSelectedIds = (newBox) => {
		const newBoxes = boxes.map((box) => {
			if (selectedIds.includes(box.id)) {
				return { id: box.id, ...newBox };
			} else {
				return box;
			}
		});
		setBoxes(newBoxes);
	};

	return (
		<div className="d-flex flex-column w-100 justify-content-center align-items-center">
			<div
				className="d-flex justify-content-between "
				style={{ width: "45%" }}
			>
				<BoxesTable
					boxes={boxes}
					selectedIds={selectedIds}
					setSelecetedIds={setSelecetedIds}
				/>
				<BoxForm
					setBoxes={setBoxes}
					boxes={boxes}
					selectedIds={selectedIds}
					editBox={editSelectedIds}
					setCustomizedError={setCustomizedError}
					setSelecetedIds={setSelecetedIds}
				/>
			</div>

			<div className="w-25 mt-3 d-flex justify-content-center position-relative">
				<Button
					className="mx-4"
					onClick={() => {
						setNewStage(-1);
					}}
				>
					Back
				</Button>
				{isLoading ? (
					<CircularProgress className="mx-4" />
				) : (
					<Button
						className="mx-4"
						onClick={handleAddProject}
					>
						Create Project!
					</Button>
				)}
				<ExplanationIcon
					style={{
						position: "absolute",
						bottom: "0",
						right: "-200px",
					}}
					explanationHeader="Edit Boxes"
					explanationText={EDIT_BOXES_EXPLANATION_TEXT}
					type="dialog"
				/>
			</div>
		</div>
	);
};
