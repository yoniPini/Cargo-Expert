import { Projects } from "./Projects/Projects";
import { Solutions } from "./Solutions/Solutions";
import { SolutionView } from "./View/SolutionView";
import { useProject } from "./ProjectProvider";

export const Project = () => {
	const { projectId, solutionId } = useProject();

	return (
		<div>
			{projectId === null && solutionId === null ? <Projects /> : null}
			{projectId !== null && solutionId === null ? <Solutions /> : null}
			{projectId !== null && solutionId !== null ? (
				<SolutionView />
			) : null}
		</div>
	);
};
