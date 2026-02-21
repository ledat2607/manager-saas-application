import NoDataFound from "@/components/noData-found";
import type { Project } from "@/types";

import ProjectCard from "../project/project-card";

interface ProjectListProps {
  workspaceId: string;

  projects: Project[];
  onCreateProject: () => void;
}

const ProjectList = ({
  workspaceId,
  projects,
  onCreateProject,
}: ProjectListProps) => {
  return (
    <div>
      <h3 className="text-2xl font-medium text-balance">Projects</h3>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <NoDataFound
            title="No project found"
            description="Create new project to get started"
            buttonAction={onCreateProject}
            buttonText="Create Project"
          />
        ) : (
          projects.map((project) => {
            const progress = 0;
            return (
              <ProjectCard
                key={project._id}
                project={project}
                progress={progress}
                workspaceId={workspaceId}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProjectList;
