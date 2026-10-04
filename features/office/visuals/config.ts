export type Vec3=[number,number,number];
export type OfficeRow={id:string;source?:string;worker_id:string;worker_name:string;role:string;state:string;message:string;task?:string;created_at:string};
export const SPOTS:Record<string,Vec3>={IDLE:[0,0,3.45],READING:[0,0,.55],CODING:[-3.48,0,-1.18],TESTING:[3.34,0,-1.18],REVIEWING:[3.18,0,1.18],DEPLOYING:[-3.55,0,2.92],BLOCKED:[0,0,3.45],DONE:[-3.55,0,2.92]};
export const OUTFITS=["#526ef5","#23a873","#e5a83d","#a85bd4","#d85d7f","#36a6b8"];
export const SKINS=["#d8a47f","#c98f6f","#e1b394","#b97d5d","#d6a07b"];
export const HAIRS=["#29231f","#17191d","#4c3427","#6b4935","#1f2530"];
export const TROUSERS=["#202633","#303847","#27323c","#3b3542"];
export function stateColor(state:string){return state==="BLOCKED"?"#ff6269":state==="DONE"?"#9e8cff":state==="DEPLOYING"?"#b291ff":state==="TESTING"?"#54d99b":state==="REVIEWING"?"#efb85d":state==="READING"?"#62b4ff":"#6682ff"}
export function identityHash(value:string){let h=2166136261;for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
export function characterPhase(value:string){return(identityHash(value)%6283)/1000}
export function profileFor(workerId:string,_index=0){const h=identityHash(workerId);return{outfit:OUTFITS[h%OUTFITS.length],skin:SKINS[(h>>>3)%SKINS.length],hair:HAIRS[(h>>>6)%HAIRS.length],hairStyle:(h>>>9)%4,trouser:TROUSERS[(h>>>11)%TROUSERS.length],topStyle:["tee","hoodie","jacket"][(h>>>13)%3] as "tee"|"hoodie"|"jacket",bottomStyle:["pants","cuffed","shorts"][(h>>>15)%3] as "pants"|"cuffed"|"shorts",glasses:!!((h>>>17)&1),headset:!!((h>>>18)&1),backpack:!!((h>>>19)&1)}}
export function roleAccent(role:string,state?:string){if(state==="BLOCKED")return"#ff6269";const r=role.toLowerCase();if(r.includes("customer")||r.includes("ops"))return"#9f8cff";if(r.includes("qa")||r.includes("test")||r.includes("action"))return"#54d99b";if(r.includes("review"))return"#efb85d";if(r.includes("deploy")||r.includes("release")||r.includes("vercel"))return"#a58aff";if(r.includes("ambient")||r.includes("facilities"))return"#718198";return"#6682ff"}
const SLOT_OFFSETS:Record<string,Vec3[]>={CODING:[[0,0,0],[-.46,0,.22],[.46,0,.22]],TESTING:[[0,0,0],[-.46,0,.24],[.46,0,.24]],REVIEWING:[[0,0,0],[-.58,0,.38],[.58,0,.38]],DEPLOYING:[[0,0,0],[-.5,0,.28],[.5,0,.28]],READING:[[0,0,0],[-.56,0,.28],[.56,0,.28]],IDLE:[[0,0,0],[-.65,0,.28],[.65,0,.28]],BLOCKED:[[0,0,0],[-.65,0,.28],[.65,0,.28]],DONE:[[0,0,0],[-.48,0,.26],[.48,0,.26]]};
export function workstationFor(row:OfficeRow):Vec3{const base=SPOTS[row.state]||SPOTS.READING,slots=SLOT_OFFSETS[row.state]||[[0,0,0]],slot=slots[identityHash(row.worker_id)%slots.length];return[base[0]+slot[0],base[1]+slot[1],base[2]+slot[2]]}
