import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export const SuccessSnackbar = ({ open, setOpen, text }) => {
	return (
		<div>
			<Snackbar
				open={open}
				autoHideDuration={4000}
				onClose={() => {
					setOpen(false);
				}}
			>
				<MuiAlert
					variant="filled"
					color="success"
					onClose={() => {
						setOpen(false);
					}}
					style={{ color: "white", backgroundColor: "#00CC00" }}
					severity="success"
					sx={{ width: "100%" }}
					elevation={6}
				>
					{text}
				</MuiAlert>
			</Snackbar>
		</div>
	);
};
