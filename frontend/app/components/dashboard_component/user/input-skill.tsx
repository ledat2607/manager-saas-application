import React, { useState } from "react";
import { X, Plus, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SKILL_SUGGESTIONS = [
  // Frontend
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "Svelte",
  "TypeScript",
  "JavaScript",
  "HTML5",
  "CSS3",
  "Tailwind CSS",
  "Sass",
  "Redux",
  "Zustand",
  "TanStack Query",

  // Backend & Database
  "Node.js",
  "Express.js",
  "NestJS",
  "Python",
  "Django",
  "FastAPI",
  "Go",
  "Rust",
  "Java",
  "Spring Boot",
  "PHP",
  "Laravel",
  "PostgreSQL",
  "MongoDB",
  "MySQL",
  "Redis",

  // DevOps & Cloud
  "Docker",
  "Kubernetes",
  "AWS",
  "Google Cloud",
  "Azure",
  "Firebase",
  "Vercel",
  "CI/CD",
  "GitHub Actions",
  "Terraform",
  "Nginx",

  // Tools & Design
  "Git",
  "GitHub",
  "GitLab",
  "Figma",
  "Adobe XD",
  "Postman",
  "Swagger",
  "Jira",

  // Soft Skills & Management
  "Agile",
  "Scrum",
  "Project Management",
  "Teamwork",
  "Problem Solving",
  "Communication",
  "Time Management",
  "Leadership",
];

export function SkillInput({
  selectedSkills,
  onChange,
}: {
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      onChange([...selectedSkills, trimmed]);
    }
    setInputValue("");
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(selectedSkills.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="space-y-4">
      {/* Ô nhập và hiển thị Tags */}
      <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-dashed bg-background/50 focus-within:border-indigo-500 transition-all">
        {selectedSkills.map((skill) => (
          <Badge
            key={skill}
            className="bg-indigo-500/10 text-indigo-600 rounded-md hover:bg-indigo-500/20 border-indigo-200 gap-1 p-1 flex items-center"
          >
            {skill}
            {/* <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => removeSkill(skill)}
              className="hover:bg-indigo-200"
            >
              <X className="size-3" />
            </Button> */}
          </Badge>
        ))}
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill(inputValue);
            }
          }}
          placeholder="Type a skill and press Enter..."
          className="flex-1 bg-transparent outline-none text-sm min-w-30"
        />
      </div>

      {/* Danh sách gợi ý */}
      {inputValue && (
        <div className="flex items-center gap-4 animate-in fade-in ">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Lightbulb className="h-3 w-3" /> Suggestions:
          </span>
          {SKILL_SUGGESTIONS.filter(
            (s) =>
              s.toLowerCase().includes(inputValue.toLowerCase()) &&
              !selectedSkills.includes(s),
          ).map((suggestion) => (
            <Button
              key={suggestion}
              size={"sm"}
              onClick={() => addSkill(suggestion)}
              className="text-xs bg-blue-400 hover:bg-indigo-100 hover:text-indigo-600 rounded-md transition-colors"
            >
              + {suggestion}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
