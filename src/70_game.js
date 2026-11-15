/* ═════════ STATE ═════════ */
const DIRS={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]},OPP={up:'down',down:'up',left:'right',right:'left'};
const WALK_MS=1000/60*16,RUN_MS=1000/60*8;      // 1 px, 2 px per 60 Hz frame
let st='title',player='FRIEND',zone='SOUTH ROAD',egg=false,started=false,introShown=false;
const me={x:START.x,y:START.y,fx:START.x,fy:START.y,dir:'up',t:0,moving:false,runN:0,step:0};
let night=false;                      // bright daytime look by default; night is a switch
let smooth=false;                     // crisp pixels by default; the smoothed look is a switch in the menu
let dq=[],di=0,dcb=null,typ='',tp=0,tt=null,lastT=0,anim=0;
const seen=new Set();
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
const howTo=()=>IS_TOUCH?`Drag the joystick to walk. TALK reads signs and opens things, MENU has shortcuts.`:`Walk with the ARROW KEYS or WASD. ENTER talks and opens things, ESC opens the menu.`;

function say(name,lines,cb){st='dlg';dq=lines;di=0;dcb=cb||null;$('dlg').style.display='block';$('dlg-name').textContent=name;$('dlg-name').style.display=name?'block':'none';type(lines[0]);}
function type(s){clearTimeout(tt);typ=s;tp=REDUCED?s.length:0;$('sr').textContent=($('dlg-name').style.display!=='none'?$('dlg-name').textContent+': ':'')+s;
  $('dlg-text').textContent=typ.slice(0,tp);$('dlg-arrow').style.display='none';
  (function step(){tp=Math.min(typ.length,tp+2);$('dlg-text').textContent=typ.slice(0,tp);if(tp<typ.length)tt=setTimeout(step,22);else $('dlg-arrow').style.display='block';})();}
function next(){if(tp<typ.length){clearTimeout(tt);tp=typ.length;$('dlg-text').textContent=typ;$('dlg-arrow').style.display='block';return;}if(++di<dq.length){type(dq[di]);return;}$('dlg').style.display='none';st='walk';if(dcb){const f=dcb;dcb=null;f();}}
$('dlg').onclick=next;
let lastFocus=null;
function openPanel(id){if(st!=='panel')lastFocus=document.activeElement;st='panel';$(id).style.display='flex';document.body.classList.add('paneled');held.length=0;
  if(id==='entry'&&!IS_TOUCH)setTimeout(()=>{const f=$('entry-b').querySelector('a,button');if(f)f.focus({preventScroll:true});},30);}
function closePanels(){['entry','menu'].forEach(i=>$(i).style.display='none');document.body.classList.remove('paneled','menuopen');
  st=!started?'title':J?'jump':'walk';                                   // a panel opened mid-flight only pauses the jump
  if(lastFocus&&lastFocus.focus&&document.contains(lastFocus)&&lastFocus!==document.body&&lastFocus.offsetParent!==null)lastFocus.focus({preventScroll:true});else if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();lastFocus=null;
  if(started&&got.size===3&&!allDone){allDone=true;setTimeout(celebrate,350);}}
/* said once, the next time the visitor is standing still after collecting the third crystal */
function celebrate(){if(st!=='walk'||me.moving){setTimeout(celebrate,250);return;}
  say('THE MENTOR',[`All three crystals collected. Nicely done, ${player}!`,`That's the whole story: PROJECTS, RÉSUMÉ and EXPERIENCE. The RÉSUMÉ button at the top keeps everything on one page, with his LinkedIn, GitHub and email.`,`Feel free to keep exploring. Project Park, the barracks, Drexel and the AIRFIELD still have more to show.`]);}
function fade(cb){st='fade';const f=$('flash');f.style.opacity=1;setTimeout(()=>{cb();if(st==='fade')st='walk';setTimeout(()=>f.style.opacity=0,90);},REDUCED?60:210);}
let locT=null;function showLoc(t){const e=$('loc');e.textContent=t;e.classList.add('show');clearTimeout(locT);locT=setTimeout(()=>e.classList.remove('show'),2300);}

