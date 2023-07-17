import {
	TableContainer,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Paper,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import { Button } from "@mui/material";
import { useMemo } from "react";

export const BoxesViewTableImproved = ({ isEdit, boxes, toggleIsIn, isIn }) => {
	const rows = useMemo(
		() =>
			boxes.map((box) => ({
				id: box.id,
				order: box.order,
				width: box.size[0],
				height: box.size[1],
				length: box.size[2],
				type: box.type,
			})),
		[boxes]
	);

	return (
		<>
			<h6>
				<strong>
					{isIn
						? "Boxes in the solution"
						: "Boxes out of the solution"}
				</strong>
			</h6>
			<div
				style={{
					height: "35vh",
					width: "400px",
				}}
			>
				<TableContainer
					component={Paper}
					sx={{
						backgroundColor: "#f3f3f3",
						height: "35vh",
						width: "400px",
					}}
				>
					<Table
						aria-label="projects table"
						size="small"
						stickyHeader
					>
						<TableHead>
							<TableRow>
								<TableCell>Order</TableCell>
								<TableCell>W</TableCell>
								<TableCell>H</TableCell>
								<TableCell>L</TableCell>
								<TableCell>Type</TableCell>
								{isEdit ? <TableCell>Action</TableCell> : null}
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row) => {
								return (
									<TableRow
										key={row.id}
										sx={{
											"&:last-child td, &:last-child th":
												{
													border: 0,
												},
										}}
									>
										<TableCell>{row.order}</TableCell>
										<TableCell>{row.width}</TableCell>
										<TableCell>{row.height}</TableCell>
										<TableCell>{row.length}</TableCell>
										<TableCell>{row.type}</TableCell>
										{isEdit ? (
											<TableCell>
												<Button
													onClick={() => {
														toggleIsIn(row.id);
													}}
												>
													{isIn ? (
														<RemoveOutlinedIcon size="small" />
													) : (
														<AddOutlinedIcon size="small" />
													)}
												</Button>
											</TableCell>
										) : null}
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</>
	);
};
