/* ═════════ WORLD ═════════ */
const G=0,PATH=2,TRE=3,FLW=4,TALL=5,WAT=6,FEN=8,SIGN=9,WALL=12,DOOR=14,BUSH=16,FENV=17,LEDGE=18,KIOSK=31,FNT=34,BOARD=35,MAILBOX=36,APRON=40,HELIPAD=41;
const FLOOR=20,WALLI=21,TABLE=22,EXIT=23,RUG=24,SHELF=25,FRIDGE=26,DESK=27;
const SOLID=new Set([TRE,WAT,FEN,FENV,SIGN,WALL,BUSH,LEDGE,WALLI,TABLE,SHELF,FRIDGE,DESK,KIOSK,FNT,BOARD,MAILBOX,HELIPAD]);

/* T tree · . grass · = sand path · w meadow plants · f flowers · F picket fence · I fence post run · S signpost
   L ledge · ~ pond · o shrub · B bulletin board · M mailbox · K project kiosk · O fountain · c airfield apron
   X helicopter pad · other letters = buildings */
const ROWS=[
'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
'TTT......TT.WWWWWWWW.TT......TTTTTTTTTTT',
'TTTHHHHH.TT.WWWWWWWW.TTAAAAAATTTTTTTTTTT',
'T.fHHHHH....WWWWWWWW...AAAAAAf.TTTTTTTTT',
'T..HHHHH....WWWWWWWW...AAAAAA..TTTTTTTTT',
'T..HHHHH....WWWWWWWW...AAAAAA..TTccccccT',
'T..M.=....FFFF.==SFFF....S=...STTcXXXXcT',
'T================================cXXXXcT',
'T================================cXXXXcT',
'T.f....f...S========FFFFF==FFFFFFcXXXXcT',
'T...........=B===OO=Iof..==..foooccccccT',
'T.DDDDDD....=====OO=I..K.==.K..TTTTTTTTT',
'T.DDDDDD.~~~========I....==....TTTTTTTTT',
'T.DDDDDD.~~~...==...I..K.==.K..TTTTTTTTT',
'T.DDDDDD.~~~.f.==.f.Iof..==..foTTTTTTTTT',
'T...S=.........==...FFFFF==FFFFTTTTTTTTT',
'T....=..f.....S==..f....S==....TTTTTTTTT',
'T==============================TTTTTTTTT',
'T==============================TTTTTTTTT',
'T..CCCCCC..f.f.==..mmmmm.RRRRRRTTTTTTTTT',
'T..CCCCCC......==..mmmmm.RRRRRRTTTTTTTTT',
'T..CCCCCC.f.f..==..mmmmm.RRRRRRTTTTTTTTT',
'T...==========================.TTTTTTTTT',
'TFFFFFFFFFFFFFF==FFFFFFFFFFFFFFTTTTTTTTT',
'T......f.......==.wwwwww.......TTTTTTTTT',
'TTTTTTT..f.....==.wwwwww.TTTTTTTTTTTTTTT',
'TTTTTTT==================TTTTTTTTTTTTTTT',
'TTTTTTT==================TTTTTTTTTTTTTTT',
'TTTTTTTLLLL.S.====.LLLLLLTTTTTTTTTTTTTTT',
'TTTTTTTwwwwww.====.wwwwwwTTTTTTTTTTTTTTT',
'TTTTTTTwwwwww.====.wwwwwwTTTTTTTTTTTTTTT',
'TTTTTTTwwww.f.====.f.wwwwTTTTTTTTTTTTTTT',
'TTTTTTTwwwwf...ww....wwwwTTTTTTTTTTTTTTT',
'TTTTTTTFFFFFFFFwwFFFFFFFFTTTTTTTTTTTTTTT',
'TTTTTTT.......IwwI.......TTTTTTTTTTTTTTT',
'TTTTTTTTTTTTT.IwwI.TTTTTTTTTTTTTTTTTTTTT',
'TTTTTTTTTTTTT.IwwI.TTTTTTTTTTTTTTTTTTTTT',
];
const LEG={'T':TRE,'.':G,'=':PATH,'w':TALL,'f':FLW,'F':FEN,'I':FENV,'S':SIGN,'L':LEDGE,'~':WAT,'o':BUSH,'B':BOARD,'M':MAILBOX,'K':KIOSK,'O':FNT,'c':APRON,'X':HELIPAD};
const GATE_Y=24;                       // fence line between ALAM TOWN (north) and SOUTH ROAD
const PAD={x:34,y:7,n:4};              // 4×4-tile helicopter pad on the airfield
const zoneAt=(x,y)=>y>=GATE_Y?'SOUTH ROAD':x>=33?'AIRFIELD':'ALAM TOWN';
const START={x:16,y:30};
let W=40,H=ROWS.length;
let map=new Array(W*H).fill(G),bidx=new Array(W*H).fill(-1);
let interior=null;                     // null = outdoors
const at=(x,y)=>(x<0||y<0||x>=W||y>=H)?(interior?WALLI:TRE):map[y*W+x];