function place(x,y,dir){me.x=me.fx=x;me.y=me.fy=y;me.dir=dir;me.t=0;me.moving=false;me.runN=0;}
function enterInterior(id){$('dn').style.display='none';const b=BLD.find(b=>b.id===id),d=INT[id];setTimeout(()=>showLoc(b.label),250);interior={id,b};W=d.W;H=d.H;map=d.build();bidx=new Array(W*H).fill(-1);NPC=d.npc;SIGNS=d.signs;place(d.start.x,d.start.y,'up');}
function exitInterior(){$('dn').style.display='';const b=interior.b;setTimeout(()=>showLoc('ALAM TOWN'),250);interior=null;W=OUT.W;H=OUT.H;map=OUT.map;bidx=OUT.bidx;NPC=OUT.NPC;SIGNS=OUT.SIGNS;place(b.dx,b.dy+1,'down');}

/* ═════════ LOGIC ═════════ */
function solid(x,y){if(x<0||y<0||x>=W||y>=H)return true;if(SOLID.has(at(x,y)))return true;return NPC.some(n=>n.x===x&&n.y===y);}
function startStep(d){me.dir=d;const[dx,dy]=DIRS[d],nx=me.x+dx,ny=me.y+dy;
  if(solid(nx,ny))return false;
  me.fx=me.x;me.fy=me.y;me.x=nx;me.y=ny;me.t=0;me.moving=true;me.step^=1;return true;}
const stepMs=()=>me.runN>=2?RUN_MS:WALK_MS;
function arrived(){const t=at(me.x,me.y);
  if(t===EXIT){fade(exitInterior);return true;}
  if(t===DOOR){const b=BLD[bidx[me.y*W+me.x]];
    if(INT[b.id])fade(()=>enterInterior(b.id));
    else fade(()=>{place(me.x,me.y+1,'down');INTERIOR[b.id]();});
    return true;}
  if(!interior){const z=zoneAt(me.x,me.y);if(z!==zone){zone=z;showLoc(z);}
    if(!egg&&me.y>=37){egg=true;say('',[`Just quiet meadow down here.`,`ALAM TOWN is back the other way: head north ↑`]);return true;}}
  return false;}
function update(dt){
  if(st==='jump'){updateJump(dt);return;}
  if(st!=='walk')return;
  if(!me.moving){const w=wantDir();if(!w||!startStep(w))me.runN=0;}
  if(me.moving){let ms=stepMs();me.t+=dt/ms;
    while(me.moving&&me.t>=1){const left=(me.t-1)*ms;me.moving=false;me.fx=me.x;me.fy=me.y;me.t=0;me.runN++;
      if(arrived())break;const w=wantDir();
      if(st==='walk'&&w&&startStep(w)){ms=stepMs();me.t=left/ms;}else me.runN=0;}}}
function interact(){if(st==='dlg'){next();return;}if(st==='jump'){jumpPress();return;}if(st!=='walk'||me.moving)return;const[dx,dy]=DIRS[me.dir],x=me.x+dx,y=me.y+dy;
  const n=NPC.find(n=>n.x===x&&n.y===y);if(n){n.face=OPP[me.dir];say(n.name,n.lines(player));return;}
  if(interior&&interior.id==='lab'){const c=CAPS.find(c=>c.x===x&&c.y===y);if(c){fade(()=>openCrystal(c.i));return;}}
  if(interior&&interior.id==='home'&&at(x,y)===FRIDGE){fade(INTERIOR.home);return;}
  if(!interior){const k=PROJ.find(k=>k.x===x&&k.y===y);if(k){fade(()=>openProject(k.i));return;}
    const t=at(x,y);
    if(t===HELIPAD){boardHeli();return;}
    if(t===BOARD){fade(contactCard);return;}
    if(t===MAILBOX){say('',[`MAILBOX — Fahadbin Alam\nfma52@drexel.edu · 856-870-7528`]);return;}
    if(t===FNT){say('',[`The fountain sparkles. A plaque reads:\n"Become the top 1% of the 1% by helping those get up there with you."`]);return;}
    if(t===WAT){say('',[`A quiet pond. The water is perfectly clear.`]);return;}}
  const s=SIGNS[x+','+y];if(s){say('',[s]);return;}
  if(at(x,y)===DOOR){const b=BLD[bidx[y*W+x]];say('',[b.label]);}}
