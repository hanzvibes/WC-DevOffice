"use client";
import{Agent}from"./Agent";
import{ClawAssetWorld,type HQRoom}from"./ClawAssets";
import{CustomerOpsWing}from"./CustomerOpsWing";
import{AmbientNPCs}from"./AmbientNPCs";
import{AgentInteractions}from"./AgentInteractions";
import{NavigationSystem}from"../systems/NavigationSystem";
import{VisualSystems}from"../systems/visualSystems";
import{workstationFor,type OfficeRow,type Vec3}from"./config";
import type{LayoutItem}from"../runtime/layout";
import type{OpsMetrics,OpsUser}from"../../../lib/customer-ops/types";
export function OfficeWorld({workers,selected,onSelect,opsUsers,opsMetrics,opsUnlocked,selectedCustomer,onSelectCustomer,mobile,layout,editMode,selectedLayoutItem,onSelectLayoutItem,onFocus,room,customerLimit,ambientNpcCount,particles,eventLines}:{workers:OfficeRow[];selected:string|null;onSelect:(id:string)=>void;opsUsers:OpsUser[];opsMetrics:OpsMetrics|null;opsUnlocked:boolean;selectedCustomer:string|null;onSelectCustomer:(id:string)=>void;mobile:boolean;layout:LayoutItem[];editMode:boolean;selectedLayoutItem:string|null;onSelectLayoutItem:(id:string)=>void;onFocus:(p:Vec3)=>void;room:HQRoom;customerLimit:number;ambientNpcCount:number;particles:boolean;eventLines:string[]}){
 const activity={coding:workers.some(w=>w.state==="CODING"),testing:workers.some(w=>w.state==="TESTING"),review:workers.some(w=>w.state==="REVIEWING"),done:workers.some(w=>w.state==="DONE"),blocked:workers.some(w=>w.state==="BLOCKED"),activeCount:workers.filter(w=>["READING","CODING","TESTING","REVIEWING"].includes(w.state)).length,blockedCount:workers.filter(w=>w.state==="BLOCKED").length,doneCount:workers.filter(w=>w.state==="DONE").length},showDev=room!=="ops",showOps=room!=="dev";
 return <group><NavigationSystem layout={layout}/><VisualSystems mobile={mobile} enabled={particles}/><ClawAssetWorld activity={activity} mobile={mobile} layout={layout} editMode={editMode} selectedId={selectedLayoutItem} onSelectItem={onSelectLayoutItem} opsMetrics={opsMetrics} opsUnlocked={opsUnlocked} onFocus={onFocus} room={room} eventLines={eventLines}/>{showOps&&<CustomerOpsWing users={opsUsers} metrics={opsMetrics} unlocked={opsUnlocked} selected={selectedCustomer} onSelect={onSelectCustomer} mobile={mobile} limit={customerLimit} effects={particles}/>} {showDev&&!editMode&&<AmbientNPCs mobile={mobile} count={ambientNpcCount}/>} {showDev&&!editMode&&<AgentInteractions workers={workers} mobile={mobile}/>} {showDev&&!editMode&&workers.map((worker,index)=><Agent key={worker.worker_id} row={worker} index={index} target={workstationFor(worker)} selected={selected===worker.worker_id} onSelect={()=>onSelect(worker.worker_id)} mobile={mobile} effects={particles}/>)}</group>
}
