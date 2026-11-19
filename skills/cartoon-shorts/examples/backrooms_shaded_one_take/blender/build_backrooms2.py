# build_backrooms2.py: the Blender half of the detailed Backrooms set (env/CONTRACT.md). Builds everything from nothing in a hidden
# Blender: no hand work in the .blend. Blender is only the set builder: materials are names, nothing is baked.
#
#   blender --background --factory-startup --python blender/build_backrooms2.py
#   optional, after --:  --exporter-test   also tries to carry the instances through the glTF exporter and reports what came out
#
# Writes under world/assets/backrooms2/: set.glb, kit.glb, scatter.json, backrooms2.blend. Check: blender/check_backrooms2.py.
#
# Everything here is authored in THREE.JS axes (x, y up, z); to_blender() converts (x, y, z) -> (x, -z, y), the exporter converts back.
# Conventions the renderer can rely on:
#  - UVs: 1 UV = 1 D. glb v is the world height on walls (u = z on x walls, u = x on z walls), and u = x, v = z on floors and ceilings.
#    The `panel` mesh is different: u, v run 0..1.2, 0..2.4 from the panel's own corner (scale by the tile size to get one whole picture).
#  - ceiling_tile has COLOR_0: per tile tone, brown where the tile is stained. Multiply it in, or ignore it.
#  - Kit assets: local +y is out of the surface they sit on (floor, wall or ceiling). For wall assets local -z points up the wall.
#    COLOR_0 on kit assets is a relative tone on top of the material colour (dark slots, screws).
#  - Decals: plane with basis u, v, normal. Spin 0 is u = up x normal, v = normal x u on walls (image top = world up); u = +x, v = -z on
#    floors; u = +x, v = +z on ceilings. Spin turns counter-clockwise around the normal, size = [along u, along v].
#  - `void` is one extra mesh beyond the contract's list: the dark plenum above the ceiling. Render it near black.
import bpy, json, math, os, random, sys
from pathlib import Path
from mathutils import Matrix, Vector

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / 'world' / 'assets' / 'backrooms2'
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []

# ---------------------------------------------------------------------------------------------------------------- layout (world/backrooms.js)
CEIL = 5.0
HALLD = [-10 - 6 * i for i in range(10)]     # hallway doorways, z -10 .. -64
DW, DH = 2.0, 3.7                            # doorway opening in the wall
TH = 0.2                                     # wall thickness
MOUTH_Y = 4.36                               # the mouth's lintel; its liner bottom sits exactly at the 4.3 limit
Z_FAR, Z_FRONT = -72.0, 18.0
FL_BOT, FL_TOP = 4.96, 4.972                 # T-bar flange under and top face
TILE_RING, TILE_FACE = 4.992, 4.980          # tile outer edge and its face (tegular: the face sits lower than the edge)
DECAL_CEIL = 4.976                           # ceiling decals sit between the flange and the tile face, so the T-bars cut them
MOD = 1.2                                    # grid module
PANEL_W, PANEL_L = 1.2, 2.4
TOP_WALL = 5.08                              # walls end just above the tiles; the dark plenum box starts there
LID = 5.5

def panel_slots():
    """The same centres as backrooms.js. Two rows would cut through a wall (z -5 and z -71 reach past it), so those panels slide 0.3 D to
    stay whole: real panels do not pass through walls. Lights in the shader can stay where they are."""
    out = []
    z = 13
    while z > -72:
        for x in ([-3.6, 3.6] if z > -4 else [-4.5, 0, 4.5]):
            real = -5.3 if z == -5 else (-70.7 if z == -71 else z)
            out.append((x, z, real))
        z -= 6
    return out
PANELS = panel_slots()

def hall_zlines():
    out = [-6.5, -69.5]                      # the two shifted panel rows have their own lines
    z = -7.4
    while z > -69:
        out.append(round(z, 3)); z -= MOD
    return sorted(out)

ZONES = [
    dict(name='room', x0=-6.9, x1=6.9, z0=-3.9, z1=17.9,
         xl=[round(.6 + MOD * k, 3) for k in range(-6, 6)], zl=[round(1 + MOD * k, 3) for k in range(-3, 14)]),
    dict(name='hall', x0=-1.9, x1=1.9, z0=-71.9, z1=-4.1, xl=[-.6, .6], zl=hall_zlines()),
    dict(name='sideR', x0=2.1, x1=6.9, z0=-71.9, z1=-4.1, xl=[2.7, 3.9, 5.1, 6.3], zl=hall_zlines()),
    dict(name='sideL', x0=-6.9, x1=-2.1, z0=-71.9, z1=-4.1, xl=[-6.3, -5.1, -3.9, -2.7], zl=hall_zlines()),
]
for Z in ZONES:
    Z['zl'] = [z for z in Z['zl'] if Z['z0'] + .25 < z < Z['z1'] - .25] if Z['name'] == 'room' else Z['zl']

# Wall faces: axis ('x' = the plane x = c, u runs along z; 'z' = the plane z = c, u runs along x), plane c, s = which way it faces, u range, door centres
FACES = []
for sx in (-1, 1):
    # the hallway side of each hall wall runs on through the back wall's thickness to its room face
    for c, s in ((sx * 2 - .1, -1), (sx * 2 + .1, 1)):
        FACES.append(dict(axis='x', c=c, s=s, u0=-71.9, u1=-3.9 if abs(c) < 2 else -4.1, doors=HALLD))
FACES += [
    dict(axis='z', c=-3.9, s=1, u0=1.9, u1=6.9, doors=[4.8]), dict(axis='z', c=-3.9, s=1, u0=-6.9, u1=-1.9, doors=[-4.8]),
    dict(axis='z', c=-4.1, s=-1, u0=2.1, u1=6.9, doors=[4.8]), dict(axis='z', c=-4.1, s=-1, u0=-6.9, u1=-2.1, doors=[-4.8]),
    dict(axis='x', c=6.9, s=-1, u0=-71.9, u1=17.9, doors=[]), dict(axis='x', c=-6.9, s=1, u0=-71.9, u1=17.9, doors=[]),
    dict(axis='z', c=-71.9, s=1, u0=-6.9, u1=6.9, doors=[]), dict(axis='z', c=17.9, s=-1, u0=-6.9, u1=6.9, doors=[]),
]
FLOOR_ZONES = [(Z['x0'], Z['x1'], Z['z0'], Z['z1']) for Z in ZONES]

def face_key(axis, c): return (axis, round(c, 3))
FACE_DOORS = {}
for F in FACES: FACE_DOORS.setdefault(face_key(F['axis'], F['c']), set()).update(F['doors'])

# ---------------------------------------------------------------------------------------------------------------- noise (seeded, pure)
def _h(i, j, s):
    n = (i * 374761393 + j * 668265263 + s * 1274126177) & 0xffffffff
    n = ((n ^ (n >> 13)) * 1274126177) & 0xffffffff
    return ((n ^ (n >> 16)) & 0xffffffff) / 4294967295.0
def vnoise(x, y, scale, s=0):
    x, y = x / scale, y / scale
    i, j = math.floor(x), math.floor(y)
    fx, fy = x - i, y - j
    fx, fy = fx * fx * (3 - 2 * fx), fy * fy * (3 - 2 * fy)
    a, b, c, d = _h(i, j, s), _h(i + 1, j, s), _h(i, j + 1, s), _h(i + 1, j + 1, s)
    return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy
def grid_y(x, z):
    """The whole ceiling grid hangs slightly out of true (+-0.01 D): the lines waver along the hallway, as in an old building."""
    return .007 * (vnoise(x, z, 7, 1) * 2 - 1) + .003 * (vnoise(x, z, 2.5, 2) * 2 - 1)
def wall_disp(axis, c, u, y):
    """Slight unevenness of a wall face along its normal, at most 0.014 D: fades out at the floor and beside doorways so skirting and casings sit tight."""
    d = .010 * (vnoise(u + c * 7, y, 3.1, 3) * 2 - 1) + .004 * (vnoise(u + c * 7, y, 1.45, 4) * 2 - 1)
    k = min(1, max(0, (y - .22) / .4))
    for dc in FACE_DOORS.get(face_key(axis, c), ()):
        k = min(k, min(1, max(0, (abs(u - dc) - DW / 2 - .16) / .35)))
    return d * k

# ---------------------------------------------------------------------------------------------------------------- mesh builder
def sub(a, b): return (a[0] - b[0], a[1] - b[1], a[2] - b[2])
def cross(a, b): return (a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0])
def dot(a, b): return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
def norm(a):
    l = math.sqrt(dot(a, a)) or 1
    return (a[0] / l, a[1] / l, a[2] / l)
def to_blender(p): return (p[0], -p[2], p[1])

class MB:
    def __init__(self):
        self.v, self.f, self.uv, self.col, self.smooth = [], [], [], [], []
        self.has_col = False
    def poly(self, pts, ref=None, uv=None, smooth=False, color=None):
        """One flat polygon with its own vertices. ref: a direction it should face (the winding flips to match)."""
        if ref is not None:
            n = (0, 0, 0)
            for i in range(1, len(pts) - 1):
                c = cross(sub(pts[i], pts[0]), sub(pts[i + 1], pts[0]))
                n = (n[0] + c[0], n[1] + c[1], n[2] + c[2])
            if dot(n, ref) < 0:
                pts = list(reversed(pts))
                if uv: uv = list(reversed(uv))
        if uv is None:
            n = (0, 0, 0)
            for i in range(1, len(pts) - 1):
                c = cross(sub(pts[i], pts[0]), sub(pts[i + 1], pts[0]))
                n = (n[0] + c[0], n[1] + c[1], n[2] + c[2])
            ax, ay, az = abs(n[0]), abs(n[1]), abs(n[2])
            if ay >= ax and ay >= az: uv = [(p[0], p[2]) for p in pts]
            elif ax >= az: uv = [(p[2], p[1]) for p in pts]
            else: uv = [(p[0], p[1]) for p in pts]
        base = len(self.v)
        self.v.extend(pts)
        self.f.append(list(range(base, base + len(pts))))
        self.uv.extend(uv)
        self.smooth.append(smooth)
        if color is not None: self.has_col = True
        self.col.extend([color or (1, 1, 1, 1)] * len(pts))
    def grid(self, fn, us, vs, ref, uvfn=None, smooth=True, color=None, colfn=None):
        """A shared-vertex grid (smooth inside). fn(u, v) -> point. ref: the side it faces."""
        base = len(self.v)
        pts = [[fn(u, v) for v in vs] for u in us]
        for row in pts: self.v.extend(row)
        nv = len(vs)
        a, b, d = pts[0][0], pts[1][0], pts[0][1]
        flip = dot(cross(sub(b, a), sub(d, a)), ref) < 0
        if color is not None or colfn is not None: self.has_col = True
        for i in range(len(us) - 1):
            for j in range(nv - 1):
                ids = [(i, j), (i + 1, j), (i + 1, j + 1), (i, j + 1)]
                if flip: ids.reverse()
                self.f.append([base + a0 * nv + b0 for a0, b0 in ids])
                self.smooth.append(smooth)
                for a0, b0 in ids:
                    u, v = us[a0], vs[b0]
                    self.uv.append(uvfn(u, v) if uvfn else (u, v))
                    self.col.append(colfn(u, v) if colfn else (color or (1, 1, 1, 1)))
    def tris(self): return sum(len(f) - 2 for f in self.f)
    def to_mesh(self, name):
        me = bpy.data.meshes.new(name)
        me.from_pydata([to_blender(p) for p in self.v], [], self.f)
        me.update()
        layer = me.uv_layers.new(name='UVMap')
        flat = []
        for u, v in self.uv: flat += (u, 1 - v)           # the exporter flips v, so the glb holds v as written here
        layer.uv.foreach_set('vector', flat)
        me.polygons.foreach_set('use_smooth', self.smooth)
        if self.has_col:
            ca = me.color_attributes.new('Col', 'FLOAT_COLOR', 'CORNER')
            flatc = []
            for c in self.col: flatc += tuple(c)
            ca.data.foreach_set('color', flatc)
            me.color_attributes.active_color_index = 0
            me.color_attributes.render_color_index = 0
        me.update()
        return me

