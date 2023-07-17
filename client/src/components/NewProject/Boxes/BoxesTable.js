import { DataGrid } from "@mui/x-data-grid";
import { useMemo } from "react";

const COLUMN_WIDTH = 100;
const PAGE_SIZE = 10;
const ROWS_PER_PAGE = 10;

const columns = [
	{ field: "order", headerName: "Order", width: COLUMN_WIDTH },
	{ field: "width", headerName: "Width", width: COLUMN_WIDTH },
	{ field: "height", headerName: "Height", width: COLUMN_WIDTH },
	{ field: "length", headerName: "Length", width: COLUMN_WIDTH },
	{ field: "type", headerName: "Type", width: COLUMN_WIDTH },
];

export const BoxesTable = ({ boxes, selectedIds, setSelecetedIds }) => {
	const rows = useMemo(
		() =>
			boxes.map((box) => ({
				id: box.id,
				order: box.order,
				width: box.width,
				height: box.height,
				length: box.length,
				type: box.type,
			})),
		[boxes]
	);

	return (
		<div style={{ width: "70%", height: "500px" }}>
			<DataGrid
				rows={rows}
				columns={columns}
				pageSize={PAGE_SIZE}
				rowsPerPageOptions={ROWS_PER_PAGE}
				checkboxSelection
				disableRowSelectionOnClick
				onRowSelectionModelChange={(rows) => {
					setSelecetedIds(rows);
				}}
				rowSelectionModel={selectedIds}
			/>
		</div>
	);
};
