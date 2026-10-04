export type WorkerState="IDLE"|"READING"|"CODING"|"TESTING"|"REVIEWING"|"BLOCKED"|"DONE";
export type OfficeEvent={id?:string;source:"codex"|"github"|"vercel"|"demo";workerId:string;workerName?:string;role?:string;state:WorkerState;message:string;task?:string;createdAt?:string};
export type WorkerSnapshot={id:string;name:string;role:string;state:WorkerState;message:string;updatedAt:string};