def material(name, rgb, emit=None):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    b = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    b.inputs['Base Color'].default_value = (*rgb, 1)
    b.inputs['Roughness'].default_value = .85
    if emit:
        b.inputs['Emission Color'].default_value = (*emit, 1)
        b.inputs['Emission Strength'].default_value = 4
    return m

def add_object(name, mb, mat, coll):
    me = mb.to_mesh(name)
    me.materials.append(mat)
    ob = bpy.data.objects.new(name, me)
    coll.objects.link(ob)
    return ob

# ---------------------------------------------------------------------------------------------------------------- ceiling cells
R = random.Random(20261104)
def zone_lines(Z, key):
    a, b = (Z['x0'], Z['x1']) if key == 'x' else (Z['z0'], Z['z1'])
    ls = sorted(set(Z['xl'] if key == 'x' else Z['zl']))
    return [a] + ls + [b]

def panels_of(Z):
    out = []
    for x, z, real in PANELS:
        if Z['x0'] < x < Z['x1'] and Z['z0'] < real < Z['z1']:
            out.append(dict(x=x, z=real, slot=z, x0=x - PANEL_W / 2, x1=x + PANEL_W / 2, z0=real - PANEL_L / 2, z1=real + PANEL_L / 2))
    return out

def plan_cells():
    """Every ceiling cell gets a state: tile, sag, hang, hole or panel, plus stained. Damage follows a large wetness field, so it clusters."""
    cells = []
    for Z in ZONES:
        Z['panels'] = panels_of(Z)
        # every panel needs a grid line at its two short ends; its middle line is simply not drawn
        Z['zl'] = sorted(set(Z['zl']) | {round(p['z0'], 3) for p in Z['panels']} | {round(p['z1'], 3) for p in Z['panels']})
        Z['zl'] = [z for z in Z['zl'] if Z['z0'] + .05 < z < Z['z1'] - .05]
        xs, zs = zone_lines(Z, 'x'), zone_lines(Z, 'z')
        Z['xs'], Z['zs'] = xs, zs
        Z['cells'] = []
        for i in range(len(xs) - 1):
            for j in range(len(zs) - 1):
                c = dict(zone=Z['name'], i=i, j=j, x0=xs[i], x1=xs[i + 1], z0=zs[j], z1=zs[j + 1], state='tile', stain=0.0, sag=0.0, tone=.9 + R.random() * .1)
                c['cx'], c['cz'] = (c['x0'] + c['x1']) / 2, (c['z0'] + c['z1']) / 2
                c['wet'] = .7 * vnoise(c['cx'], c['cz'], 9, 11) + .3 * vnoise(c['cx'], c['cz'], 3, 12) + R.random() * .08
                for p in Z['panels']:
                    if p['x0'] - .01 <= c['cx'] <= p['x1'] + .01 and p['z0'] - .01 <= c['cz'] <= p['z1'] + .01:
                        c['state'] = 'panel'
                Z['cells'].append(c); cells.append(c)
        Z['grid'] = {(c['i'], c['j']): c for c in Z['cells']}
    quota = dict(room=3, hall=6, sideR=7, sideL=7)
    for Z in ZONES:
        cand = sorted((c for c in Z['cells'] if c['state'] == 'tile' and abs(c['x1'] - c['x0'] - MOD) < .15 and abs(c['z1'] - c['z0'] - MOD) < .15), key=lambda c: -c['wet'])
        holes = []
        # the room always has damage in frame, to the sides of the action: the cells nearest these spots
        for sx, sz in dict(room=[(-4.8, -2.0), (4.8, 6.4), (-1.2, 12.5)]).get(Z['name'], []):
            holes.append(min(cand, key=lambda c: math.hypot(c['cx'] - sx, c['cz'] - sz)))
        for c in cand:
            if len(holes) >= quota[Z['name']]: break
            if any(math.hypot(c['cx'] - h['cx'], c['cz'] - h['cz']) < 6.5 for h in holes): continue
            near_panel = any(n and n['state'] == 'panel' for n in (Z['grid'].get((c['i'] + a, c['j'] + b)) for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1))))
            if near_panel and R.random() < .7: continue
            holes.append(c)
        for c in holes:
            c['state'] = 'hole'
            for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)):
                n = Z['grid'].get((c['i'] + a, c['j'] + b))
                if not n or n['state'] != 'tile': continue
                n['stain'] = max(n['stain'], .55 + R.random() * .4)
                if (a == 0 or b == 0) and R.random() < .5: n['sag'] = .05 + R.random() * .08
        # a few tiles have slipped off one side and hang into the room, always above y 4.3
        hangs = 0
        for c in holes:
            if hangs >= (1 if Z['name'] == 'room' else 2): break
            for a, b, edge in R.sample([(1, 0, 'x1'), (-1, 0, 'x0'), (0, 1, 'z1'), (0, -1, 'z0')], 4):
                n = Z['grid'].get((c['i'] + a, c['j'] + b))
                if n and n['state'] == 'tile' and abs(n['x1'] - n['x0'] - MOD) < .15 and abs(n['z1'] - n['z0'] - MOD) < .15:
                    # the free edge is the one facing the hole
                    n['state'] = 'hang'; n['hinge'] = {'x1': 'x1', 'x0': 'x0', 'z1': 'z1', 'z0': 'z0'}[edge]
                    n['droop'] = .3 + R.random() * .16
                    hangs += 1
                    break
        # large soft sags and stains that follow the wetness
        rest = [c for c in Z['cells'] if c['state'] == 'tile']
        rest.sort(key=lambda c: -c['wet'])
        for k, c in enumerate(rest[:int(len(rest) * .12)]):
            c['stain'] = max(c['stain'], .35 + R.random() * .5)
            if k % 3 == 0: c['sag'] = max(c['sag'], .025 + R.random() * .07)
    return cells

def near_damage(Z, x, z, r=1.7):
    return any(c['state'] in ('hole', 'hang') or c['sag'] > .04 for c in Z['cells'] if abs(c['cx'] - x) < r and abs(c['cz'] - z) < r)

# ---------------------------------------------------------------------------------------------------------------- the ceiling
def tile_color(c):
    t = c['tone']
    s = c['stain']
    return (t * (1 - .30 * s), t * (1 - .38 * s), t * (1 - .58 * s), 1)

def build_tile(m, Z, c):
    """A tile sitting in its grid cell: outer edge, two bevel steps, a face that is a shallow dish (or a sag), real sides where they can be seen."""
    INS = .024                              # overlaps the flange (half width 0.03): no light gap
    col = tile_color(c)
    hh = R.random() * .010                  # small height variation between tiles
    tilt = [R.random() * .004 for _ in range(4)]
    x0, x1, z0, z1 = c['x0'], c['x1'], c['z0'], c['z1']
    def corner(x, z, k):
        return grid_y(x, z) + hh + tilt[k]
    ys = [corner(x0, z0, 0), corner(x1, z0, 1), corner(x1, z1, 2), corner(x0, z1, 3)]
    def base(x, z):
        u, v = (x - x0) / (x1 - x0), (z - z0) / (z1 - z0)
        return (ys[0] * (1 - u) + ys[1] * u) * (1 - v) + (ys[3] * (1 - u) + ys[2] * u) * v
    rings = [(INS, TILE_RING), (INS + .012, TILE_RING - .006), (INS + .03, TILE_FACE)]
    def rect(ins, y):
        return [(x0 + ins, y + base(x0 + ins, z0 + ins), z0 + ins), (x1 - ins, y + base(x1 - ins, z0 + ins), z0 + ins),
                (x1 - ins, y + base(x1 - ins, z1 - ins), z1 - ins), (x0 + ins, y + base(x0 + ins, z1 - ins), z1 - ins)]
    down = (0, -1, 0)
    # the edge resting on the flange, darker: a shadow line that also closes the gap above the flange
    ro0 = rect(INS, TILE_RING)
    edge_col = (col[0] * .42, col[1] * .42, col[2] * .42, 1)
    for k in range(4):
        k2 = (k + 1) % 4
        a0, b0 = ro0[k], ro0[k2]
        ya, yb = FL_TOP - .001 + grid_y(a0[0], a0[2]), FL_TOP - .001 + grid_y(b0[0], b0[2])
        m.poly([(a0[0], ya, a0[2]), (b0[0], yb, b0[2]), b0, a0], ref=((a0[0] + b0[0]) / 2 - c['cx'], 0, (a0[2] + b0[2]) / 2 - c['cz']), color=edge_col)
    for a, b in zip(rings[:-1], rings[1:]):
        ra, rb = rect(*a), rect(*b)
        for k in range(4):
            k2 = (k + 1) % 4
            m.poly([ra[k], ra[k2], rb[k2], rb[k]], ref=down, color=col)
    ins = rings[2][0]
    fx0, fx1, fz0, fz1 = x0 + ins, x1 - ins, z0 + ins, z1 - ins
    N = 6 if c['sag'] > 0 else 3
    us = [fx0 + (fx1 - fx0) * i / N for i in range(N + 1)]
    vs = [fz0 + (fz1 - fz0) * i / N for i in range(N + 1)]
    dish = .002 + R.random() * .004
    sag = c['sag']
    ox, oz = .35 + R.random() * .3, .35 + R.random() * .3   # the low point is off centre
    def fp(x, z):
        u, v = (x - fx0) / (fx1 - fx0), (z - fz0) / (fz1 - fz0)
        bump = math.sin(math.pi * u) * math.sin(math.pi * v)
        uu = u ** (math.log(.5) / math.log(ox)); vv = v ** (math.log(.5) / math.log(oz))
        low = (math.sin(math.pi * uu) * math.sin(math.pi * vv)) ** 1.15 if sag > 0 else 0
        return (x, TILE_FACE + base(x, z) + dish * bump - sag * low, z)
    m.grid(fp, us, vs, down, uvfn=lambda x, z: (x, z), smooth=True, color=col)
    # the back and sides only where a hole or a sag lets them be seen
    if near_damage(Z, c['cx'], c['cz']):
        top = TILE_RING + .05
        ro = rect(INS, TILE_RING)
        rt = [(p[0], p[1] + .05, p[2]) for p in ro]
        cen = (c['cx'], top, c['cz'])
        for k in range(4):
            k2 = (k + 1) % 4
            mid = ((ro[k][0] + ro[k2][0]) / 2 - cen[0], 0, (ro[k][2] + ro[k2][2]) / 2 - cen[2])
            m.poly([ro[k], ro[k2], rt[k2], rt[k]], ref=mid, color=col)
        m.poly(rt, ref=(0, 1, 0), color=col)

