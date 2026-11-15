/* ═════════ PIXEL CORE — everything is drawn 1:1 in art pixels (16 px tiles) ═════════ */
const TS=16;
const $=id=>document.getElementById(id);
const hash=(x,y)=>((((x+97)*73856093)^((y+57)*19349663))>>>0);
function mkc(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
const Q=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h);};
function stamp(c,rows,pal,ox,oy,flip){ox=ox||0;oy=oy||0;
  for(let j=0;j<rows.length;j++){const r=rows[j],n=r.length;
    for(let i=0;i<n;i++){const col=pal[r[i]];if(col){c.fillStyle=col;c.fillRect(ox+(flip?n-1-i:i),oy+j,1,1);}}}}
function shade(hex,amt){const n=parseInt(hex.slice(1),16);let r=(n>>16)+amt,g=((n>>8)&255)+amt,b=(n&255)+amt;
  r=Math.max(0,Math.min(255,r));g=Math.max(0,Math.min(255,g));b=Math.max(0,Math.min(255,b));
  return '#'+((r<<16)|(g<<8)|b).toString(16).padStart(6,'0');}
function grid(w,h){const g=[];for(let y=0;y<h;y++)g.push(new Array(w).fill(null));return g;}
function gs(g,x,y,c){if(y>=0&&y<g.length&&x>=0&&x<g[0].length)g[y][x]=c;}
function outline(g,col){const h=g.length,w=g[0].length,o=[];
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(!g[y][x]&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>{const yy=y+dy,xx=x+dx;return yy>=0&&yy<h&&xx>=0&&xx<w&&g[yy][xx]&&g[yy][xx]!==col;}))o.push([x,y]);
  o.forEach(([x,y])=>g[y][x]=col);}
function blit(c,g,ox,oy){ox=ox||0;oy=oy||0;for(let y=0;y<g.length;y++)for(let x=0;x<g[0].length;x++)if(g[y][x])Q(c,ox+x,oy+y,1,1,g[y][x]);}

/* Day palette — the daytime route reference, lifted a touch brighter */
const C={
  g:'#74d4a4',gT:'#56b88c',gL:'#aaf0cc',gS:'#5cbc90',
  s:'#f6e690',sD:'#e0cc78',sL:'#fcf4bc',sE:'#e4d28a',b1:'#bceaa8',b2:'#92dca8',b3:'#d0e09c',
  tK:'#2c6c20',tD:'#3a8c34',tM:'#46a45c',tB:'#56bc7c',tL:'#80dca4',tH:'#b8f4cc',
  eK:'#205c38',eD:'#34884c',eM:'#52b65a',eL:'#84dc6c',eH:'#c4f88c',wd:'#b08050',wdD:'#805830',
  fK:'#5c6480',fW:'#f8f8ff',fL:'#dce0f4',fB:'#a8b2cc',fb:'#949eb8',fS:'#74968e',
  lK:'#583038',lD:'#744048',lM:'#8c5458',lH:'#a87470',
  nK:'#48546c',nW:'#f8f8fc',nL:'#e0e0f0',nb:'#b4b8d0',nT:'#e84848',
  rR:'#f04c4c',rL:'#fc8874',rK:'#b83040',rO:'#fcc050',lf:'#3cb874',lfL:'#78dc9c',lfK:'#22744a',
  w:'#60a0f0',wL:'#90c4fc',wH:'#c8e4ff',wD:'#4480d8',wK:'#3264b0',
  o:'#404050',lit:'#f8e078',litH:'#fff4b8',ndot:'#4c7cac',
};

/* Night palette — lavender ground, teal plants, dark outlines (the night reference).
   Named colours are remapped exactly; anything else goes through a generic dusk tint. */
const NMAP=new Map();const rgbInt=h=>parseInt(h.slice(1),16);
function N(day,night){NMAP.set(rgbInt(day),rgbInt(night));}
[['g','#7c7acc'],['gT','#447ca8'],['gL','#6894c4'],['gS','#646cb4'],
 ['s','#827ad0'],['sD','#7068b4'],['sL','#9088dc'],['sE','#7e78cc'],['b1','#807cd0'],['b2','#7e7acc'],['b3','#827cd0'],
 ['tK','#0c3444'],['tD','#185c74'],['tM','#206c8c'],['tB','#307c9c'],['tL','#5094b8'],['tH','#80acd0'],
 ['eK','#0a141e'],['eD','#0e3c48'],['eM','#1a6078'],['eL','#247c94'],['eH','#3c98b0'],['wd','#544c80'],['wdD','#322c58'],
 ['fK','#18183a'],['fW','#9088d8'],['fL','#7c74c0'],['fB','#5e5a9c'],['fb','#484474'],['fS','#6464a8'],
 ['lK','#201838'],['lD','#443464'],['lM','#5c4888'],['lH','#7860ac'],
 ['nK','#1c1c30'],['nW','#847cc8'],['nL','#7068b0'],['nb','#54508c'],['nT','#302c5c'],
 ['rR','#a02880'],['rL','#c850a0'],['rK','#681460'],['rO','#d878b8'],['lf','#206c8c'],['lfL','#4490ac'],['lfK','#0e4054'],
 ['w','#4458ac'],['wL','#5c74c8'],['wH','#8898dc'],['wD','#32408c'],['wK','#202868'],
 ['lit','#f8e078'],['litH','#fff4b8'],['ndot','#4c7cac'],
].forEach(([k,n])=>N(C[k],n));
function nightRGB(v){const m=NMAP.get(v);if(m!==undefined)return m;
  const r=v>>16,g=(v>>8)&255,b=v&255,L=.3*r+.59*g+.11*b,k=.3+.7*L/255;
  const R2=Math.min(255,(.55*r+.45*L)*.64+14*k)|0,G2=Math.min(255,(.55*g+.45*L)*.58+10*k)|0,B2=Math.min(255,(.55*b+.45*L)*.84+56*k)|0;
  return (R2<<16)|(G2<<8)|B2;}
function nightify(g,w,h){const d=g.getImageData(0,0,w,h),a=d.data;
  for(let i=0;i<a.length;i+=4){if(!a[i+3])continue;const v=nightRGB((a[i]<<16)|(a[i+1]<<8)|a[i+2]);a[i]=v>>16;a[i+1]=(v>>8)&255;a[i+2]=v&255;}
  g.putImageData(d,0,0);}

/* art cache: one canvas per key and light mode. `fixed` art (characters, interiors) is never tinted. */
const ART={};let LIGHT='d',ND=false;
function art(key,w,h,draw,fixed){const k=fixed?key:key+'|'+LIGHT;let c=ART[k];if(c)return c;
  c=mkc(w,h);const g=c.getContext('2d');ND=!fixed&&LIGHT==='n';draw(g);if(ND)nightify(g,w,h);ND=false;return ART[k]=c;}
