/* ═════════ TILES (16×16, drawn 1:1) ═════════ */
const SANDY=new Set([PATH,DOOR,FNT,BOARD,APRON,HELIPAD]);     // the road runs straight onto the airfield apron
const isPath=t=>SANDY.has(t);
const isFence=t=>t===FEN||t===FENV;

/* ── grass: flat mint with small three-stroke tufts ── */
const TUFT=[[0,0],[3,0],[6,0],[1,1],[5,1]];
function tuft(c,x,y,col){TUFT.forEach(([i,j])=>Q(c,x+i,y+j,1,1,col));}
const GV=[[[1,3,'gT'],[9,10,'gT']],[[6,6,'gT'],[8,13,'gL']],[[2,10,'gT'],[9,2,'gT']],[[7,12,'gT'],[1,5,'gL']]];
function grassBase(c){Q(c,0,0,16,16,C.g);
  if(ND)for(let y=0;y<16;y+=2)for(let x=(y&2)?1:0;x<16;x+=2)Q(c,x,y,1,1,C.ndot);}   // night: fine teal dither
function grass(c,v){grassBase(c);GV[v&3].forEach(([x,y,k])=>tuft(c,x,y,C[k]));}

/* ── sand path: per-pixel distance field → soft wavy light-green border, rounded corners ── */
function nbMask(x,y,f){const P=(dx,dy)=>f(at(x+dx,y+dy))?1:0;
  return P(0,-1)|P(1,0)<<1|P(0,1)<<2|P(-1,0)<<3|P(-1,-1)<<4|P(1,-1)<<5|P(1,1)<<6|P(-1,1)<<7;}
function edgeDist(m,i,j,Rr){const u=m&1,r=m&2,d=m&4,l=m&8,ul=m&16,ur=m&32,dr=m&64,dl=m&128,fx=i+.5,fy=j+.5;let k=99;
  if(!u)k=Math.min(k,fy);if(!d)k=Math.min(k,16-fy);if(!l)k=Math.min(k,fx);if(!r)k=Math.min(k,16-fx);
  if(!u&&!l&&fx<Rr&&fy<Rr)k=Math.min(k,Rr-Math.hypot(Rr-fx,Rr-fy));
  if(!u&&!r&&fx>16-Rr&&fy<Rr)k=Math.min(k,Rr-Math.hypot(fx-16+Rr,Rr-fy));
  if(!d&&!l&&fx<Rr&&fy>16-Rr)k=Math.min(k,Rr-Math.hypot(Rr-fx,fy-16+Rr));
  if(!d&&!r&&fx>16-Rr&&fy>16-Rr)k=Math.min(k,Rr-Math.hypot(fx-16+Rr,fy-16+Rr));
  if(u&&l&&!ul)k=Math.min(k,Math.hypot(fx,fy));if(u&&r&&!ur)k=Math.min(k,Math.hypot(16-fx,fy));
  if(d&&l&&!dl)k=Math.min(k,Math.hypot(fx,16-fy));if(d&&r&&!dr)k=Math.min(k,Math.hypot(16-fx,16-fy));
  return k;}
function pathPx(c,m,odd){const sand=[],nar=((!(m&8)&&!(m&2))||(!(m&1)&&!(m&4)))?.62:1;   // one-tile-wide strips get a slimmer edge
  for(let j=0;j<16;j++)for(let i=0;i<16;i++){const d0=edgeDist(m,i,j,6),d=d0-((((i+j)>>2)&1)?0:.9),e=d0-((((i+j)>>1)&1)?0:.7);
    const col=d<.3*nar?C.g:d<1.3*nar?C.b2:e<4.1*nar?C.b1:e<5*nar?C.b3:e<5.8*nar?C.sE:C.s;if(col===C.s)sand.push(j*16+i);Q(c,i,j,1,1,col);}
  const S=new Set(sand),dot=(x,y,col)=>{if(S.has(y*16+x))Q(c,x,y,1,1,col);};
  if(ND)for(let j=1;j<16;j+=4)for(let i=((j>>2)&1)?3:1;i<16;i+=4){dot(i,j,C.sD);if((i+j)%8===2)dot(i+1,j-1,C.sD);}
  const bx=odd?8:1,by=odd?9:2;[[2,0],[0,2],[5,2],[4,4]].forEach(([i,j])=>dot(bx+i,by+j,C.sD));
  (odd?[[3,4],[12,2]]:[[11,11],[13,6]]).forEach(([i,j])=>dot(i,j,C.sL));}
