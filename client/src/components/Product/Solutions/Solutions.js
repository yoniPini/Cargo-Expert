import { SolutionsTable } from "./SolutionsTable";
import { useProject } from "../ProjectProvider";

export const Solutions = () => {
	const { getCurrentProjectName } = useProject();

	const projectName = getCurrentProjectName();

	return (
		<div>
			<SolutionsTable title={projectName} />
		</div>
	);
};
