import { Button } from "@mui/material";
import { useProject } from "../ProjectProvider.js";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ThreeSixtyOutlinedIcon from "@mui/icons-material/ThreeSixtyOutlined";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import { useState, useEffect } from "react";
import { Slider } from "@mui/material";

const BoxesButton = ({ text, onClick }) => {
	return <Button onClick={() => onClick()}>{text}</Button>;
};

const MovementIconButton = ({ icon, arg, onClick, bgColor }) => {
	return (
		<IconButton
			style={{
				backgroundColor: bgColor,
				color: "white",
			}}
			onClick={() => onClick(arg)}
		>
			{icon}
		</IconButton>
	);
};

export const EditPanel = ({ maxStepSize }) => {
	const { moveBox, rotateBox, resetBoxes, deselectBoxes, removeBoxes } =
		useProject();
	const [stepSize, setStepSize] = useState(1);
	const [unitsStepSize, setUnitsStepSize] = useState(1);
	const [tenthsStepSize, setTenthsStepSize] = useState(0);

	useEffect(() => {
		setStepSize(tenthsStepSize + unitsStepSize);
	}, [tenthsStepSize, unitsStepSize]);

	const buttonsArgs = [
		[[-stepSize, 0, 0], "x", [stepSize, 0, 0], "rgb(255, 90, 90)"],
		[[0, -stepSize, 0], "y", [0, stepSize, 0], "rgb(90, 255, 90)"],
		[[0, 0, -stepSize], "z", [0, 0, stepSize], "rgb(90, 90, 255)"],
	];

	return (
		<div
			style={{
				border: "1px solid",
				borderRadius: "20px",
				width: "60%",
				borderColor: "rgba(0, 0, 0, 0.1)",
			}}
			className="p-3 auto-mx  d-flex flex-column justify-content-center align-items-center"
		>
			<div className="w-100 d-flex mx-auto justify-content-around align-items-center">
				<ButtonGroup orientation="vertical">
					{buttonsArgs.map((args, i) => {
						return (
							<ButtonGroup
								variant="outlined"
								key={i}
							>
								<MovementIconButton
									icon={
										<ArrowBackOutlinedIcon size="small" />
									}
									arg={args[0]}
									onClick={moveBox}
									bgColor={args[3]}
								/>
								<MovementIconButton
									icon={
										<ThreeSixtyOutlinedIcon size="small" />
									}
									arg={args[1]}
									onClick={rotateBox}
									bgColor={args[3]}
								/>
								<MovementIconButton
									icon={
										<ArrowForwardOutlinedIcon size="small" />
									}
									arg={args[2]}
									onClick={moveBox}
									bgColor={args[3]}
								/>
							</ButtonGroup>
						);
					})}
				</ButtonGroup>
				<div className="d-flex flex-column">
					<BoxesButton
						text="Remove"
						onClick={removeBoxes}
					/>
					<BoxesButton
						text="Reset"
						onClick={resetBoxes}
					/>
					<BoxesButton
						text="Deselect"
						onClick={deselectBoxes}
					/>
				</div>
			</div>
			<div className="w-100 d-flex flex-column">
				<p
					style={{ fontWeight: "bold" }}
					className="mt-3 mb-1 d-flex justify-content-center"
				>
					Step Size: {stepSize}
				</p>
				<div className="w-100 d-flex">
					<p
						className="my-auto"
						style={{ width: "40%", fontWeight: "bold" }}
					>
						Units:
					</p>
					<Slider
						value={unitsStepSize}
						step={1}
						marks
						min={0}
						max={maxStepSize}
						onChange={(event) =>
							setUnitsStepSize(event.target.value)
						}
					/>
				</div>
				<div className="w-100 d-flex">
					<p
						className="my-auto"
						style={{ width: "40%", fontWeight: "bold" }}
					>
						Tenths:
					</p>
					<Slider
						value={tenthsStepSize}
						step={0.1}
						marks
						min={0}
						max={1}
						onChange={(event) =>
							setTenthsStepSize(event.target.value)
						}
					/>
				</div>
			</div>
		</div>
	);
};
