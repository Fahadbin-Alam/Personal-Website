/* ═════════ OBJECTS: trees, buildings, fountain, crystals ═════════ */

/* Tall three-tier evergreen, 32×48: the lower 32 px sit on a 2×2-tile footprint, the top 16 px overlap the row above. */
function treeArt(){return art('tree',32,48,c=>{
  const g=grid(32,48),cx=16,FOL=new Set([C.eH,C.eL,C.eM,C.eD]);
  for(let y=41;y<48;y++)for(let x=1;x<31;x++){const ex=(x+.5-cx)/14.5,ey=(y+.5-44.5)/3.4;if(ex*ex+ey*ey<=1)g[y][x]=C.gS;}
  for(let y=38;y<46;y++){for(let x=14;x<18;x++)g[y][x]=x<16?C.wd:C.wdD;g[y][13]=C.eK;g[y][18]=C.eK;}
  for(let x=13;x<19;x++)g[46][x]=C.eK;
  const tiers=[[20,40,9.6,15.9],[9,27,5.4,14.5],[1,15,.6,11.4]];
  tiers.forEach(([t,b,w0,w1],ti)=>{
    const bot=x=>b-Math.round(2.6*Math.abs(((x+ti*2)%6)-3)/3),hwAt=y=>w0+(w1-w0)*Math.pow((y-t)/(b-t),.78);
    for(let x=0;x<32;x++){const yb=bot(x),dx=x+.5-cx;
      for(let y=t;y<=yb;y++){const f=(y-t)/(b-t),hw=hwAt(y);if(Math.abs(dx)>hw)continue;
        const sc=1-1.25*f-.55*dx/hw+(((x+ti*3)%4<2)?.09:-.09);
        g[y][x]=sc>.8?C.eH:sc>.26?C.eL:sc>-.36?C.eM:C.eD;}
      if(Math.abs(dx)<=hwAt(yb)){if(yb+1<48&&FOL.has(g[yb+1][x]))g[yb+1][x]=C.eK;if(yb+2<48&&FOL.has(g[yb+2][x]))g[yb+2][x]=C.eD;}}
  });
  const solid=v=>v&&v!==C.gS&&v!==C.eK,edge=[];
  for(let y=0;y<48;y++)for(let x=0;x<32;x++){const v=g[y][x];if(v&&v!==C.gS)continue;
    if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>{const yy=y+dy,xx=x+dx;return yy>=0&&yy<48&&xx>=0&&xx<32&&solid(g[yy][xx]);}))edge.push([x,y]);}
  edge.forEach(([x,y])=>g[y][x]=C.eK);
  blit(c,g);});}

