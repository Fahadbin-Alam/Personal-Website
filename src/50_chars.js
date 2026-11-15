/* ═════════ CHARACTERS — compact 16×16 sprites (≈12×16 figure): big head, tiny body, dark outline ═════════
   K outline · H/h/I hair · C/c/W/B cap · S/s skin · E eye · T/t top · A sleeve · P pants · F shoes
   D skirt                                                                                              */
const HEAD={
 short:{
  down:['......KKKK......','....KKHHHHKK....','...KHIIHHHHHK...','..KHIHHHHHHHhK..','..KHHHHHHHHHhK..','..KHhSSHHSShhK..','..KhSSESSESShK..','..KSSSESSESSSK..','...KsSSSSSSsK...','....KKssssKK....'],
  up:  ['......KKKK......','....KKHHHHKK....','...KHIIHHHHHK...','..KHIHHHHHHHhK..','..KHHHHHHHHHhK..','..KHHHHHHHHHhK..','..KHHHHHHHHhhK..','..KShHHHHHHhSK..','...KKhhhhhhKK...','.....KssssK.....'],
  left:['......KKKK......','....KKHHHHKK....','...KIIHHHHHHK...','..KHIHHHHHHHhK..','..KHHHHHHHHHhK..','..KSSHHHHHHHhK..','..KSESSHHHHhhK..','..KSESSSHHhhK...','...KSSSSsshK....','....KKssKK......'],
 },
 cap:{
  down:['......KKKK......','....KKCCCCKK....','...KCWWWWWWCK...','..KCCWWWWWWCCK..','..KCCCCCCCCCCK..','..KBBBBBBBBBBK..','..KHSSESSESSHK..','..KSSSESSESSSK..','...KsSSSSSSsK...','....KKssssKK....'],
  up:  ['......KKKK......','....KKCCCCKK....','...KCCCCCCCCK...','..KCCCCCCCCCcK..','..KCCCCCCCCccK..','..KcCCCCCCcccK..','..KHKccccccKHK..','..KHHHHHHHHHHK..','...KKhHHHHhKK...','.....KssssK.....'],
  left:['......KKKK......','....KKCCCCKK....','...KWWCCCCCCK...','..KWWWCCCCCCcK..','..KWWCCCCCCCcK..','.KBBBBBCCCCccK..','.KKSESSHHHHHHK..','..KSESSSHHHhK...','...KSSSSsshK....','....KKssKK......'],
 },
 long:{
  down:['......KKKK......','....KKHHHHKK....','...KHIIHHHHHK...','..KHIHHHHHHHhK..','..KHHHHHHHHHhK..','..KHHhSSSShHhK..','..KHhSESSEShhK..','..KHhSESSEShhK..','..KHhsSSSSshhK..','..KHhKssssKhhK..'],
  up:  ['......KKKK......','....KKHHHHKK....','...KHIIHHHHHK...','..KHIHHHHHHHhK..','..KHHHHHHHHHhK..','..KHHHHHHHHHhK..','..KHHHHHHHHhhK..','..KHHHHHHHHhhK..','..KHHHHHHHHhhK..','..KHHhHHHHhhhK..'],
  left:['......KKKK......','....KKHHHHKK....','...KIIHHHHHHK...','..KHIHHHHHHHhK..','..KHHHHHHHHHhK..','..KSSHHHHHHHhK..','..KSESSHHHHhhK..','..KSESSSHHHhhK..','...KSSSSsHHhhK..','....KKssKHHhhK..'],
 }};
/* long-hair tails that fall over the shoulders (rows 10-11) */
const TAIL={down:['..KHhK....KhhK..','...KK......KK...'],
            up:  ['..KHhHHHHHhhhK..','...KKKKKKKKKK...'],
            left:['.........KHhhK..','..........KKK...']};
/* torso rows 10-12: [stand, step] */
const TORSO={
 down:[['....KTTSSTTK....','...KATTTTTTAK...','...KSKtTTtKSK...'],
       ['....KTTSSTTK....','...KSTTTTTTAK...','...KKKtTTtKSK...']],
 up:  [['....KTTTTTTK....','...KATTTTTTAK...','...KSKtTTtKSK...'],
       ['....KTTTTTTK....','...KSTTTTTTAK...','...KKKtTTtKSK...']],
 left:[['.....KTTTTK.....','.....KTATTK.....','.....KtSTtK.....'],
       ['.....KTTTTK.....','....KATTTTAK....','....KSKTTtKK....']]};
