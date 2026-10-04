import {NextRequest,NextResponse} from "next/server";
const url="https://aeahvnsjggazjpvaupan.supabase.co";
const key="sb_publishable_Ve2yGJoFM6PdkpTRec-Q6Q_BjI-KfrA";
const headers={"apikey":key,"Authorization":`Bearer ${key}`,"Content-Type":"application/json"};
export const dynamic="force-dynamic";
export async function GET(){
 const r=await fetch(`${url}/rest/v1/rpc/get_dev_office_events`,{method:"POST",headers,body:JSON.stringify({event_limit:80}),cache:"no-store"});
 const events=await r.json();return NextResponse.json({events:Array.isArray(events)?events:[],configured:true},{status:r.ok?200:r.status});
}
export async function POST(req:NextRequest){
 const bridgeToken=req.headers.get("x-bridge-token");if(!bridgeToken)return NextResponse.json({error:"Missing bridge token"},{status:401});
 const body=await req.json();
 const payload={bridge_token:bridgeToken,p_source:body.source||"codex",p_worker_id:body.workerId||"codex-main",p_worker_name:body.workerName||"Codex",p_role:body.role||"AI Engineer",p_state:body.state||"READING",p_message:String(body.message||"Activity"),p_task:String(body.task||"Wedding Copilot")};
 const r=await fetch(`${url}/rest/v1/rpc/push_dev_office_event`,{method:"POST",headers,body:JSON.stringify(payload)});
 if(!r.ok)return NextResponse.json({error:"Rejected event"},{status:r.status===400?401:r.status});
 return NextResponse.json({id:await r.json(),ok:true});
}