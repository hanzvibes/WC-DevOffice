"use client";
import{Agent}from"./Agent";
import{ClawAssetWorld}from"./ClawAssets";
import{CustomerOpsWing}from"./CustomerOpsWing";
import{AmbientNPCs}from"./AmbientNPCs";
import{NavigationSystem}from"../systems/NavigationSystem";
import{VisualSystems}from"../systems/visualSystems";
import{SPOTS,type OfficeRow,type Vec3}from"./config";
import type{LayoutItem}from"../runtime/layout";
import type{OpsMetrics,OpsUser}from"../../../lib/customer-ops/types";
export function OfficeWorld({workers,selected,onSelect,opsUsers,opsMetrics,opsUnlocked,selectedCustomer,onSelectCustomer,mobile,layout,editMode,selectedLayoutItem,onSelectLayoutItem,onFocus}:{workers:OfficeRow[];selected:string|null;onSelect:(id:string)=>void;opsUsers:OpsUser[];opsMetrics:OpsMetrics|null;opsUnlocked:boolean;selectedCustomer:string|null;onSelectCustomer:(id:string)=>void;mobile:boolean;layout:LayoutItem[];editMode:boolean;selectedLayoutItem:string|null;onSelectLayoutItem:(id:string)=>void;onFocus:(p:Vec3)=>void}){
 const activity={coding:workers.some(w=>w.state==="CODING"),testing:workers.some(w=>w.state==="TESTING"),review:workers.some(w=>w.state==="REVIEWING"),done:workers.some(w=>w.state==="DONE"),blocked:workers.some(w=>w.state==="BLOCKED")};
 return <group><NavigationSystem layout={layout}/><VisualSystems mobile={mobile}/><ClawAssetWorld activity={activity} mobile={mobile} layout={layout} editMode={editMode} selectedId={selectedLayoutItem} onSelectItem={onSelectLayoutItem} opsMetrics={opsMetrics} opsUnlocked={opsUnlocked} onFocus={onFocus}/><CustomerOpsWing users={opsUsers} metrics={opsMetrics} unlocked={opsUnlocked} selected={selectedCustomer} onSelect={onSelectCustomer} mobile={mobile}/>{!editMode&&<AmbientNPCs mobile={mobile} count={mobile?1:2}/>} {!editMode&&workers.map((worker,index)=><Agent key={worker.worker_id} row={worker} index={index} target={SPOTS[worker.state]||SPOTS.READING} selected={selected===worker.worker_id} onSelect={()=>onSelect(worker.worker_id)} mobile={mobile}/>)}</group>
}
