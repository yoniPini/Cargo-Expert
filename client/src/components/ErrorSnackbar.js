import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export const ErrorSnackbar = ({ open, setOpen, text }) => {
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
					color="error"
					onClose={() => {
						setOpen(false);
					}}
					style={{ color: "white", backgroundColor: "#EE2222" }}
					severity="error"
					sx={{ width: "100%" }}
					elevation={6}
				>
					{text}
				</MuiAlert>
			</Snackbar>
		</div>
	);
};