function setNight(v){night=v;$('dn').textContent=night?'☀':'☾';}
function setSmooth(v){smooth=v;document.body.classList.toggle('smooth',v);}
function menuToggle(){if(st==='walk'&&!me.moving){lastFocus=document.activeElement;st='panel';const m=$('menu'),mi=(l,f)=>`<button class="mi" role="menuitem" type="button" onclick="${f}">${l}</button>`;m.style.display='block';document.body.classList.add('menuopen');
  m.innerHTML=mi('RÉSUMÉ','openResume()')+mi('CONTACT CARD','contactCard()')+mi('THE 3 CRYSTALS','crystalPick()')+mi('PARACHUTE JUMP','closePanels();startJump()')+
    `<a class="mi" role="menuitem" href="${F.linktree}" target="_blank" rel="noopener">LINKTREE ↗</a>`+
    mi((night?'DAY':'NIGHT')+' MODE','setNight(!night);closePanels()')+mi((smooth?'PIXEL':'SMOOTH')+' GRAPHICS','setSmooth(!smooth);closePanels()')+mi('CLOSE','closePanels()');
  if(!IS_TOUCH)m.querySelector('.mi').focus({preventScroll:true});}
  else if(st==='panel'){closePanels();}}
/* the résumé is one press away from anywhere: it closes a dialogue or the menu, and only pauses a parachute jump */
function resumeNow(){if(st==='fade'||(st==='panel'&&$('entry').style.display==='flex'))return;
  if(st==='dlg'){$('dlg').style.display='none';clearTimeout(tt);dcb=null;}$('menu').style.display='none';document.body.classList.remove('menuopen');openResume();}
$('dn').addEventListener('click',e=>{e.stopPropagation();setNight(!night);$('dn').blur();});
$('rbtn').addEventListener('click',e=>{e.stopPropagation();$('rbtn').blur();resumeNow();});

/* ═════════ INPUT ═════════ */
const KEYDIR={ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down',ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right'};
const held=[];let joyDir=null,padDir=null;
const wantDir=()=>held.length?held[held.length-1]:(joyDir||padDir);
addEventListener('keydown',e=>{
  const tg=e.target,onCtl=tg&&tg.closest&&tg.closest('button,a,input');
  if(onCtl&&(e.key==='Enter'||e.key===' '))return;                    // let focused buttons, links and inputs work natively
  if(tg&&tg.id==='name')return;
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  if(st==='title'){if(e.key==='r'||e.key==='R')openResume();else if(e.key==='Enter')start();return;}
  if(st==='panel'||st==='fade'){if(e.key==='Escape'&&st==='panel')closePanels();return;}   // arrows scroll the panel
  const d=KEYDIR[e.key];
  if(d){e.preventDefault();if(!e.repeat){const i=held.indexOf(d);if(i>=0)held.splice(i,1);held.push(d);
      if(st==='walk'&&!me.moving)me.dir=d;}                              // a quick tap always turns you, even toward a wall
    return;}
  if(e.key===' ')e.preventDefault();
  if(e.repeat)return;
  if(e.key==='Enter'||e.key==='z'||e.key==='Z'||e.key===' ')interact();
  else if(e.key==='Escape'||e.key==='x'||e.key==='X')menuToggle();
  else if(e.key==='r'||e.key==='R')resumeNow();
  else if(e.key==='n'||e.key==='N'){if(st==='walk')setNight(!night);}});
addEventListener('keyup',e=>{const d=KEYDIR[e.key];if(d){const i=held.indexOf(d);if(i>=0)held.splice(i,1);}});
addEventListener('blur',()=>{held.length=0;joyDir=null;});

/* mode 'jump' = start by parachuting in from the airfield instead of walking up the road */
function start(mode){if(started)return;started=true;player=($('name').value.trim()||'FRIEND').toUpperCase().slice(0,8);$('name').blur();$('title').style.display='none';document.body.classList.remove('titled');
  $('hud').classList.add('on');st='walk';if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();
  if(mode==='jump'){startJump();return;}
  introShown=true;showLoc('SOUTH ROAD');
  setTimeout(()=>{if(st==='walk')say('',[`Welcome, ${player}! This road leads to ALAM TOWN, home of FAHADBIN ALAM.`,`${howTo()}\nThe town is straight ahead ↑`,`Short on time? The RÉSUMÉ button at the top right skips the game. Or pick PARACHUTE JUMP in the menu and drop into town the way FAHADBIN did with the 82nd AIRBORNE.`]);},450);}
