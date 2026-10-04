export type WorkerState="IDLE"|"READING"|"CODING"|"TESTING"|"REVIEWING"|"DEPLOYING"|"BLOCKED"|"DONE";
export type OfficeSource="codex"|"github"|"vercel"|"demo";
export type OfficeEvent={id?:string;source:OfficeSource;workerId:string;workerName?:string;role?:string;state:WorkerState;message:string;task?:string;createdAt?:string;meta?:Record<string,unknown>};
export type WorkerSnapshot={id:string;name:string;role:string;state:WorkerState;message:string;updatedAt:string};
