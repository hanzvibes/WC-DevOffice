"use client";
import{Agent}from"./Agent";
import{OfficeEnvironment}from"./Environment";
import{CustomerOpsWing}from"./CustomerOpsWing";
import{SPOTS,type OfficeRow}from"./config";
import type{OpsMetrics,OpsUser}from"../../../lib/customer-ops/types";

export function OfficeWorld({workers,selected,onSelect,opsUsers,opsMetrics,opsUnlocked,selectedCustomer,onSelectCustomer,mobile}:{workers:OfficeRow[];selected:string|null;onSelect:(id:string)=>void;opsUsers:OpsUser[];opsMetrics:OpsMetrics|null;opsUnlocked:boolean;selectedCustomer:string|null;onSelectCustomer:(id:string)=>void;mobile:boolean}){
 const activity={coding:workers.some(w=>w.state==="CODING"),testing:workers.some(w=>w.state==="TESTING"),review:workers.some(w=>w.state==="REVIEWING"),done:workers.some(w=>w.state==="DONE"),blocked:workers.some(w=>w.state==="BLOCKED")};
 return <group>
  <OfficeEnvironment activity={activity}/>
  <CustomerOpsWing users={opsUsers} metrics={opsMetrics} unlocked={opsUnlocked} selected={selectedCustomer} onSelect={onSelectCustomer} mobile={mobile}/>
  {workers.map((worker,index)=><Agent key={worker.worker_id} row={worker} index={index} target={SPOTS[worker.state]||SPOTS.READING} selected={selected===worker.worker_id} onSelect={()=>onSelect(worker.worker_id)} mobile={mobile}/>) }
 </group>
}
