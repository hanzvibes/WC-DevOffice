import * as THREE from "three";
import type {Vec3} from "./types";

export type NavObstacle={minX:number;maxX:number;minZ:number;maxZ:number};
type Bounds={minX:number;maxX:number;minZ:number;maxZ:number};
type NavGrid={cells:Uint8Array;cols:number;rows:number;cell:number;bounds:Bounds};
const DEFAULT_BOUNDS:Bounds={minX:-5.5,maxX:25,minZ:-5.55,maxZ:5.55};
let activeGrid:NavGrid=buildNavGrid([],DEFAULT_BOUNDS,.5);

export function configureNavigation(obstacles:NavObstacle[],bounds:Bounds=DEFAULT_BOUNDS,cell=.5){activeGrid=buildNavGrid(obstacles,bounds,cell)}
export function buildNavGrid(obstacles:NavObstacle[],bounds:Bounds=DEFAULT_BOUNDS,cell=.5):NavGrid{
 const cols=Math.ceil((bounds.maxX-bounds.minX)/cell),rows=Math.ceil((bounds.maxZ-bounds.minZ)/cell),cells=new Uint8Array(cols*rows);
 const mark=(c:number,r:number)=>{if(c>=0&&c<cols&&r>=0&&r<rows)cells[r*cols+c]=1};
 for(const obstacle of obstacles){const pad=.18,c1=Math.max(0,Math.floor((obstacle.minX-pad-bounds.minX)/cell)),c2=Math.min(cols-1,Math.floor((obstacle.maxX+pad-bounds.minX)/cell)),r1=Math.max(0,Math.floor((obstacle.minZ-pad-bounds.minZ)/cell)),r2=Math.min(rows-1,Math.floor((obstacle.maxZ+pad-bounds.minZ)/cell));for(let r=r1;r<=r2;r++)for(let c=c1;c<=c2;c++)mark(c,r)}
 for(let c=0;c<cols;c++){mark(c,0);mark(c,rows-1)}for(let r=0;r<rows;r++){mark(0,r);mark(cols-1,r)}
 return{cells,cols,rows,cell,bounds};
}
function astarWorld(from:THREE.Vector3,to:Vec3,grid:NavGrid){
 const{cols,rows,cell,bounds,cells}=grid,clamp=(v:number,l:number,h:number)=>Math.min(h,Math.max(l,v));
 const toCell=(x:number,z:number)=>({c:clamp(Math.floor((x-bounds.minX)/cell),0,cols-1),r:clamp(Math.floor((z-bounds.minZ)/cell),0,rows-1)}),toWorld=(c:number,r:number)=>new THREE.Vector3(bounds.minX+c*cell+cell/2,0,bounds.minZ+r*cell+cell/2);
 const findFree=(c:number,r:number)=>{if(!cells[r*cols+c])return{c,r};for(let d=1;d<8;d++)for(let dr=-d;dr<=d;dr++)for(let dc=-d;dc<=d;dc++){if(Math.abs(dr)!==d&&Math.abs(dc)!==d)continue;const nr=r+dr,nc=c+dc;if(nr>=0&&nr<rows&&nc>=0&&nc<cols&&!cells[nr*cols+nc])return{c:nc,r:nr}}return null};
 let s=toCell(from.x,from.z),e=toCell(to[0],to[2]);const sf=findFree(s.c,s.r),ef=findFree(e.c,e.r);if(!sf||!ef)return[new THREE.Vector3(...to)];s=sf;e=ef;if(s.c===e.c&&s.r===e.r)return[new THREE.Vector3(...to)];
 const count=cols*rows,g=new Float32Array(count).fill(Infinity),parent=new Int32Array(count).fill(-1),seen=new Uint8Array(count),open:[number,number][]=[];
 const push=(entry:[number,number])=>{open.push(entry);let i=open.length-1;while(i>0){const p=(i-1)>>1;if(open[p][1]<=entry[1])break;open[i]=open[p];i=p}open[i]=entry};
 const pop=()=>{if(!open.length)return null;const first=open[0],last=open.pop()!;if(!open.length)return first;let i=0;while(true){const l=i*2+1,r=l+1;if(l>=open.length)break;let sm=l;if(r<open.length&&open[r][1]<open[l][1])sm=r;if(open[sm][1]>=last[1])break;open[i]=open[sm];i=sm}open[i]=last;return first};
 const si=s.r*cols+s.c,ei=e.r*cols+e.c;g[si]=0;push([si,Math.hypot(e.c-s.c,e.r-s.r)]);const dirs:[number,number,number][]=[[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,1.414],[1,-1,1.414],[-1,1,1.414],[-1,-1,1.414]];
 while(open.length){const item=pop();if(!item)break;const cur=item[0];if(seen[cur])continue;seen[cur]=1;if(cur===ei){const path:THREE.Vector3[]=[];let node=cur;while(node!==si&&node>=0){path.push(toWorld(node%cols,Math.floor(node/cols)));node=parent[node]}path.reverse();if(path.length)path[path.length-1]=new THREE.Vector3(...to);else path.push(new THREE.Vector3(...to));return simplify(path)}const cc=cur%cols,rr=Math.floor(cur/cols);for(const[dc,dr,cost]of dirs){const nc=cc+dc,nr=rr+dr;if(nc<0||nc>=cols||nr<0||nr>=rows)continue;const ni=nr*cols+nc;if(seen[ni]||cells[ni])continue;if(dc&&dr){const a=(rr+dr)*cols+cc,b=rr*cols+(cc+dc);if(cells[a]||cells[b])continue}const ng=g[cur]+cost;if(ng<g[ni]){g[ni]=ng;parent[ni]=cur;push([ni,ng+Math.hypot(e.c-nc,e.r-nr)])}}}
 return[new THREE.Vector3(...to)];
}
function simplify(path:THREE.Vector3[]){if(path.length<3)return path;const out=[path[0]];for(let i=1;i<path.length-1;i++){const a=out[out.length-1],b=path[i],c=path[i+1],ab=new THREE.Vector2(b.x-a.x,b.z-a.z).normalize(),bc=new THREE.Vector2(c.x-b.x,c.z-b.z).normalize();if(ab.dot(bc)<.995)out.push(b)}out.push(path[path.length-1]);return out}
export function routeBetween(from:THREE.Vector3,to:Vec3){return astarWorld(from,to,activeGrid)}
export function faceAngle(a:THREE.Vector3,b:THREE.Vector3){return Math.atan2(b.x-a.x,b.z-a.z)}
export function angleDelta(a:number,b:number){let d=b-a;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;return d}
