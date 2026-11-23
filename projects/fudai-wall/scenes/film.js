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
const CAM_SH04_A=add(PLACES.COAST_VILLAGE,[-5,3.5,7]), CAM_SH04_B=add(PLACES.COAST_VILLAGE,[-5,3.5,7]), CAM_SQUARE=add(PLACES.COAST_VILLAGE,[0,1.5,-1]);
const CAM_SH05_A=add(PLACES.COAST_VILLAGE,[-5,16.5,16]), CAM_SH05_B=add(PLACES.COAST_VILLAGE,[20,16.5,16]);
const CAM_SH05_TA=add(PLACES.COAST_WALL,[4,10.5,2]), CAM_SH05_TB=add(PLACES.COAST_WALL,[12.6,10.5,2]);
const CAM_SH06_A=add(PLACES.NEIGHBOR_COAST,[0,14,20]), CAM_SH06_B=add(PLACES.NEIGHBOR_COAST,[0,14,20]);
const CAM_SH06_TA=add(PLACES.NEIGHBOR_COAST,[0,5,5]), CAM_SH06_TB=add(PLACES.NEIGHBOR_COAST,[0,5,5]);
const CAM_SH07_A=add(PLACES.COAST_VILLAGE,[4,2.5,-7]), CAM_SH07_TA=add(PLACES.COAST_VILLAGE,[4,1.9,-2]);
const CAM_SH07_B=[4.3,5.82,-0.3], CAM_SH07_TB=[4,1.9,0], CAM_SH07_FOV=50;
const CAM_SH08_A=add(PLACES.COAST_VILLAGE,[4,3,-6]), CAM_SH08_TA=add(PLACES.COAST_VILLAGE,[4,1.9,-2]);
const CAM_SH08_B=add(PLACES.COAST_VILLAGE,[4,3,-6]);
const CAM_SH09_A=add(PLACES.COAST_VILLAGE,[.5,1.7,4.4]), CAM_SH09_T=add(PLACES.COAST_VILLAGE,[0,2.47,0]);
const CAM_SH09_B=add(PLACES.COAST_VILLAGE,[.3,2.1,4.0]);
const CAM_SH10_A=add(BLUEPRINT,[1.8,3,9]), CAM_SH10_T=add(BLUEPRINT,[0,1.55,0]), CAM_SH10_B=add(BLUEPRINT,[1.8,3,9]);
const CAM_SH11=add(PLACES.COAST_VILLAGE,[-5,40,0]), CAM_SH11_T=add(PLACES.SEA,[-5.5,9,14]);
const CAM_SH12_A=add(PLACES.COAST_VILLAGE,[-5,5,4]), CAM_SH12_TA=add(PLACES.COAST_WALL,[-5,6.5,6]);
const CAM_SH12_B=add(PLACES.COAST_VILLAGE,[-5,5,4]), CAM_SH12_TB=add(PLACES.COAST_WALL,[-5,6.5,6]);
// Phase 11 chunk merge: SH13–SH26 are translated from the Qwen/Hydrogen
// records in P11_MERGE_CHUNKS_BRIEF.md. All points remain PLACES anchored.
const p=(place,offset)=>add(PLACES[place],offset);
const cam=(place,pos,look,fov)=>({pos:p(place,pos),target:p(place,look),fov});
const chunk3Shot=(id,t0,t1,place,a,b,fov=40)=>({id,t0,t1,camera:{move:'push',from:cam(place,a[0],a[1],Array.isArray(fov)?fov[0]:fov),to:cam(place,b[0],b[1],Array.isArray(fov)?fov[1]:fov)}});
const CAST3={
 mayor_old:{spec:'cast/mayor_old.json',at:[p('COAST_VILLAGE',[-6,0,1])[0],p('COAST_VILLAGE',[-6,0,1])[2]],ry:30},
 mayor_young:{spec:'cast/mayor_young.json',at:[p('FLASHBACK_ROCK',[0,0,2])[0],p('FLASHBACK_ROCK',[0,0,2])[2]],ry:0},
 child:{spec:'cast/child.json',at:[p('ROOM',[0,0,-1.15])[0],p('ROOM',[0,0,-1.15])[2]],ry:180},
 workers:{spec:'cast/workers.json',at:[p('COAST_WALL',[0,17,.2])[0],p('COAST_WALL',[0,17,.2])[2]],ry:0},
 villagers:{spec:'cast/villagers.json',at:[p('COAST_VILLAGE',[-3,0,.8])[0],p('COAST_VILLAGE',[-3,0,.8])[2]],ry:0},
 villagers_shore:{spec:'cast/villagers.json',at:[p('SEA',[-5,0,-5])[0],p('SEA',[-5,0,-5])[2]],ry:0}
};
const ACTS3={
 mayor_old:{face:[{t:'line:11.start',eyes:'open',brow:'down',mouth:'tight'}],look:[{t:'line:11.start',at:p('COAST_VILLAGE',[-2,1.5,9])}],walk:[{t0:'line:11.start',path:[[-6,1],[-5.7,2.4],[-2.6,2.8],[6.5,3.2]],speed:1}]},
 mayor_young:{place:[{t:'line:18.start',at:[p('FLASHBACK_ROCK',[.9,0,-1.10])[0],p('FLASHBACK_ROCK',[.9,0,-1.10])[2]]}],face:[{t:'line:17.start',eyes:'open',brow:'down',mouth:'tight'}],look:[{t:'line:17.start',at:p('FLASHBACK_ROCK',[-3.5,-1,-12])},{t:'line:18.start',at:p('FLASHBACK_ROCK',[-1.4,1.68,-.60])},{t:50.60,at:p('FLASHBACK_ROCK',[-.4,1.65,-1.85])}]},
 child:{look:[{t:'line:19.start',at:p('ROOM',[0,1.52,2.6])}],face:[{t:'line:19.start',eyes:'open',brow:'up',mouth:'smile'}]},
 workers:{place:[{t:'line:20.start',at:[p('COAST_WALL',[0,0,.20])[0],p('COAST_WALL',[0,0,.20])[2]],y:17},{t:57.10,at:[p('COAST_WALL',[0,0,.20])[0],p('COAST_WALL',[0,0,.20])[2]],y:18}],look:[{t:'line:20.start',at:p('COAST_WALL',[0,17.5,12])}],face:[{t:'line:20.start',eyes:'open',brow:'down',mouth:'tight'}]},
 villagers:{walk:[{t0:'line:23.start',path:[[0,6],[0,6]],speed:1}],face:[{t:'line:23.start',eyes:'open',brow:'up',mouth:'smile'}]},
 villagers_shore:{face:[{t:'line:16.start',eyes:'open',brow:'up',mouth:'D'}],walk:[{t0:'line:16.start',path:[[-5,-5],[-4,6]],speed:1}]}
};
const PROP3=[
 {id:'box_sh13',kind:'belongings_box',in:'world',at:p('COAST_VILLAGE',[-6,1.15,1.45]),fetch:true,keys:[{t:'line:11.start',at:p('COAST_VILLAGE',[-6,1.15,1.45])},{t:'line:11.end',at:p('COAST_VILLAGE',[-2.6,1.15,3.25])}]},
 {id:'gravestone_sh14',kind:'gravestone',in:'world',at:p('HILL_GRAVE',[0,0,0]),keys:[{t:'line:12.start'}]},
 {id:'leaf_sh14',kind:'leaf',in:'world',at:p('HILL_GRAVE',[.55,3.3,.25]),keys:[{t:'line:12.start',at:p('HILL_GRAVE',[.55,3.3,.25])},{t:'line:12.end',at:p('HILL_GRAVE',[.18,.06,.55])}]},
 {id:'wall_distant_sh14',kind:'seawall',in:'world',at:p('HILL_GRAVE',[0,0,-140]),w:18,h:18,keys:[{t:'line:12.start'}]},
 {id:'birds_sh16',kind:'birds',in:'world',at:p('COAST_VILLAGE',[1.5,4.6,1]),n:7,burst:0,keys:[{t:'line:14.start',burst:0},{t:'line:14.word:2',burst:.15},{t:'line:14.end',burst:1}]},
 {id:'sea_sheet_sh17',kind:'sea_sheet',in:'world',at:p('SEA',[0,.02,0]),pull:0,keys:[{t:'line:15.start',pull:0},{t:'line:15.word:2',pull:4},{t:39.90,pull:14},{t:40.50,pull:36},{t:'line:15.end',pull:36}]},
 {id:'boat_sh17_a',kind:'boat',in:'world',at:p('SEA',[-3.5,.15,4]),rot:[0,0,0],keys:[{t:'line:15.start',at:p('SEA',[-3.5,.15,4]),rot:[0,0,0]},{t:39.90,at:p('SEA',[-3.5,.02,4])},{t:40.10,rot:[0,0,14]}]},
 {id:'boat_sh17_b',kind:'boat',in:'world',at:p('SEA',[2.5,.15,7]),rot:[0,0,0],keys:[{t:'line:15.start',at:p('SEA',[2.5,.15,7]),rot:[0,0,0]},{t:39.70,at:p('SEA',[2.5,.02,7])},{t:39.95,rot:[0,0,-11]}]},
 {id:'wave_sh18',kind:'wave',in:'world',at:p('SEA',[0,0,-20]),h:0,advance:0,w:90,keys:[{t:'line:16.start',h:2,advance:0},{t:'line:16.word:2',h:6},{t:'line:16.end',h:17.5,advance:2}]},
 {id:'measure_wave',kind:'measure',in:'world',at:p('SEA',[5,0,-16]),lineY:0,keys:[{t:'line:16.start',lineY:0},{t:'line:16.end',lineY:15}]},
 {id:'old_village_sh19',kind:'storeys',in:'world',at:p('FLASHBACK_ROCK',[-3.5,-1.5,-12]),storeys:3,keys:[{t:'line:17.start'}]},
 {id:'wave_old_sh19',kind:'wave',in:'world',at:p('FLASHBACK_ROCK',[-9,-1.5,-17]),h:5,advance:0,w:14,keys:[{t:'line:17.start',h:5,advance:0},{t:'line:17.end',h:8,advance:4.5}]},
 {id:'carved_line_sh20',kind:'carved_line',in:'world',at:p('FLASHBACK_ROCK',[-.4,1.65,-1.85]),length:3.6,reveal:.35,keys:[{t:'line:18.start',reveal:.35},{t:'line:18.end',reveal:1}]},
 {id:'pencil_mark_sh21',kind:'pencil_mark',in:'world',at:p('ROOM',[0,1.62,-1.55]),lineY:0,draw:0,keys:[{t:'line:19.start',draw:0},{t:'line:19.end',draw:1}]},
 {id:'pour_sh22',kind:'concrete_pour',in:'world',at:p('COAST_WALL',[0,17,0]),progress:0,keys:[{t:'line:20.start',progress:0},{t:'line:20.end',progress:1}]},
 {id:'wave_neighbor_sh23',kind:'wave',in:'world',at:p('NEIGHBOR_COAST',[0,0,-26]),hidden:true,h:17.5,width:70,crestY:17.5,curl:.4,keys:[{t:'line:21.start',hidden:false,at:p('NEIGHBOR_COAST',[0,0,-26]),h:17.5,crestY:17.5,curl:.5},{t:60.2,hidden:false,at:p('NEIGHBOR_COAST',[0,0,6]),h:17.5,crestY:17.5,curl:.85},{t:'line:21.end',hidden:false,at:p('NEIGHBOR_COAST',[0,0,18]),h:17.5,crestY:17.5,curl:.95},{t:'line:22.start',hidden:true}]},
 {id:'wave_hero_sh24',kind:'wave',in:'world',at:p('COAST_WALL',[0,0,-34]),hidden:true,h:17.5,w:70,crestY:15,curl:.6,keys:[{t:'line:22.start',hidden:false,h:17.5,crestY:15.5,curl:.7},{t:62.1,at:p('COAST_WALL',[0,0,-17.5]),crestY:16.8,curl:.9},{t:63.2,at:p('COAST_WALL',[0,0,-17.5]),crestY:17.5,curl:.25},{t:'line:23.start',crestY:16.5},{t:'line:24.start',hidden:true}]},
 {id:'spray_hero_sh24',kind:'spray',in:'world',at:p('COAST_WALL',[0,17.5,-17.5]),hidden:true,intensity:0,lift:0,keys:[{t:'line:22.start',hidden:false,intensity:0,lift:0},{t:62.1,intensity:1,lift:2.2},{t:63.2,intensity:.35,lift:.4},{t:'line:23.start',hidden:true}]},
 {id:'sunbeam_sh25',kind:'sunbeam',in:'world',at:p('COAST_VILLAGE',[0,16,6]),hidden:true,opacity:0,keys:[{t:'line:23.start',hidden:false,opacity:.45},{t:64.8,opacity:.85},{t:'line:24.start',hidden:true}]},
 {id:'gravestone_sh26',kind:'gravestone',in:'world',at:p('HILL_GRAVE',[0,0,1]),h:1.35,keys:[{t:'line:24.start'}]},
 {id:'flowers_sh26',kind:'flowers',in:'world',at:p('HILL_GRAVE',[0,.05,1.45]),keys:[{t:'line:24.start'}]},
 {id:'wall_distant_sh26',kind:'seawall',in:'world',at:p('HILL_GRAVE',[0,-6,-58]),h:18,keys:[{t:'line:24.start'}]}
];
const SHOTS3=[
 chunk3Shot('SH13','line:11.start','line:11.end','COAST_VILLAGE',[[13,5,-9.5],[12,1.5,-6]],[[4.8,5,-8.2],[-4.6,1.9,2.2]],50),
 chunk3Shot('SH14','line:12.start','line:12.end','HILL_GRAVE',[[2.6,.9,5.2],[0,1,0]],[[2.2,3.4,6.4],[0,1.2,-2]],40),
 chunk3Shot('SH15','line:13.start','line:13.end','COAST_VILLAGE',[[-1.5,1.7,3.6],[-1.5,1.7,.25]],[[-1.5,1.7,3],[-1.5,1.7,.25]],32),
 chunk3Shot('SH16','line:14.start','line:14.end','COAST_VILLAGE',[[-5.4,7.6,9.8],[-1.1,2.5,0.9]],[[-5.2,7.5,9.5],[-1.1,2.4,0.9]],49),
 chunk3Shot('SH17','line:15.start','line:15.end','SEA',[[-6,13.5,15],[0,0,-2]],[[2,12.5,14],[0,0,-6]],44),
 chunk3Shot('SH18','line:16.start','line:16.end','SEA',[[-1.5,.65,2.5],[0,2.2,-20]],[[-1,.9,1.5],[0,16.5,-20]],[46,50]),
 chunk3Shot('SH19','line:17.start','line:17.end','FLASHBACK_ROCK',[[-2.5,.9,-21],[-2,1,-4]],[[-1,1.3,-16],[-4,1.2,-4]],46),
 chunk3Shot('SH20','line:18.start','line:18.end','FLASHBACK_ROCK',[[-4.2,1.6,-1.55],[.25,1.55,-1.55]],[[-4.7,1.55,-1.65],[.65,1.4,-1.25]],40),
 chunk3Shot('SH21','line:19.start','line:19.end','ROOM',[[0,1.52,3],[0,1.52,-1.6]],[[0,1.54,2.4],[0,1.54,-1.6]],[38,36]),
 chunk3Shot('SH22','line:20.start','line:20.end','COAST_WALL',[[0,16.86,9],[0,16.86,0]],[[4,18.8,16],[0,18.2,0]],[28,36]),
 chunk3Shot('SH23','line:21.start','line:21.end','NEIGHBOR_COAST',[[-26,26,24],[-4,10,-4]],[[22,24,28],[4,11,6]],[44,46]),
 chunk3Shot('SH24','line:22.start','line:22.end','COAST_WALL',[[10,20.5,-50],[0,11,-14]],[[6,19.5,-44],[0,8,-10]],[42,48]),
 chunk3Shot('SH25','line:23.start','line:23.end','COAST_WALL',[[0,19.6,2],[0,19,24]],[[0,19.6,6],[0,6,22]],[48,30]),
 chunk3Shot('SH26','line:24.start','line:24.end','HILL_GRAVE',[[0,2.3,7],[0,1.65,-1.2]],[[0,3.2,11.2],[0,2.2,-3]],[42,44])
];
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
const film = {
 fps:30,size:[1080,1920],endFrame:false,
 world:{set:'own',setOpts:{post:{...makePost(),shade:makeShade()}}},
 cast:{mayor:{spec:'cast/mayor.json',at:[MAYOR[0],MAYOR[2]],ry:0},mocker_a:{spec:'cast/mocker_a.json',at:[MOCK_A[0],MOCK_A[2]],ry:0},mocker_b:{spec:'cast/mocker_b.json',at:[MOCK_B[0],MOCK_B[2]],ry:180},mocker_c:{spec:'cast/mocker_c.json',at:[MOCK_C[0],MOCK_C[2]],ry:180},villager_1:{spec:'cast/villagers.json',at:[V1[0],V1[2]],ry:0},villager_2:{spec:'cast/villagers.json',at:[V2[0],V2[2]],ry:0},villager_3:{spec:'cast/villagers.json',at:[V3[0],V3[2]],ry:20},villager_4:{spec:'cast/villagers.json',at:[V4[0],V4[2]],ry:-20},villager_5:{spec:'cast/villagers.json',at:[V5[0],V5[2]],ry:40},villager_6:{spec:'cast/villagers.json',at:[V6[0],V6[2]],ry:-40},...CAST3},
 voice:{file:'voice_owner.wav',words:'audio/clean.json',lines:lines.map(text=>({who:null,text}))},
 acts:{
 mayor:{
  face:[{t:0,eyes:'open',brow:'up',mouth:'tight'},{t:'line:1.word:2',eyes:'look_up',brow:'up',mouth:'tight'},{t:'line:3.start',eyes:'open',brow:'up',mouth:'tight'},{t:'line:8.start',eyes:'open',brow:'down',mouth:'tight'}],
  look:[{t:0,at:MAYOR_HEAD},{t:'line:1.word:2',at:WALLTOP},{t:'line:3.start',at:add(PLACES.COAST_VILLAGE,[0,1.5,8])},{t:'line:8.start',at:add(PLACES.COAST_VILLAGE,[0,1.5,3])}],
  walk:[{t0:'line:2.start',path:[[0,-9],[0,-2],[0,2]],speed:5.5,gait:'walk'},{t0:'line:8.end',path:[[0,2],[0,8],[0,10.8]],speed:5,gait:'walk'},{t0:25.3,path:[[0,10.8],[0,13.8]],speed:1.5,gait:'walk'}]
 },
 mocker_a:{place:[{t:'line:24.start',at:[p('HILL_GRAVE',[-.95,0,-.60])[0],p('HILL_GRAVE',[-.95,0,-.60])[2]]}],face:[{t:'line:3.start',eyes:'open',brow:'up',mouth:'smile'},{t:'line:6.start',eyes:'happy',brow:'up',mouth:'D'},{t:'line:7.end',eyes:'open',brow:'up',mouth:'smile'}],clips:[{clip:'point',at:'line:6.word:3',params:{dir:[3,18,-16]}},{clip:'point',at:'line:6.word:8',params:{dir:[3,19,-40]}}],look:[{t:'line:6.word:3',at:WALLTOP},{t:'line:6.word:8',at:[2,19.5,-17.5]},{t:'line:24.start',at:p('HILL_GRAVE',[0,1,1])}]},
 mocker_b:{place:[{t:'line:24.start',at:[p('HILL_GRAVE',[.95,0,-.60])[0],p('HILL_GRAVE',[.95,0,-.60])[2]]}],face:[{t:'line:3.start',eyes:'open',brow:'up',mouth:'smile'},{t:'line:7.start',eyes:'happy',brow:'up',mouth:'D'},{t:'line:10.start',eyes:'happy',brow:'up',mouth:'D'}],walk:[{t0:'line:9.start',path:[[-5,-6],[-5,-8],[-5,-8]],speed:5}],look:[{t:'line:24.start',at:p('HILL_GRAVE',[0,1,1])}]},
 mocker_c:{place:[{t:'line:8.word:5',at:[4.4,-2.0]},{t:'line:8.end',at:[6,.5]},{t:'line:24.start',at:[p('HILL_GRAVE',[0,0,-1.30])[0],p('HILL_GRAVE',[0,0,-1.30])[2]]}],face:[{t:'line:3.start',eyes:'open',brow:'up',mouth:'smile'},{t:'line:7.start',eyes:'happy',brow:'up',mouth:'D'},{t:'line:10.start',eyes:'happy',brow:'up',mouth:'D'}],walk:[{t0:'line:9.start',path:[[-4,-6],[-4,-8],[-4,-8]],speed:5}],look:[{t:'line:24.start',at:p('HILL_GRAVE',[0,1,1])}]},
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
  {id:'popsign',kind:'boardsign',in:'world',at:add(PLACES.COAST_VILLAGE,[0,3,-1]),text:'3,000',w:3.4,h:1.5,post:0,keys:[{t:0,in:'hidden'},{t:'line:3.word:4',in:'world',at:add(PLACES.COAST_VILLAGE,[0,3,-1])},{t:'line:4.start',in:'hidden'}]},
  {id:'crane_a',kind:'crane',in:'world',at:add(PLACES.COAST_WALL,[2,0,2]),rot:[0,15,0],keys:[{t:0,in:'hidden'},{t:'line:4.start',in:'world',at:add(PLACES.COAST_WALL,[2,0,2]),rot:[0,15,0]},{t:'line:5.start',in:'hidden'}]},
  {id:'crane_b',kind:'crane',in:'world',at:add(PLACES.COAST_WALL,[17.5,0,4]),rot:[0,-90,0],keys:[{t:0,in:'hidden'},{t:'line:4.start',in:'world',at:add(PLACES.COAST_WALL,[17.5,0,4]),rot:[0,-90,0]},{t:'line:5.start',in:'hidden'}]},
  {id:'money',kind:'money',in:'world',at:add(PLACES.COAST_WALL,[0,0,3]),keys:[{t:0,in:'hidden'},{t:'line:4.start',in:'world',at:add(PLACES.COAST_WALL,[0,0,3])},{t:'line:5.start',in:'hidden'}]},
  {id:'moneysign',kind:'boardsign',in:'world',at:add(PLACES.COAST_WALL,[0,0,3.4]),text:'$30M',w:2.6,h:1.1,post:1,leg:2.2,keys:[{t:0,in:'hidden'},{t:'line:4.start',in:'world',at:add(PLACES.COAST_WALL,[0,0,3.4])},{t:'line:5.start',in:'hidden'}]},
  {id:'calendar',kind:'calendar',in:'world',at:add(PLACES.COAST_WALL,[13,0,2]),page:0,keys:[{t:0,in:'hidden'},{t:'line:4.start',in:'world',at:add(PLACES.COAST_WALL,[13,0,2])},{t:'line:4.word:1',page:0},{t:'line:4.word:2',page:1},{t:'line:4.word:3',page:2},{t:'line:4.word:4',page:3},{t:'line:4.word:5',page:4},{t:'line:4.word:6',page:5},{t:'line:4.word:7',page:6},{t:'line:4.word:8',page:7},{t:'line:4.word:9',page:8},{t:'line:4.word:10',page:9},{t:'line:4.word:11',page:10},{t:'line:4.word:12',page:11},{t:'line:5.start',in:'hidden'}]},
  {id:'gateleaf',kind:'gateleaf',in:'world',at:add(PLACES.COAST_WALL,[0,0,1.1]),lift:0,keys:[{t:0,in:'hidden'},{t:'line:4.start',in:'world',at:add(PLACES.COAST_WALL,[0,0,1.1])},{t:'line:4.start',lift:0},{t:'line:4.word:7',lift:1,ease:2.6},{t:'line:5.start',in:'hidden'}]},
  {id:'measure',kind:'measure',in:'world',at:add(PLACES.COAST_WALL,[16,0,2]),h:.8,full:18,label:'15.5M',keys:[{t:0,in:'hidden'},{t:'line:4.start',in:'world',at:add(PLACES.COAST_WALL,[16,0,2])},{t:'line:4.word:8',h:.8},{t:'line:4.word:10',h:18,ease:1.2},{t:'line:5.start',in:'hidden'}]},
  {id:'sticker_a',kind:'boardsign',in:'world',at:add(PLACES.NEIGHBOR_COAST,[-3,7,2]),text:'10M',w:1.7,h:.95,post:0,keys:[{t:0,at:add(PLACES.NEIGHBOR_COAST,[-3,7,2])}]},
  {id:'sticker_b',kind:'boardsign',in:'world',at:add(PLACES.NEIGHBOR_COAST,[3,7,2]),text:'10M',w:1.7,h:.95,post:0,keys:[{t:0,at:add(PLACES.NEIGHBOR_COAST,[3,7,2])}]},
  {id:'coins',kind:'coins',in:'world',at:COINS,keys:[{t:0,in:'hidden'},{t:'line:6.word:10',drop:{from:[2,19.5,-17.5],v0:[.6,2.2,0],g:9.8,ground:17.55,hide:true}}]},
  {id:'blueprint',kind:'blueprint',in:'world',at:BLUEPRINT,lineY:1,pin:0,keys:[{t:0,at:BLUEPRINT,lineY:1,pin:0},{t:'line:8.word:6',lineY:.62,ease:.5},{t:'line:8.word:8',lineY:1,ease:.3},{t:'line:8.word:8',pin:1}]},
  {id:'mocksign',kind:'boardsign',in:'world',at:add(PLACES.COAST_WALL,[-6,12.8,1.8]),text:'أغبى مشروع',w:4.2,h:2.4,bg:'#9a7047',fg:'#f5e9d0',post:0,rot:[4,0,-2],keys:[{t:0,in:'hidden'},{t:'line:10.start',in:'world',at:add(PLACES.COAST_WALL,[-6,12.8,1.8]),rot:[4,0,-2]}]},
  {id:'sunorb',kind:'orb',in:'world',at:SUNORB,cx:-15,cy:8,color:'#ffd27a',r:1.7,keys:[{t:0,in:'hidden'},{t:'line:9.start',in:'world',at:SUNORB},{t:'line:10.start',in:'hidden'},{t:'line:9.start',cx:-15,cy:8},{t:25.75,cx:0,cy:18,ease:.66},{t:26.40,cx:15,cy:8,ease:.65},{t:27.05,cx:15,cy:-5,ease:.65},{t:27.45,cx:-15,cy:9,ease:.27}]},
  {id:'moonorb',kind:'orb',in:'world',at:SUNORB,cx:-15,cy:-5,color:'#dfe8ff',r:1.3,keys:[{t:0,in:'hidden'},{t:'line:9.start',in:'world',at:SUNORB},{t:'line:10.start',in:'hidden'},{t:'line:9.start',cx:-15,cy:-5},{t:27.05,cx:-8,cy:14,ease:.65},{t:27.45,cx:6,cy:-5,ease:.27}]},
  ...PROP3
 ],
 handovers:[],
 shots:[
  {id:'SH01',t0:0,t1:2.6,camera:{move:'push',from:{pos:CLOSE_POS,target:MAYOR_HEAD,fov:34},to:{pos:TILT_POS,target:TILT_TARGET,fov:38}}},
  {id:'SH02',t0:2.6,t1:'line:1.end',camera:{move:'push',from:{pos:TILT_POS,target:TILT_TARGET,fov:38},to:{pos:WIDE_POS,target:WIDE_TARGET,fov:48}}},
  {id:'SH03',t0:'line:2.start',t1:'line:2.end',camera:{move:'push',from:{pos:SEA_FROM,target:BOAT,fov:42},to:{pos:SEA_TO,target:BOAT,fov:42}}},
  {id:'SH04',t0:'line:3.start',t1:'line:3.end',camera:{move:'push',from:{pos:CAM_SH04_A,target:CAM_SQUARE,fov:50},to:{pos:CAM_SH04_B,target:CAM_SQUARE,fov:50}}},
  {id:'SH05',t0:'line:4.start',t1:'line:4.end',camera:{move:'push',ease:'inQuad',from:{pos:CAM_SH05_A,target:CAM_SH05_TA,fov:50},to:{pos:CAM_SH05_B,target:CAM_SH05_TB,fov:34}}},
  {id:'SH06',t0:'line:5.start',t1:'line:5.end',camera:{move:'push',from:{pos:CAM_SH06_A,target:CAM_SH06_TA,fov:50},to:{pos:CAM_SH06_B,target:CAM_SH06_TB,fov:50}}},
  {id:'SH07',t0:'line:6.start',t1:'line:6.word:9',camera:{move:'push',ease:'inExpo',t1:19.0,roll:[-5,-2],from:{pos:CAM_SH07_A,target:CAM_SH07_TA,fov:50},to:{pos:CAM_SH07_B,target:CAM_SH07_TB,fov:CAM_SH07_FOV}}},
  {id:'SH07B',t0:'line:6.word:9',t1:'line:6.end',camera:{move:'push',ease:'outCubic',roll:[-2,-2],from:{pos:add(PLACES.COAST_VILLAGE,[5.5,2.2,2.2]),target:add(PLACES.COAST_WALL,[1,7.5,0]),fov:50},to:{pos:add(PLACES.COAST_WALL,[2,44,-20.5]),target:add(PLACES.COAST_WALL,[0,14,0]),fov:38}}},
  {id:'SH08',t0:'line:7.start',t1:'line:7.end',camera:{move:'push',from:{pos:CAM_SH08_A,target:CAM_SH08_TA,fov:34},to:{pos:CAM_SH08_B,target:CAM_SH08_TA,fov:34}}},
  {id:'SH09',t0:'line:8.start',t1:'line:8.word:5',camera:{move:'push',from:{pos:CAM_SH09_A,target:CAM_SH09_T,fov:32},to:{pos:CAM_SH09_B,target:CAM_SH09_T,fov:30}}},
  {id:'SH10',t0:'line:8.word:5',t1:'line:8.end',camera:{move:'push',from:{pos:CAM_SH10_A,target:CAM_SH10_T,fov:48},to:{pos:CAM_SH10_B,target:CAM_SH10_T,fov:48}}},
  {id:'SH11',t0:'line:9.start',t1:'line:9.end',camera:{move:'park',pos:CAM_SH11,target:CAM_SH11_T,fov:50}},
  {id:'SH12',t0:'line:10.start',t1:'line:10.end',camera:{move:'push',from:{pos:CAM_SH12_A,target:CAM_SH12_TA,fov:50},to:{pos:CAM_SH12_B,target:CAM_SH12_TB,fov:50}}},
  ...SHOTS3
 ],
 captions:'words'
};
Object.assign(film.acts,ACTS3);
film.props.find(x=>x.id==='seawall').keys.push({t:'line:20.start',h:17},{t:55.9,h:17.5},{t:57.1,h:18},{t:'line:23.end',h:18});
film.props.find(x=>x.id==='calendar').keys.push({t:'line:13.start',in:'world',at:p('COAST_VILLAGE',[-1.5,1.7,.25]),page:0},{t:35.95,page:7},{t:36.1,page:14},{t:'line:13.word:4',page:14},{t:'line:13.end',page:14});
export default film;