def build_hanging_tile(m, Z, c):
    """A tile slipped off the grid: one edge still rests on the flange, the other droops into the room, a whole rigid plate with thickness."""
    col = tile_color(c)
    x0, x1, z0, z1 = c['x0'] + .03, c['x1'] - .03, c['z0'] + .03, c['z1'] - .03
    droop = c['droop']
    g = grid_y(c['cx'], c['cz'])
    y0 = TILE_FACE + g
    hinge = c['hinge']
    def dr(x, z):
        if hinge == 'x1': t = (x1 - x) / (x1 - x0)
        elif hinge == 'x0': t = (x - x0) / (x1 - x0)
        elif hinge == 'z1': t = (z1 - z) / (z1 - z0)
        else: t = (z - z0) / (z1 - z0)
        return droop * t + .012 * math.sin(math.pi * t)
    us = [x0 + (x1 - x0) * i / 4 for i in range(5)]
    vs = [z0 + (z1 - z0) * i / 4 for i in range(5)]
    m.grid(lambda x, z: (x, y0 - dr(x, z), z), us, vs, (0, -1, 0), uvfn=lambda x, z: (x, z), smooth=True, color=col)
    m.grid(lambda x, z: (x, y0 + .05 - dr(x, z), z), us, vs, (0, 1, 0), uvfn=lambda x, z: (x, z), smooth=True, color=col)
    ring = [(u, z0) for u in us] + [(x1, v) for v in vs[1:]] + [(u, z1) for u in reversed(us[:-1])] + [(x0, v) for v in reversed(vs[1:-1])]
    for k, (a, b) in enumerate(ring):
        c2, d2 = ring[(k + 1) % len(ring)]
        mid = ((a + c2) / 2 - c['cx'], 0, (b + d2) / 2 - c['cz'])
        m.poly([(a, y0 - dr(a, b), b), (c2, y0 - dr(c2, d2), d2), (c2, y0 + .05 - dr(c2, d2), d2), (a, y0 + .05 - dr(a, b), b)], ref=mid, color=col)

def tbar_segment(m, axis, a, b, line, stem):
    """One stretch of T-bar between two grid crossings: the rolled flange, and the web + bulb where a hole lets them be seen."""
    prof = [(-.03, .006), (-.026, 0), (.026, 0), (.03, .006), (.03, .012)]
    if stem: prof += [(.005, .012), (.005, .095), (.012, .095), (.012, .115), (-.012, .115), (-.012, .095), (-.005, .095), (-.005, .012)]
    prof += [(-.03, .012)]
    def P(t, s, y):
        return (line + s, FL_BOT + y + grid_y(line, t), t) if axis == 'z' else (t, FL_BOT + y + grid_y(t, line), line + s)
    n = len(prof)
    cy = sum(p[1] for p in prof) / n
    for i in range(n):
        s0, y0 = prof[i]; s1, y1 = prof[(i + 1) % n]
        if not stem and y0 == .012 and y1 == .012: continue
        ds, dy = s1 - s0, y1 - y0
        nr = (dy, -ds)                      # the profile runs around it counter-clockwise, so this is outward
        ref = (nr[0], nr[1], 0) if axis == 'z' else (0, nr[1], nr[0])
        m.poly([P(a, s0, y0), P(b, s0, y0), P(b, s1, y1), P(a, s1, y1)], ref=ref)

def build_grid(tb):
    for Z in ZONES:
        xs, zs = Z['xs'], Z['zs']
        # mains run along z, all the way
        for x in xs[1:-1]:
            for j in range(len(zs) - 1):
                a, b = zs[j], zs[j + 1]
                tbar_segment(tb, 'z', a, b, x, near_damage(Z, x, (a + b) / 2, 1.3))
        # cross tees between the mains, stopping at their flanges (no coplanar overlap); the panel's middle line is not drawn
        for z in zs[1:-1]:
            for i in range(len(xs) - 1):
                a, b = xs[i], xs[i + 1]
                cx = (a + b) / 2
                if any(p['x0'] < cx < p['x1'] and p['z0'] + .1 < z < p['z1'] - .1 for p in Z['panels']): continue
                aa = a + (.029 if i > 0 else 0); bb = b - (.029 if i < len(xs) - 2 else 0)
                tbar_segment(tb, 'x', aa, bb, z, near_damage(Z, cx, z, 1.3))
        # wall angle: an L around the room, held to the wall
        def angle(x0, z0, x1, z1, inx, inz, stops):
            for s0, s1 in zip(stops[:-1], stops[1:]):
                def P(t, off, y):
                    x = x0 if x0 == x1 else t
                    z = z0 if z0 == z1 else t
                    return (x + inx * off, FL_BOT + y + grid_y(x, z), z + inz * off)
                back, front = -.004, .05
                tb.poly([P(s0, back, 0), P(s1, back, 0), P(s1, front, 0), P(s0, front, 0)], ref=(0, -1, 0))
                tb.poly([P(s0, front, 0), P(s1, front, 0), P(s1, front, .01), P(s0, front, .01)], ref=(inx, 0, inz))
                tb.poly([P(s0, .016, .01), P(s1, .016, .01), P(s1, .016, .09), P(s0, .016, .09)], ref=(inx, 0, inz))
        angle(Z['x0'], Z['z0'], Z['x1'], Z['z0'], 0, 1, xs)
        angle(Z['x0'], Z['z1'], Z['x1'], Z['z1'], 0, -1, xs)
        angle(Z['x0'], Z['z0'], Z['x0'], Z['z1'], 1, 0, zs)
        angle(Z['x1'], Z['z0'], Z['x1'], Z['z1'], -1, 0, zs)
        # hanger wires up from the crossings around each hole
        for c in Z['cells']:
            if c['state'] != 'hole': continue
            for x, z in ((c['x0'], c['z0']), (c['x1'], c['z1']), (c['x0'], c['z1'])):
                y0, y1 = FL_BOT + .1 + grid_y(x, z), LID
                r = .006
                for k in range(3):
                    a0, a1 = k * 2.094, (k + 1) * 2.094
                    p0 = (x + r * math.cos(a0), y0, z + r * math.sin(a0)); p1 = (x + r * math.cos(a1), y0, z + r * math.sin(a1))
                    m0 = (math.cos((a0 + a1) / 2), 0, math.sin((a0 + a1) / 2))
                    tb.poly([p0, p1, (p1[0], y1, p1[2]), (p0[0], y1, p0[2])], ref=m0)

def build_panel(frame, lens, p):
    """A recessed 2x4 troffer: a flat lip beside the T-bar, a chamfer, a sloped reflector up to the lens, the emissive lens set back in it."""
    g = grid_y(p['x'], p['z'])
    b = FL_BOT + g
    rings = [(.02, .014), (.032, .002), (.058, .002), (.066, .012), (.098, .062), (.102, .09)]
    def rect(ins, y):
        return [(p['x0'] + ins, b + y, p['z0'] + ins), (p['x1'] - ins, b + y, p['z0'] + ins), (p['x1'] - ins, b + y, p['z1'] - ins), (p['x0'] + ins, b + y, p['z1'] - ins)]
    for a, c in zip(rings[:-1], rings[1:]):
        ra, rc = rect(*a), rect(*c)
        for k in range(4):
            k2 = (k + 1) % 4
            frame.poly([ra[k], ra[k2], rc[k2], rc[k]], ref=(0, -1, 0))
    ins, y = .1, .085
    pts = rect(ins, y)
    lens.poly(pts, ref=(0, -1, 0), uv=[(q[0] - p['x0'], q[2] - p['z0']) for q in pts])

def build_ceiling(tile, tb, frame, lens, void):
    for Z in ZONES:
        for c in Z['cells']:
            if c['state'] == 'tile': build_tile(tile, Z, c)
            elif c['state'] == 'hang': build_hanging_tile(tile, Z, c)
        for p in Z['panels']: build_panel(frame, lens, p)
        # the plenum: a dark box per zone
        x0, x1, z0, z1 = Z['x0'], Z['x1'], Z['z0'], Z['z1']
        void.poly([(x0, LID, z0), (x1, LID, z0), (x1, LID, z1), (x0, LID, z1)], ref=(0, -1, 0))
        for a, b, ref in (((x0, z0), (x1, z0), (0, 0, 1)), ((x1, z0), (x1, z1), (-1, 0, 0)), ((x1, z1), (x0, z1), (0, 0, -1)), ((x0, z1), (x0, z0), (1, 0, 0))):
            void.poly([(a[0], TOP_WALL - .04, a[1]), (b[0], TOP_WALL - .04, b[1]), (b[0], LID, b[1]), (a[0], LID, a[1])], ref=ref)
        # something to see up there: a duct and a pipe over each hole
        for c in Z['cells']:
            if c['state'] != 'hole': continue
            rr = random.Random(int(c['cx'] * 100) * 31 + int(c['cz'] * 100))
            along_x = rr.random() < .5
            off = (rr.random() - .5) * .5
            w, lo, hi = .34 + rr.random() * .16, 5.2, 5.42
            if along_x:
                a0, a1 = max(x0, c['cx'] - 2.2), min(x1, c['cx'] + 2.2)
                zz = c['cz'] + off
                void.poly([(a0, lo, zz - w), (a1, lo, zz - w), (a1, lo, zz + w), (a0, lo, zz + w)], ref=(0, -1, 0))
                void.poly([(a0, lo, zz - w), (a1, lo, zz - w), (a1, hi, zz - w), (a0, hi, zz - w)], ref=(0, 0, -1))
                void.poly([(a0, lo, zz + w), (a1, lo, zz + w), (a1, hi, zz + w), (a0, hi, zz + w)], ref=(0, 0, 1))
            else:
                a0, a1 = max(z0, c['cz'] - 2.2), min(z1, c['cz'] + 2.2)
                xx = c['cx'] + off
                void.poly([(xx - w, lo, a0), (xx + w, lo, a0), (xx + w, lo, a1), (xx - w, lo, a1)], ref=(0, -1, 0))
                void.poly([(xx - w, lo, a0), (xx - w, lo, a1), (xx - w, hi, a1), (xx - w, hi, a0)], ref=(-1, 0, 0))
                void.poly([(xx + w, lo, a0), (xx + w, lo, a1), (xx + w, hi, a1), (xx + w, hi, a0)], ref=(1, 0, 0))

# ---------------------------------------------------------------------------------------------------------------- walls, frames, skirting
def face_rects(F):
    """(u0, u1, y0, y1, kind) of a wall face: solid stretches between doorways, the header over each doorway."""
    out = []
    a = F['u0']
    for d in sorted(F['doors']):
        l, r = d - DW / 2, d + DW / 2
        if l > a: out.append((a, l, 0, TOP_WALL, 'solid'))
        out.append((l, r, DH, TOP_WALL, 'header'))
        a = r
    if F['u1'] > a: out.append((a, F['u1'], 0, TOP_WALL, 'solid'))
    return out

def lines(a, b, step, extra=()):
    n = max(1, int(round((b - a) / step)))
    ls = {round(a + (b - a) * i / n, 4) for i in range(n + 1)} | {round(e, 4) for e in extra if a < e < b}
    return sorted(ls)

def wall_point(F, u, y, displaced=True):
    d = wall_disp(F['axis'], F['c'], u, y) if displaced else 0
    return (F['c'] + F['s'] * d, y, u) if F['axis'] == 'x' else (u, y, F['c'] + F['s'] * d)
def face_normal(F): return (F['s'], 0, 0) if F['axis'] == 'x' else (0, 0, F['s'])

