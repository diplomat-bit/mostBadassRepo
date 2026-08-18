// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/types/models/platform/project.ts
================================================================================

// types/models/platform/project.ts
export type ProjectStatus = 'Backlog' | 'In Progress' | 'Review' | 'Done';

export interface ProjectTask {
    id: string;
    title: string;
    status: ProjectStatus;
    assignee: string;
}

export interface Project {
    id: string;
    name: string;
    tasks: ProjectTask[];
}