function pathTile(x,y){const m=nbMask(x,y,isPath);return art('p'+m+'_'+(y&1),16,16,c=>pathPx(c,m,y&1));}

/* ── pond ── */
function waterPx(c,m,f){
  for(let j=0;j<16;j++)for(let i=0;i<16;i++){const dd=edgeDist(m,i,j,5);
    Q(c,i,j,1,1,dd<.4?C.g:dd<1.5?C.wK:dd<2.6?C.wD:C.w);}
  const ok=(x,y)=>edgeDist(m,x,y,5)>=3.2,dash=(x,y,n)=>{for(let k=0;k<n;k++)if(ok(x+k,y))Q(c,x+k,y,1,1,k===0?C.wH:C.wL);};
  dash(2+f*2,4,4);dash(9+f*2,9,4);dash(5-f,13,3);dash(11-f,2,2);}
function waterTile(x,y,f){const m=nbMask(x,y,t=>t===WAT);return art('w'+m+'_'+f,16,16,c=>waterPx(c,m,f));}

/* ── meadow plants: one leafy plant per tile, dark centre, light leaf tips ── */
const TALLG=[
'.......DD.......',
'.DD...DHHD...DD.',
'DHHD..DHHK..DLLD',
'DLHHD.DHLK.DLLBK',
'.DLHHLDLLKBLLBK.',
'..DLLLDKBKBBMK..',
'.DDDDDDKKKKKKKK.',
'DHHHLLDKKKBBBBMK',
'DLHLLBMKKKMBBMMK',
'.DDLBBMKKKMMMKK.',
'...DDDKKKKKKK...',
'.DLLLBDKKKBBBMK.',
'DLHLLBDKKKMBMMMK',
'DLLBDD.KBMK.KMMK',
'.DDD..KMMK...KK.',
'.......KK.......'];
const P_TALL={K:C.tK,D:C.tD,M:C.tM,B:C.tB,L:C.tL,H:C.tH};

/* ── flowers: two red blossoms over green leaves ── */
const FLOWER=[
'................',
'....XX.XX.......',
'...XrrXrRX......',
'..XrrRRRRX......',
'..XRROORRXXX....',
'...XROORXrrRX...',
'..XRRRRXrrRRRX..',
'..XRRXRXRROORX..',
'...XXKXXRROORX..',
'....KGgKXRRRRX..',
'...KGgGGKXRRX...',
'...KGGKKGKXXKK..',
'....KKKGgGGKGgK.',
'.......KGGKKGGK.',
'........KK..KK..',
'................'];
const P_FLOWER={R:C.rR,r:C.rL,X:C.rK,O:C.rO,G:C.lf,g:C.lfL,K:C.lfK};

/* ── white picket fence (two rounded pickets per tile, rail behind, shadow on the grass) ── */
const FENCE_H=[
'................',
'................',
'..KKKK....KKKK..',
'.KWWWWK..KWWWWK.',
'.KWWWWK..KWWWWK.',
'.KWLLLK..KWLLLK.',
'KKLBBbKKKKLBBbKK',
'WKLBBbKWWKLBBbKW',
'KKLBBbKKKKLBBbKK',
'KKLBBbKKKKLBBbKK',
'.KLBBbK..KLBBbK.',
'.KBBbbK..KBBbbK.',
'.KKKKKKS.KKKKKKS',
'..SSSSSS..SSSSSS',
'...SSSSS...SSSSS',
'....SSSS....SSSS'];
const P_FENCE={K:C.fK,W:C.fW,L:C.fL,B:C.fB,b:C.fb,S:C.fS};
function fenvSide(x,y){let yy=y;while(at(x,yy)===FENV)yy--;
  if(at(x,yy)===FEN){if(!isFence(at(x+1,yy)))return 9;if(!isFence(at(x-1,yy)))return 1;}return 1;}
