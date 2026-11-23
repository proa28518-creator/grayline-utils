// Fudai opening: SH01–SH03. Every world point is staged from the one PLACES table.
import { PLACES } from './set.js';
import { makePost } from './post.js';
import { makeShade } from './shade.js';
const add=(p,[dx,dy,dz])=>{const a=Array.isArray(p)?p:p.at;return [a[0]+dx,a[1]+dy,a[2]+dz];};
const MAYOR=add(PLACES.COAST_WALL,[0,0,7]);
const MAYOR_HEAD=[MAYOR[0],1.55,MAYOR[2]];
const WALLTOP=add(PLACES.COAST_WALL,[0,17,0]);
const BOAT=add(PLACES.SEA,[0,.25,14]);
const CLOSE_POS=add(PLACES.COAST_WALL,[.7,.9,12]);
const TILT_POS=add(PLACES.COAST_WALL,[8,9,38]);
const TILT_TARGET=add(PLACES.COAST_WALL,[4.5,9,0]);
const WIDE_POS=add(PLACES.COAST_VILLAGE,[12,26,30]);
const WIDE_TARGET=add(PLACES.COAST_WALL,[0,6,6]);
const SEA_FROM=add(PLACES.SEA,[-16,3.5,6]);
const SEA_TO=add(PLACES.SEA,[16,3.5,-2]);
const SQUARE=add(PLACES.COAST_VILLAGE,[0,0,0]);
const MOCK_A=add(PLACES.COAST_VILLAGE,[4,.5,-2]);
const MOCK_B=add(PLACES.COAST_VILLAGE,[4,0,-3.0]), MOCK_C=add(PLACES.COAST_VILLAGE,[6,0,-1.5]);
const MOCK_A_HEAD=add(MOCK_A,[0,1.05,0]);
const BLUEPRINT=add(PLACES.COAST_VILLAGE,[5.2,0,-1.5]);
const MOCKSIGN=add(PLACES.COAST_WALL,[-6,12.8,1.8]);
const COINS=add(PLACES.COAST_WALL,[2,19.5,-1.5]);
const SUNORB=add(PLACES.SEA,[0,0,-16]);
const V1=add(PLACES.COAST_VILLAGE,[-1,0,2]), V2=add(PLACES.COAST_VILLAGE,[1,0,2]);
const V3=add(PLACES.COAST_VILLAGE,[-2,0,4]), V4=add(PLACES.COAST_VILLAGE,[5,0,5]);
const V5=add(PLACES.COAST_VILLAGE,[-8,0,3]), V6=add(PLACES.COAST_VILLAGE,[10,0,4]);
const CAM_SH04_A=add(PLACES.COAST_VILLAGE,[-5,3.5,7]), CAM_SH04_B=add(PLACES.COAST_VILLAGE,[-5,3.5,7]), CAM_SQUARE=add(PLACES.COAST_VILLAGE,[0,4.8,-1]);
const CAM_SH05_A=add(PLACES.COAST_VILLAGE,[-5,16.5,16]), CAM_SH05_B=add(PLACES.COAST_VILLAGE,[20,16.5,16]);
const CAM_SH05_TA=add(PLACES.COAST_WALL,[4,10.5,2]), CAM_SH05_TB=add(PLACES.COAST_WALL,[12.6,10.5,2]);
const CAM_SH06_A=add(PLACES.NEIGHBOR_COAST,[-10,8.5,15]), CAM_SH06_B=add(PLACES.NEIGHBOR_COAST,[10,8.5,15]);
const CAM_SH06_TA=add(PLACES.NEIGHBOR_COAST,[0,4,3]), CAM_SH06_TB=add(PLACES.NEIGHBOR_COAST,[0,4,3]);
const CAM_SH07_A=add(PLACES.COAST_VILLAGE,[4,2.5,-7]), CAM_SH07_TA=add(PLACES.COAST_VILLAGE,[4,1.9,-2]);
const CAM_SH07_B=add(PLACES.COAST_VILLAGE,[2,20,-14]), CAM_SH07_TB=add(PLACES.COAST_WALL,[2,19.5,0]);
const CAM_SH08_A=add(PLACES.COAST_VILLAGE,[4,3,-6]), CAM_SH08_TA=add(PLACES.COAST_VILLAGE,[4,1.9,-2]);
const CAM_SH08_B=add(PLACES.COAST_VILLAGE,[4,3,-6]);
const CAM_SH09_A=add(PLACES.COAST_VILLAGE,[.5,1.7,4.4]), CAM_SH09_T=add(PLACES.COAST_VILLAGE,[0,1.55,0]);
const CAM_SH09_B=add(PLACES.COAST_VILLAGE,[.3,2.1,4.0]);
const CAM_SH10_A=add(BLUEPRINT,[0,3,9]), CAM_SH10_T=add(BLUEPRINT,[0,1.55,0]), CAM_SH10_B=add(BLUEPRINT,[0,3,9]);
const CAM_SH11=add(PLACES.COAST_VILLAGE,[-5,40,0]), CAM_SH11_T=add(PLACES.SEA,[-5.5,9,14]);
const CAM_SH12_A=add(PLACES.COAST_VILLAGE,[-5,5,4]), CAM_SH12_TA=add(PLACES.COAST_WALL,[-5,6.5,6]);
const CAM_SH12_B=add(PLACES.COAST_VILLAGE,[-5,5,4]), CAM_SH12_TB=add(PLACES.COAST_WALL,[-5,6.5,6]);
const lines=[
'بنى سور خرساني بطول عمارة خمس أدوار قدام قرية صيد صغيرة',
'والبحر قدامه هادي زي المراية',
'كان عمدة لقرية فيها 3000 شخص بس',
'وصرف 30 مليون دولار و12 سنة بناء على بوابة ارتفاعها 15 متر ونص',
'مع إن كل القرى اللي حواليه اكتفت بسور 10 متر',
'أهل القرية ضحكوا عليه وقالوا له: إنت بترمي فلوسنا في البحر؟',
'الموج عمره ما هيوصل هناك',
'بس العمدة ما ردش ولا نزل السور سنتي واحد',
'السور خلص والبحر فضل هادي سنين',
'والناس سموه أغبى مشروع في البلد',
'العمدة طلع على المعاش وهو لسه بيتلام على الفلوس اللي ضاعت',
'ومات من غير ما حد واحد يصدقه',
'بعد موته بـ 14 سنة',
'الأرض اتهزت بزلزال عنيف',
'والبحر اتسحب لورا',
'ورجع بموجة عملاقة ارتفاعها 15 متر بالظبط',
'أصل العمدة وهو شاب شاف البحر بيبلع قريته',
'فافتكر علامات قديمة على الصخر بتحدد أعلى نقطة وصلها الموج زمان',
'زي ما تحط شرطة بالقلم على الحيطة عشان ما تنساش المقاس',
'هو بنى السور على مقاس أضخم موجة في الذاكرة',
'القرى اللي حواليهم بأسوارها الـ 10 متر اتمسحت في دقايق',
'والموجة خبطت في سوره ووقفت عند حافته',
'القرية كلها نجت',
'والناس اللي ضحكوا عليه راحوا قبره يشكروه'
];
export default {
 fps:30,size:[1080,1920],endFrame:false,
 world:{set:'own',setOpts:{post:{...makePost(),shade:makeShade()}}},
 cast:{mayor:{spec:'cast/mayor.json',at:[MAYOR[0],MAYOR[2]],ry:0},mocker_a:{spec:'cast/mocker_a.json',at:[MOCK_A[0],MOCK_A[2]],ry:0},mocker_b:{spec:'cast/mocker_b.json',at:[MOCK_B[0],MOCK_B[2]],ry:180},mocker_c:{spec:'cast/mocker_c.json',at:[MOCK_C[0],MOCK_C[2]],ry:180},villager_1:{spec:'cast/villagers.json',at:[V1[0],V1[2]],ry:0},villager_2:{spec:'cast/villagers.json',at:[V2[0],V2[2]],ry:0},villager_3:{spec:'cast/villagers.json',at:[V3[0],V3[2]],ry:20},villager_4:{spec:'cast/villagers.json',at:[V4[0],V4[2]],ry:-20},villager_5:{spec:'cast/villagers.json',at:[V5[0],V5[2]],ry:40},villager_6:{spec:'cast/villagers.json',at:[V6[0],V6[2]],ry:-40}},
 voice:{file:'voice_owner.wav',words:'audio/clean.json',lines:lines.map(text=>({who:null,text}))},
 acts:{
 mayor:{
  face:[{t:0,eyes:'open',brow:'up',mouth:'tight'},{t:'line:1.word:2',eyes:'look_up',brow:'up',mouth:'tight'},{t:'line:3.start',eyes:'open',brow:'up',mouth:'tight'},{t:'line:8.start',eyes:'open',brow:'down',mouth:'tight'}],
  look:[{t:0,at:MAYOR_HEAD},{t:'line:1.word:2',at:WALLTOP},{t:'line:3.start',at:add(PLACES.COAST_VILLAGE,[0,1.5,8])},{t:'line:8.start',at:add(PLACES.COAST_VILLAGE,[0,1.5,3])}],
  walk:[{t0:'line:2.start',path:[[0,-9],[0,-2],[0,2]],speed:5.5,gait:'walk'},{t0:'line:8.end',path:[[0,2],[0,8],[0,10.8]],speed:5,gait:'walk'},{t0:25.3,path:[[0,10.8],[0,13.8]],speed:1.5,gait:'walk'}]
 },
 mocker_a:{face:[{t:'line:3.start',eyes:'open',brow:'up',mouth:'smile'},{t:'line:6.start',eyes:'happy',brow:'up',mouth:'D'},{t:'line:7.end',eyes:'open',brow:'up',mouth:'smile'}],clips:[{clip:'point',at:'line:6.word:3',params:{dir:[3,18,-16]}},{clip:'point',at:'line:6.word:8',params:{dir:[3,19,-40]}}],look:[{t:'line:6.word:3',at:WALLTOP},{t:'line:6.word:8',at:[2,19.5,-17.5]}]},
 mocker_b:{face:[{t:'line:3.start',eyes:'open',brow:'up',mouth:'smile'},{t:'line:7.start',eyes:'happy',brow:'up',mouth:'D'},{t:'line:10.start',eyes:'happy',brow:'up',mouth:'D'}],walk:[{t0:'line:9.start',path:[[-5,-6],[-5,-8],[-5,-8]],speed:5}]},
 mocker_c:{face:[{t:'line:3.start',eyes:'open',brow:'up',mouth:'smile'},{t:'line:7.start',eyes:'happy',brow:'up',mouth:'D'},{t:'line:10.start',eyes:'happy',brow:'up',mouth:'D'}],walk:[{t0:'line:9.start',path:[[-4,-6],[-4,-8],[-4,-8]],speed:5}]},
 villager_1:{walk:[{t0:'line:9.start',path:[[-6,-5],[-6,-7],[-6,-7]],speed:5}]},
 villager_2:{face:[{t:'line:7.start',eyes:'happy',brow:'up',mouth:'D'},{t:'line:7.end',eyes:'open',brow:'up',mouth:'smile'}]},
 villager_3:{walk:[{t0:'line:9.start',path:[[-3,-6],[-3,-8],[-3,-8]],speed:5}]},
 villager_4:{face:[{t:'line:7.start',eyes:'happy',brow:'up',mouth:'D'},{t:'line:7.end',eyes:'open',brow:'up',mouth:'smile'}]},
 villager_5:{},villager_6:{}
 },
 props:[
  {id:'seawall',kind:'seawall',in:'world',at:PLACES.COAST_WALL.at,w:90,h:18,gateW:7,keys:[{t:0,at:PLACES.COAST_WALL.at}]},
  {id:'storeys',kind:'storeys',in:'world',at:add(PLACES.COAST_WALL,[4.5,0,2.5]),h:17.4,floors:5,keys:[{t:0,at:add(PLACES.COAST_WALL,[4.5,0,2.5])},{t:'line:3.start',in:'hidden'}]},
  {id:'boat',kind:'boat',in:'world',at:BOAT,keys:[{t:0,at:BOAT},{t:'line:2.end',at:add(PLACES.SEA,[.12,.25,14.08])}]},
  {id:'popsign',kind:'sign',in:'world',at:add(PLACES.COAST_VILLAGE,[0,3,-1]),text:'3,000',w:3.4,h:1.5,post:0,keys:[{t:0,in:'hidden'},{t:'line:3.word:4',in:'world',at:add(PLACES.COAST_VILLAGE,[0,3,-1])},{t:'line:4.start',in:'hidden'}]},
  {id:'crane_a',kind:'crane',in:'world',at:add(PLACES.COAST_WALL,[2,0,2]),rot:[0,15,0],keys:[{t:0,in:'hidden'},{t:'line:4.start',in:'world',at:add(PLACES.COAST_WALL,[2,0,2]),rot:[0,15,0]},{t:'line:5.start',in:'hidden'}]},
  {id:'crane_b',kind:'crane',in:'world',at:add(PLACES.COAST_WALL,[13,0,3]),rot:[0,-20,0],keys:[{t:0,in:'hidden'},{t:'line:4.start',in:'world',at:add(PLACES.COAST_WALL,[13,0,3]),rot:[0,-20,0]},{t:'line:5.start',in:'hidden'}]},
  {id:'money',kind:'money',in:'world',at:add(PLACES.COAST_WALL,[0,0,3]),keys:[{t:0,in:'hidden'},{t:'line:4.start',in:'world',at:add(PLACES.COAST_WALL,[0,0,3])},{t:'line:5.start',in:'hidden'}]},
  {id:'moneysign',kind:'sign',in:'world',at:add(PLACES.COAST_WALL,[0,0,3.4]),text:'$30M',w:2.6,h:1.1,post:1,leg:2.2,keys:[{t:0,in:'hidden'},{t:'line:4.start',in:'world',at:add(PLACES.COAST_WALL,[0,0,3.4])},{t:'line:5.start',in:'hidden'}]},
  {id:'calendar',kind:'calendar',in:'world',at:add(PLACES.COAST_WALL,[13,0,2]),page:0,keys:[{t:0,in:'hidden'},{t:'line:4.start',in:'world',at:add(PLACES.COAST_WALL,[13,0,2])},{t:'line:4.word:1',page:0},{t:'line:4.word:2',page:1},{t:'line:4.word:3',page:2},{t:'line:4.word:4',page:3},{t:'line:4.word:5',page:4},{t:'line:4.word:6',page:5},{t:'line:4.word:7',page:6},{t:'line:4.word:8',page:7},{t:'line:4.word:9',page:8},{t:'line:4.word:10',page:9},{t:'line:4.word:11',page:10},{t:'line:4.word:12',page:11},{t:'line:5.start',in:'hidden'}]},
  {id:'gateleaf',kind:'gateleaf',in:'world',at:add(PLACES.COAST_WALL,[0,0,1.1]),lift:0,keys:[{t:0,in:'hidden'},{t:'line:4.start',in:'world',at:add(PLACES.COAST_WALL,[0,0,1.1])},{t:'line:4.start',lift:0},{t:'line:4.word:7',lift:1,ease:2.6},{t:'line:5.start',in:'hidden'}]},
  {id:'measure',kind:'measure',in:'world',at:add(PLACES.COAST_WALL,[16,0,2]),h:.8,full:18,label:'15.5M',keys:[{t:0,in:'hidden'},{t:'line:4.start',in:'world',at:add(PLACES.COAST_WALL,[16,0,2])},{t:'line:4.word:8',h:.8},{t:'line:4.word:10',h:18,ease:1.2},{t:'line:5.start',in:'hidden'}]},
  {id:'sticker_a',kind:'sign',in:'world',at:add(PLACES.NEIGHBOR_COAST,[-3,7,2]),text:'10M',w:1.7,h:.95,post:0,keys:[{t:0,at:add(PLACES.NEIGHBOR_COAST,[-3,7,2])}]},
  {id:'sticker_b',kind:'sign',in:'world',at:add(PLACES.NEIGHBOR_COAST,[3,7,2]),text:'10M',w:1.7,h:.95,post:0,keys:[{t:0,at:add(PLACES.NEIGHBOR_COAST,[3,7,2])}]},
  {id:'coins',kind:'coins',in:'world',at:COINS,keys:[{t:0,in:'hidden'},{t:'line:6.word:10',drop:{from:[2,19.5,-17.5],v0:[.6,2.2,0],g:9.8,ground:17.55,hide:true}}]},
  {id:'blueprint',kind:'blueprint',in:'world',at:BLUEPRINT,lineY:1,pin:0,keys:[{t:0,at:BLUEPRINT,lineY:1,pin:0},{t:'line:8.word:6',lineY:.62,ease:.5},{t:'line:8.word:8',lineY:1,ease:.3},{t:'line:8.word:8',pin:1}]},
  {id:'mocksign',kind:'sign',in:'world',at:add(PLACES.COAST_WALL,[-6,12.8,1.8]),text:'أغبى مشروع',w:4.2,h:2.4,bg:'#9a7047',fg:'#f5e9d0',post:0,rot:[4,0,-2],keys:[{t:0,in:'hidden'},{t:'line:10.start',in:'world',at:add(PLACES.COAST_WALL,[-6,12.8,1.8]),rot:[4,0,-2]}]},
  {id:'sunorb',kind:'orb',in:'world',at:SUNORB,cx:-15,cy:8,color:'#ffd27a',r:1.7,keys:[{t:0,in:'hidden'},{t:'line:9.start',in:'world',at:SUNORB},{t:'line:10.start',in:'hidden'},{t:'line:9.start',cx:-15,cy:8},{t:25.75,cx:0,cy:18,ease:.66},{t:26.40,cx:15,cy:8,ease:.65},{t:27.05,cx:15,cy:-5,ease:.65},{t:27.45,cx:-15,cy:9,ease:.27}]},
  {id:'moonorb',kind:'orb',in:'world',at:SUNORB,cx:-15,cy:-5,color:'#dfe8ff',r:1.3,keys:[{t:0,in:'hidden'},{t:'line:9.start',in:'world',at:SUNORB},{t:'line:10.start',in:'hidden'},{t:'line:9.start',cx:-15,cy:-5},{t:27.05,cx:-8,cy:14,ease:.65},{t:27.45,cx:6,cy:-5,ease:.27}]}
 ],
 handovers:[],
 shots:[
  {id:'SH01',t0:0,t1:2.6,camera:{move:'push',from:{pos:CLOSE_POS,target:MAYOR_HEAD,fov:34},to:{pos:TILT_POS,target:TILT_TARGET,fov:38}}},
  {id:'SH02',t0:2.6,t1:'line:1.end',camera:{move:'push',from:{pos:TILT_POS,target:TILT_TARGET,fov:38},to:{pos:WIDE_POS,target:WIDE_TARGET,fov:48}}},
  {id:'SH03',t0:'line:2.start',t1:'line:2.end',camera:{move:'push',from:{pos:SEA_FROM,target:BOAT,fov:42},to:{pos:SEA_TO,target:BOAT,fov:42}}},
  {id:'SH04',t0:'line:3.start',t1:'line:3.end',camera:{move:'push',from:{pos:CAM_SH04_A,target:CAM_SQUARE,fov:50},to:{pos:CAM_SH04_B,target:CAM_SQUARE,fov:50}}},
  {id:'SH05',t0:'line:4.start',t1:'line:4.end',camera:{move:'push',ease:'inQuad',from:{pos:CAM_SH05_A,target:CAM_SH05_TA,fov:50},to:{pos:CAM_SH05_B,target:CAM_SH05_TB,fov:34}}},
  {id:'SH06',t0:'line:5.start',t1:'line:5.end',camera:{move:'push',from:{pos:CAM_SH06_A,target:CAM_SH06_TA,fov:50},to:{pos:CAM_SH06_B,target:CAM_SH06_TB,fov:50}}},
  {id:'SH07',t0:'line:6.start',t1:'line:6.word:9',camera:{move:'push',ease:'inExpo',t1:19.0,roll:[-5,-2],from:{pos:CAM_SH07_A,target:CAM_SH07_TA,fov:50},to:{pos:add(PLACES.COAST_VILLAGE,[5.5,2.2,2.2]),target:add(PLACES.COAST_WALL,[1,7.5,0]),fov:50}}},
  {id:'SH07B',t0:'line:6.word:9',t1:'line:6.end',camera:{move:'push',ease:'outCubic',roll:[-2,-2],from:{pos:add(PLACES.COAST_VILLAGE,[5.5,2.2,2.2]),target:add(PLACES.COAST_WALL,[1,7.5,0]),fov:50},to:{pos:add(PLACES.COAST_VILLAGE,[2,21.5,-15]),target:add(PLACES.COAST_WALL,[2,19.5,-19]),fov:24}}},
  {id:'SH08',t0:'line:7.start',t1:'line:7.end',camera:{move:'push',from:{pos:CAM_SH08_A,target:CAM_SH08_TA,fov:34},to:{pos:CAM_SH08_B,target:CAM_SH08_TA,fov:34}}},
  {id:'SH09',t0:'line:8.start',t1:'line:8.word:5',camera:{move:'push',from:{pos:CAM_SH09_A,target:CAM_SH09_T,fov:32},to:{pos:CAM_SH09_B,target:CAM_SH09_T,fov:30}}},
  {id:'SH10',t0:'line:8.word:5',t1:'line:8.end',camera:{move:'push',from:{pos:CAM_SH10_A,target:CAM_SH10_T,fov:48},to:{pos:CAM_SH10_B,target:CAM_SH10_T,fov:48}}},
  {id:'SH11',t0:'line:9.start',t1:'line:9.end',camera:{move:'park',pos:CAM_SH11,target:CAM_SH11_T,fov:50}},
  {id:'SH12',t0:'line:10.start',t1:'line:10.end',camera:{move:'push',from:{pos:CAM_SH12_A,target:CAM_SH12_TA,fov:50},to:{pos:CAM_SH12_B,target:CAM_SH12_TB,fov:50}}}
 ],
 captions:'words'
};
