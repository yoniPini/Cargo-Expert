import { View } from "./View";
import { EditProvider } from "./EditProvider";

export const SolutionView = () => {
	return (
		<div>
			<EditProvider>
				<View />
			</EditProvider>
		</div>
	);
};
