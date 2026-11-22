// Fudai opening: SH01–SH03. Every world point is staged from the one PLACES table.
import { PLACES } from './set.js';
import { makePost } from './post.js';
import { makeShade } from './shade.js';
const add=(p,[dx,dy,dz])=>[p.at[0]+dx,p.at[1]+dy,p.at[2]+dz];
const MAYOR=add(PLACES.COAST_WALL,[0,0,7]);
const MAYOR_HEAD=[MAYOR[0],1.55,MAYOR[2]];
const WALLTOP=add(PLACES.COAST_WALL,[0,17,0]);
const BOAT=add(PLACES.SEA,[0,.25,14]);
const CLOSE_POS=add(PLACES.COAST_WALL,[.7,.9,10.2]);
const TILT_POS=add(PLACES.COAST_WALL,[3.5,9,17]);
const WIDE_POS=add(PLACES.COAST_VILLAGE,[12,26,30]);
const WIDE_TARGET=add(PLACES.COAST_WALL,[0,6,6]);
const SEA_FROM=add(PLACES.SEA,[-16,3.5,6]);
const SEA_TO=add(PLACES.SEA,[16,3.5,-2]);
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
 fps:30,size:[1080,1920],
 world:{set:'own',setOpts:{post:{...makePost(),shade:makeShade()}}},
 cast:{mayor:{spec:'cast/mayor.json',at:[MAYOR[0],MAYOR[2]],ry:0}},
 voice:{file:'voice_owner.wav',words:'audio/clean.json',lines:lines.map(text=>({who:null,text}))},
 acts:{mayor:{
  face:[{t:0,eyes:'open',brow:'up',mouth:'tight'},{t:'line:1.word:2',eyes:'look_up',brow:'up',mouth:'tight'}],
  look:[{t:0,at:MAYOR_HEAD},{t:'line:1.word:2',at:WALLTOP}]
 }},
 props:[
  {id:'seawall',kind:'seawall',in:'world',at:PLACES.COAST_WALL.at,w:90,h:18,gateW:7,keys:[{t:0,at:PLACES.COAST_WALL.at}]},
  {id:'storeys',kind:'storeys',in:'world',at:add(PLACES.COAST_WALL,[14,0,0]),h:17.4,floors:5,keys:[{t:0,at:add(PLACES.COAST_WALL,[14,0,0])}]},
  {id:'boat',kind:'boat',in:'world',at:BOAT,keys:[{t:0,at:BOAT},{t:'line:2.end',at:add(PLACES.SEA,[.12,.25,14.08])}]}
 ],
 handovers:[],
 shots:[
  {id:'SH01',t0:0,t1:2.6,camera:{move:'push',from:{pos:CLOSE_POS,target:MAYOR_HEAD,fov:34},to:{pos:TILT_POS,target:WALLTOP,fov:38}}},
  {id:'SH02',t0:2.6,t1:'line:1.end',camera:{move:'push',from:{pos:TILT_POS,target:WALLTOP,fov:38},to:{pos:WIDE_POS,target:WIDE_TARGET,fov:48}}},
  {id:'SH03',t0:'line:2.start',t1:'line:2.end',camera:{move:'push',from:{pos:SEA_FROM,target:BOAT,fov:42},to:{pos:SEA_TO,target:BOAT,fov:42}}}
 ],
 captions:'words'
};