/* Building emblems (7×7) shown on a small board above each door */
const EMB={
 gear:['..W.W..','.WWWWW.','WW...WW','.W...W.','WW...WW','.WWWWW.','..W.W..'],
 star:['...W...','...W...','WWWWWWW','.WWWWW.','..WWW..','.WW.WW.','.W...W.'],
 cap:['...W...','.WWWWW.','WWWWWWW','.WWWWWW','..WWW.W','..WWW.W','.......'],
 cloud:['.......','..WW...','.WWWWW.','WWWWWWW','WWWWWWW','.WWWWW.','.......'],
 heart:['.......','.WW.WW.','WWWWWWW','WWWWWWW','.WWWWW.','..WWW..','...W...'],
 book:['.......','WWW.WWW','W.WWW.W','W.WWW.W','W.WWW.W','WWWWWWW','.......'],
};
const BHEAD=8;   // head-room above the footprint for ridge / chimney
function buildingArt(b){const w=b.w*16,h=b.h*16;
  return art('bld'+b.id,w,h+BHEAD,c=>{c.save();c.translate(0,BHEAD);
    const o=C.o,rh=b.h>=5?40:b.h===4?30:22,rf=b.roof,rfL=shade(rf,40),rfD=b.roof2,wl=b.wall;
    // wall
    Q(c,1,rh-2,w-2,h-rh+2,o);Q(c,2,rh-2,w-4,h-rh+1,wl);
    for(let j=rh+7;j<h-6;j+=5)Q(c,2,j,w-4,1,shade(wl,-20));
    Q(c,2,rh,w-4,2,shade(wl,-60));Q(c,2,rh+2,w-4,1,shade(wl,-28));
    Q(c,2,h-5,w-4,4,'#b0a8a0');Q(c,2,h-5,w-4,1,'#d8d0c8');Q(c,2,h-2,w-4,1,'#8c8478');
    for(let i=7;i<w-4;i+=8)Q(c,i,h-4,1,2,'#8c8478');
    // windows
    const dxk=b.dx-b.x,wy=rh+(b.h>=4?7:5),gl=ND?C.lit:'#68a0e8',gh=ND?C.litH:'#a8d0f8';
    for(let k=0;k<b.w;k++){if(k===dxk||(b.w>=5&&(k===0||k===b.w-1)))continue;const x=k*16+3;
      Q(c,x,wy,11,9,o);Q(c,x+1,wy+1,9,7,gl);Q(c,x+5,wy+1,1,7,'#f8f8f8');Q(c,x+1,wy+4,9,1,'#f8f8f8');
      Q(c,x+1,wy+1,2,1,gh);Q(c,x+1,wy+2,1,1,gh);Q(c,x+6,wy+1,2,1,gh);Q(c,x+6,wy+2,1,1,gh);
      Q(c,x,wy+9,11,1,shade(wl,-40));}
    // door
    const dx=dxk*16+2,dy=h-15;
    Q(c,dx,dy,12,15,o);Q(c,dx+1,dy+1,10,14,'#8c5830');Q(c,dx+2,dy+2,8,13,'#b87848');Q(c,dx+2,dy+2,8,1,'#d89c60');
    Q(c,dx+3,dy+4,2,4,'#986038');Q(c,dx+7,dy+4,2,4,'#986038');Q(c,dx+3,dy+9,2,4,'#986038');Q(c,dx+7,dy+9,2,4,'#986038');Q(c,dx+8,dy+8,1,2,'#f8d868');
    // emblem board above the door
    if(b.em){const ex=dxk*16+3,ey=rh+(b.h>=5?8:b.h===4?5:1);
      Q(c,ex,ey,11,9,o);Q(c,ex+1,ey+1,9,7,'#f8f8f0');stamp(c,EMB[b.em],{W:b.roof2},ex+2,ey+1);}
    // roof: bevelled top corners, shingle rows, dark eave
    for(let j=-4;j<rh;j++){const ins=j<0?-j:0,x0=ins,x1=w-ins-1,band=Math.floor((j+4)/5),ph=(j+4)%5;
      let col=rf;if(j<=-3)col=rfL;else if(j>=rh-3)col=rfD;else if(ph===4)col=rfD;
      Q(c,x0,j,x1-x0+1,1,col);
      if(j>-3&&j<rh-3&&ph!==4){for(let x=x0+2+((band*4)%8);x<x1-1;x+=8)Q(c,x,j,1,1,rfD);if(ph===0)for(let x=x0+5+((band*4)%8);x<x1-3;x+=8)Q(c,x,j,2,1,rfL);}
      if(j>-3&&j<rh-1){Q(c,x0+1,j,1,1,rfL);Q(c,x1-1,j,1,1,rfD);}
      Q(c,x0,j,1,1,o);Q(c,x1,j,1,1,o);}
    Q(c,4,-4,w-8,1,o);Q(c,0,rh-1,w,1,o);
    if(b.id==='home'){const cxh=w-15;Q(c,cxh,-8,8,11,o);Q(c,cxh+1,-7,6,9,'#b06858');Q(c,cxh+1,-7,6,1,'#dc9480');Q(c,cxh+1,-4,6,1,'#8c4840');Q(c,cxh+1,-1,6,1,'#8c4840');Q(c,cxh+4,-6,1,2,'#8c4840');Q(c,cxh+2,-3,1,2,'#8c4840');}
    c.restore();});}

