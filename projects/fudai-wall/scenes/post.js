export const makePost = () => ({
  quality:'auto',maxBlur:22,blend:.12,
  zones:{COAST_WALL:[0,-16],COAST_VILLAGE:[0,2],SEA:[0,-44],NEIGHBOR_COAST:[600,0],FLASHBACK_ROCK:[1200,0],ROOM:[1800,0],HILL_GRAVE:[2400,0]},
  places:Object.fromEntries(['COAST_WALL','COAST_VILLAGE','SEA','NEIGHBOR_COAST','FLASHBACK_ROCK','ROOM','HILL_GRAVE'].map(name=>[name,{air:{density:.0035,start:[2,8],far:88,color:[.025,.03,.04],lights:.12,g:.42,noise:.08,noiseScale:.2,noiseSpeed:.04},dof:{aperture:9,nearK:.18,dead:1.5},bloom:{k:.18,thr:.88},particles:[],gain:1.05,grade:{gamma:1.04,contrast:1.03,saturation:1.08,gr:1.04,gg:1.01,gb:.98,vignette:.3}}]))
});
