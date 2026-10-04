"use client";
import{useEffect,useMemo}from"react";
import{configureNavigation,HQ_NAV_BOUNDS,type NavObstacle}from"../navigation";
import{MODEL_FOOTPRINT,type ClawModelKey,type LayoutItem}from"../runtime/layout";
const FLOOR_BLOCKERS=new Set<ClawModelKey>(["desk","deskCorner","chairDesk","chairModern","cabinet","fridge","lamp","loungeChair","sofa","smallPlant","plant","table","coffeeTable","roundTable","bookcase"]);
const STATIC_OBSTACLES:NavObstacle[]=[{minX:-7.75,maxX:-6.75,minZ:1.75,maxZ:3.35},{minX:7,maxX:7.8,minZ:4.45,maxZ:5.8}];
function obstacleFor(item:LayoutItem):NavObstacle|null{if(item.blocksNavigation===false||(!item.blocksNavigation&&!FLOOR_BLOCKERS.has(item.model)))return null;const base=MODEL_FOOTPRINT[item.model],raw=item.scale??1,sx=Array.isArray(raw)?raw[0]:raw,sz=Array.isArray(raw)?raw[2]:raw,rot=item.rotation?.[1]||0,fullW=base[0]*Math.max(.65,sx),fullD=base[1]*Math.max(.65,sz),c=Math.abs(Math.cos(rot)),s=Math.abs(Math.sin(rot)),halfW=(fullW*c+fullD*s)/2,halfD=(fullW*s+fullD*c)/2;return{minX:item.position[0]-halfW,maxX:item.position[0]+halfW,minZ:item.position[2]-halfD,maxZ:item.position[2]+halfD}}
export function NavigationSystem({layout}:{layout:LayoutItem[]}){const obstacles=useMemo(()=>[...layout.map(obstacleFor).filter((v):v is NavObstacle=>!!v),...STATIC_OBSTACLES],[layout]);useEffect(()=>configureNavigation(obstacles,HQ_NAV_BOUNDS,.4),[obstacles]);return null}