/* Town-square fountain, 32×32, three ripple frames */
function fountainArt(f){return art('fnt'+f,32,32,c=>{const g=grid(32,32),K='#585c74';
  const E=(cx,cy,rx,ry,col,only)=>{for(let y=0;y<32;y++)for(let x=0;x<32;x++){const ex=(x+.5-cx)/rx,ey=(y+.5-cy)/ry;if(ex*ex+ey*ey<=1&&(!only||g[y][x]===only))g[y][x]=col;}};
  E(16,21.5,15.6,9.8,C.sD);                                   // soft ground shadow
  E(16,19,15,10.5,K);E(16,19,14,9.5,'#a4a8bc');E(16,18,14,8.6,'#d4d8e8');   // stone rim: light top, shaded front
  E(16,17.6,11.6,6.9,K);E(16,17.8,10.6,6,C.w);E(16,16.6,10.6,4.9,C.wL,C.w);E(16,18.4,10.2,5.4,C.w,C.wL);
  const ring=[[5.5,2.6],[7.5,3.6],[9.3,4.6]][f];
  for(let a=0;a<64;a++){const x=Math.round(15.5+Math.cos(a/64*6.283)*ring[0]),y=Math.round(18+Math.sin(a/64*6.283)*ring[1]);if(g[y]&&(g[y][x]===C.w||g[y][x]===C.wL)&&(a%4<2))g[y][x]=C.wH;}
  for(let y=7;y<19;y++){g[y][13]=K;g[y][18]=K;g[y][14]='#eceef8';g[y][15]='#d4d8e8';g[y][16]='#d4d8e8';g[y][17]='#a4a8bc';}
  for(let x=13;x<19;x++)g[19][x]=K;
  for(let x=10;x<22;x++){g[4][x]=K;g[5][x]=x<13?'#eceef8':x<19?'#d4d8e8':'#a4a8bc';g[6][x]=x<19?'#a4a8bc':'#8c90a8';g[7][x]=K;}g[5][9]=K;g[6][9]=K;g[5][22]=K;g[6][22]=K;
  const jet=[[15,1],[16,2],[12,2+f%2],[19,2+(f+1)%2],[11,3],[20,3]];jet.forEach(([x,y])=>{g[y][x]=C.wH;});g[3][15]=C.wL;g[3][16]=C.wH;
  blit(c,g);});}

/* Crystal floating over the workshop table (12×14): a faceted gem in its own colour; dimmed with a check once collected */
const CRYS=[
'.....KK.....',
'....KHHK....',
'...KHHLMK...',
'..KHHLLMMK..',
'.KHHLLLMMDK.',
'.KHWLLLMMDK.',
'.KHWLLLMMDK.',
'.KHLLLLMMDK.',
'.KLLLLMMMDK.',
'.KLLLMMMDDK.',
'..KLLMMDDK..',
'...KLMMDK...',
'....KMDK....',
'.....KK.....'];
const TICK=['.GGG.','GGGGW','GWGWG','GGWGG','.GGG.'];
function crystalArt(col,done){return art('cry'+col+(done?1:0),12,14,c=>{
  if(done)c.globalAlpha=.5;
  stamp(c,CRYS,{K:'#30283c',W:'#ffffff',H:shade(col,95),L:shade(col,45),M:col,D:shade(col,-55)});c.globalAlpha=1;
  if(done)stamp(c,TICK,{G:'#2c9c58',W:'#ffffff'},7,0);},1);}

/* ═════════ AIRFIELD ART: helicopter seen from above (nose west), parachute canopy, clouds ═════════ */
const HB={K:'#2c3420',B:'#6c8048',L:'#94a868',D:'#4c5c30',d:'#3c4a26',G:'#283850',H:'#7898c0',R:'#343840'},HS=64,HUB={x:29,y:32};
function heliBody(){return art('heliB',HS,HS,c=>{const g=grid(HS,HS);
  const E=(cx,cy,rx,ry,col,ok)=>{for(let y=0;y<HS;y++)for(let x=0;x<HS;x++){const ex=(x+.5-cx)/rx,ey=(y+.5-cy)/ry;if(ex*ex+ey*ey<=1&&(!ok||ok(g[y][x])))g[y][x]=col;}};
  const R=(x,y,w,h,col)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(j>=0&&j<HS&&i>=0&&i<HS)g[j][i]=col;};
  R(41,30,11,5,HB.B);R(52,31,9,3,HB.B);R(41,30,11,1,HB.L);R(52,31,9,1,HB.L);R(41,34,11,1,HB.D);R(52,33,9,1,HB.D);   // tail boom
  R(54,23,4,19,HB.B);R(54,23,4,1,HB.L);R(54,23,1,19,HB.L);R(57,24,1,18,HB.D);R(54,41,4,1,HB.D);                    // stabilator
  R(60,26,1,13,HB.R);R(59,30,2,5,HB.D);                                                                          // tail rotor
  R(19,19,8,3,HB.d);R(19,43,8,3,HB.d);R(22,22,3,2,HB.D);R(22,41,3,2,HB.D);                                         // wheels on stub struts
  E(26,32.5,18.2,9.8,HB.B);E(11.5,32.5,5.5,6.4,HB.B);                                                             // fuselage + nose
  E(24,29.5,16,6,HB.L,v=>v===HB.B);E(26,32.8,17,7,HB.B,v=>v===HB.L);                                               // light upper edge
  for(let y=38;y<HS;y++)for(let x=0;x<46;x++)if(g[y][x]===HB.B||g[y][x]===HB.L)g[y][x]=HB.D;                       // shaded lower edge
  E(14.5,32.5,7,7.4,HB.G,v=>v===HB.B||v===HB.L||v===HB.D);                                                        // cockpit glass
  R(9,29,4,1,HB.H);R(9,30,1,3,HB.H);R(11,31,2,1,HB.H);                                                            // glint
  for(let x=8;x<22;x++)for(const y of[32,33])if(g[y][x]===HB.G&&x>15)g[y][x]=HB.K;                                // windscreen centre post
  for(let y=22;y<44;y++){[22,33].forEach(x=>{if(g[y][x]&&g[y][x]!==HB.G&&g[y][x]!==HB.K)g[y][x]=HB.D;});}           // cabin door seams
  R(33,26,8,2,HB.d);R(33,37,8,2,HB.d);R(40,27,2,1,HB.R);R(40,37,2,1,HB.R);                                         // engine exhausts
  E(HUB.x,HUB.y+.5,4.4,4.4,HB.D);E(HUB.x,HUB.y+.5,2.3,2.3,HB.R);                                                  // rotor mast
  outline(g,HB.K);blit(c,g);},1);}
