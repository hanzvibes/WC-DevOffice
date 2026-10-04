import * as THREE from "three";
import type {Vec3} from "./types";
const aisle=.45;
export function routeBetween(from:THREE.Vector3,to:Vec3){const t=new THREE.Vector3(...to),p:THREE.Vector3[]=[];if(Math.abs(from.x-t.x)>2.4){p.push(new THREE.Vector3(from.x,0,aisle),new THREE.Vector3(t.x,0,aisle))}p.push(t);return p}
export function faceAngle(a:THREE.Vector3,b:THREE.Vector3){return Math.atan2(b.x-a.x,b.z-a.z)}
export function angleDelta(a:number,b:number){let d=b-a;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;return d}