def build_walls(wall, lintel):
    for F in FACES:
        for u0, u1, y0, y1, kind in face_rects(F):
            m = lintel if kind == 'header' else wall
            m.grid(lambda u, y: wall_point(F, u, y), lines(u0, u1, .5), lines(y0, y1, .5, (DH,)), face_normal(F), uvfn=lambda u, y: (u, y))
    # the outside of the outer shell (never seen, closes the box)
    for a, b, ref in (((7.1, -72.1), (7.1, 18.1), (1, 0, 0)), ((-7.1, -72.1), (-7.1, 18.1), (-1, 0, 0)), ((-7.1, -72.1), (7.1, -72.1), (0, 0, -1)), ((-7.1, 18.1), (7.1, 18.1), (0, 0, 1))):
        wall.poly([(a[0], 0, a[1]), (b[0], 0, b[1]), (b[0], TOP_WALL, b[1]), (a[0], TOP_WALL, a[1])], ref=ref)
    # the mouth's lintel: x -1.9..1.9, both faces and its underside
    for c, s in ((-3.9, 1), (-4.1, -1)):
        F = dict(axis='z', c=c, s=s)
        lintel.grid(lambda u, y: wall_point(F, u, y, False), lines(-1.9, 1.9, .5), lines(MOUTH_Y, TOP_WALL, .4), (0, 0, s), uvfn=lambda u, y: (u, y))

def sweep_u(m, axis, plane, s, uL, uR, yH, profile, legs=(0, 1, 2)):
    """Sweep a profile around a doorway (left post, head, right post) with mitred corners. Profile points: (t, h), t = away from the opening
    in the wall plane, h = along the normal s from the plane."""
    def P(st, t, h):
        u, y = ((uL - t, 0), (uL - t, yH + t), (uR + t, yH + t), (uR + t, 0))[st]
        n = plane + s * h
        return (n, y, u) if axis == 'x' else (u, y, n)
    tc = sum(p[0] for p in profile) / len(profile); hc = sum(p[1] for p in profile) / len(profile)
    nvec = (s, 0, 0) if axis == 'x' else (0, 0, s)
    uvec = (0, 0, 1) if axis == 'x' else (1, 0, 0)
    tdirs = ((-uvec[0], 0, -uvec[2]), (0, 1, 0), (uvec[0], 0, uvec[2]))
    for leg in legs:
        T = tdirs[leg]
        for (t0, h0), (t1, h1) in zip(profile[:-1], profile[1:]):
            mid_t, mid_h = (t0 + t1) / 2 - tc, (h0 + h1) / 2 - hc
            dt, dh = t1 - t0, h1 - h0
            cand = (-dh, dt)
            if cand[0] * mid_t + cand[1] * mid_h < 0: cand = (dh, -dt)
            ref = (T[0] * cand[0] + nvec[0] * cand[1], T[1] * cand[0], T[2] * cand[0] + nvec[2] * cand[1])
            m.poly([P(leg, t0, h0), P(leg + 1, t0, h0), P(leg + 1, t1, h1), P(leg, t1, h1)], ref=ref)

CASING = [(0, 0), (0, .034), (.012, .047), (.05, .052), (.118, .036), (.146, .024), (.16, .012), (.16, -.006)]
LINER = [(0, -.112), (-.05, -.112), (-.06, -.1), (-.06, .1), (-.05, .112), (0, .112)]

