// routes/classroom/types.ts
export interface Post {
    id: number;
    text: string;
  }
  
  export interface ClassDate {
    date: string;
    startHour: string;
    finalHour: string;
  }
  
  export interface Student {
    id: number;
    name: string;
    email: string;
    status: "regular" | "pending" | "blocked";
  }
  