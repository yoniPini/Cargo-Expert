import { Project } from "./Project";
import { ProjectProvider } from "./ProjectProvider";

export const Product = () => {
	return (
		<div>
			<ProjectProvider>
				<Project />
			</ProjectProvider>
		</div>
	);
};
