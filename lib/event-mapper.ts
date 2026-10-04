import type {OfficeEvent,WorkerState} from "./types";
export function mapCodexEvent(raw:any,workerId="codex-main"):OfficeEvent|null{
 const type=raw?.type; const item=raw?.item; let state:WorkerState="READING"; let message=type||"Codex activity";
 if(type==="turn.started") return base("READING","Starting task");
 if(type==="turn.completed") return base("DONE","Task completed");
 if(type==="turn.failed"||type==="error") return base("BLOCKED",raw?.error?.message||raw?.message||"Task failed");
 if(!type?.startsWith("item.")) return null;
 switch(item?.type){
  case "command_execution": state=/test|vitest|jest|playwright|pytest|build/i.test(item?.command||"")?"TESTING":"CODING"; message=item?.command||"Running command"; break;
  case "file_change": state="CODING"; message="Editing project files"; break;
  case "todo_list": state="READING"; message="Planning work"; break;
  case "collab_tool_call": state="REVIEWING"; message="Coordinating agent work"; break;
  case "mcp_tool_call": state="CODING"; message="Using development tool"; break;
  case "error": state="BLOCKED"; message=item?.message||"Runtime error"; break;
  default: state="READING"; message=item?.type?item.type.replaceAll("_"," "):"Processing";
 }
 return base(state,message);
 function base(s:WorkerState,m:string):OfficeEvent{return{source:"codex",workerId,workerName:"Codex",role:"AI Engineer",state:s,message:m,task:"Wedding Copilot"}}
}