function rotorArt(fr,spin){return art('rot'+fr+(spin?'s':''),HS,HS,c=>{const hx=HUB.x,hy=HUB.y+.5,RR=28.5,a0=fr*Math.PI/12,px=new Set();
  if(spin){c.fillStyle='rgba(60,66,76,.15)';for(let y=0;y<HS;y++)for(let x=0;x<HS;x++){if(Math.hypot(x+.5-hx,y+.5-hy)<=RR+.5)c.fillRect(x,y,1,1);}
    for(let a=0;a<360;a+=1.5){const x=Math.floor(hx+Math.cos(a/57.3)*RR),y=Math.floor(hy+Math.sin(a/57.3)*RR);if(x>=0&&x<HS&&y>=0&&y<HS)px.add(y*HS+x);}
    c.fillStyle='rgba(60,66,76,.2)';px.forEach(k=>c.fillRect(k%HS,Math.floor(k/HS),1,1));px.clear();}
  const n=spin?2:4;
  for(let k=0;k<n;k++){const a=a0+k*(spin?Math.PI:Math.PI/2);for(let t=3;t<=RR;t+=.5){const x=hx+Math.cos(a)*t,y=hy+Math.sin(a)*t,x2=x-Math.sin(a)*.9,y2=y+Math.cos(a)*.9;
    [[x,y],[x2,y2]].forEach(([u,v])=>{u=Math.floor(u);v=Math.floor(v);if(u>=0&&u<HS&&v>=0&&v<HS)px.add(v*HS+u);});}}
  c.fillStyle=spin?'rgba(44,48,56,.6)':HB.R;px.forEach(k=>c.fillRect(k%HS,Math.floor(k/HS),1,1));},1);}
function heliShadow(){return art('heliS',HS,HS,c=>{c.fillStyle='#000';
  for(let y=0;y<HS;y++)for(let x=0;x<HS;x++){const ex=(x+.5-25)/19.4,ey=(y+.5-32.5)/10.8;if(ex*ex+ey*ey<=1)c.fillRect(x,y,1,1);}
  c.fillRect(41,29,20,7);c.fillRect(53,22,6,21);},1);}
function canopyArt(big){const w=big?26:14,h=big?13:8;return art('canopy'+(big?1:0),w,h,c=>{const g=grid(w,h),cx=w/2,rx=w/2-1,ry=h-3,bw=big?4:3;
  for(let x=1;x<w-1;x++){const u=(x+.5-cx)/rx,top=Math.max(1,Math.round((h-2)-ry*Math.sqrt(Math.max(0,1-u*u)))),bot=h-2-((x%bw)===(bw>>1)?1:0);
    for(let y=top;y<=bot;y++)g[y][x]=(y<=top+1&&u<.25)?'#a4b870':((Math.floor(x/bw)&1)?'#64783c':'#80944c');}
  outline(g,'#2c3420');blit(c,g);},1);}
function cloudArt(v){const w=v?30:40,h=v?12:15;return art('cloud'+v,w,h,c=>{const g=grid(w,h);
  const puffs=v?[[8,7,7,4.5],[16,5,8,5],[23,7.5,6,4]]:[[9,9,8,5],[19,6,9,6],[29,8.5,9,5.5],[15,10,10,4.5]];
  puffs.forEach(([cx,cy,rx,ry])=>{for(let y=0;y<h;y++)for(let x=0;x<w;x++){const ex=(x+.5-cx)/rx,ey=(y+.5-cy)/ry;if(ex*ex+ey*ey<=1)g[y][x]=(y+.5>cy+ry*.35)?'#dcecfc':'#ffffff';}});
  blit(c,g);});}
