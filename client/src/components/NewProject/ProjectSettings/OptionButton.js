import { Button } from "@mui/material";

export const OptionButton = ({ preference, option, setOption }) => {
	return (
		<Button
			style={{
				width: "50%",
			}}
			className="mx-1"
			variant={preference === option ? "contained" : "outlined"}
			onClick={() => setOption(option)}
		>
			{option}
		</Button>
	);
};
