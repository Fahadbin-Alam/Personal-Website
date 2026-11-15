/* ═════════ AIRFIELD — helicopter flight and parachute jump ═════════
   Board the helicopter → it lifts off and flies west over town → press the action button to jump (or it
   drops you over the town square) → steer the parachute → land on any walkable tile.                         */
const PADC={x:(PAD.x+PAD.n/2)*TS,y:(PAD.y+PAD.n/2)*TS};         // ground centre of the pad, in art px
const HH=HS>>1;
const FLY_ALT=52,FLY_V=80,CHUTE_V=46,SINK=6.5,JUMP_FROM=31*TS,AUTO_X=16.5*TS;
const HELI={st:'parked',x:PADC.x,y:PADC.y,alt:0,t:0};           // parked · spin · rise · fly · gone · return · spindown
const CLOUDS=[[20,30],[150,95],[262,12],[92,150],[334,122],[212,186]];
let J=null,jumps=0,rotT=0,REACH=null;                           // J = the jump in progress (st==='jump')
const ease=t=>t*t*(3-2*t);

function hud(t){const e=$('jhud');if(t){if(e.textContent!==t){e.textContent=t;$('sr').textContent=t;}e.classList.add('on');}else e.classList.remove('on');}
const A_BTN=document.querySelector('.ab [data-k="a"]');
function aLabel(t){if(A_BTN&&A_BTN.textContent!==t)A_BTN.textContent=t;}      // the touch action button reads JUMP while the green light is on
const heliBusy=()=>say('',[`The helicopter is still on its way back to the pad. Give it a moment.`]);
function boardHeli(){if(HELI.st!=='parked'){heliBusy();return;}
  say('JUMPMASTER',[`Stand in the door, ${player}!`,`We fly west over ALAM TOWN. ${IS_TOUCH?'Tap JUMP':'Press ENTER'} when the light turns green, then steer your parachute with the ${IS_TOUCH?'joystick':'arrow keys'}.`],startJump);}
function startJump(){if(!started||J||st==='jump'||st==='fade')return;
  if(interior){say('',[`Step outside first — the helicopter waits at the AIRFIELD.`]);return;}
  if(HELI.st!=='parked'){heliBusy();return;}
  fade(()=>{st='jump';J={ph:'spin',t:0,gx:0,gy:0,alt:0,lead:0,canopy:0,ok:false,from:null};
    HELI.st='spin';HELI.x=PADC.x;HELI.y=PADC.y;HELI.alt=0;hud('ROTORS TURNING…');});}
function jumpPress(){if(J&&J.ph==='fly'&&J.ok)doJump();}
function doJump(){const j=J;j.ph='fall';j.t=0;j.gx=HELI.x;j.gy=HELI.y;j.alt=HELI.alt;aLabel('TALK');showLoc('AIRBORNE!');}

function updateJump(dt){const j=J,s=dt/1000;j.t+=s;
  if(j.ph==='spin'){if(j.t>=1){j.ph='rise';j.t=0;HELI.st='rise';hud('LIFTING OFF…');}}
  else if(j.ph==='rise'){HELI.alt=FLY_ALT*ease(Math.min(1,j.t/1.4));if(j.t>=1.4){j.ph='fly';j.t=0;HELI.st='fly';}}
  else if(j.ph==='fly'){HELI.x-=FLY_V*Math.min(1,.2+j.t/1.1)*s;j.lead=Math.min(30,j.lead+40*s);
    if(HELI.x<JUMP_FROM&&!j.ok){j.ok=true;aLabel('JUMP');}
    hud(j.ok?`GREEN LIGHT — ${IS_TOUCH?'TAP JUMP':'PRESS ENTER TO JUMP'}`:'CLEARING THE TREES…');
    if(HELI.x<=AUTO_X)doJump();}
  else{
    if(HELI.st==='fly'){HELI.x-=FLY_V*s;if(HELI.x<-80)HELI.st='gone';}
    j.lead=Math.max(0,j.lead-60*s);
    if(j.ph==='fall'){j.alt-=16*s;if(j.t>=.45){j.ph='chute';j.t=0;}}
    else if(j.ph==='chute'){j.canopy=Math.min(1,j.t/.3);const d=wantDir();
      if(d){j.gx+=DIRS[d][0]*CHUTE_V*s;j.gy+=DIRS[d][1]*CHUTE_V*s;}
      j.gx=Math.max(1.5*TS,Math.min((W-1.5)*TS,j.gx));j.gy=Math.max(2.5*TS,Math.min(33.5*TS,j.gy));
      j.alt-=SINK*s;if(j.alt<=0){j.alt=0;touchDown();}}
    else if(j.ph==='land'){const k=Math.min(1,j.t/.25);j.gx=j.sx+(j.tx-j.sx)*k;j.gy=j.sy+(j.ty-j.sy)*k;if(k>=1){finishJump();return;}}
    if(j.ph==='fall'||j.ph==='chute')hud(`ALT ${Math.max(0,Math.round(j.alt/FLY_ALT*125)*10)} FT — STEER WITH THE ${IS_TOUCH?'JOYSTICK':'ARROW KEYS'}`);
  }}
