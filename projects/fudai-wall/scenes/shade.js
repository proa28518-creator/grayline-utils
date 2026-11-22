const names=['COAST_WALL','COAST_VILLAGE','SEA','NEIGHBOR_COAST','FLASHBACK_ROCK','ROOM','HILL_GRAVE'];
export const makeShade = () => ({
  zones:{COAST_WALL:[0,-16],COAST_VILLAGE:[0,2],SEA:[0,-44],NEIGHBOR_COAST:[600,0],FLASHBACK_ROCK:[1200,0],ROOM:[1800,0],HILL_GRAVE:[2400,0]},
  steps:[2.6,4.56],
  places:Object.fromEntries(names.map(name=>[name,{exposure:1,sat:.98,keyTint:[1,.88,.68],fillTint:[.68,.78,1.08],hard:.48,rim:.42,rimFill:.34,low:.5,chest:.32,front:-.16,floor:[.48,.5,.55],keyMin:[.82,.78,.7],extra:[],aerial:{color:[.08,.09,.12],density:.003,max:.08},metal:{spec:.56,env:.3,keep:.6}}]))
});