/* legs rows 13-15: [stand, step] */
const LEGS={
 pants:{
  down:[['....KPPKKPPK....','....KFFKKFFK....','....KKK..KKK....'],
        ['....KPPKKPPK....','....KFFKKKKK....','....KKK.........']],
  left:[['.....KPPPPK.....','....KFFFFFK.....','....KKKKKKK.....'],
        ['....KPPKKPPK....','...KFFK..KFFK...','...KKKK..KKKK...']]},
 skirt:{
  down:[['...KDDDDDDDDK...','....KFFKKFFK....','....KKK..KKK....'],
        ['...KDDDDDDDDK...','....KFFKKKKK....','....KKK.........']],
  left:[['....KDDDDDDK....','....KFFFFFK.....','....KKKKKKK.....'],
        ['...KDDDDDDDK....','...KFFK..KFFK...','...KKKK..KKKK...']]}};
LEGS.pants.up=LEGS.pants.down;LEGS.skirt.up=LEGS.skirt.down;
const SKIN={S:'#f8d0a8',s:'#e0a078'},SKIN2={S:'#d8a070',s:'#b07848'},OUT_K='#282028',CH_H=16,CH_UP=2;
const CHARS={
 player:{head:'short',legs:'pants',pal:{H:'#2a2230',h:'#17121c',I:'#4a3c56',T:'#14b8a6',t:'#0f8a7d',A:'#14b8a6',P:'#2b3350',F:'#f4f4f8',...SKIN2}},
 mentor:{head:'short',legs:'pants',pal:{H:'#3a3a48',h:'#24242e',I:'#6a6a7c',T:'#3b5bdb',t:'#2f49b0',A:'#3b5bdb',P:'#2a2a36',F:'#1c1c24',...SKIN}},
 sgt:{head:'cap',legs:'pants',pal:{C:'#6c8848',c:'#4c6830',W:'#8cac64',B:'#4c6830',H:'#382818',h:'#281808',T:'#789850',t:'#587838',A:'#789850',P:'#586838',F:'#403020',...SKIN2}},
 prof:{head:'short',legs:'pants',pal:{H:'#784828',h:'#583018',I:'#a06838',T:'#4878d8',t:'#3058a8',A:'#4878d8',P:'#484858',F:'#383030',...SKIN}},
 kid:{head:'cap',legs:'pants',pal:{C:'#f8c838',c:'#c89818',W:'#f8e478',B:'#c89818',H:'#784828',h:'#583018',T:'#f8f8f8',t:'#c8c8d8',A:'#f8d0a8',P:'#3868c8',F:'#383030',...SKIN}},
 vol:{head:'short',legs:'pants',pal:{H:'#302420',h:'#181010',I:'#504038',T:'#38a860',t:'#287840',A:'#38a860',P:'#484858',F:'#383030',...SKIN2}},
 lass:{head:'long',legs:'skirt',pal:{H:'#c07038',h:'#985028',I:'#e49858',T:'#f068a8',t:'#c04880',A:'#f068a8',D:'#f068a8',F:'#b04070',...SKIN}},
 lass2:{head:'long',legs:'skirt',pal:{H:'#40304c',h:'#281c34',I:'#604c70',T:'#8858c8',t:'#6038a0',A:'#8858c8',D:'#8858c8',F:'#483060',...SKIN}},
 mom:{head:'long',legs:'skirt',pal:{H:'#684020',h:'#482810',I:'#8c5c30',T:'#f8a048',t:'#c87828',A:'#f8a048',D:'#f8f0e0',F:'#784830',...SKIN}},
 jump:{head:'cap',legs:'pants',pal:{C:'#a03444',c:'#74202e',W:'#bc4c5c',B:'#74202e',H:'#382818',h:'#281808',T:'#789850',t:'#587838',A:'#789850',P:'#586838',F:'#403020',...SKIN}},
 guide:{head:'short',legs:'pants',pal:{H:'#8c7c48',h:'#685c30',I:'#b0a060',T:'#e05840',t:'#b03c30',A:'#e05840',P:'#585868',F:'#383030',...SKIN}},
};
const mirror=r=>r.split('').reverse().join('');
/* pose: 0 stand · 1 step (left foot) · 2 step (right foot) */
function charArt(kind,dir,pose){const flip=dir==='right',d=flip?'left':dir;
  return art('ch'+kind+dir+pose,16,CH_H,c=>{const ch=CHARS[kind],st=pose?1:0;
    let body=TORSO[d][st].concat(LEGS[ch.legs][d][st]);
    if(pose===2&&d!=='left')body=body.map(mirror);
    const pal=Object.assign({K:OUT_K,E:'#201820',I:ch.pal.H,c:ch.pal.C,t:ch.pal.T},ch.pal);
    const cv2=mkc(16,CH_H),g=cv2.getContext('2d');
    stamp(g,body,pal,0,10);
    stamp(g,HEAD[ch.head][d],pal,0,0);
    if(ch.head==='long')stamp(g,TAIL[d],pal,0,10);
    if(flip){c.translate(16,0);c.scale(-1,1);}
    c.drawImage(cv2,0,0);},1);}