function tickHeli(dt){rotT+=dt;
  if(HELI.st==='return'){HELI.t+=dt/1000;const k=Math.min(1,HELI.t/2.4);HELI.alt=150*(1-ease(k));if(k>=1){HELI.st='spindown';HELI.t=0;HELI.alt=0;}}
  else if(HELI.st==='spindown'){HELI.t+=dt/1000;if(HELI.t>1.2)HELI.st='parked';}}

/* every tile a visitor can walk to from the start — a landing must end on one of these */
function reachSet(){if(REACH)return REACH;const seen=new Set([START.x+','+START.y]),q=[[START.x,START.y]];
  while(q.length){const[x,y]=q.shift();for(const d in DIRS){const[dx,dy]=DIRS[d],nx=x+dx,ny=y+dy;
    if(solid(nx,ny)||at(nx,ny)===DOOR)continue;const k=nx+','+ny;if(!seen.has(k)){seen.add(k);q.push([nx,ny]);}}}
  return REACH=seen;}
function nearestFree(tx,ty){const R=reachSet();let best=null,bd=1e9;
  for(let r=0;r<40&&!best;r++)for(let y=ty-r;y<=ty+r;y++)for(let x=tx-r;x<=tx+r;x++){
    if(Math.max(Math.abs(x-tx),Math.abs(y-ty))!==r||y>=36||!R.has(x+','+y))continue;
    const d=(x-tx)*(x-tx)+(y-ty)*(y-ty);if(d<bd){bd=d;best=[x,y];}}
  return best||[START.x,START.y];}
function touchDown(){const j=J,tx=Math.floor(j.gx/TS),ty=Math.floor(j.gy/TS),t=nearestFree(tx,ty);
  j.from=(t[0]===tx&&t[1]===ty)?null:at(tx,ty);j.ph='land';j.t=0;j.sx=j.gx;j.sy=j.gy;j.tx=t[0]*TS+8;j.ty=t[1]*TS+8;j.tile=t;hud('');}
function finishJump(){const j=J,[x,y]=j.tile;J=null;jumps++;hud('');aLabel('TALK');place(x,y,'down');st='walk';zone=zoneAt(x,y);showLoc(zone);
  HELI.st='return';HELI.x=PADC.x;HELI.y=PADC.y;HELI.alt=150;HELI.t=0;
  const how=j.from===WALL||j.from===DOOR?`You slid off a rooftop and touched down right beside it.`:j.from===TRE||j.from===BUSH?`You steered clear of the treetops at the last second.`:j.from===WAT?`You skimmed the pond and landed on the bank.`:`Feet and knees together — a clean landing.`;
  const lines=[`AIRBORNE! ${how}`];
  if(jumps===1)lines.push(`FAHADBIN jumped from aircraft with the 82nd AIRBORNE DIVISION. Step into the barracks for his full Army record.`);
  if(!introShown){introShown=true;lines.push(`Welcome to ALAM TOWN, ${player}! ${howTo()}`,`Every building, kiosk and sign holds part of FAHADBIN ALAM's résumé. Short on time? The RÉSUMÉ button at the top right has it all on one page.`);}
  say('',lines);}

