import Papa from "papaparse";
import { Button } from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { DownloadFile } from "./DownloadFile";
import { useState, useEffect, useCallback } from "react";

const CONTAINER_ERROR = "There is a problem with the container";
const BOXES_ERROR = "There is a problem with the boxes";
const FILE_ERROR = "There was an error pasring the file";
const FILE_UPLOAD_PAGE_TEXT = `You may upload a CSV file which contains the information about 
your container and boxes. You may find an example file here:`;

export const FileUpload = ({
	setNewStage,
	setContainer,
	setBoxes,
	setCustomizedError,
}) => {
	const [fileName, setFileName] = useState(null);

	const handleDelete = useCallback(() => {
		setContainer([]);
		setBoxes([]);
		setFileName(null);
	}, [setContainer, setBoxes, setFileName]);

	useEffect(() => {
		handleDelete();
	}, [handleDelete]);

	const parseData = (data) => {
		try {
			let numeric_data = [];
			for (let i = 0; i < data.length; i++) {
				let numberic_object = {};
				for (let property in data[i]) {
					const value = data[i][property];
					if (value && value.trim().length !== 0 && !isNaN(value)) {
						numberic_object[property] = parseFloat(value);
					} else {
						numberic_object[property] = value.trim();
					}
				}
				numberic_object = {
					id: i,
					...numberic_object,
					color: "",
					isIn: 0,
				};
				if (
					Object.values(numberic_object).includes(null) ||
					Object.values(numberic_object).includes(undefined)
				) {
					setCustomizedError(BOXES_ERROR);
					return;
				}
				numeric_data.push(numberic_object);
			}

			let container_data = {
				width: numeric_data[0]["width"],
				height: numeric_data[0]["height"],
				length: numeric_data[0]["length"],
			};

			if (
				container_data.height == null ||
				container_data.width == null ||
				container_data.length == null
			) {
				setCustomizedError(CONTAINER_ERROR);
				return;
			}

			let boxes = [];
			for (let i = 1; i < numeric_data.length; i++) {
				boxes.push(numeric_data[i]);
			}
			setContainer(Object.values(container_data));
			setBoxes(boxes);
		} catch (err) {
			setCustomizedError(FILE_ERROR);
		}
	};

	const handleDrop = (files) => {
		try {
			Papa.parse(files[0], {
				header: true,
				skipEmptyLines: true,
				complete: function (results) {
					parseData(results.data);
				},
			});
		} catch (e) {
			alert(FILE_ERROR);
		}
	};

	return (
		<div className="d-flex flex-column align-items-center w-25">
			<p className="mb-0 text-center">{FILE_UPLOAD_PAGE_TEXT}</p>
			<DownloadFile setCustomizedError={setCustomizedError} />
			<DropzoneArea
				dropzoneClass={
					"px-4 text-secondary d-flex align-items-center w-100"
				}
				acceptedFiles={["text/csv"]}
				dropzoneParagraphClass={fileName ? "fw-bold" : ""}
				dropzoneText={
					fileName
						? `${fileName} was uploaded successfully`
						: `Drop a CSV file or click to upload your file!`
				}
				filesLimit={1}
				maxFileSize={5000000}
				showAlerts={false}
				showPreviews={false}
				showFileNamesInPreview={false}
				showPreviewsInDropzone={false}
				showFileNames={false}
				getFileAddedMessage={(fileName) => {
					setFileName(fileName);
					return `CSV file ${fileName} added`;
				}}
				getFileRemovedMessage={(fileName) => {
					setFileName(null);
					return `CSV file ${fileName} removed`;
				}}
				onDrop={(files) => handleDrop(files)}
				onDelete={handleDelete}
				alertSnackbarProps={{}}
			/>

			<div className="w-100 d-flex justify-content-between">
				<Button onClick={() => setNewStage(-1)}>Back</Button>
				<Button onClick={() => setNewStage(1)}>Continue</Button>
			</div>
		</div>
	);
};
