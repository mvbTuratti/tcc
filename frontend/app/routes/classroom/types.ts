// routes/classroom/types.ts
export interface Post {
    id: string;
    text: string;
  }
  
  export interface ClassDate {
    date: string;
    startHour: string;
    finalHour: string;
  }
  
  export interface Student {
    id: string;
    name: string;
    email: string;
    status: "regular" | "pending" | "blocked";
  }
  