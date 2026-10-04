import type {Vec3} from "../visuals/config";
export type DistrictId="engineering"|"qa"|"review"|"deploy"|"lounge"|"kitchen"|"ops-registration"|"ops-nurture"|"ops-checkout"|"ops-subscribers"|"ops-attention";
export type District={id:DistrictId;label:string;center:Vec3;color:string;camera:Vec3};
export const DISTRICTS:Record<DistrictId,District>={
 engineering:{id:"engineering",label:"Engineering",center:[-5.2,0,-2.62],color:"#6682ff",camera:[-2.2,8.4,9.5]},
 qa:{id:"qa",label:"QA Lab",center:[5.2,0,-2.62],color:"#58dba1",camera:[8,8.2,9.3]},
 review:{id:"review",label:"Review",center:[5.25,0,1.02],color:"#efb85d",camera:[8,7.9,9.8]},
 deploy:{id:"deploy",label:"Deploy",center:[-5.35,0,1.62],color:"#a58aff",camera:[-8,8,9.6]},
 lounge:{id:"lounge",label:"Lounge",center:[0,0,1.15],color:"#7fa6d9",camera:[3.2,8.2,10.5]},
 kitchen:{id:"kitchen",label:"Kitchen",center:[6.45,0,-.2],color:"#d5aa63",camera:[9.2,7.8,8.8]},
 "ops-registration":{id:"ops-registration",label:"Registration",center:[14.5,0,-2.75],color:"#66b7ff",camera:[17.4,8.8,9.8]},
 "ops-nurture":{id:"ops-nurture",label:"No Subscription",center:[14.5,0,2.65],color:"#7b8798",camera:[17.4,8.6,10.2]},
 "ops-checkout":{id:"ops-checkout",label:"Checkout",center:[20,0,-2.75],color:"#efb85d",camera:[23,8.8,9.8]},
 "ops-subscribers":{id:"ops-subscribers",label:"Subscribers",center:[25.5,0,2.65],color:"#9f8cff",camera:[28.2,8.8,10.2]},
 "ops-attention":{id:"ops-attention",label:"Attention",center:[25.5,0,-2.75],color:"#ff636b",camera:[28.2,8.8,9.8]}
};
export function districtForState(state:string):DistrictId{return state==="CODING"?"engineering":state==="TESTING"?"qa":state==="REVIEWING"?"review":state==="DEPLOYING"||state==="DONE"?"deploy":state==="BLOCKED"?"lounge":"lounge"}