function railV(c,xo,y0,y1){for(let y=y0;y<=y1;y++){Q(c,xo,y,1,1,C.fK);Q(c,xo+1,y,1,1,C.fL);Q(c,xo+2,y,2,1,C.fW);Q(c,xo+4,y,1,1,C.fb);Q(c,xo+5,y,1,1,C.fK);Q(c,xo+6,y,1,1,C.fS);}}
function fenceH(c,x,y){grass(c,hash(x,y)&3);stamp(c,FENCE_H,P_FENCE);
  if(!isFence(at(x-1,y))||at(x-1,y)===FENV)Q(c,0,6,1,4,C.g);
  if(!isFence(at(x+1,y))||at(x+1,y)===FENV)Q(c,15,6,1,4,C.g);
  if(at(x,y+1)===FENV){const xo=fenvSide(x,y+1);Q(c,xo,12,8,4,C.g);railV(c,xo,12,15);}}
function fenceV(c,x,y){grass(c,hash(x,y)&3);const xo=fenvSide(x,y),cont=isFence(at(x,y+1));
  railV(c,xo,0,cont?15:11);Q(c,xo+1,5,4,1,C.fK);Q(c,xo+1,6,4,1,C.fB);
  if(cont){Q(c,xo+1,13,4,1,C.fK);Q(c,xo+1,14,4,1,C.fB);}
  else{Q(c,xo,12,6,1,C.fK);Q(c,xo+2,13,6,1,C.fS);Q(c,xo+3,14,4,1,C.fS);}}

/* ── signpost (white board, red lettering) ── */
const SIGNG=[
'..KK........KK..',
'.KKKKKKKKKKKKKK.',
'.KWWWWWWWWWWWWK.',
'.KWWWWWWWWWWWWK.',
'.KLLLLLLLLLLLLK.',
'.KLTLTTLTTLTLLK.',
'.KLTTLTLLTTTLLK.',
'.KLLTLTTLTLTLLK.',
'.KLLLLLLLLLLLLK.',
'.KbbbbbbbbbbbbK.',
'.KKKKKKKKKKKKKK.',
'..KbK......KbK..',
'..KbK......KbK..',
'.SKKKSSSSSSKKKS.',
'..SSSSSSSSSSSS..',
'................'];
const P_SIGN={K:C.nK,W:C.nW,L:C.nL,b:C.nb,T:C.nT,S:C.fS};

/* ── ledge: brown scalloped rock strip in the lower half of the tile ── */
function ledgeT(c,x,y){grassBase(c);tuft(c,4,2,C.gT);
  const Lf=at(x-1,y)===LEDGE,Rt=at(x+1,y)===LEDGE;
  for(let i=0;i<16;i++){const m=i%8,hi=(m>=6||m<=1);let top=hi?8:9,bot=15,cap=false;       // 8-px rock bumps
    if(!Lf){if(i===0){top=11;bot=13;cap=true;}else if(i===1){top=10;bot=14;}}
    if(!Rt){if(i===15){top=11;bot=13;cap=true;}else if(i===14){top=10;bot=14;}}
    for(let j=top;j<=bot;j++){let col;
      if(cap||j===top||j===bot)col=C.lK;else if(j===bot-1)col=C.lD;
      else if(j<=10&&m>=1&&m<=3)col=C.lH;else if(m===5&&j<=12)col=C.lD;else col=C.lM;
      Q(c,i,j,1,1,col);}}}

/* ── small round shrub ── */
const SHRUB=[
'................',
'.....KKKKKK.....',
'...KKHHLLLLKK...',
'..KHHHLLLLMMMK..',
'.KHHLLLLLMMMMMK.',
'.KHLLLLLMMMMMDK.',
'KHLLLLLMMMMMMDDK',
'KLLLLLMMMMMMDDDK',
'KLLLMMMMMMMDDDDK',
'KLMMMMMMMMDDDDDK',
'.KMMMMMMDDDDDDK.',
'.KKMMMDDDDDDKKK.',
'...KKKKwvKKKK...',
'....SSKwvKSSS...',
'....SSKKKKSSS...',
'................'];
const P_SHRUB={K:C.eK,H:C.eH,L:C.eL,M:C.eM,D:C.eD,w:C.wd,v:C.wdD,S:C.gS};

