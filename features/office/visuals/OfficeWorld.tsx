"use client";
import {Agent} from "./Agent";
import {OfficeEnvironment} from "./Environment";
import {SPOTS,type OfficeRow} from "./config";
export function OfficeWorld({workers,selected,onSelect}:{workers:OfficeRow[];selected:string|null;onSelect:(id:string)=>void}){const activity={coding:workers.some(w=>w.state==="CODING"),testing:workers.some(w=>w.state==="TESTING"),review:workers.some(w=>w.state==="REVIEWING"),done:workers.some(w=>w.state==="DONE"),blocked:workers.some(w=>w.state==="BLOCKED")};return <group><OfficeEnvironment activity={activity}/>{workers.map((worker,index)=><Agent key={worker.worker_id} row={worker} index={index} target={SPOTS[worker.state]||SPOTS.READING} selected={selected===worker.worker_id} onSelect={()=>onSelect(worker.worker_id)}/>)}</group>}