function jumpCam(){const j=J,air=j.ph==='fall'||j.ph==='chute'||j.ph==='land',X=air?j.gx:HELI.x,Y=air?j.gy:HELI.y,A=air?j.alt:HELI.alt;
  return[Math.round(X)-Math.round(j.lead)-(VW>>1),Math.round(Y-A*.5)-(VH>>1)];}

/* drawing */
const heliOnPad=()=>HELI.st==='parked'||HELI.st==='spin'||HELI.st==='spindown';
function drawHeli(g,x,y,spin){g.drawImage(heliBody(),x,y);g.drawImage(rotorArt(spin?Math.floor(rotT/34)%12:1,spin),x,y);}
function drawParked(g,cx,cy){const hx=PADC.x-HH-cx,hy=PADC.y-HH-cy;g.globalAlpha=.2;g.drawImage(heliShadow(),hx+2,hy+3);g.globalAlpha=1;drawHeli(g,hx,hy,HELI.st!=='parked');}
function drawAir(g,cx,cy,vw,vh){
  if(HELI.st==='rise'||HELI.st==='fly'||HELI.st==='return'){const hx=Math.round(HELI.x)-HH-cx,hy=Math.round(HELI.y)-HH-cy,a=Math.round(HELI.alt);
    g.globalAlpha=.2;g.drawImage(heliShadow(),hx+2,hy+3);g.globalAlpha=1;drawHeli(g,hx,hy-a,true);}
  const j=J,air=j&&(j.ph==='fall'||j.ph==='chute'||j.ph==='land');
  if(air){const gx=Math.round(j.gx)-cx,gy=Math.round(j.gy)-cy,a=Math.round(j.alt),sw=j.ph==='chute'?Math.round(Math.sin(anim/420)*1.6):0,sh=a>30?3:a>12?4:5;
    if(j.ph==='chute'&&Math.floor(anim/260)%2){const t=nearestFree(Math.floor(j.gx/TS),Math.floor(j.gy/TS)),mx=t[0]*TS-cx,my=t[1]*TS-cy;      // blinking corner marks: the tile you will land on
      [[0,0,1,1],[15,0,-1,1],[0,15,1,-1],[15,15,-1,-1]].forEach(([x,y,dx,dy])=>{g.fillStyle='#383848';g.fillRect(mx+Math.min(x,x+dx*4),my+y,5,1);g.fillRect(mx+x,my+Math.min(y,y+dy*4),1,5);
        g.fillStyle='#ffffff';g.fillRect(mx+Math.min(x+dx,x+dx*3),my+y+dy,3,1);g.fillRect(mx+x+dx,my+Math.min(y+dy,y+dy*3),1,3);});}
    g.fillStyle='rgba(0,0,0,.28)';g.fillRect(gx-sh-1,gy+4,sh*2+2,3);g.fillRect(gx-sh+1,gy+3,sh*2-2,5);   // shadow widens on the way down
    const px=gx-8+sw,py=gy-8-a;
    if(j.ph!=='fall'){const big=j.canopy>=.6,cw=big?26:14,ch=big?13:8,ox=px+8-(cw>>1),oy=py-(big?19:13);
      g.fillStyle='#3c4048';[[ox+1,5],[ox+Math.round(cw*.34),6],[ox+Math.round(cw*.66)-1,9],[ox+cw-2,10]].forEach(([x0,sx])=>{const y0=oy+ch-1,x1=px+sx,y1=py+7,n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);
        for(let k=0;k<=n;k++)g.fillRect(Math.round(x0+(x1-x0)*k/n),Math.round(y0+(y1-y0)*k/n),1,1);});
      g.drawImage(canopyArt(big),ox,oy);}
    drawChar(g,'player','down',j.ph==='fall'?1:0,px,py);}
  const alt=air?j.alt:(HELI.st==='rise'||HELI.st==='fly')?HELI.alt:0,al=Math.min(.9,alt/FLY_ALT*1.5);
  if(al>.03){g.globalAlpha=al;const W2=vw+90,H2=vh+70;CLOUDS.forEach((c,i)=>{
      const x=(((c[0]-cx*1.4-anim*.012*(1+i%3))%W2)+W2)%W2-60,y=(((c[1]-cy*1.4)%H2)+H2)%H2-40;g.drawImage(cloudArt(i&1),Math.round(x),Math.round(y));});g.globalAlpha=1;}
}
