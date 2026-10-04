import type {Vec3} from "../visuals/config";
export type DistrictId="engineering"|"qa"|"review"|"deploy"|"lounge"|"kitchen"|"ops-registration"|"ops-nurture"|"ops-checkout"|"ops-subscribers"|"ops-attention";
export type District={id:DistrictId;label:string;center:Vec3;color:string;camera:Vec3};
export const DISTRICTS:Record<DistrictId,District>={
 engineering:{id:"engineering",label:"Engineering",center:[-3.55,0,-1.4],color:"#6682ff",camera:[-1.2,7.8,8.8]},
 qa:{id:"qa",label:"QA Lab",center:[3.45,0,-1.4],color:"#58dba1",camera:[5.5,7.6,8.5]},
 review:{id:"review",label:"Review",center:[3.15,0,1.7],color:"#efb85d",camera:[6.3,7.2,8.3]},
 deploy:{id:"deploy",label:"Deploy",center:[-3.7,0,2.8],color:"#a58aff",camera:[-6.2,7.4,8.3]},
 lounge:{id:"lounge",label:"Lounge",center:[0,0,3],color:"#7fa6d9",camera:[2.8,7.2,9]},
 kitchen:{id:"kitchen",label:"Kitchen",center:[4.65,0,3.1],color:"#d5aa63",camera:[7.6,7.2,9]},
 "ops-registration":{id:"ops-registration",label:"Registration",center:[12.35,0,-2.55],color:"#66b7ff",camera:[15,8.2,8.8]},
 "ops-nurture":{id:"ops-nurture",label:"No Subscription",center:[12.45,0,2.45],color:"#7b8798",camera:[15,8,9.5]},
 "ops-checkout":{id:"ops-checkout",label:"Checkout",center:[17,0,-2.65],color:"#efb85d",camera:[19.5,8.2,8.6]},
 "ops-subscribers":{id:"ops-subscribers",label:"Subscribers",center:[21.45,0,2.35],color:"#9f8cff",camera:[24,8.2,9.5]},
 "ops-attention":{id:"ops-attention",label:"Attention",center:[21.45,0,-2.65],color:"#ff636b",camera:[24,8.2,8.5]}
};
export function districtForState(state:string):DistrictId{return state==="CODING"?"engineering":state==="TESTING"?"qa":state==="REVIEWING"?"review":state==="DEPLOYING"||state==="DONE"?"deploy":state==="BLOCKED"?"lounge":"lounge"}