const BLD=[
  {id:'home',ch:'H',roof:'#e05848',roof2:'#b83c38',wall:'#f8f0d8',label:"FAHADBIN's HOUSE",em:null},
  {id:'lab', ch:'W',roof:'#6878a0',roof2:'#485880',wall:'#f0f0f4',label:'THE WORKSHOP',em:'gear'},
  {id:'army',ch:'A',roof:'#6c8848',roof2:'#4c6830',wall:'#e8e0c0',label:'82nd AIRBORNE',em:'star'},
  {id:'drex',ch:'D',roof:'#4078d8',roof2:'#2858a8',wall:'#f8f0d0',label:'DREXEL UNIVERSITY',em:'cap'},
  {id:'mssa',ch:'C',roof:'#f08848',roof2:'#c86430',wall:'#f8f8f8',label:'MSSA CENTER',em:'cloud'},
  {id:'owr', ch:'R',roof:'#38a868',roof2:'#207848',wall:'#f0f8f0',label:'ONE WORLD RELIEF',em:'heart'},
  {id:'mart',ch:'m',roof:'#8858c8',roof2:'#6038a0',wall:'#f4f0f8',label:'BOOK MART',em:'book'},
];
ROWS.forEach((r,y)=>{if(r.length!==W)console.warn('map row '+y+' has length '+r.length);
  for(let x=0;x<W;x++){const ch=r[x],bi=BLD.findIndex(b=>b.ch===ch);
    if(bi>=0){const b=BLD[bi];map[y*W+x]=WALL;bidx[y*W+x]=bi;
      if(b.x===undefined){b.x=x;b.y=y;b.x2=x;b.y2=y;}b.x=Math.min(b.x,x);b.x2=Math.max(b.x2,x);b.y2=Math.max(b.y2,y);}
    else map[y*W+x]=LEG[ch]!==undefined?LEG[ch]:G;}});
BLD.forEach(b=>{b.w=b.x2-b.x+1;b.h=b.y2-b.y+1;b.dx=b.x+Math.floor(b.w/2);b.dy=b.y+b.h-1;map[b.dy*W+b.dx]=DOOR;});

/* Trees are 2×2-tile blocks anchored at odd x / even y; anything off the map is forest too. */
const treeBlock=(ax,ay)=>!interior&&at(ax,ay)===TRE&&at(ax+1,ay)===TRE&&at(ax,ay+1)===TRE&&at(ax+1,ay+1)===TRE;

const PROJ=[{x:23,y:12,i:0},{x:28,y:12,i:1},{x:23,y:14,i:2},{x:28,y:14,i:3}];
const FOUNT={x:17,y:11};
let SIGNS={
  '17,7':`THE WORKSHOP\nThree crystals inside: PROJECTS, RÉSUMÉ and EXPERIENCE.`,
  '25,7':`82nd AIRBORNE DIVISION\nU.S. Army · June 2020 – June 2025`,
  '30,7':`AIRFIELD →\nBoard the helicopter and parachute into town — the way FAHADBIN did with the 82nd AIRBORNE.`,
  '11,10':`ALAM TOWN\n"Where every career has a beginning."`,
  '4,16':`DREXEL UNIVERSITY\nPhiladelphia, PA`,
  '14,17':`↑ TOWN SQUARE · THE WORKSHOP\n← DREXEL      → PROJECT PARK\n↗ AIRFIELD   ↓ SOUTH ROAD`,
  '24,17':`↑ PROJECT PARK\nFour kiosks, one for each thing he built. Press ${ACT} at any kiosk.`,
  '12,29':`SOUTH ROAD\n↑ ALAM TOWN — home of FAHADBIN ALAM`,
};
let NPC=[
  {x:14,y:7,s:'mentor',name:'THE MENTOR',dir:'down',lines:n=>[`Hey ${n}, welcome to Alam Town!`,`This town is home to FAHADBIN ALAM — a U.S. Army veteran and Computer Science student at Drexel who builds full-stack software.`,`Explore the town. Every building, kiosk and sign holds part of his story.`,`Step inside the workshop behind me. Three crystals are waiting: PROJECTS, RÉSUMÉ and EXPERIENCE. Collect all three!`,`In a hurry? Press the RÉSUMÉ button at the top right any time.`]},
  {x:27,y:7,s:'sgt',name:'SERGEANT',dir:'down',lines:n=>[`Hooah! Looking for SGT ALAM? He served in the 82nd AIRBORNE from June 2020 to June 2025.`,`Communications Systems Specialist. He automated Cisco configuration in Python across 10+ devices — deployment went from 3 hours to 30 minutes.`,`Step inside the barracks for the full record. Then head east to the AIRFIELD and jump like he did!`]},
  {x:6,y:16,s:'prof',name:'DREXEL PROF',dir:'down',lines:n=>[`Fahadbin? One of my Computer Science students — with minors in Mathematics, Data Science, and Electrical & Computer Engineering.`,`He already holds a CCNA, Security+, Network+ and A+. Four certifications!`]},
  {x:9,y:22,s:'kid',name:'STUDENT',dir:'down',lines:n=>[`Have you seen the PROJECT PARK east of the square? Four kiosks, one for each thing he built!`,`PATH OF THE SAHABAH — the Roblox game — is my favorite.`]},
  {x:12,y:12,s:'lass',name:'TOURIST',dir:'right',lines:n=>[`This square is so peaceful. The bulletin board by the fountain has all of Fahadbin's links.`]},
  {x:24,y:22,s:'vol',name:'VOLUNTEER',dir:'down',lines:n=>[`Fahadbin founded ONE WORLD RELIEF — a nonprofit that supports orphans and builds water wells.`,`He built its donation platform himself: $20K+ processed across 50+ donations. Go inside and see!`]},
  {x:18,y:22,s:'lass2',name:'READER',dir:'down',lines:n=>[`Did you know he wrote a book? It's called THE IVORY. The Book Mart sells it!`,`The clerk says he was an Airbnb host, too — and automated the whole operation in Python.`]},
  {x:6,y:7,s:'mom',name:'NEIGHBOR',dir:'down',lines:n=>[`Oh, hi ${n}! Fahadbin is out at the workshop again.`,`If you need to reach him, his contact card is pinned on the fridge inside.`]},
  {x:9,y:27,s:'guide',name:'GUIDE',dir:'down',lines:n=>[`Hi, ${n}! ALAM TOWN is just north of here — follow the sand path straight up.`,`Talk to people, read the signs and step into the buildings. Each one holds a piece of FAHADBIN ALAM's résumé.`,`And don't miss the AIRFIELD in the north-east corner. You can parachute into town!`]},
  {x:33,y:10,s:'jump',name:'JUMPMASTER',dir:'up',lines:n=>[`Welcome to the AIRFIELD, ${n}.`,`FAHADBIN jumped out of aircraft with the 82nd AIRBORNE DIVISION. Today it's your turn.`,`Walk up to the helicopter and press ${ACT}. We fly you over town — you decide where to land.`]},
];

