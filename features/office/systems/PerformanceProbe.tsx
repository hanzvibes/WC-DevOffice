"use client";
import{useFrame}from"@react-three/fiber";
import{useRef}from"react";
export type GpuStats={calls:number;triangles:number;points:number;lines:number};
export function PerformanceProbe({onSample}:{onSample:(stats:GpuStats)=>void}){const elapsed=useRef(0);useFrame(({gl},dt)=>{elapsed.current+=dt;if(elapsed.current<.6)return;elapsed.current=0;const r=gl.info.render;onSample({calls:r.calls,triangles:r.triangles,points:r.points,lines:r.lines})});return null}
