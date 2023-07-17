import { OptionButton } from "./OptionButton";
import { ExplanationIcon } from "../../ExplanationIcon.js";

const PREFERENCES_PANEL_EXPLANATION_TEXT = `Select your preferences:

Order: This preference prioritizes the arrangement of the boxes to match the order in which you entered them.

Quantity: This preference focuses on maximizing the number of boxes inside the container.

Time: This preference aims to minimize the waiting time for a solution.

Quality: This preference emphasizes waiting for as long as necessary to achieve an optimal solution.`;

export const PreferencesPanel = ({
	preference,
	setPreference,
	options,
	text,
}) => {
	return (
		<div className="my-2">
			<div className="d-flex justify-content-between align-items-center">
				<label className="mb-1">{text}</label>
				<ExplanationIcon
					explanationHeader="Preference Panel"
					explanationText={PREFERENCES_PANEL_EXPLANATION_TEXT}
					type="dialog"
				/>
			</div>
			<div className="mx-auto w-100 d-flex  justify-content-between">
				{options.map((option, i) => {
					return (
						<OptionButton
							key={i}
							className="mx-1"
							preference={preference}
							option={option}
							setOption={setPreference}
						/>
					);
				})}
			</div>
		</div>
	);
};