/* ── bulletin board, mailbox, project kiosk ── */
const BOARDG=[
'................',
'.KKKKKKKKKKKKKK.',
'.KwwwwwwwwwwwwK.',
'.KwPPPPPPPPPPwK.',
'.KwPrrPbbPggPwK.',
'.KwPrrPbbPggPwK.',
'.KwPPPPPPPPPPwK.',
'.KwPyyyPPrrrPwK.',
'.KwPPPPPPPPPPwK.',
'.KvvvvvvvvvvvvK.',
'.KKKKKKKKKKKKKK.',
'...KwK....KwK...',
'...KvK....KvK...',
'..DKKKDDDDKKKD..',
'................',
'................'];
const P_BOARD={K:'#503820',w:'#c89050',v:'#a06c38',P:'#f8f0d0',r:'#e05048',b:'#4878d8',g:'#38a860',y:'#e8a830',D:C.sD};
const MAILG=[
'................',
'................',
'....KKKKKKKK....',
'...KrrrrrrrrK...',
'...KRRRRRRRRK...',
'...KRWWWWWWRK...',
'...KRRRRRRRRK...',
'...KDDDDDDDDK...',
'...KKKKKKKKKK...',
'......KwvK......',
'......KwvK......',
'......KwvK......',
'......KwvK......',
'.....SKKKKSS....',
'.....SSSSSSS....',
'................'];
const P_MAIL={K:'#402830',R:'#e04848',r:'#f88070',D:'#b02c3c',W:'#f8f8f8',w:C.wd,v:C.wdD,S:C.fS};
const KIOSKG=[
'................',
'.KKKKKKKKKKKKKK.',
'.KwwwwwwwwwwwwK.',
'.KwcccccccccccK.',
'.KwCCCCCCCCCCvK.',
'.KwCCCCCCCCCCvK.',
'.KwCCCCCCCCCCvK.',
'.KwCCCCCCCCCCvK.',
'.KwCCCCCCCCCCvK.',
'.KwvvvvvvvvvvvK.',
'.KKKKKKKKKKKKKK.',
'...KwK....KwK...',
'...KvK....KvK...',
'..SKKKSSSSKKKS..',
'..SSSSSSSSSSSS..',
'................'];
const KICON=[
 ['.WW..WW.','W..WW..W','W..WW..W','W..WW..W','WWWWWWWW'],          // open book — Muslimo
 ['.WWWWWW.','WW.WWW.W','W...W.WW','WW.WWWWW','W.W..W.W'],          // gamepad — Path of the Sahabah
 ['.WW..WW.','WWWWWWWW','.WWWWWW.','..WWWW..','...WW...'],          // heart — donation platform
 ['WW....WW','WW.WW.WW','..WWWW..','WW.WW.WW','WW....WW'],          // network nodes — automation
];
function kioskT(c,x,y){grass(c,hash(x,y)&3);const k=PROJ.find(k=>k.x===x&&k.y===y)||{i:0},col=KIOSKS[k.i].c;
  stamp(c,KIOSKG,{K:'#503820',w:'#c89050',v:'#a06c38',C:col,c:shade(col,45),S:C.fS});stamp(c,KICON[k.i],{W:'#ffffff'},4,4);}

