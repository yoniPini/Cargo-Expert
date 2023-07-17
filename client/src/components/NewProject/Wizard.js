import { Stepper, Step, StepLabel } from "@material-ui/core";

export const Wizard = ({ stage }) => {
	return (
		<div>
			<Stepper
				style={{
					fontFamily: "Arial, Helvetica, sans-serif",
					color: "#3a4750",
					backgroundColor: "#f3f3f3",
				}}
				activeStep={stage}
				alternativeLabel
			>
				<Step>
					<StepLabel>Project Settings</StepLabel>
				</Step>
				<Step>
					<StepLabel>Upload File</StepLabel>
				</Step>
				<Step>
					<StepLabel>Edit Container</StepLabel>
				</Step>
				<Step>
					<StepLabel>Edit Boxes</StepLabel>
				</Step>
			</Stepper>
		</div>
	);
};
