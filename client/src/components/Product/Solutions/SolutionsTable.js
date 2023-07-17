import { Button } from "@mui/material";
import { useProject } from "../ProjectProvider";
import { useUserData } from "../../UserDataProvider.js";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import { IconButton } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { SuccessSnackbar } from "../../SuccessSnackbar.js";

import {
	TableContainer,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Paper,
} from "@mui/material";
import { useState } from "react";
import { ChangeNamePopup } from "../ChangeNamePopup";
import { DeletePopup } from "../DeletePopup";
import { TableSortLabel } from "@mui/material";

const SortIcon = ({ column, sortByColumn }) => {
	const [isAscending, setIsAscending] = useState("asc");

	return (
		<TableSortLabel
			onClick={() => {
				sortByColumn(column, isAscending, setIsAscending);
			}}
			fontSize="small"
			active={true}
			direction={isAscending ? "asc" : "desc"}
		/>
	);
};

export const SolutionsTable = ({ title }) => {
	const { solutions, setSolutionId, projectId } = useProject();
	const {
		deleteSolution,
		duplicateSolution,
		updateSolutionName,
		isLoading,
		setCustomizedError,
		error,
	} = useUserData();

	const [tableSolutionId, setTableSolutionId] = useState(null);
	const [showChangeNamePopup, setShowChangeNamePopup] = useState(false);
	const [showDeletePopup, setShowDeletePopup] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [tableData, setTableData] = useState([]);
	// const [isAscending, setIsAscending] = useState(true);

	useEffect(() => {
		if (solutions !== null && solutions.length !== 0) {
			setTableData(
				solutions.map((solution) => {
					return {
						id: solution.id,
						name: solution.name,
						number_of_items: solution.solution_data.number_of_items,
						capacity: solution.solution_data.capacity,
						order_score: solution.solution_data.order_score,
						overall_score: solution.solution_data.overall_score,
						solution_data: solution.solution_data,
					};
				})
			);
		}
	}, [solutions]);

	if (solutions == null || solutions.length === 0) {
		return <h3>There are no solutions, please create a new project</h3>;
	}

	const handleClick = (index) => {
		setSolutionId(index);
	};

	const getSolutionById = (id) => {
		for (let i = 0; i < solutions.length; i++) {
			if (solutions[i].id === id) {
				return solutions[i];
			}
		}
		return null;
	};

	const handleChangeName = (id, name) => {
		const solution = getSolutionById(id);
		if (solution !== null) {
			const newSolution = {
				...solution,
				name: name,
			};
			updateSolutionName(projectId, newSolution);
			setSnackbarMessage(`Changed name to ${name}`);
		}
	};

	const handleDelete = (id) => {
		const deleteSpecificSolution = deleteSolution(projectId);
		deleteSpecificSolution(id);
		if (error === "") {
			setSnackbarMessage(`Deleted Solution successfully`);
		}
	};

	const sortByColumn = (column, isAscending, setIsAscending) => {
		setIsAscending((prevIsAscending) => !prevIsAscending);
		const sorted = [...tableData].sort((a, b) => {
			const valueA = a[column];
			const valueB = b[column];

			if (typeof valueA === "string" && typeof valueB === "string") {
				return isAscending
					? valueA.localeCompare(valueB)
					: valueB.localeCompare(valueA);
			}

			return isAscending ? valueA - valueB : valueB - valueA;
		});
		setTableData(sorted);
	};

	return (
		<div className="w-100 ">
			<TableContainer component={Paper}>
				<Table
					aria-label="projects table"
					stickyHeader
				>
					<TableHead>
						<TableRow>
							<TableCell style={{ fontWeight: "bold" }}>
								{title} - Solution
								<SortIcon
									column="name"
									sortByColumn={sortByColumn}
								/>
							</TableCell>
							<TableCell style={{ fontWeight: "bold" }}>
								Number Of Items
								<SortIcon
									column="number_of_items"
									sortByColumn={sortByColumn}
								/>
							</TableCell>
							<TableCell style={{ fontWeight: "bold" }}>
								Capacity
								<SortIcon
									column="capacity"
									sortByColumn={sortByColumn}
								/>
							</TableCell>
							<TableCell style={{ fontWeight: "bold" }}>
								Order Score
								<SortIcon
									column="order_score"
									sortByColumn={sortByColumn}
								/>
							</TableCell>
							<TableCell style={{ fontWeight: "bold" }}>
								Overall Score
								<SortIcon
									column="overall_score"
									sortByColumn={sortByColumn}
								/>
							</TableCell>
							<TableCell style={{ fontWeight: "bold" }}>
								Change Name
							</TableCell>
							<TableCell style={{ fontWeight: "bold" }}>
								Duplicate
							</TableCell>
							{solutions.length !== 1 ? (
								<TableCell style={{ fontWeight: "bold" }}>
									Delete
								</TableCell>
							) : null}
						</TableRow>
					</TableHead>
					<TableBody>
						{tableData.map((row) => {
							return (
								<TableRow key={row.id}>
									<TableCell>
										<Button
											style={{
												justifyContent: "flex-start",
												textAlign: "left",
											}}
											onClick={() => {
												handleClick(row.id);
											}}
										>
											{row.name}
										</Button>
									</TableCell>
									<TableCell>{row.number_of_items}</TableCell>
									<TableCell>{row.capacity}</TableCell>
									<TableCell>{row.order_score}</TableCell>
									<TableCell>{row.overall_score}</TableCell>

									<TableCell>
										{isLoading ? (
											<CircularProgress />
										) : (
											<IconButton
												onClick={() => {
													setShowChangeNamePopup(
														true
													);
													setTableSolutionId(row.id);
												}}
											>
												<EditOutlinedIcon
													color="primary"
													size="small"
												></EditOutlinedIcon>
											</IconButton>
										)}
									</TableCell>
									<TableCell>
										{isLoading ? (
											<CircularProgress />
										) : (
											<IconButton
												onClick={() => {
													duplicateSolution(
														projectId,
														row.id
													);
													setSnackbarMessage(
														`Duplicated solution`
													);
												}}
											>
												<ContentCopyOutlinedIcon
													color="primary"
													size="small"
												></ContentCopyOutlinedIcon>
											</IconButton>
										)}
									</TableCell>

									{solutions.length !== 1 ? (
										<TableCell>
											{isLoading ? (
												<CircularProgress />
											) : (
												<IconButton
													onClick={() => {
														setShowDeletePopup(
															true
														);
														setTableSolutionId(
															row.id
														);
													}}
												>
													<DeleteOutlineIcon
														color="primary"
														size="small"
													></DeleteOutlineIcon>
												</IconButton>
											)}
										</TableCell>
									) : null}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
			{showChangeNamePopup ? (
				<ChangeNamePopup
					text="Change Solution Name"
					id={tableSolutionId}
					onSubmit={handleChangeName}
					onClose={() => setShowChangeNamePopup(false)}
					setCustomizedError={setCustomizedError}
				/>
			) : null}
			{showDeletePopup ? (
				<DeletePopup
					text="Delete Solution?"
					id={tableSolutionId}
					onSubmit={handleDelete}
					onClose={() => {
						setShowDeletePopup(false);
					}}
					setCustomizedError={setCustomizedError}
				/>
			) : null}
			<SuccessSnackbar
				open={snackbarMessage !== ""}
				text={snackbarMessage}
				setOpen={() => setSnackbarMessage("")}
			/>
		</div>
	);
};