/* ── airfield: concrete apron with a painted boundary line, and the helicopter pad marking ── */
const AP={b:'#c6cad2',l:'#d6dae2',s:'#b0b4be',e:'#8a8e9c',y:'#f0c838',w:'#f8f8fc'};
function apronPx(c,x,y){const paved=t=>t===APRON||t===HELIPAD||t===PATH;
  Q(c,0,0,16,16,AP.b);Q(c,0,15,16,1,AP.s);Q(c,15,0,1,16,AP.s);Q(c,0,0,15,1,AP.l);Q(c,0,0,1,15,AP.l);
  [[4,5],[11,9],[7,12]].forEach(([i,j])=>Q(c,i,j,1,1,AP.s));
  if(!paved(at(x,y-1))){Q(c,0,0,16,1,AP.e);Q(c,0,1,16,1,AP.y);}
  if(!paved(at(x,y+1))){Q(c,0,15,16,1,AP.e);Q(c,0,14,16,1,AP.y);}
  if(!paved(at(x-1,y))){Q(c,0,0,1,16,AP.e);Q(c,1,0,1,16,AP.y);}
  if(!paved(at(x+1,y))){Q(c,15,0,1,16,AP.e);Q(c,14,0,1,16,AP.y);}}
function padPx(c,x,y,letter){apronPx(c,x,y);const ox=(x-PAD.x)*16,oy=(y-PAD.y)*16;   // the H only shows while the helicopter is away
  for(let j=0;j<16;j++)for(let i=0;i<16;i++){const X=ox+i,Y=oy+j,r=Math.hypot(X+.5-32,Y+.5-32);
    if(r>=27&&r<29.6)Q(c,i,j,1,1,AP.y);
    else if(letter&&(((X>=22&&X<=25)||(X>=38&&X<=41))&&Y>=20&&Y<=43))Q(c,i,j,1,1,AP.w);
    else if(letter&&X>=22&&X<=41&&Y>=30&&Y<=33)Q(c,i,j,1,1,AP.w);}}

/* ── interior: off-white walls with a slate band, wooden pillars, round windows, wood-plank floor ── */
function tatami(c,y){Q(c,0,0,16,16,'#c79a66');for(let j=0;j<16;j+=4){Q(c,0,j,16,1,'#a87c4c');Q(c,0,j+1,16,1,'#d6ab78');}
  const o=(y%2)?5:11;for(let j=0;j<16;j+=4){const sx=(o+j*2)%16;Q(c,sx,j+1,1,3,'#a87c4c');}}
function iwall(c,x,y){
  const side=(x===0||x===W-1);
  if(side&&y>=1){Q(c,0,0,16,16,'#383030');Q(c,x===0?14:0,0,2,16,'#584840');return;}
  if(y===0){Q(c,0,0,16,16,'#e6e1d6');Q(c,0,0,16,3,'#2f4858');Q(c,0,3,16,1,'#1f3140');Q(c,0,15,16,1,'#cfc8b8');
    if(x%6===2||x%6===4){Q(c,4,5,8,10,'#685030');Q(c,3,6,10,8,'#685030');Q(c,5,6,6,8,'#88c8c0');Q(c,4,7,8,6,'#88c8c0');Q(c,7,6,2,8,'#487878');Q(c,4,9,8,2,'#487878');Q(c,5,7,2,2,'#c8f0e8');}}
  else{Q(c,0,0,16,16,'#ece7dc');Q(c,0,0,16,1,'#cfc8b8');Q(c,0,11,16,1,'#1f3140');Q(c,0,12,16,3,'#2f4858');Q(c,0,12,16,1,'#46677a');Q(c,0,15,16,1,'#1f3140');}
  if(x%6===0&&!side){Q(c,5,0,6,16,'#584020');Q(c,6,0,4,16,'#a87038');Q(c,7,0,1,16,'#c89050');for(let j=2;j<16;j+=5){Q(c,6,j,4,1,'#805028');Q(c,8,j+1,2,1,'#805028');}}
}

