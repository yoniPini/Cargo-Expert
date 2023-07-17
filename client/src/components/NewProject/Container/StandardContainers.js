import { Button } from "@mui/material";

const ContainerButton = ({ size, text, setStandardContainer }) => {
	return (
		<Button onClick={() => setStandardContainer(...size)}>
			{text}
			<br />
			{size.join(", ")}
		</Button>
	);
};

export const StandardContainers = ({ setStandardContainer }) => {
	return (
		<div className="d-flex justify-content-between mb-3">
			<ContainerButton
				size={[2, 2, 6]}
				text={"Small Size"}
				setStandardContainer={setStandardContainer}
			/>
			<ContainerButton
				size={[2, 2, 12]}
				text={"Medium Size"}
				setStandardContainer={setStandardContainer}
			/>
			<ContainerButton
				size={[2, 3, 12]}
				text={"Large Size"}
				setStandardContainer={setStandardContainer}
			/>
		</div>
	);
};
