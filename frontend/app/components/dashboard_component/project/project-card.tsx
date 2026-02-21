import type { Project } from "@/types";
import React from "react";

interface ProjectCardProps {
  workspaceId: string;
  project: Project;
  progress: number;
  key: string;
}

const ProjectCard = ({
  workspaceId,
  project,
  progress,
  key,
}: ProjectCardProps) => {
  return <div>ProjectCard</div>;
};

export default ProjectCard;
