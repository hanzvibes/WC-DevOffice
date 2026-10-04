import type {Vec3} from "./types";
export const STATIONS:Record<string,Vec3>={IDLE:[0,0,3.65],READING:[0,0,.35],CODING:[-4.05,0,-1.65],TESTING:[4.05,0,-1.65],REVIEWING:[3.65,0,2.25],BLOCKED:[0,0,3.65],DONE:[-3.75,0,2.45]};
export const stateColor=(s:string)=>s==="BLOCKED"?"#ff5f66":s==="DONE"?"#a58aff":s==="TESTING"?"#58dba1":s==="REVIEWING"?"#f1b85b":"#6682ff";