/* ── tile lookup: returns the cached 16×16 canvas for a map cell ── */
function tileArt(id,x,y,fr){const v=hash(x,y)&3,rm=interior?interior.id:'';
  switch(id){
    case PATH:case FNT:return pathTile(x,y);
    case APRON:return art('ap'+x+'_'+y,16,16,c=>apronPx(c,x,y));
    case HELIPAD:{const on=heliOnPad();return art('pad'+x+'_'+y+(on?'':'h'),16,16,c=>padPx(c,x,y,!on));}
    case TALL:return art('tall',16,16,c=>{grassBase(c);stamp(c,TALLG,P_TALL);});
    case WAT:return waterTile(x,y,fr);
    case FEN:return art('fh'+x+'_'+y,16,16,c=>fenceH(c,x,y));
    case FENV:return art('fv'+x+'_'+y,16,16,c=>fenceV(c,x,y));
    case FLW:return art('fl'+fr,16,16,c=>{grassBase(c);stamp(c,FLOWER.slice(0,9),P_FLOWER,fr,0);stamp(c,FLOWER.slice(9),P_FLOWER,0,9);});
    case SIGN:return art('sg',16,16,c=>{grass(c,1);stamp(c,SIGNG,P_SIGN);});
    case LEDGE:return art('lg'+(at(x-1,y)===LEDGE?1:0)+(at(x+1,y)===LEDGE?1:0),16,16,c=>ledgeT(c,x,y));
    case BUSH:return art('sh',16,16,c=>{grassBase(c);stamp(c,SHRUB,P_SHRUB);});
    case BOARD:return art('bd'+x+'_'+y,16,16,c=>{pathPx(c,nbMask(x,y,isPath),y&1);stamp(c,BOARDG,P_BOARD);});
    case MAILBOX:return art('mb',16,16,c=>{grass(c,1);stamp(c,MAILG,P_MAIL);});
    case KIOSK:return art('ki'+x+'_'+y,16,16,c=>kioskT(c,x,y));
    case FLOOR:return art('tat'+(y%2),16,16,c=>tatami(c,y),1);
    case RUG:return art('rug'+(y%2),16,16,c=>{tatami(c,y);Q(c,0,0,16,16,'#c85048');Q(c,0,0,16,1,'#e8c050');Q(c,0,15,16,1,'#e8c050');},1);
    case WALLI:return art('iw'+rm+x+'_'+y,16,16,c=>iwall(c,x,y),1);
    case TABLE:return art('tb'+(y%2),16,16,c=>{tatami(c,y);Q(c,0,1,16,12,'#383028');Q(c,0,2,16,10,'#c8b060');Q(c,0,2,16,2,'#e0d088');Q(c,0,10,16,2,'#a08840');Q(c,1,13,2,3,'#383028');Q(c,13,13,2,3,'#383028');},1);
    case EXIT:return art('ex'+(y%2),16,16,c=>{tatami(c,y);Q(c,1,4,14,11,'#383028');Q(c,2,5,12,9,'#c86838');Q(c,3,6,10,7,'#e89058');for(let i=4;i<12;i+=2)Q(c,i,7,1,5,'#c86838');},1);
    case SHELF:return art('bk'+rm+x,16,16,c=>{iwall(c,x,1);Q(c,1,0,14,16,'#383028');Q(c,2,1,12,14,'#c08848');Q(c,2,1,12,1,'#e0b070');Q(c,3,3,10,4,'#a07038');Q(c,3,9,10,4,'#a07038');Q(c,3,3,10,1,'#583818');Q(c,3,9,10,1,'#583818');Q(c,7,5,2,1,'#e8d0a0');Q(c,7,11,2,1,'#e8d0a0');},1);
    case FRIDGE:return art('fr',16,16,c=>{iwall(c,3,1);Q(c,3,0,10,16,'#383028');Q(c,4,1,8,14,'#e8ecf4');Q(c,4,6,8,1,'#b0b8c8');Q(c,10,3,1,2,'#808898');Q(c,10,8,1,3,'#808898');Q(c,5,2,4,3,'#f8d048');},1);
    case DESK:return art('dk'+(y%2),16,16,c=>{tatami(c,y);Q(c,0,3,16,11,'#383028');Q(c,1,4,14,9,'#c08848');Q(c,1,4,14,1,'#e0b070');Q(c,3,0,10,8,'#383028');Q(c,4,1,8,6,'#9898e8');Q(c,5,2,3,1,'#d0d0f8');Q(c,8,4,3,1,'#d0d0f8');},1);
    default:return art('g'+v,16,16,c=>grass(c,v));
  }
}