$('go').onclick=()=>start();$('para').onclick=()=>start('jump');$('skip').onclick=openResume;
$('name').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();start();}});

/* ═════════ SCREEN FIT — whole-number pixel scale, 240×160 view (about 12 tiles across on a phone held upright) ═════════ */
if(IS_TOUCH)document.body.classList.add('touch');
const cv=$('c'),ctx=cv.getContext('2d');let VW=240,VH=160,ZS=4;
const buf=mkc(VW,VH),bx=buf.getContext('2d',{willReadFrequently:true});
function fit(){
  const vw=innerWidth,vh=innerHeight,dpr=window.devicePixelRatio||1,portrait=vh>vw,wrap=$('wrap');let aw,ah;
  document.body.classList.toggle('land',IS_TOUCH&&!portrait);
  if(IS_TOUCH&&portrait){const dw=Math.floor(vw*dpr+1e-6);ZS=Math.max(1,Math.round(dw/190));        // ≈12 tiles across, whole-number pixels, full width
    VW=Math.floor(dw/ZS)&~1;VH=16*Math.max(9,Math.min(13,Math.floor((vh-196)*dpr/ZS/16)));}
  else{if(IS_TOUCH){aw=vw-8;ah=vh-8;}else{aw=vw-24;ah=vh-76;}
    VW=240;VH=160;ZS=Math.max(1,Math.floor(Math.min(aw/VW,ah/VH)*dpr+1e-6));if(!IS_TOUCH)ZS=Math.min(ZS,Math.ceil(5*dpr));}
  const w=VW*ZS/dpr,h=VH*ZS/dpr;
  wrap.style.width=w+'px';wrap.style.height=h+'px';wrap.style.borderRadius=IS_TOUCH?'0':'';
  cv.width=VW*ZS;cv.height=VH*ZS;buf.width=VW;buf.height=VH;
  wrap.style.fontSize=Math.max(10,Math.min(16,w/60))+'px';
  wrap.style.left=wrap.style.top='0px';const r=wrap.getBoundingClientRect();          // snap the frame to whole device pixels
  wrap.style.left=(Math.round(r.left*dpr)/dpr-r.left)+'px';wrap.style.top=(Math.round(r.top*dpr)/dpr-r.top)+'px';
}
addEventListener('resize',fit);addEventListener('orientationchange',()=>setTimeout(fit,200));fit();