def box(m, x0, x1, y0, y1, z0, z1, skip_bottom=True):
    c = ((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2)
    m.poly([(x0, y0, z0), (x0, y1, z0), (x0, y1, z1), (x0, y0, z1)], ref=(-1, 0, 0))
    m.poly([(x1, y0, z0), (x1, y1, z0), (x1, y1, z1), (x1, y0, z1)], ref=(1, 0, 0))
    m.poly([(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0)], ref=(0, 0, -1))
    m.poly([(x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)], ref=(0, 0, 1))
    m.poly([(x0, y1, z0), (x1, y1, z0), (x1, y1, z1), (x0, y1, z1)], ref=(0, 1, 0))
    if not skip_bottom: m.poly([(x0, y0, z0), (x1, y0, z0), (x1, y0, z1), (x0, y0, z1)], ref=(0, -1, 0))

def build_door(tr, axis, center, uc):
    """A doorway: jamb liner through the wall, a bevelled casing on both faces, plinth blocks. Every doorway is the same."""
    uL, uR = uc - DW / 2, uc + DW / 2
    sweep_u(tr, axis, center, 1, uL, uR, DH, LINER)
    for s in (1, -1):
        sweep_u(tr, axis, center + s * TH / 2, s, uL, uR, DH, CASING)
        for u0, u1 in ((uL - .17, uL + .004), (uR - .004, uR + .17)):
            h0, h1 = center + s * (TH / 2 - .006), center + s * (TH / 2 + .064)
            if axis == 'x': box(tr, min(h0, h1), max(h0, h1), 0, .3, u0, u1)
            else: box(tr, u0, u1, 0, .3, min(h0, h1), max(h0, h1))
    # a worn metal threshold where the carpet changes room, flush enough to walk over
    if axis == 'x': cbox(tr, center - .13, center + .13, 0, .012, uL + .06, uR - .06, .004, skip=((1, -1),))
    else: cbox(tr, uL + .06, uR - .06, 0, .012, center - .13, center + .13, .004, skip=((1, -1),))

def build_trim(tr):
    for x in (-2, 2):
        for z in HALLD: build_door(tr, 'x', x, z)
    for x in (-4.8, 4.8): build_door(tr, 'z', -4, x)
    # the hallway mouth: liner under the lintel down to exactly y 4.3, casing round it on the room side, head casing on the hall side
    sweep_u(tr, 'z', -4, 1, -1.9, 1.9, MOUTH_Y, [(t, h) for t, h in LINER])
    sweep_u(tr, 'z', -3.9, 1, -1.9, 1.9, MOUTH_Y, CASING)
    sweep_u(tr, 'z', -4.1, -1, -1.9, 1.9, MOUTH_Y, CASING, legs=(1,))
    # skirting on every wall face, stopped by the door casings
    PROF = [(0, -.004), (0, .034), (.135, .034), (.185, .025), (.214, .012), (.22, -.004)]
    for F in FACES:
        for u0, u1, y0, y1, kind in face_rects(F):
            if kind != 'solid': continue
            a = u0 + (.13 if any(abs(u0 - (d + DW / 2)) < 1e-6 for d in F['doors']) else 0)
            b = u1 - (.13 if any(abs(u1 - (d - DW / 2)) < 1e-6 for d in F['doors']) else 0)
            # the hall walls stop their skirting at the mouth's liner; the back wall's room face stops at the mouth's casing
            if F['axis'] == 'x' and abs(abs(F['c']) - 1.9) < 1e-6: b = min(b, -4.12)
            if F['axis'] == 'z' and F['c'] == -3.9:
                if a == 1.9: a = 2.05
                if b == -1.9: b = -2.05
            n = face_normal(F)
            for (y_0, h0), (y_1, h1) in zip(PROF[:-1], PROF[1:]):
                def P(u, y, h):
                    p = F['c'] + F['s'] * h
                    return (p, y, u) if F['axis'] == 'x' else (u, y, p)
                dy, dh = y_1 - y_0, h1 - h0
                ref = (n[0] * max(dy, 0), max(-dh, 0), n[2] * max(dy, 0))
                if ref == (0, 0, 0): continue       # the bottom of the profile (y 0): never seen
                tr.poly([P(a, y_0, h0), P(b, y_0, h0), P(b, y_1, h1), P(a, y_1, h1)], ref=ref)

def build_carpet(c):
    # flat, y 0 everywhere: characters stand on it
    c.grid(lambda x, z: (x, 0, z), lines(-7.1, 7.1, 2), lines(Z_FAR - .1, Z_FRONT + .1, 2), (0, 1, 0), uvfn=lambda x, z: (x, z), smooth=False)

# ---------------------------------------------------------------------------------------------------------------- the kit
def tone(t): return (t, t, t, 1)

def cbox(m, x0, x1, y0, y1, z0, z1, b=.006, color=None, skip=()):
    """A box with chamfered edges and corners, so they catch the light."""
    c = ((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2)
    h = ((x1 - x0) / 2, (y1 - y0) / 2, (z1 - z0) / 2)
    b = min(b, h[0] * .9, h[1] * .9, h[2] * .9)
    def pt(ax_vals): return (c[0] + ax_vals[0], c[1] + ax_vals[1], c[2] + ax_vals[2])
    for ax in range(3):
        a1, a2 = (ax + 1) % 3, (ax + 2) % 3
        for s in (-1, 1):
            if (ax, s) in skip: continue
            q = []
            for t1, t2 in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
                v = [0, 0, 0]; v[ax] = s * h[ax]; v[a1] = t1 * (h[a1] - b); v[a2] = t2 * (h[a2] - b)
                q.append(pt(v))
            r = [0, 0, 0]; r[ax] = s
            m.poly(q, ref=tuple(r), color=color)
    for a in range(3):
        for bb in range(a + 1, 3):
            cc = 3 - a - bb
            for sa in (-1, 1):
                for sb in (-1, 1):
                    q = []
                    for sc, first in ((-1, True), (1, True), (1, False), (-1, False)):
                        v = [0, 0, 0]
                        v[a] = sa * (h[a] - (0 if first else b)); v[bb] = sb * (h[bb] - (b if first else 0)); v[cc] = sc * (h[cc] - b)
                        q.append(pt(v))
                    r = [0, 0, 0]; r[a] = sa; r[bb] = sb
                    m.poly(q, ref=tuple(r), color=color)
    for sx in (-1, 1):
        for sy in (-1, 1):
            for sz in (-1, 1):
                q = [pt((sx * h[0], sy * (h[1] - b), sz * (h[2] - b))), pt((sx * (h[0] - b), sy * h[1], sz * (h[2] - b))), pt((sx * (h[0] - b), sy * (h[1] - b), sz * h[2]))]
                m.poly(q, ref=(sx, sy, sz), color=color)

def tube(m, path, r, sides=6, color=None, caps=True, flat=False):
    """A round section along a path (smooth), with simple frames."""
    pts = [Vector(p) for p in path]
    rings = []
    up = Vector((0, 1, 0))
    for i, p in enumerate(pts):
        d = (pts[min(i + 1, len(pts) - 1)] - pts[max(i - 1, 0)]).normalized()
        a = d.cross(up)
        if a.length < .15: a = d.cross(Vector((1, 0, 0)))
        a.normalize(); b = a.cross(d).normalized()
        rr = r[i] if isinstance(r, (list, tuple)) else r
        rings.append([tuple(p + a * (rr * math.cos(k * 6.28318 / sides)) + b * (rr * math.sin(k * 6.28318 / sides))) for k in range(sides)])
    base = len(m.v)
    for rg in rings: m.v.extend(rg)
    if color is not None: m.has_col = True
    for i in range(len(rings) - 1):
        for k in range(sides):
            k2 = (k + 1) % sides
            ids = [base + i * sides + k, base + i * sides + k2, base + (i + 1) * sides + k2, base + (i + 1) * sides + k]
            ctr = (Vector(m.v[ids[0]]) + Vector(m.v[ids[2]])) / 2 - (pts[i] + pts[i + 1]) / 2
            nr = Vector(cross(sub(m.v[ids[1]], m.v[ids[0]]), sub(m.v[ids[3]], m.v[ids[0]])))
            if nr.dot(ctr) < 0: ids.reverse()
            m.f.append(ids); m.smooth.append(not flat)
            for q in ids:
                m.uv.append((m.v[q][0] + m.v[q][2], m.v[q][1]))
                m.col.append(color or (1, 1, 1, 1))
    if caps:
        for i, rg in ((0, rings[0]), (len(rings) - 1, rings[-1])):
            d = (pts[1] - pts[0]) if i == 0 else (pts[-1] - pts[-2])
            s = -1 if i == 0 else 1
            m.poly(list(rg), ref=tuple(d * s), color=color)

def rock(m, c, r, seed, color=None, flatten=.7):
    """An irregular chunk, flat shaded."""
    rr = random.Random(seed)
    top = (c[0] + (rr.random() - .5) * r * .6, c[1] + r * flatten * (.8 + rr.random() * .4), c[2] + (rr.random() - .5) * r * .6)
    ring = []
    n = 5 + (seed % 2)
    for k in range(n):
        a = k * 6.28318 / n + rr.random() * .4
        d = r * (.7 + rr.random() * .5)
        ring.append((c[0] + d * math.cos(a), c[1] + r * flatten * (.1 + rr.random() * .35), c[2] + d * math.sin(a)))
    low = []
    for k in range(n):
        a = k * 6.28318 / n + rr.random() * .3
        d = r * (.85 + rr.random() * .35)
        low.append((c[0] + d * math.cos(a), c[1], c[2] + d * math.sin(a)))
    for k in range(n):
        k2 = (k + 1) % n
        o = sub(((ring[k][0] + ring[k2][0]) / 2, c[1] + r * .3, (ring[k][2] + ring[k2][2]) / 2), (c[0], c[1], c[2]))
        m.poly([ring[k], ring[k2], top], ref=(o[0], r, o[2]), color=color)
        m.poly([low[k], low[k2], ring[k2], ring[k]], ref=o, color=color)

def jag_plate(m, outline, y0, y1, color=None, up=True):
    """A flat plate from an irregular outline, with sides and a top."""
    top = [(x, y1, z) for x, z in outline]
    m.poly(top, ref=(0, 1, 0), color=color)
    if not up: m.poly([(x, y0, z) for x, z in outline], ref=(0, -1, 0), color=color)
    cx = sum(p[0] for p in outline) / len(outline); cz = sum(p[1] for p in outline) / len(outline)
    for k in range(len(outline)):
        a, b = outline[k], outline[(k + 1) % len(outline)]
        m.poly([(a[0], y0, a[1]), (b[0], y0, b[1]), (b[0], y1, b[1]), (a[0], y1, a[1])], ref=((a[0] + b[0]) / 2 - cx, 0, (a[1] + b[1]) / 2 - cz), color=color)

def build_kit(coll):
    rr = random.Random(77)
    out = {}
    def done(name, m, rgb): out[name] = add_object(name, m, material('kit_' + name, rgb), coll)

    # vent: a return grille on a wall. Local: +y out of the wall, -z up the wall. 0.76 wide, 0.4 tall.
    m = MB()
    W, H, T = .38, .20, .03
    D = tone(.18)
    cbox(m, -W, W, 0, .004, -H, H, 0, D, skip=((1, -1),))                          # dark back
    for x0, x1, z0, z1 in ((-W, -W + .035, -H, H), (W - .035, W, -H, H), (-W + .035, W - .035, -H, -H + .035), (-W + .035, W - .035, H - .035, H)):
        cbox(m, x0, x1, 0, T, z0, z1, .008, skip=((1, -1),))
    n = 7
    for i in range(n):
        z = -H + .05 + (2 * H - .1) * (i + .5) / n
        a = (-W + .035, .012, z + .022); b = (W - .035, .012, z + .022)
        c = (W - .035, T - .004, z - .018); d = (-W + .035, T - .004, z - .018)
        m.poly([a, b, c, d], ref=(0, 1, -1))
        m.poly([(a[0], a[1], a[2]), (b[0], b[1], b[2]), (b[0], b[1] + .006, b[2]), (a[0], a[1] + .006, a[2])], ref=(0, 0, 1), color=tone(.75))
    for sx in (-1, 1):
        for sz in (-1, 1):
            cbox(m, sx * (W - .018) - .007, sx * (W - .018) + .007, T - .001, T + .006, sz * (H - .018) - .007, sz * (H - .018) + .007, .002, tone(.5), skip=((1, -1),))
    done('vent', m, (.72, .70, .60))

    # outlet: plate, two sockets, a screw
    m = MB()
    cbox(m, -.065, .065, 0, .014, -.105, .105, .006, skip=((1, -1),))
    for z in (-.048, .048):
        cbox(m, -.036, .036, .010, .018, z - .036, z + .036, .004, tone(.92), skip=((1, -1),))
        for x in (-.012, .012):
            cbox(m, x - .004, x + .004, .0175, .0195, z - .010, z + .010, .001, tone(.08), skip=((1, -1),))
    cbox(m, -.006, .006, .012, .019, -.006, .006, .002, tone(.5), skip=((1, -1),))
    done('outlet', m, (.78, .74, .62))

    # conduit_run: a junction box with a metal conduit running 3 D up the wall to the ceiling, straps and couplings
    m = MB()
    cbox(m, -.09, .09, 0, .075, -.09, .09, .008, skip=((1, -1),))
    cbox(m, -.075, .075, .074, .079, -.075, .075, .002, tone(.8), skip=((1, -1),))
    tube(m, [(0, .045, -.09), (0, .045, -.6), (0, .045, -1.2), (0, .045, -2), (0, .045, -2.45), (.012, .04, -3.0)], .024, 6, caps=False)
    for z in (-.08, -.95, -1.9, -2.7):
        tube(m, [(0, .045, z), (0, .045, z - .05)], .031, 6, tone(.72))
    for z in (-.5, -1.45, -2.35):
        cbox(m, -.05, .05, 0, .012, z - .018, z + .018, .004, tone(.65), skip=((1, -1),))
        tube(m, [(-.03, .012, z), (-.027, .05, z), (0, .076, z), (.027, .05, z), (.03, .012, z)], .012, 3, tone(.65), caps=False)
    done('conduit_run', m, (.56, .56, .52))

    # cable_coil: a loose coil of dark cable on the floor, with a tail
    m = MB()
    for k, (cx, cz, r0, y0) in enumerate(((0, 0, .135, .012), (.012, -.006, .125, .028), (-.01, .012, .14, .042))):
        path = []
        for i in range(13):
            a = i * 6.28318 / 12 + k
            rw = r0 * (1 + .08 * math.sin(a * 3 + k))
            path.append((cx + rw * math.cos(a), y0 + .006 * math.sin(a * 2 + k), cz + rw * math.sin(a)))
        tube(m, path, .012, 4, caps=False)
    tube(m, [(.13, .012, .03), (.2, .012, .08), (.27, .012, .06), (.34, .012, .13), (.38, .012, .12)], .012, 4)
    done('cable_coil', m, (.08, .08, .07))

    # paper_scrap: a creased, torn sheet
    m = MB()
    nx, nz = 4, 5
    g = {}
    for i in range(nx + 1):
        for j in range(nz + 1):
            x = (i / nx - .5) * .3 + (rr.random() - .5) * .025 * (1 if i in (0, nx) or j in (0, nz) else .3)
            z = (j / nz - .5) * .4 + (rr.random() - .5) * .025 * (1 if i in (0, nx) or j in (0, nz) else .3)
            g[i, j] = (x, .004 + .012 * abs(math.sin(i * 1.7 + j * .4)) + .012 * rr.random() + (.018 if j == nz and i >= nx - 1 else 0), z)
    for i in range(nx):
        for j in range(nz):
            m.poly([g[i, j], g[i + 1, j], g[i + 1, j + 1], g[i, j + 1]], ref=(0, 1, 0), color=tone(.9 + rr.random() * .1))
    done('paper_scrap', m, (.74, .71, .60))

    # tile_loose: a fallen ceiling tile, one corner broken off, and the broken piece beside it
    m = MB()
    S = .56
    out1 = [(-S, -S), (S, -S), (S, .12), (.34, .2), (.28, .36), (.05, S), (-S, S)]
    # the sheet is slightly warped
    jag_plate(m, out1, .002, .05, tone(.96))
    # a bevel line along the edges, as the tile had on the ceiling
    jag_plate(m, [(.48, .36), (.62, .24), (.72, .42), (.6, .6), (.42, .56)], .002, .045, tone(.86))
    rock(m, (.2, 0, .7), .05, 3, tone(.8), .6)
    rock(m, (.74, 0, .08), .04, 4, tone(.8), .6)
    done('tile_loose', m, (.70, .68, .56))

    # tile_missing_frame: goes into a hole. Local +y points down into the room, the origin is on the grid. Torn tile edges on the flanges and
    # two wires dangling, never lower than y 4.6 in the world.
    m = MB()
    A = .57
    jag = lambda n, s: [(-A + 2 * A * i / n, A - s * (.04 + rr.random() * .13)) for i in range(n + 1)]
    edge1 = [(-A, A)] + [(x, z) for x, z in jag(7, 1)][::1] + [(A, A)]
    def strip(pts, rot):
        c, s = math.cos(rot), math.sin(rot)
        pts2 = [(x * c - z * s, x * s + z * c) for x, z in pts]
        top = [(x, -.01, z) for x, z in pts2]
        bot = [(x, -.05, z) for x, z in pts2]
        m.poly(top, ref=(0, 1, 0), color=tone(.95))
        m.poly(bot, ref=(0, -1, 0), color=tone(.8))
        cx = sum(p[0] for p in pts2) / len(pts2); cz = sum(p[1] for p in pts2) / len(pts2)
        for k in range(len(pts2)):
            a, b = pts2[k], pts2[(k + 1) % len(pts2)]
            m.poly([(a[0], -.05, a[1]), (b[0], -.05, b[1]), (b[0], -.01, b[1]), (a[0], -.01, a[1])], ref=((a[0] + b[0]) / 2 - cx, 0, (a[1] + b[1]) / 2 - cz), color=tone(.7))
    strip(edge1, 0)
    strip([(-A, A)] + [(x, z) for x, z in jag(5, .7)] + [(A, A)], math.pi / 2)
    strip([(-A, A)] + [(x, z) for x, z in jag(6, 1.1)] + [(A, A)], math.pi)
    tube(m, [(.18, -.42, .1), (.2, -.1, .12), (.26, .1, .08), (.22, .26, .02), (.27, .36, -.02)], .009, 3, tone(.2))
    tube(m, [(-.26, -.42, -.2), (-.24, -.08, -.22), (-.3, .06, -.26), (-.27, .15, -.3)], .007, 3, tone(.35))
    done('tile_missing_frame', m, (.66, .64, .52))

    # can: a crushed can lying on its side
    m = MB()
    L, Rd = .11, .062
    rings = []
    for i, x in enumerate((-L, -L + .01, -L + .03, -.02, .03, L - .03, L - .01, L)):
        s = {0: .78, 1: .95, 6: .95, 7: .78}.get(i, 1)
        ring = []
        for k in range(9):
            a = k * 6.28318 / 9
            dent = 1 - .35 * max(0, math.cos(a - 1.1)) * math.exp(-((x - .01) / .05) ** 2)
            ring.append((x, Rd + Rd * s * dent * math.sin(a), Rd * s * dent * math.cos(a)))
        rings.append(ring)
    for i in range(len(rings) - 1):
        for k in range(9):
            k2 = (k + 1) % 9
            q = [rings[i][k], rings[i + 1][k], rings[i + 1][k2], rings[i][k2]]
            ctr = ((q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2, (q[0][2] + q[2][2]) / 2)
            m.poly(q, ref=(0, ctr[1] - Rd, ctr[2]), color=tone(.45 if i in (0, 6) else 1))
    m.poly(rings[0], ref=(-1, 0, 0), color=tone(.55))
    m.poly(rings[-1], ref=(1, 0, 0), color=tone(.55))
    done('can', m, (.40, .33, .22))

    # debris_a: chunks of plaster and tile
    m = MB()
    for i, (x, z, r) in enumerate(((0, 0, .065), (.11, .05, .04), (-.09, .07, .035), (.05, -.1, .03), (-.12, -.06, .022))):
        rock(m, (x, 0, z), r, 10 + i, tone(.82 + rr.random() * .18))
    done('debris_a', m, (.62, .58, .46))

    # debris_b: crumbs, fibre flakes and a splinter of trim
    m = MB()
    for i in range(7):
        a = rr.random() * 6.28; d = .03 + rr.random() * .14
        x, z = d * math.cos(a), d * math.sin(a)
        s = .018 + rr.random() * .022
        rot = rr.random() * 6.28
        pts = [(x + s * math.cos(rot + k * 2.09) * (1 + rr.random() * .5), z + s * math.sin(rot + k * 2.09) * (1 + rr.random() * .5)) for k in range(3)]
        jag_plate(m, pts, .001, .007 + rr.random() * .012, tone(.75 + rr.random() * .25))
    cbox(m, -.11, .07, 0, .012, -.012, .012, .003, tone(.45), skip=((1, -1),))
    done('debris_b', m, (.46, .42, .30))
    return out

# ---------------------------------------------------------------------------------------------------------------- geometry nodes scatter
def bpoint(p): return Vector(to_blender(p))

def helper_mesh(name, coll, verts, edges=()):
    me = bpy.data.meshes.new(name)
    me.from_pydata([to_blender(v) for v in verts], list(edges), [])
    me.update()
    ob = bpy.data.objects.new(name, me)
    coll.objects.link(ob)
    return ob

def surface_mesh(name, kind):
    m = MB()
    if kind == 'floor':
        for x0, x1, z0, z1 in FLOOR_ZONES:
            m.grid(lambda x, z: (x, 0, z), lines(x0, x1, .25), lines(z0, z1, .25), (0, 1, 0), smooth=False)
    elif kind == 'ceil':
        for x0, x1, z0, z1 in FLOOR_ZONES:
            m.grid(lambda x, z: (x, DECAL_CEIL, z), lines(x0, x1, .4), lines(z0, z1, .4), (0, -1, 0), smooth=False)
    elif kind in ('wall', 'wall_solid', 'wall_high'):
        for F in FACES:
            for u0, u1, y0, y1, k in face_rects(F):
                if kind == 'wall_solid' and k != 'solid': continue
                y1 = min(y1, CEIL - .05)
                m.grid(lambda u, y: wall_point(F, u, y, False), lines(u0, u1, .33), lines(y0, y1, .33), face_normal(F), smooth=False)
    return m.to_mesh(name)

def make_scatter_group(name, cfg, helpers):
    ng = bpy.data.node_groups.new(name, 'GeometryNodeTree')
    ng.interface.new_socket('Geometry', in_out='INPUT', socket_type='NodeSocketGeometry')
    ng.interface.new_socket('Geometry', in_out='OUTPUT', socket_type='NodeSocketGeometry')
    N = ng.nodes.new
    L = ng.links.new
    gi, go = N('NodeGroupInput'), N('NodeGroupOutput')
    seed = cfg['seed']

    def val(v):
        n = N('ShaderNodeValue'); n.outputs[0].default_value = v; return n.outputs[0]
    def math_op(op, a, b):
        n = N('ShaderNodeMath'); n.operation = op
        for i, x in enumerate((a, b)):
            if isinstance(x, (int, float)): n.inputs[i].default_value = x
            else: L(x, n.inputs[i])
        return n.outputs[0]
    def map_range(v, a, b, c, d, smooth=False):
        n = N('ShaderNodeMapRange'); n.clamp = True
        if smooth: n.interpolation_type = 'SMOOTHSTEP'
        L(v, n.inputs[0])
        n.inputs[1].default_value, n.inputs[2].default_value, n.inputs[3].default_value, n.inputs[4].default_value = a, b, c, d
        return n.outputs[0]
    def rand(lo, hi, sd):
        n = N('FunctionNodeRandomValue'); n.data_type = 'FLOAT'
        n.inputs['Min'].default_value, n.inputs['Max'].default_value = lo, hi
        n.inputs['Seed'].default_value = sd
        return n.outputs['Value']
    def noise(scale, w, detail=2.0):
        n = N('ShaderNodeTexNoise'); n.noise_dimensions = '4D'
        n.inputs['W'].default_value = w; n.inputs['Scale'].default_value = scale; n.inputs['Detail'].default_value = detail
        return n.outputs[0]
    def proximity(ob, mode):
        info = N('GeometryNodeObjectInfo'); info.transform_space = 'RELATIVE'
        info.inputs['Object'].default_value = ob
        p = N('GeometryNodeProximity'); p.target_element = mode
        L(info.outputs['Geometry'], p.inputs[0])
        return p.outputs['Distance']

    if cfg.get('points'):
        points_geo = gi.outputs[0]
        normal_out = None
    else:
        # DENSITY = base x large noise x medium noise x (ambient + the strongest of: near the floor seam, near a hot point)
        terms = []
        if cfg.get('seamW', 0) > 0:
            d = proximity(helpers['seam'], 'EDGES')
            terms.append(math_op('MULTIPLY', math_op('POWER', map_range(d, 0, cfg['seamFall'], 1, 0), cfg.get('seamPow', 2)), cfg['seamW']))
        if cfg.get('hot'):
            d = proximity(helpers[cfg['hot']], 'POINTS')
            terms.append(math_op('MULTIPLY', math_op('POWER', map_range(d, 0, cfg['hotFall'], 1, 0), cfg.get('hotPow', 1.5)), cfg.get('hotW', 1)))
        strength = terms[0] if terms else val(1)
        for t in terms[1:]: strength = math_op('MAXIMUM', strength, t)
        strength = math_op('ADD', strength, cfg.get('amb', 0))
        nL = cfg.get('nL')
        mask = strength
        if nL: mask = math_op('MULTIPLY', mask, map_range(noise(nL[0], seed * 1.37), nL[1], nL[2], 0, 1, True))
        nM = cfg.get('nM')
        if nM: mask = math_op('MULTIPLY', mask, map_range(noise(nM[0], seed * 2.11), nM[1], nM[2], nM[3], 1, True))
        band = cfg.get('band')
        if band:
            pos = N('GeometryNodeInputPosition')
            sep = N('ShaderNodeSeparateXYZ'); L(pos.outputs[0], sep.inputs[0])
            mask = math_op('MULTIPLY', mask, map_range(sep.outputs['Z'], band[0], band[1], 0, 1))
            mask = math_op('MULTIPLY', mask, map_range(sep.outputs['Z'], band[2], band[3], 1, 0))
        dist = N('GeometryNodeDistributePointsOnFaces')
        L(gi.outputs[0], dist.inputs['Mesh'])
        dist.inputs['Seed'].default_value = seed
        if cfg.get('poisson'):
            dist.distribute_method = 'POISSON'
            dist.inputs['Distance Min'].default_value = cfg['poisson']
            dist.inputs['Density Max'].default_value = cfg['base']
            L(mask, dist.inputs['Density Factor'])
        else:
            L(math_op('MULTIPLY', mask, cfg['base']), dist.inputs['Density'])
        points_geo = dist.outputs['Points']
        normal_out = dist.outputs['Normal']

    if cfg.get('fixZ') is not None:
        pos = N('GeometryNodeInputPosition')
        sep = N('ShaderNodeSeparateXYZ'); L(pos.outputs[0], sep.inputs[0])
        com = N('ShaderNodeCombineXYZ'); L(sep.outputs['X'], com.inputs['X']); L(sep.outputs['Y'], com.inputs['Y']); com.inputs['Z'].default_value = cfg['fixZ']
        sp = N('GeometryNodeSetPosition'); L(points_geo, sp.inputs['Geometry']); L(com.outputs[0], sp.inputs['Position'])
        points_geo = sp.outputs[0]

    # rotation: local Z along the surface normal; on walls local Y up the wall; then the random turn around the normal
    al = N('FunctionNodeAlignRotationToVector'); al.axis = 'Z'
    if normal_out is not None: L(normal_out, al.inputs['Vector'])
    else: al.inputs['Vector'].default_value = cfg.get('normal', (0, 0, -1))
    rot = al.outputs[0]
    if cfg.get('upright'):
        al2 = N('FunctionNodeAlignRotationToVector'); al2.axis = 'Y'; al2.pivot_axis = 'Z'
        L(rot, al2.inputs['Rotation']); al2.inputs['Vector'].default_value = (0, 0, 1)
        rot = al2.outputs[0]
    spin = cfg.get('spin', 3.14159)
    if spin:
        if cfg.get('spinSteps'):
            a = math_op('MULTIPLY', math_op('FLOOR', rand(0, cfg['spinSteps'] - .001, seed + 5), 0), 6.28318 / cfg['spinSteps'])
        else:
            a = rand(-spin, spin, seed + 5)
        com = N('ShaderNodeCombineXYZ'); L(a, com.inputs['Z'])
        e2r = N('FunctionNodeEulerToRotation'); L(com.outputs[0], e2r.inputs[0])
        rr_ = N('FunctionNodeRotateRotation'); rr_.rotation_space = 'LOCAL'
        L(rot, rr_.inputs['Rotation']); L(e2r.outputs[0], rr_.inputs['Rotate By'])
        rot = rr_.outputs[0]

    # the scale: decals keep w, h and hold their alpha in the unused z, kit assets are uniform
    com = N('ShaderNodeCombineXYZ')
    w = rand(cfg['w'][0], cfg['w'][1], seed + 7)
    if cfg['kind'] == 'decal':
        L(w, com.inputs['X'])
        L(math_op('MULTIPLY', w, rand(cfg['aspect'][0], cfg['aspect'][1], seed + 11)), com.inputs['Y'])
        L(rand(cfg['alpha'][0], cfg['alpha'][1], seed + 13), com.inputs['Z'])
    else:
        L(w, com.inputs['X']); L(w, com.inputs['Y']); L(w, com.inputs['Z'])

    inst = N('GeometryNodeInstanceOnPoints')
    L(points_geo, inst.inputs['Points']); L(rot, inst.inputs['Rotation']); L(com.outputs[0], inst.inputs['Scale'])
    if cfg['kind'] == 'decal':
        ci = N('GeometryNodeCollectionInfo'); ci.transform_space = 'ORIGINAL'
        ci.inputs['Collection'].default_value = cfg['coll']
        ci.inputs['Separate Children'].default_value = True
        ci.inputs['Reset Children'].default_value = True
        L(ci.outputs[0], inst.inputs['Instance'])
        inst.inputs['Pick Instance'].default_value = True
        ri = N('FunctionNodeRandomValue'); ri.data_type = 'INT'
        ri.inputs['Min'].default_value, ri.inputs['Max'].default_value = 0, len(cfg['coll'].objects) - 1
        ri.inputs['Seed'].default_value = seed + 3
        L(ri.outputs['Value'], inst.inputs['Instance Index'])
    else:
        info = N('GeometryNodeObjectInfo'); info.transform_space = 'ORIGINAL'
        info.inputs['Object'].default_value = cfg['asset']
        info.inputs['As Instance'].default_value = True
        L(info.outputs['Geometry'], inst.inputs['Instance'])
    L(inst.outputs[0], go.inputs[0])
    return ng

def layer_configs(decal_colls, kit):
    d = decal_colls
    k = kit
    LOUD = (.085, .40, .60)    # large blotches: clear stretches, bad stretches
    return [
        # decals. seam = the floor seam, hot = doorway sides, corners, under stained tiles
        dict(name='floor_dirt', surface='floor', kind='decal', coll=d['floor'], base=1.15, seamW=1, seamFall=2.0, hot='hot_floor', hotFall=2.0, amb=.015, nL=LOUD, nM=(.7, .35, .65, .25), seed=11, w=(.45, 1.5), aspect=(.7, 1.25), alpha=(.45, 1)),
        dict(name='floor_dirt_small', surface='floor', kind='decal', coll=d['floor'], base=1.3, seamW=1, seamFall=1.0, hot='hot_floor', hotFall=1.2, amb=.0, nL=(.13, .38, .58), nM=(1.2, .4, .65, .2), seed=23, w=(.2, .55), aspect=(.7, 1.3), alpha=(.5, 1)),
        dict(name='floor_tracks', surface='floor', kind='decal', coll=d['tracks'], base=.05, seamW=.5, seamFall=2.5, hot='hot_floor', hotFall=2.0, amb=.45, nL=(.05, .42, .6), seed=31, w=(.8, 2.0), aspect=(.45, .95), alpha=(.3, .75)),
        dict(name='wall_damp', surface='wall_solid', kind='decal', coll=d['damp'], base=2.2, seamW=1, seamFall=1.2, seamPow=1, hot='hot_floor', hotFall=1.4, amb=.0, nL=(.09, .36, .56), nM=(.8, .35, .6, .3), seed=41, w=(.7, 1.8), aspect=(.55, 1.05), alpha=(.5, 1), upright=True, spin=.1, band=(0, .01, 1.2, 1.8)),
        dict(name='wall_peel', surface='wall', kind='decal', coll=d['peel'], base=.16, amb=1, nL=(.075, .46, .64), nM=(.8, .3, .6, .2), seed=53, w=(.45, 1.3), aspect=(.8, 1.6), alpha=(.6, 1), upright=True, spin=.3, band=(.5, 1.1, 4.4, 4.8)),
        dict(name='ceil_stains', surface='ceil', kind='decal', coll=d['ceil'], base=.9, hot='hot_stain', hotFall=.8, hotPow=1, amb=.0, seed=61, w=(.55, 1.2), aspect=(.75, 1.25), alpha=(.45, 1)),
        # kit on the floor
        dict(name='k_paper', asset=k['paper_scrap'], surface='floor', kind='kit', base=.55, seamW=1, seamFall=1.6, hot='hot_floor', hotFall=1.6, amb=.012, nL=LOUD, nM=(.9, .3, .6, .3), seed=71, w=(.65, 1.15)),
        dict(name='k_debris_a', asset=k['debris_a'], surface='floor', kind='kit', base=3.2, seamW=1, seamFall=.75, hot='hot_holes', hotFall=2.2, amb=.0, nL=(.1, .40, .58), nM=(1.1, .35, .6, .15), seed=73, w=(.6, 1.25)),
        dict(name='k_debris_b', asset=k['debris_b'], surface='floor', kind='kit', base=4.0, seamW=1, seamFall=.9, hot='hot_holes', hotFall=2.2, amb=.0, nL=(.11, .38, .58), nM=(1.0, .35, .6, .15), seed=79, w=(.7, 1.3)),
        dict(name='k_can', asset=k['can'], surface='floor', kind='kit', base=.09, seamW=1, seamFall=1.3, hot='hot_floor', hotFall=1.1, amb=.0, nL=(.09, .38, .52), seed=83, w=(.92, 1.08)),
        dict(name='k_coil', asset=k['cable_coil'], surface='floor', kind='kit', base=.16, seamW=1, seamFall=.9, amb=.0, nL=(.07, .40, .55), seed=89, w=(.9, 1.15)),
        dict(name='k_tile_loose', asset=k['tile_loose'], surface='floor', kind='kit', base=.17, hot='hot_holes', hotFall=2.4, hotPow=1, amb=.0, seed=97, w=(.62, 1.0)),
        # on the walls: spaced with poisson, fixed heights
        dict(name='k_vent', asset=k['vent'], surface='wall', kind='kit', base=.3, poisson=5.5, amb=1, nL=(.05, .3, .5), seed=101, w=(1, 1), upright=True, spin=0, fixZ=4.3, band=(3.95, 4.05, 4.7, 4.8)),
        dict(name='k_outlet', asset=k['outlet'], surface='wall_solid', kind='kit', base=.25, poisson=4.2, amb=1, nL=(.08, .3, .5), seed=103, w=(1, 1), upright=True, spin=0, fixZ=.46, band=(.1, .2, .9, 1.0)),
        dict(name='k_conduit', asset=k['conduit_run'], surface='wall_solid', kind='kit', base=.6, poisson=2.5, amb=1, nL=(.06, .32, .52), seed=107, w=(1, 1), upright=True, spin=0, fixZ=1.94, band=(1.4, 1.5, 2.4, 2.5)),
        # one torn frame in each hole, right on the hole's centre points (no distribution here)
        dict(name='k_frames', asset=k['tile_missing_frame'], surface='holes_ceil', points=True, kind='kit', seed=109, w=(1, 1), normal=(0, 0, -1), spinSteps=4),
    ]

def build_scatter(cells, kit, coll_scatter, coll_help):
    # helpers: the floor seam as edges, hot points as vertices
    verts, edges = [], []
    for F in FACES:
        for u0, u1, y0, y1, k in face_rects(F):
            if k != 'solid': continue
            a, b = wall_point(F, u0, 0, False), wall_point(F, u1, 0, False)
            verts += [a, b]; edges.append((len(verts) - 2, len(verts) - 1))
    helpers = {'seam': helper_mesh('h_seam', coll_help, verts, edges)}
    hot = []
    for F in FACES:
        for d in F['doors']:
            for s in (-1, 1): hot.append(wall_point(F, d + s * (DW / 2 + .2), 0, False))
    for x0, x1, z0, z1 in FLOOR_ZONES:
        hot += [(x0, 0, z0), (x1, 0, z0), (x1, 0, z1), (x0, 0, z1)]
    holes = [c for c in cells if c['state'] == 'hole']
    stained = [c for c in cells if c['stain'] > .3 and c['state'] in ('tile', 'hang')]
    floor_under = [(c['cx'], 0, c['cz']) for c in holes] + [(c['cx'], 0, c['cz']) for c in stained if c['stain'] > .6]
    helpers['hot_floor'] = helper_mesh('h_hot_floor', coll_help, hot + floor_under)
    helpers['hot_holes'] = helper_mesh('h_hot_holes', coll_help, [(c['cx'], 0, c['cz']) for c in holes])
    helpers['hot_stain'] = helper_mesh('h_hot_stain', coll_help, [(c['cx'], DECAL_CEIL, c['cz']) for c in stained])
    helpers_holes_ceil = helper_mesh('h_holes_ceil', coll_help, [(c['cx'], FL_TOP + grid_y(c['cx'], c['cz']), c['cz']) for c in holes])

    # decal stand-ins: one little quad per sheet cell, so the instances say which cell they use
    decal_colls = {}
    for key, r in (('floor', range(0, 12)), ('tracks', range(12, 18)), ('damp', range(18, 24)), ('peel', range(24, 30)), ('ceil', range(30, 36))):
        c = bpy.data.collections.new('decals_' + key)
        coll_help.children.link(c)
        decal_colls[key] = c
        for i in r:
            me = bpy.data.meshes.new('dc_%02d' % i)
            me.from_pydata([(-.5, -.5, 0), (.5, -.5, 0), (.5, .5, 0), (-.5, .5, 0)], [], [(0, 1, 2, 3)])
            me.update()
            ob = bpy.data.objects.new('dc_%02d' % i, me)
            c.objects.link(ob)

    surfaces = {k: surface_mesh('surf_' + k, k) for k in ('floor', 'ceil', 'wall', 'wall_solid')}
    surfaces['holes_ceil'] = helpers_holes_ceil.data
    layers = {}
    for cfg in layer_configs(decal_colls, kit):
        ng = make_scatter_group('scatter_' + cfg['name'], cfg, helpers)
        ob = bpy.data.objects.new('scatter_' + cfg['name'], surfaces[cfg['surface']])
        coll_scatter.objects.link(ob)
        md = ob.modifiers.new('scatter', 'NODES')
        md.node_group = ng
        layers[ob.name] = cfg
    return layers

# ---------------------------------------------------------------------------------------------------------------- reading the evaluated instances back
R3 = Matrix(((1, 0, 0), (0, 0, 1), (0, -1, 0)))     # blender -> three: (x, y, z) -> (x, z, -y)
R3T = R3.transposed()

def to_three_transform(mw):
    loc, rot, sca = mw.decompose()
    p = R3 @ loc
    rm = R3 @ rot.to_matrix() @ R3T
    q = rm.to_quaternion()
    return (p.x, p.y, p.z), (q.x, q.y, q.z, q.w), (sca.x, sca.z, sca.y), rm

def lane_blocked(x, z):
    return (abs(x) < 1.05 and z < -4) or (abs(x) < 4.4 and -2.9 < z < 10.2)
def in_doorway(x, z, r=0):
    for sx in (-2, 2):
        if abs(x - sx) < .4 + r:
            for d in HALLD:
                if abs(z - d) < DW / 2 + .22 + r: return True
    if abs(z + 4) < .4 + r:
        if abs(x) < 2.1 + r: return True
        for d in (-4.8, 4.8):
            if abs(x - d) < DW / 2 + .22 + r: return True
    return False

def floor_zone(x, z):
    for b in FLOOR_ZONES:
        if b[0] <= x <= b[1] and b[2] <= z <= b[3]: return b
    return None

def wall_face_at(n, p):
    """The wall face a point lies on, from its normal and position (three axes)."""
    axis = 'x' if abs(n[0]) > abs(n[2]) else 'z'
    s = 1 if (n[0] if axis == 'x' else n[2]) > 0 else -1
    c, u = (p[0], p[2]) if axis == 'x' else (p[2], p[0])
    for F in FACES:
        if F['axis'] == axis and F['s'] == s and abs(F['c'] - c) < .02 and F['u0'] - .01 <= u <= F['u1'] + .01:
            return F
    return None

def read_instances(layers, cells):
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    raw = []
    for inst in dg.object_instances:
        if not inst.is_instance or inst.parent is None: continue
        pn = inst.parent.name
        if pn not in layers: continue
        raw.append((pn, inst.instance_object.name, inst.matrix_world.copy()))
    print('EVALUATED INSTANCES', len(raw))
    instances, decals = {}, []
    stats = {}
    bad_rects = [(c['x0'], c['x1'], c['z0'], c['z1']) for c in cells if c['state'] in ('hole', 'hang')]
    for Z in ZONES:
        bad_rects += [(p['x0'], p['x1'], p['z0'], p['z1']) for p in Z['panels']]
    idx = 0
    for pn, name, mw in raw:
        cfg = layers[pn]
        p, q, s, rm = to_three_transform(mw)
        stats[pn] = stats.get(pn, 0) + 1
        nr = (rm[0][1], rm[1][1], rm[2][1])         # local three +y = the blender local Z: the surface normal
        if cfg['kind'] == 'decal':
            idx += 1
            d = decal_entry(cfg, name, p, s, rm, nr, bad_rects, idx)
            if d: decals.append(d)
            continue
        e = kit_entry(cfg, name, p, q, s, nr)
        if not e: continue
        if name == 'conduit_run' and any(math.dist(e[:3], o[:3]) < 7 for o in instances.get(name, [])): continue    # runs stay far apart
        instances.setdefault(name, []).append(e)
    return instances, decals, stats

def decal_entry(cfg, name, p, s, rm, nr, bad_rects, idx):
    cell = int(name.split('_')[1])
    w, h, alpha = s[0], s[2], s[1]                    # blender local (x, y, z) -> three (x, z, y): h is three z, alpha three y
    ux = (rm[0][0], rm[1][0], rm[2][0])
    surface = cfg['surface']
    x, y, z = p
    if surface == 'floor':
        normal = (0, 1, 0); bu = (1, 0, 0)
    elif surface == 'ceil':
        normal = (0, -1, 0); bu = (1, 0, 0)
    else:
        n0 = (round(nr[0]), 0, round(nr[2]))
        normal = n0
        bu = norm(cross((0, 1, 0), n0))
    bv = cross(normal, bu)
    spin = math.atan2(dot(ux, bv), dot(ux, bu))
    ca, sa = abs(math.cos(spin)), abs(math.sin(spin))
    eu, ev = (w * ca + h * sa) / 2, (w * sa + h * ca) / 2     # half extents along the base axes
    if surface == 'floor':
        zone = floor_zone(x, z)
        if not zone: return None
        ex = eu; ez = ev
        over = .12                                      # may run under the skirting into the wall, never out the far side
        if ex * 2 > zone[1] - zone[0] + over * 2 - .1 or ez * 2 > zone[3] - zone[2] + over * 2 - .1: return None
        x = max(zone[0] - over + ex, min(zone[1] + over - ex, x))
        z = max(zone[2] - over + ez, min(zone[3] + over - ez, z))
        y = .004 + (idx % 9) * .0007
        surf = 'floor'
    elif surface == 'ceil':
        for b in bad_rects:
            if x + eu > b[0] and x - eu < b[1] and z + ev > b[2] and z - ev < b[3]: return None
        g = min(grid_y(x + a * eu, z + c * ev) for a in (-1, 0, 1) for c in (-1, 0, 1))
        y = DECAL_CEIL + g
        surf = 'ceiling'
    else:
        F = wall_face_at(normal, p)
        if not F: return None
        u = p[2] if F['axis'] == 'x' else p[0]
        rect = next((r for r in face_rects(F) if r[0] - .01 <= u <= r[1] + .01 and r[2] - .01 <= p[1] <= r[3]), None)
        if not rect: return None
        if eu * 2 > rect[1] - rect[0] - .02: return None
        u = max(rect[0] + eu, min(rect[1] - eu, u))
        if 18 <= cell <= 23:                             # damp rises from the skirting: its bottom edge sits behind the skirting's top
            y = ev + .12 + (idx % 5) * .012
        else:
            y = p[1]
        y = max(rect[2] + ev + .02, min(CEIL - .08 - ev, y))
        if ev * 2 > rect[3] - rect[2] - .1: return None
        # float it over the highest point of the wall under it: no poke-through
        top = max(wall_disp(F['axis'], F['c'], u + a * eu, y + c * ev) for a in (-1, -.5, 0, .5, 1) for c in (-1, -.5, 0, .5, 1))
        off = max(0, top) + .005 + (idx % 7) * .0006
        wp = F['c'] + F['s'] * off
        x, z = (wp, u) if F['axis'] == 'x' else (u, wp)
        surf = 'wall'
    return dict(cell=cell, pos=[round(x, 4), round(y, 4), round(z, 4)], normal=[normal[0], normal[1], normal[2]], spin=round(spin, 3),
                size=[round(w, 3), round(h, 3)], surface=surf, alpha=round(alpha, 3))

FOOT = dict(paper_scrap=.22, debris_a=.16, debris_b=.16, can=.14, cable_coil=.2, tile_loose=.8)
def kit_entry(cfg, name, p, q, s, nr):
    x, y, z = p
    if cfg['surface'] == 'floor':
        r = FOOT[name] * s[0]
        zone = floor_zone(x, z)
        if not zone: return None
        if in_doorway(x, z, r * 1.25): return None
        if name != 'paper_scrap' and lane_blocked(x, z): return None
        margin = r + .04
        if zone[1] - zone[0] < margin * 2 or zone[3] - zone[2] < margin * 2: return None
        x = max(zone[0] + margin, min(zone[1] - margin, x))
        z = max(zone[2] + margin, min(zone[3] - margin, z))
        y = 0.002
    elif cfg['surface'].startswith('wall'):
        n0 = (round(nr[0]), 0, round(nr[2]))
        F = wall_face_at(n0, p)
        if not F: return None
        u = p[2] if F['axis'] == 'x' else p[0]
        half = dict(vent=.44, outlet=.1, conduit_run=.12)[name]
        for d in F['doors']:
            if name == 'vent':
                if abs(u - d) < DW / 2 + .18 + half and y < DH + .4: return None
            elif abs(u - d) < DW / 2 + .18 + half + .12: return None
        if u - half < F['u0'] + .05 or u + half > F['u1'] - .05: return None
        off = wall_disp(F['axis'], F['c'], u, y) - .004
        wp = F['c'] + F['s'] * off
        x, z = (wp, u) if F['axis'] == 'x' else (u, wp)
    return [round(v, 4) for v in (x, y, z, *q, *s)]

# ---------------------------------------------------------------------------------------------------------------- export
def export_glb(path, objs, **extra):
    tmp = str(path) + '.tmp.glb'
    bpy.ops.object.select_all(action='DESELECT')
    for ob in objs: ob.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    args = dict(filepath=tmp, export_format='GLB', use_selection=True, export_apply=False, export_yup=True, export_texcoords=True, export_normals=True,
                export_tangents=False, export_materials='EXPORT', export_vertex_color='ACTIVE', export_active_vertex_color_when_no_material=True,
                export_animations=False, export_skins=False, export_morph=False, export_cameras=False, export_lights=False, export_extras=False,
                export_gn_mesh=False, export_gpu_instances=False, export_image_format='NONE')
    args.update(extra)
    bpy.ops.export_scene.gltf(**args)
    os.replace(tmp, path)

def atomic_json(path, data):
    tmp = str(path) + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f: json.dump(data, f, separators=(',', ':'))
    os.replace(tmp, path)

def exporter_test(layers, vl):
    """Can glTF carry the instances? Try EXT_mesh_gpu_instancing on one layer of each kind and report; the renderer reads scatter.json either way."""
    import struct
    test = HERE / 'exporter_test.glb'
    names = ['scatter_k_paper', 'scatter_floor_dirt']
    obs = [bpy.data.objects[n] for n in names]
    bpy.ops.object.select_all(action='DESELECT')
    export_glb(test, obs, export_gpu_instances=True, export_gn_mesh=True)
    raw = open(test, 'rb').read()
    n = struct.unpack('<I', raw[12:16])[0]
    j = json.loads(raw[20:20 + n])
    print('EXPORTER TEST: size', len(raw), 'extensionsUsed', j.get('extensionsUsed'), 'nodes', len(j.get('nodes', [])), 'meshes', len(j.get('meshes', [])),
          'with instancing ext', sum(1 for nd in j.get('nodes', []) if 'EXT_mesh_gpu_instancing' in nd.get('extensions', {})))
    os.remove(test)

# ---------------------------------------------------------------------------------------------------------------- main
def main():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    OUT.mkdir(parents=True, exist_ok=True)
    root = scene.collection
    col_set, col_kit, col_scatter, col_help = (bpy.data.collections.new(n) for n in ('set', 'kit', 'scatter', 'helpers'))
    for c in (col_set, col_kit, col_scatter, col_help): root.children.link(c)
    cells = plan_cells()

    wall, lintel, carpet, tile, tb, trim, frame, lens, void = MB(), MB(), MB(), MB(), MB(), MB(), MB(), MB(), MB()
    build_walls(wall, lintel)
    build_carpet(carpet)
    build_trim(trim)
    build_grid(tb)
    build_ceiling(tile, tb, frame, lens, void)
    mats = dict(wall=(.72, .66, .34), lintel=(.70, .64, .33), carpet=(.42, .38, .18), ceiling_tile=(.80, .77, .62), tbar=(.74, .72, .62), trim=(.40, .33, .16),
                panel=(.95, .95, .85), panel_frame=(.82, .80, .72), void=(.008, .008, .006))
    meshes = dict(wall=wall, lintel=lintel, carpet=carpet, ceiling_tile=tile, tbar=tb, trim=trim, panel=lens, panel_frame=frame, void=void)
    set_objs = []
    tri = {}
    for name, mb in meshes.items():
        set_objs.append(add_object(name, mb, material(name, mats[name], emit=(1, .98, .85) if name == 'panel' else None), col_set))
        tri[name] = mb.tris()
    print('SET TRIS', tri, 'total', sum(tri.values()))
    cc = {}
    for c in cells: cc[c['state']] = cc.get(c['state'], 0) + 1
    print('CEILING CELLS', cc, 'stained', sum(1 for c in cells if c['stain'] > .3), 'sagging', sum(1 for c in cells if c['sag'] > 0))
    export_glb(OUT / 'set.glb', set_objs)
    print('WROTE set.glb', round((OUT / 'set.glb').stat().st_size / 1e6, 2), 'MB')

    kit = build_kit(col_kit)
    kit_tris = {n: sum(len(p.vertices) - 2 for p in ob.data.polygons) for n, ob in kit.items()}
    print('KIT TRIS', kit_tris)
    export_glb(OUT / 'kit.glb', list(kit.values()))
    print('WROTE kit.glb', round((OUT / 'kit.glb').stat().st_size / 1e6, 3), 'MB')

    layers = build_scatter(cells, kit, col_scatter, col_help)
    vl = bpy.context.view_layer
    vl.layer_collection.children['helpers'].exclude = True
    vl.layer_collection.children['kit'].exclude = True
    vl.update()
    instances, decals, stats = read_instances(layers, cells)
    print('RAW PER LAYER', stats)
    print('INSTANCES', {k: len(v) for k, v in instances.items()}, 'total', sum(len(v) for v in instances.values()))
    dc = {}
    for d in decals: dc[d['surface']] = dc.get(d['surface'], 0) + 1
    print('DECALS', dc, 'total', len(decals))
    meta = dict(built='2026-11-04', tool='blender/build_backrooms2.py',
                flickerPanel=[3.6, 1.0],
                panels=[dict(x=p['x'], z=p['z'], slot=p['slot']) for Z in ZONES for p in Z['panels']],
                holes=[[round(c['cx'], 3), round(c['cz'], 3)] for c in cells if c['state'] == 'hole'],
                hanging=[[round(c['cx'], 3), round(c['cz'], 3)] for c in cells if c['state'] == 'hang'],
                decalSpin='plane basis u, v, normal; spin 0: floor u=+x v=-z, ceiling u=+x v=+z, wall u=up x normal v=up; spin is counter-clockwise around the normal; size=[along u, along v]',
                kitAxes='local +y out of the surface it sits on; on walls local -z points up')
    atomic_json(OUT / 'scatter.json', dict(meta=meta, instances=instances, decals=decals))
    print('WROTE scatter.json', round((OUT / 'scatter.json').stat().st_size / 1e6, 3), 'MB')

    if '--exporter-test' in ARGS:
        exporter_test(layers, vl)

    bpy.context.preferences.filepaths.save_version = 0
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT / 'backrooms2.blend'), compress=True)
    print('BUILD OK')

main()