/* ═════════ INTERIORS ═════════ */
const OUT={W,H,map,bidx,NPC,SIGNS};
const CAPS=[{x:5,y:4,i:0},{x:7,y:4,i:1},{x:9,y:4,i:2}];
const INT={
  lab:{W:15,H:10,build(){const w=15,h=10,m=new Array(w*h).fill(FLOOR);const S=(x,y,v)=>m[y*w+x]=v;
    for(let x=0;x<w;x++){S(x,0,WALLI);S(x,1,WALLI);}for(let y=0;y<h;y++){S(0,y,WALLI);S(w-1,y,WALLI);}
    [1,2,3,11,12,13].forEach(x=>S(x,1,SHELF));for(let x=4;x<=10;x++)S(x,4,TABLE);S(12,5,DESK);S(2,6,DESK);
    S(7,9,EXIT);return m;},
    start:{x:7,y:8},npc:[{x:12,y:6,s:'mentor',name:'THE MENTOR',dir:'left',lines:n=>[`The three crystals on the table each hold a piece of FAHADBIN's story.`,`Walk up to one and press ${ACT} to open it.`]}],
    signs:{'1,1':`Bookshelf: Python, TypeScript, C#, SQL... and one copy of THE IVORY.`,'2,1':`Bookshelf: CCNA, Security+, Network+ and A+ study guides — all four passed.`,'3,1':`Bookshelf: FastAPI, React Native, PostgreSQL and Docker handbooks, full of sticky notes.`,'12,5':`A desk covered in Cisco configuration printouts — and the Python script that automated them.`,'2,6':`A workstation showing MUSLIMO's CI pipeline: 95 backend pytest tests on every pull request.`}},
  home:{W:13,H:10,build(){const w=13,h=10,m=new Array(w*h).fill(FLOOR);const S=(x,y,v)=>m[y*w+x]=v;
    for(let x=0;x<w;x++){S(x,0,WALLI);S(x,1,WALLI);}for(let y=0;y<h;y++){S(0,y,WALLI);S(w-1,y,WALLI);}
    S(2,1,FRIDGE);[3,4,9,10,11].forEach(x=>S(x,1,SHELF));for(let x=5;x<=7;x++)S(x,5,TABLE);S(6,9,EXIT);return m;},
    start:{x:6,y:8},npc:[{x:3,y:4,s:'mom',name:'ROOMMATE',dir:'down',lines:n=>[`Come on in, ${n}! Make yourself at home.`,`Fahadbin's contact card is on the fridge if you need him.`]}],
    signs:{'2,1':`FRIDGE NOTE\nfma52@drexel.edu · 856-870-7528\nlinktr.ee/fahadbin.alam`,'3,1':`Family photos and a framed Army Commendation Medal.`}}
};