/* ═════════ TOUCH JOYSTICK ═════════ */
const joy=$('joy'),knob=$('knob');let jid=null;
function jset(cx,cy){const r=joy.getBoundingClientRect();let dx=cx-(r.left+r.width/2),dy=cy-(r.top+r.height/2);
  const max=r.width/2-18,d=Math.hypot(dx,dy);if(d>max){dx*=max/d;dy*=max/d;}
  knob.style.transform=`translate(${dx}px,${dy}px)`;
  joyDir=d>r.width*0.16?(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up')):null;}
function jend(e){if(e&&e.pointerId!==jid)return;jid=null;joy.classList.remove('on');knob.style.transform='';joyDir=null;}
joy.addEventListener('pointerdown',e=>{e.preventDefault();jid=e.pointerId;try{joy.setPointerCapture(jid);}catch(_){}joy.classList.add('on');jset(e.clientX,e.clientY);});
joy.addEventListener('pointermove',e=>{if(e.pointerId===jid){e.preventDefault();jset(e.clientX,e.clientY);}});
joy.addEventListener('pointerup',jend);joy.addEventListener('pointercancel',jend);joy.addEventListener('lostpointercapture',jend);
document.querySelectorAll('.ab [data-k]').forEach(el=>{
  el.addEventListener('pointerdown',e=>{e.preventDefault();if(!started)return;el.classList.add('on');if(el.dataset.k==='a')interact();else menuToggle();});
  ['pointerup','pointercancel','pointerleave'].forEach(t=>el.addEventListener(t,()=>el.classList.remove('on')));});
document.addEventListener('contextmenu',e=>{if(e.target.closest('#ctl'))e.preventDefault();});
cv.addEventListener('pointerdown',()=>{if(st==='jump')jumpPress();});

/* ═════════ GAMEPAD ═════════ */
let gpPrev={};
function pollPad(){const pads=navigator.getGamepads?navigator.getGamepads():[];let p=null;for(const g of pads)if(g){p=g;break;}
  if(!p){padDir=null;return;}
  const ax=p.axes[0]||0,ay=p.axes[1]||0,b=i=>!!(p.buttons[i]&&p.buttons[i].pressed);
  padDir=(ay<-.5||b(12))?'up':(ay>.5||b(13))?'down':(ax<-.5||b(14))?'left':(ax>.5||b(15))?'right':null;
  const A=b(0),B=b(1),S=b(9);
  if(st==='title'){if((A||S)&&!gpPrev.A&&!gpPrev.S)start();}
  else{if(A&&!gpPrev.A)interact();if((B&&!gpPrev.B)||(S&&!gpPrev.S))menuToggle();}
  gpPrev={A,B,S};}

/* ═════════ RENDER ═════════ */
let LABELS=[];
function drawChar(g,kind,dir,pose,px,py){g.drawImage(charArt(kind,dir,pose),px,py-CH_UP);}
function bubble(g,x,y){Q(g,x+1,y,6,1,'#383848');Q(g,x,y+1,8,6,'#383848');Q(g,x+1,y+7,6,1,'#383848');Q(g,x+1,y+1,6,6,'#f8f8f8');Q(g,x+3,y+8,2,1,'#383848');Q(g,x+3,y+2,2,3,'#e03040');Q(g,x+3,y+6,2,1,'#e03040');}
function drawScene(g,cx,cy,vw,vh,ppx,ppy,live){
  g.fillStyle=interior?'#101018':'#000';g.fillRect(0,0,vw,vh);
  const fr2=Math.floor(anim/480)%2,idle=live&&st==='walk'&&!me.moving,near=(x,y)=>idle&&Math.abs(x-me.x)+Math.abs(y-me.y)===1,
    front=(x,y)=>idle&&x===me.x+DIRS[me.dir][0]&&y===me.y+DIRS[me.dir][1],above=y=>(Math.min(y,me.y))*TS-cy;
  const c0=Math.floor(cx/TS),c1=Math.floor((cx+vw-1)/TS),r0=Math.floor(cy/TS),r1=Math.floor((cy+vh-1)/TS);
  for(let y=r0;y<=r1;y++)for(let x=c0;x<=c1;x++){if(interior&&(x<0||y<0||x>=W||y>=H))continue;
    g.drawImage(tileArt(at(x,y),x,y,fr2),x*TS-cx,y*TS-cy);}
  const ents=[];
  if(!interior){
    let ax0=c0-2;if(!(ax0&1))ax0--;let ay0=r0-2;if(ay0&1)ay0--;
    for(let ay=ay0;ay<=r1+1;ay+=2)for(let ax=ax0;ax<=c1;ax+=2)if(treeBlock(ax,ay))ents.push({k:(ay+2)*TS,d:()=>g.drawImage(treeArt(),ax*TS-cx,(ay-1)*TS-cy)});
    BLD.forEach(b=>{if(b.x2<c0-1||b.x>c1+1||b.y2<r0-1||b.y>r1+1)return;ents.push({k:(b.y+b.h)*TS-1,d:()=>g.drawImage(buildingArt(b),b.x*TS-cx,b.y*TS-BHEAD-cy)});});
    ents.push({k:(FOUNT.y+2)*TS-2,d:()=>g.drawImage(fountainArt(Math.floor(anim/320)%3),FOUNT.x*TS-cx,FOUNT.y*TS-cy)});
    PROJ.forEach(k=>{if(front(k.x,k.y))LABELS.push([KIOSKS[k.i].n,k.x*TS+8-cx,above(k.y)-(k.y>me.y?4:2)]);});
    if(live&&st==='walk'&&!me.moving){const b=BLD.find(b=>b.dx===me.x&&b.dy+1===me.y);if(b)LABELS.push([b.label,b.dx*TS+8-cx,b.dy*TS-4-cy]);}
    if(heliOnPad()&&PAD.x<=c1+1&&PAD.x+PAD.n>=c0-1){ents.push({k:(PAD.y+PAD.n)*TS-1,d:()=>drawParked(g,cx,cy)});
      if(idle&&at(me.x+DIRS[me.dir][0],me.y+DIRS[me.dir][1])===HELIPAD&&HELI.st==='parked')LABELS.push(['BOARD THE HELICOPTER',PADC.x-cx,PAD.y*TS-3-cy]);}
  }else if(interior.id==='lab'){
    // the three crystals hover over the table; a collected one is dimmed and ticked
    CAPS.forEach(cp=>{const X=cp.x*TS-cx,Y=cp.y*TS-cy,done=got.has(cp.i),bob=REDUCED?0:Math.round(Math.sin(anim/400+cp.x)*1.2);
      ents.push({k:(cp.y+1)*TS+1,d:()=>{Q(g,X+4,Y+6,8,2,'rgba(0,0,0,.2)');Q(g,X+5,Y+5,6,4,'rgba(0,0,0,.2)');
        g.drawImage(crystalArt(CRYSTALS[cp.i].c,done),X+2,Y-10+bob);
        if(!done&&!REDUCED&&Math.floor(anim/230+cp.x*3)%5===0){const sx=X+3+(cp.x*5)%9,sy=Y-9+bob+(cp.x*3)%6;Q(g,sx,sy-1,1,3,'#ffffff');Q(g,sx-1,sy,3,1,'#ffffff');}}});
      if(front(cp.x,cp.y))LABELS.push([CRYSTALS[cp.i].n,X+8,Y-12]);});
  }
  NPC.forEach(n=>{if(live&&!n.face&&Math.random()<0.003)n.idle=['down','left','right','down'][Math.floor(Math.random()*4)];
    ents.push({k:(n.y+1)*TS,d:()=>{drawChar(g,n.s,n.face||n.idle||n.dir,0,n.x*TS-cx,n.y*TS-cy);
      if(near(n.x,n.y))bubble(g,n.x*TS+4-cx,n.y*TS-13-cy+(Math.floor(anim/300)%2));}});});
  const pose=me.moving&&me.t<.5?(me.step?1:2):0;
  if(!J)ents.push({k:ppy+TS,d:()=>drawChar(g,'player',me.dir,pose,ppx-cx,ppy-cy)});
  ents.sort((a,b)=>a.k-b.k).forEach(e=>e.d());
  // meadow plants cover the feet
  if(!interior&&!J){const tg=()=>tileArt(TALL,0,0,0);[[me.x,me.y],[me.fx,me.fy]].forEach(([tx,ty],i)=>{if((i===0||me.moving)&&at(tx,ty)===TALL)g.drawImage(tg(),0,10,16,6,tx*TS-cx,ty*TS+10-cy,16,6);});}
  if(!interior)drawAir(g,cx,cy,vw,vh);
}
function label(t,ax,ay){const s=ZS,fs=Math.max(9,Math.round(6.5*s));ctx.font='600 '+fs+'px "Pixelify Sans",ui-monospace,monospace';ctx.textAlign='center';ctx.textBaseline='middle';
  const tw=Math.ceil(ctx.measureText(t).width)+4*s,h=fs+3*s;let x=Math.round(ax*s-tw/2),y=Math.round(ay*s-h);
  x=Math.max(2*s,Math.min(VW*s-tw-2*s,x));y=Math.max(2*s,y);
  ctx.fillStyle='#383848';ctx.fillRect(x-s,y-s,tw+2*s,h+2*s);ctx.fillStyle='#f8f8f8';ctx.fillRect(x,y,tw,h);ctx.fillStyle='#484848';ctx.fillText(t,x+tw/2,y+h/2+s*.4);}

/* Optional smooth look (menu → SMOOTH GRAPHICS): edge-aware 2× smoothing (EPX) run on the finished frame — twice on a
   computer, once on a phone to stay light — so stair-steps round into curves, plus a soft vignette.
   Off by default: the game is drawn as crisp pixels. */
let SM=null,VIG=null,VIGK='';
function epx(s,w,h,d){const W2=w*2;
  for(let y=0;y<h;y++){const r=y*w,u=y>0?r-w:r,n=y<h-1?r+w:r,o=2*y*W2;
    for(let x=0;x<w;x++){const P=s[r+x],A=s[u+x],B=x<w-1?s[r+x+1]:P,C=x>0?s[r+x-1]:P,D=s[n+x],i=o+2*x;
      d[i]=(C===A&&C!==D&&A!==B)?A:P;d[i+1]=(A===B&&A!==C&&B!==D)?B:P;
      d[i+W2]=(D===C&&D!==B&&C!==A)?C:P;d[i+W2+1]=(B===D&&B!==A&&D!==C)?D:P;}}}
function smoothFrame(){const w=VW,h=VH,two=!IS_TOUCH,k=two?4:2;
  if(!SM||SM.w!==w||SM.h!==h){const c=mkc(w*k,h*k),g=c.getContext('2d'),id=g.createImageData(w*k,h*k);
    SM={w,h,c,g,id,out:new Uint32Array(id.data.buffer),mid:two?new Uint32Array(w*2*h*2):null};}
  const src=new Uint32Array(bx.getImageData(0,0,w,h).data.buffer);
  if(two){epx(src,w,h,SM.mid);epx(SM.mid,w*2,h*2,SM.out);}else epx(src,w,h,SM.out);
  SM.g.putImageData(SM.id,0,0);return SM.c;}
function vignette(){const k=cv.width+'x'+cv.height+(night&&!interior?'n':'d');if(VIGK!==k){VIGK=k;VIG=mkc(cv.width,cv.height);const v=VIG.getContext('2d'),w=cv.width,h=cv.height;
    const gr=v.createRadialGradient(w/2,h*.45,Math.min(w,h)*.35,w/2,h*.5,Math.max(w,h)*.75);gr.addColorStop(0,'rgba(8,10,28,0)');gr.addColorStop(1,night&&!interior?'rgba(8,10,28,.5)':'rgba(8,10,28,.26)');
    v.fillStyle=gr;v.fillRect(0,0,w,h);}
  return VIG;}

function camera(ppx,ppy){let cx=ppx+8-VW/2,cy=ppy+8-VH/2;
  if(interior){const mw=W*TS,mh=H*TS;cx=mw<=VW?Math.round((mw-VW)/2):Math.max(0,Math.min(mw-VW,cx));cy=mh<=VH?Math.round((mh-VH)/2):Math.max(0,Math.min(mh-VH,cy));}
  return[cx,cy];}
function loop(ts){const dt=Math.min(50,(ts-lastT)||16);lastT=ts;anim+=dt;pollPad();update(dt);tickHeli(dt);
  LIGHT=(night&&!interior)?'n':'d';
  const k=me.moving?Math.min(1,me.t):0,ppx=Math.round((me.fx+(me.x-me.fx)*k)*TS),ppy=Math.round((me.fy+(me.y-me.fy)*k)*TS);
  const[cx,cy]=J?jumpCam():camera(ppx,ppy);LABELS=[];
  drawScene(bx,cx,cy,VW,VH,ppx,ppy,true);
  if(smooth){ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(smoothFrame(),0,0,cv.width,cv.height);ctx.drawImage(vignette(),0,0);}
  else{ctx.imageSmoothingEnabled=false;ctx.drawImage(buf,0,0,cv.width,cv.height);}
  LABELS.forEach(l=>label(l[0],l[1],l[2]));
  requestAnimationFrame(loop);}
if(!IS_TOUCH)setTimeout(()=>{if(st==='title')$('go').focus({preventScroll:true});},100);
/* …/artifact-link#resume opens the text résumé directly */
const hashResume=()=>{if(location.hash==='#resume'&&!(st==='panel'&&$('entry').style.display==='flex')){if(started)resumeNow();else openResume();}};
addEventListener('hashchange',hashResume);hashResume();
requestAnimationFrame(loop);
