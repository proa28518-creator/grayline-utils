# build_s4.py: the Blender half of the S-4 environment pass (s4/ENV_BRIEF.md). Everything from nothing in a hidden Blender, nothing baked, no hand work.
#   blender --background --factory-startup --python blender/build_s4.py                     everything
#   blender --background --factory-startup --python blender/build_s4.py -- torpedo sea      only these places (scatter.json keeps the other places' data)
# Writes world/assets/s4/: torpedo.glb, seabed.glb, sub.glb, sea.glb, boat.glb, storm.glb, kit.glb, scatter.json, s4.blend. How the renderer places them: BLENDER.md there.
# Check: blender/check_s4.py. Authored in THREE.JS axes (x, y up, z); to_blender() converts, the exporter converts back. UVs: 1 UV = 1 D.
import bpy, json, math, os, random, sys
from pathlib import Path
from mathutils import Vector

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / 'world' / 'assets' / 's4'
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
PLACES = [a for a in ARGS if not a.startswith('-')] or ['torpedo', 'sub', 'seabed', 'sea', 'boat', 'storm']
TAU = math.tau
# decal sheet cells (tex/decals.png, 6 x 6, order of tex/jobs/flow_jobs.json; world/assets/s4/README.md is the truth)
CELLS = dict(rust=range(0, 6), patch=range(6, 12), oil=range(12, 18), barnacle=range(18, 24), growth=range(24, 30), wear=range(30, 36))
# where Flow's plate_riveted.jpg has its seams, in D inside one 4 D tile (measured off the picture): the room's plates are modelled to land on them
PLATE_U, PLATE_V = 2.585, 1.415

# ---------------------------------------------------------------------------------------------------------------- noise, vectors
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
def sub_(a, b): return (a[0] - b[0], a[1] - b[1], a[2] - b[2])
def cross(a, b): return (a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0])
def dot(a, b): return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
def norm(a):
    l = math.sqrt(dot(a, a)) or 1
    return (a[0] / l, a[1] / l, a[2] / l)
def to_blender(p): return (p[0], -p[2], p[1])
def smooth01(a, b, x):
    u = max(0, min(1, (x - a) / (b - a)))
    return u * u * (3 - 2 * u)
def basis(axis):
    """Two unit vectors square to an axis."""
    a = norm(axis)
    h = (0, 1, 0) if abs(a[1]) < .9 else (1, 0, 0)
    u = norm(cross(h, a)); v = cross(a, u)
    return a, u, v

class MB:
    def __init__(self):
        self.v, self.f, self.uv, self.smooth = [], [], [], []
    def poly(self, pts, ref=None, uv=None, smooth=False):
        pts = list(pts)
        n = (0, 0, 0)
        for i in range(1, len(pts) - 1):
            c = cross(sub_(pts[i], pts[0]), sub_(pts[i + 1], pts[0]))
            n = (n[0] + c[0], n[1] + c[1], n[2] + c[2])
        if ref is not None and dot(n, ref) < 0:
            pts = pts[::-1]
            if uv: uv = uv[::-1]
        if uv is None:
            ax, ay, az = abs(n[0]), abs(n[1]), abs(n[2])
            if ay >= ax and ay >= az: uv = [(p[0], p[2]) for p in pts]
            elif ax >= az: uv = [(p[2], p[1]) for p in pts]
            else: uv = [(p[0], p[1]) for p in pts]
        base = len(self.v)
        self.v.extend(pts)
        self.f.append(list(range(base, base + len(pts))))
        self.uv.extend(uv)
        self.smooth.append(smooth)
    def grid(self, fn, us, vs, ref, uvfn=None, smooth=True):
        base = len(self.v)
        pts = [[fn(u, v) for v in vs] for u in us]
        for row in pts: self.v.extend(row)
        nv = len(vs)
        a, b, d = pts[0][0], pts[1][0], pts[0][1]
        flip = dot(cross(sub_(b, a), sub_(d, a)), ref) < 0
        for i in range(len(us) - 1):
            for j in range(nv - 1):
                ids = [(i, j), (i + 1, j), (i + 1, j + 1), (i, j + 1)]
                if flip: ids.reverse()
                self.f.append([base + a0 * nv + b0 for a0, b0 in ids])
                self.smooth.append(smooth)
                for a0, b0 in ids:
                    self.uv.append(uvfn(us[a0], vs[b0]) if uvfn else (us[a0], vs[b0]))
    def tris(self): return sum(len(f) - 2 for f in self.f)
    def to_mesh(self, name):
        me = bpy.data.meshes.new(name)
        me.from_pydata([to_blender(p) for p in self.v], [], self.f)
        me.update()
        layer = me.uv_layers.new(name='UVMap')
        flat = []
        for u, v in self.uv: flat += (u, 1 - v)
        layer.uv.foreach_set('vector', flat)
        me.polygons.foreach_set('use_smooth', self.smooth)
        me.update()
        return me

class Set:
    """One mesh per material name, created when first used."""
    def __init__(self): self.m = {}
    def __getitem__(self, k):
        if k not in self.m: self.m[k] = MB()
        return self.m[k]

MATS = dict(plate_riveted=(.34, .36, .36), steel_paint=(.30, .33, .33), deck_steel=(.30, .29, .27), iron=(.09, .09, .09), pipe_copper=(.55, .33, .18), pipe_steel=(.36, .40, .37), brass=(.72, .55, .22),
            red_paint=(.55, .12, .08), torpedo=(.40, .46, .40), canvas=(.52, .49, .40), wood=(.42, .30, .17), glass=(.75, .78, .72), lamp_bulb=(1, .85, .6), hull_wreck=(.30, .36, .33), sand=(.55, .56, .46), rock=(.32, .35, .31),
            ship_paint=(.40, .44, .48), white_paint=(.80, .79, .73), deck_wood=(.52, .46, .36), black=(.05, .05, .06), boot_red=(.48, .17, .12), hull_wood=(.35, .24, .15), crate_label=(.65, .5, .3), rope=(.55, .47, .33), void=(.01, .01, .012))

def material(name):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    b = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    b.inputs['Base Color'].default_value = (*MATS.get(name, (.5, .5, .5)), 1)
    b.inputs['Roughness'].default_value = .85
    return m

def export_glb(path, objs):
    tmp = str(path) + '.tmp.glb'
    bpy.ops.object.select_all(action='DESELECT')
    for ob in objs: ob.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.export_scene.gltf(filepath=tmp, export_format='GLB', use_selection=True, export_apply=False, export_yup=True, export_texcoords=True, export_normals=True,
                              export_tangents=False, export_materials='EXPORT', export_animations=False, export_skins=False, export_morph=False, export_cameras=False, export_lights=False,
                              export_extras=False, export_gn_mesh=False, export_gpu_instances=False, export_image_format='NONE')
    os.replace(tmp, path)

def atomic_json(path, data):
    tmp = str(path) + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f: json.dump(data, f, separators=(',', ':'))
    os.replace(tmp, path)

def write_place(name, S, coll):
    objs, tri = [], {}
    for mat, mb in S.m.items():
        if not mb.f: continue
        me = mb.to_mesh(name + '_' + mat)
        me.materials.append(material(mat))
        ob = bpy.data.objects.new(mat if name == 'kit' else name + '.' + mat, me)
        coll.objects.link(ob)
        objs.append(ob); tri[mat] = mb.tris()
    bpy.context.view_layer.update()
    export_glb(OUT / (name + '.glb'), objs)
    print('WROTE', name + '.glb', round((OUT / (name + '.glb')).stat().st_size / 1e6, 2), 'MB', 'draws', len(objs), 'tris', sum(tri.values()), tri, flush=True)
    return objs

# ---------------------------------------------------------------------------------------------------------------- shapes
def box(m, x0, x1, y0, y1, z0, z1, b=.012, skip=()):
    """A box with chamfered edges, so they catch the light."""
    c = ((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2)
    h = ((x1 - x0) / 2, (y1 - y0) / 2, (z1 - z0) / 2)
    b = min(b, h[0] * .9, h[1] * .9, h[2] * .9)
    def pt(a): return (c[0] + a[0], c[1] + a[1], c[2] + a[2])
    for ax in range(3):
        a1, a2 = (ax + 1) % 3, (ax + 2) % 3
        for s in (-1, 1):
            if (ax, s) in skip: continue
            q = []
            for t1, t2 in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
                v = [0, 0, 0]; v[ax] = s * h[ax]; v[a1] = t1 * (h[a1] - b); v[a2] = t2 * (h[a2] - b)
                q.append(pt(v))
            r = [0, 0, 0]; r[ax] = s
            m.poly(q, ref=tuple(r))
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
                    m.poly(q, ref=tuple(r))
    for sx in (-1, 1):
        for sy in (-1, 1):
            for sz in (-1, 1):
                m.poly([pt((sx * h[0], sy * (h[1] - b), sz * (h[2] - b))), pt((sx * (h[0] - b), sy * h[1], sz * (h[2] - b))), pt((sx * (h[0] - b), sy * (h[1] - b), sz * h[2]))], ref=(sx, sy, sz))

def tube(m, path, r, sides=8, caps=True, smooth=True):
    pts = [Vector(p) for p in path]
    rings = []
    prev_a = None
    for i, p in enumerate(pts):
        d = (pts[min(i + 1, len(pts) - 1)] - pts[max(i - 1, 0)]).normalized()
        if prev_a is None:
            a = d.cross(Vector((0, 1, 0)))
            if a.length < .15: a = d.cross(Vector((1, 0, 0)))
        else:
            a = prev_a - d * prev_a.dot(d)                  # carry the frame along so a bend never twists
        a.normalize(); prev_a = a
        b = a.cross(d).normalized()
        rr = r[i] if isinstance(r, (list, tuple)) else r
        rings.append([tuple(p + a * (rr * math.cos(k * TAU / sides)) + b * (rr * math.sin(k * TAU / sides))) for k in range(sides)])
    base = len(m.v)
    for rg in rings: m.v.extend(rg)
    L = [0]
    for i in range(1, len(pts)): L.append(L[-1] + (pts[i] - pts[i - 1]).length)
    for i in range(len(rings) - 1):
        for k in range(sides):
            k2 = (k + 1) % sides
            ids = [base + i * sides + k, base + i * sides + k2, base + (i + 1) * sides + k2, base + (i + 1) * sides + k]
            ctr = (Vector(m.v[ids[0]]) + Vector(m.v[ids[2]])) / 2 - (pts[i] + pts[i + 1]) / 2
            nr = Vector(cross(sub_(m.v[ids[1]], m.v[ids[0]]), sub_(m.v[ids[3]], m.v[ids[0]])))
            order = [(i, k), (i, k2), (i + 1, k2), (i + 1, k)]
            if nr.dot(ctr) < 0: ids.reverse(); order.reverse()
            m.f.append(ids); m.smooth.append(smooth)
            ra = r[i] if isinstance(r, (list, tuple)) else r
            for ii, kk in order:
                m.uv.append((kk * TAU * ra / sides, L[ii]))
    if caps:
        for i, rg in ((0, rings[0]), (len(rings) - 1, rings[-1])):
            d = (pts[1] - pts[0]) if i == 0 else (pts[-1] - pts[-2])
            if (r[i] if isinstance(r, (list, tuple)) else r) > .001:
                m.poly(list(rg), ref=tuple(d * (-1 if i == 0 else 1)))

def cyl(m, a, b, r, sides=8, caps=True, smooth=True): tube(m, [a, b], r, sides, caps, smooth)

def torus(m, c, axis, R, r, seg=20, sides=6, a0=0.0, a1=TAU):
    a, u, v = basis(axis)
    def fn(th, ph):
        e = tuple(u[i] * math.cos(th) + v[i] * math.sin(th) for i in range(3))
        return tuple(c[i] + e[i] * (R + r * math.cos(ph)) + a[i] * r * math.sin(ph) for i in range(3))
    e0 = tuple(u[i] * math.cos(a0) + v[i] * math.sin(a0) for i in range(3))
    m.grid(fn, [a0 + (a1 - a0) * i / seg for i in range(seg + 1)], [TAU * j / sides for j in range(sides + 1)], e0, uvfn=lambda th, ph: (th * R, ph * r))

def pipe_run(m, pts, r, bend=.22, sides=8, caps=True):
    """A path with rounded corners."""
    P = [Vector(p) for p in pts]
    out = [P[0]]
    for i in range(1, len(P) - 1):
        a, b, c = P[i - 1], P[i], P[i + 1]
        br = min(bend, (b - a).length * .45, (c - b).length * .45)
        p0, p2 = b + (a - b).normalized() * br, b + (c - b).normalized() * br
        for k in range(5):
            t = k / 4
            out.append(p0 * (1 - t) ** 2 + b * 2 * t * (1 - t) + p2 * t * t)
    out.append(P[-1])
    tube(m, [tuple(p) for p in out], r, sides, caps)

def rivet(m, p, n, r=.032, h=.016):
    """A dome of 6 triangles, smooth."""
    a, u, v = basis(n)
    apex = tuple(p[i] + a[i] * h for i in range(3))
    ring = [tuple(p[i] + r * (u[i] * math.cos(k * TAU / 6) + v[i] * math.sin(k * TAU / 6)) for i in range(3)) for k in range(6)]
    base = len(m.v)
    m.v.append(apex); m.v.extend(ring)
    pu = dot(p, u); pv = dot(p, v)
    for k in range(6):
        k2 = (k + 1) % 6
        c = cross(sub_(ring[k], apex), sub_(ring[k2], apex))
        ids = [base, base + 1 + k, base + 1 + k2] if dot(c, a) > 0 else [base, base + 1 + k2, base + 1 + k]
        m.f.append(ids); m.smooth.append(True)
        for q in ids:
            vv = m.v[q]; m.uv.append((dot(vv, u), dot(vv, v)))

def flange(m, c, axis, R, t, bolts=None, n=8, br=.022):
    a, u, v = basis(axis)
    p0 = tuple(c[i] - a[i] * t / 2 for i in range(3)); p1 = tuple(c[i] + a[i] * t / 2 for i in range(3))
    cyl(m, p0, p1, R, sides=12)
    if bolts is not None:
        for k in range(n):
            e = tuple(u[i] * math.cos(k * TAU / n) + v[i] * math.sin(k * TAU / n) for i in range(3))
            for s in (-1, 1):
                q = tuple(c[i] + e[i] * (R * .8) + a[i] * s * (t / 2 + .006) for i in range(3))
                q2 = tuple(q[i] + a[i] * s * .018 for i in range(3))
                cyl(bolts, q, q2, br, sides=6)

def handwheel(rim, hub, c, axis, R, r=.03, spokes=5, stem=.12):
    """A valve wheel: axis points out towards the hand."""
    a, u, v = basis(axis)
    seg = max(14, int(R * 44))
    torus(rim, c, axis, R, r, seg=seg, sides=6)
    for k in range(spokes):
        e = tuple(u[i] * math.cos(k * TAU / spokes + .4) + v[i] * math.sin(k * TAU / spokes + .4) for i in range(3))
        cyl(rim, c, tuple(c[i] + e[i] * R for i in range(3)), r * .62, sides=5, caps=False)
    cyl(hub, tuple(c[i] - a[i] * stem for i in range(3)), tuple(c[i] + a[i] * r * 1.6 for i in range(3)), r * 1.5, sides=8)

def valve(S, c, axis, body_r=.13, wheel_R=.15, rim='red_paint', stem_len=.3, mat='brass'):
    """Globe body, bonnet, stem, wheel. axis = the way the stem points."""
    a = norm(axis)
    m = S[mat]
    tube(m, [tuple(c[i] - a[i] * body_r for i in range(3)), tuple(c[i] - a[i] * body_r * .4 for i in range(3)), c, tuple(c[i] + a[i] * body_r * .5 for i in range(3)), tuple(c[i] + a[i] * body_r * 1.1 for i in range(3))],
         [body_r * .5, body_r * .95, body_r, body_r * .9, body_r * .45], sides=10)
    top = tuple(c[i] + a[i] * stem_len for i in range(3))
    cyl(S['iron'], c, top, .018, sides=6)
    handwheel(S[rim], S['iron'], top, a, wheel_R, r=.018, spokes=4, stem=.03)

def gauge(S, c, axis, R=.12):
    """A round dial on the plate it sits on: brass case, glass face, needle."""
    a, u, v = basis(axis)
    back = tuple(c[i] - a[i] * .035 for i in range(3)); front = tuple(c[i] + a[i] * .025 for i in range(3))
    cyl(S['brass'], back, front, R, sides=16)
    torus(S['brass'], front, a, R * .95, R * .09, seg=16, sides=4)
    f = tuple(front[i] + a[i] * .003 for i in range(3))
    S['glass'].poly([tuple(f[i] + R * .88 * (u[i] * math.cos(k * TAU / 14) + v[i] * math.sin(k * TAU / 14)) for i in range(3)) for k in range(14)], ref=a)
    ang = _h(int(c[0] * 90), int(c[1] * 90), 5) * 4 + 1
    tip = tuple(f[i] + a[i] * .004 + R * .72 * (u[i] * math.cos(ang) + v[i] * math.sin(ang)) for i in range(3))
    cyl(S['iron'], tuple(f[i] + a[i] * .004 for i in range(3)), tip, .006, sides=3, caps=False, smooth=False)

def chain(m, p0, p1, link=.09, r=.012):
    a = Vector(p1) - Vector(p0)
    n = max(2, int(a.length / (link * 1.25)))
    d = a.normalized()
    side = d.cross(Vector((1, 0, 0)) if abs(d.x) < .8 else Vector((0, 1, 0))).normalized()
    for i in range(n):
        c = Vector(p0) + a * ((i + .5) / n)
        sd = side if i % 2 else d.cross(side).normalized()
        axis = sd
        q = []
        hl, hw = link * .62, link * .3
        for t, w in ((-1, -1), (-1, 1), (1, 1), (1, -1), (-1, -1)):
            q.append(tuple(c + d * (t * hl) + d.cross(axis).normalized() * (w * hw)))
        tube(m, q, r, sides=3, caps=False, smooth=False)

def sagging(m, a, b, sag, r, n=7, sides=5):
    """A rope or cable hanging between two points."""
    A, B = Vector(a), Vector(b)
    pts = []
    for i in range(n + 1):
        t = i / n
        pts.append(tuple(A + (B - A) * t + Vector((0, -sag * 4 * t * (1 - t), 0))))
    tube(m, pts, r, sides=sides, caps=False)

# ---------------------------------------------------------------------------------------------------------------- TORPEDO ROOM (0, 0): world/s4.js coordinates
HY = 2.4; HR = 5.6                      # hull axis height and radius
FRAMES = [-3.6 + 2.6 * i for i in range(8)]   # z. Moved off the previz spacing: the camera flies right against the hull at z 2.7, 3.4, 4.6 and 9
TH_MAX = math.radians(128)
Z_FWD, Z_AFT = -6.3, 16.25
HULL_STRAKES = 6
def hp(r, th, z): return (r * math.sin(th), HY + r * math.cos(th), z)
def inward(th): return (-math.sin(th), -math.cos(th), 0)
def between_frames(z):
    f = [z_ for z_ in FRAMES if z_ <= z]
    a = max(f) if f else FRAMES[0] - 2.6
    return (z - a) / 2.6
def hull_r(th, z):
    """Plates dish in and out between frames, the way old riveted hulls do: it catches the lamp at a grazing angle."""
    return HR - .03 * math.sin(math.pi * max(0, min(1, between_frames(z)))) ** 2 + .012 * (vnoise(th * 4, z, 1.7, 7) - .5)

def build_hull(S):
    plate, steel, iron = S['plate_riveted'], S['steel_paint'], S['iron']
    # Six strakes, each one 4 D plate of Flow's texture wide: the modelled lap lands on the painted seam and its painted rivets, so one pattern, not two
    N = HULL_STRAKES
    edges = [-TH_MAX + 2 * TH_MAX * i / N for i in range(N + 1)]
    zs = [Z_FWD + i * .325 for i in range(int((Z_AFT - Z_FWD) / .325) + 1)] + [Z_AFT]
    for i in range(N):
        off = .035 if i % 2 else 0
        ths = [edges[i] + (edges[i + 1] - edges[i]) * k / 11 for k in range(12)]
        zb = -6 + 2 * (i % 2)                # butts every 4 D on the painted seam, staggered strake to strake
        plate.grid(lambda th, z: hp(hull_r(th, z) - off, th, z), ths, zs, inward((ths[0] + ths[1]) / 2),
                   uvfn=lambda th, z: (z - zb + PLATE_U, (th - edges[i]) / (edges[i + 1] - edges[i]) * 4 + PLATE_V))
        # the lap between this strake and the next
        if i < N - 1:
            th = edges[i + 1]; o2 = 0 if i % 2 else .035
            for a, b in zip(zs, zs[1:]):
                plate.poly([hp(hull_r(th, a) - off, th, a), hp(hull_r(th, b) - off, th, b), hp(hull_r(th, b) - o2, th, b), hp(hull_r(th, a) - o2, th, a)], ref=(math.cos(th) * (1 if off > o2 else -1), -math.sin(th) * (1 if off > o2 else -1), 0))
    # frames: T section, web + flange, rivets beside them
    for fz in FRAMES:
        ths = [-TH_MAX + 2 * TH_MAX * k / 48 for k in range(49)]
        for sg in (-1, 1):
            steel.grid(lambda th, r: hp(r, th, fz + sg * .03), ths, [HR - .02, HR - .29], (0, 0, sg), uvfn=lambda th, r: (th * HR, r), smooth=False)
        steel.grid(lambda th, x: hp(HR - .29, th, fz + x), ths, [-.11, .11], inward(ths[0]), uvfn=lambda th, x: (th * HR, x), smooth=False)
        for sg in (-1, 1):
            steel.grid(lambda th, r: hp(r, th, fz + sg * .11), ths, [HR - .29, HR - .33], (0, 0, sg), uvfn=lambda th, r: (th * HR, r), smooth=False)
        steel.grid(lambda th, x: hp(HR - .33, th, fz + x), ths, [-.11, .11], inward(ths[0]), uvfn=lambda th, x: (th * HR, x), smooth=False)
        k = -TH_MAX + .03
        while k < TH_MAX:
            for sg in (-.075, .075): rivet(iron, hp(HR - .335, k, fz + sg), inward(k), r=.024, h=.012)
            for sg in (-.1, .1): rivet(iron, hp(hull_r(k, fz + sg) - .04, k, fz + sg), inward(k), r=.026, h=.014)
            k += .05 + .012 * (int(k * 100) % 2)

def build_deck(S):
    d, iron = S['deck_steel'], S['iron']
    # plates with a real gap and chamfer between them; the top is exactly y 0 so feet stay where they stand
    xs = [-5.3 + 1.48 * i for i in range(8)]
    zs0 = [-6.3 + 2.3 * i for i in range(11)]
    for i, (x0, x1) in enumerate(zip(xs, xs[1:])):
        shift = .9 if i % 2 else 0
        zs = [zs0[0]] + [z + shift for z in zs0[1:-1]] + [zs0[-1]]
        for z0, z1 in zip(zs, zs[1:]):
            e = .018; dp = .02
            d.poly([(x0 + e, 0, z0 + e), (x1 - e, 0, z0 + e), (x1 - e, 0, z1 - e), (x0 + e, 0, z1 - e)], ref=(0, 1, 0))
            for a, b in (((x0, z0), (x1, z0)), ((x1, z0), (x1, z1)), ((x1, z1), (x0, z1)), ((x0, z1), (x0, z0))):
                ia = (a[0] + (e if a[0] == x0 else -e), a[1] + (e if a[1] == z0 else -e)); ib = (b[0] + (e if b[0] == x0 else -e), b[1] + (e if b[1] == z0 else -e))
                d.poly([(a[0], -dp, a[1]), (b[0], -dp, b[1]), (ib[0], 0, ib[1]), (ia[0], 0, ia[1])], ref=(0, 1, 0))
            if z0 < 8:   # rivets round each plate where it is in frame
                nx = max(2, int((x1 - x0) / .3)); nz = max(2, int((z1 - z0) / .3))
                for k in range(nx + 1):
                    for z_ in (z0 + .07, z1 - .07): rivet(iron, (x0 + .07 + (x1 - x0 - .14) * k / nx, 0, z_), (0, 1, 0), r=.024, h=.007)
                for k in range(1, nz):
                    for x_ in (x0 + .07, x1 - .07): rivet(iron, (x_, 0, z0 + .07 + (z1 - z0 - .14) * k / nz), (0, 1, 0), r=.024, h=.007)
    d.poly([(-6, -.02, -6.3), (6, -.02, -6.3), (6, -.02, Z_AFT), (-6, -.02, Z_AFT)], ref=(0, 1, 0))
    # bilge gutter: the angle iron where deck meets hull
    for s in (-1, 1):
        box(S['steel_paint'], s * 4.95 - .12, s * 4.95 + .12, 0, .16, -5.95, 15.9, b=.015)
    # a flush hatch in the deck aft of the men, a drain near the kid
    torus(S['iron'], (.6, .008, 7.6), (0, 1, 0), .62, .022, seg=24, sides=4)
    d.poly([(.6 + .6 * math.cos(k * TAU / 24), .004, 7.6 + .6 * math.sin(k * TAU / 24)) for k in range(24)], ref=(0, 1, 0))
    for k in range(10):
        rivet(iron, (.6 + .52 * math.cos(k * TAU / 10), .004, 7.6 + .52 * math.sin(k * TAU / 10)), (0, 1, 0), r=.03, h=.01)

def tube_door(S, x, y, idx):
    """A torpedo tube's breech door: seat flange, domed door, dogs, hinge, the breech wheel and its lock lever. Centres as in world/s4.js."""
    steel, iron, brass, red = S['steel_paint'], S['iron'], S['brass'], S['red_paint']
    Z0 = -5.95
    sd = 1 if x > 0 else -1
    # the tube's seat on the bulkhead, a heavy flange with studs
    tube(steel, [(x, y, Z0), (x, y, Z0 + .13)], 1.2, sides=40)
    tube(steel, [(x, y, Z0 + .13), (x, y, Z0 + .15)], [1.2, 1.15], sides=40, caps=False)
    for k in range(24):
        a = k * TAU / 24 + .13
        c = (x + 1.11 * math.cos(a), y + 1.11 * math.sin(a), Z0 + .15)
        cyl(iron, c, (c[0], c[1], c[2] + .03), .03, sides=6)
    # the door: a dome, not a disc
    rs = [1.03, 1.03, 1.0, .9, .72, .46, .2]
    zs = [-5.80, -5.74, -5.70, -5.655, -5.61, -5.575, -5.56]
    tube(S['steel_paint'], [(x, y, z) for z in zs], rs, sides=36)
    torus(brass, (x, y, -5.72), (0, 0, 1), 1.03, .055, seg=40, sides=6)   # the bright ring, as in the previz
    # dogs: eight swing bolts over the rim
    for k in range(8):
        a = k * TAU / 8 + TAU / 16
        ca, sa = math.cos(a), math.sin(a)
        p0, p1 = (x + .84 * ca, y + .84 * sa, -5.63), (x + 1.16 * ca, y + 1.16 * sa, -5.72)
        cyl(iron, p0, p1, .036, sides=6)
        cyl(iron, (p0[0], p0[1], p0[2] - .03), (p0[0], p0[1], p0[2] + .05), .06, sides=6)
        cyl(iron, (p1[0], p1[1], p1[2] - .02), (p1[0], p1[1], p1[2] + .05), .05, sides=6)
    # hinge on the outer side
    for dy in (-.4, 0, .4):
        box(iron, x + sd * 1.0 - .09, x + sd * 1.0 + .09, y + dy - .14, y + dy + .14, -5.79, -5.62, b=.012)
    cyl(iron, (x + sd * 1.0, y - .6, -5.62), (x + sd * 1.0, y + .6, -5.62), .05, sides=8)
    # the breech wheel on its hub, painted, with a crank handle; same centre and size as the previz
    tube(iron, [(x, y, -5.58), (x, y, -5.47)], [.14, .1], sides=12)
    handwheel(red, iron, (x, y, -5.5), (0, 0, 1), .34, r=.045, spokes=5, stem=.02)
    cyl(red, (x + .34 * math.cos(1.1), y + .34 * math.sin(1.1), -5.5), (x + .34 * math.cos(1.1), y + .34 * math.sin(1.1), -5.39), .028, sides=6)
    # the lock lever: down and out from the hub, a ball on the end
    tip = (x - sd * .38, y - .68, -5.5)
    cyl(red, (x, y, -5.5), tip, .036, sides=6)
    tube(iron, [(tip[0], tip[1], tip[2] - .05), tip, (tip[0], tip[1], tip[2] + .05)], [.02, .055, .02], sides=8, caps=False)
    # tally plate + a depth gauge on the door's shoulder, test cock at the bottom
    gauge(S, (x + sd * -.52, y + .58, -5.56), (0, -.05, 1), R=.1)
    box(brass, x + sd * .3 - .13, x + sd * .3 + .13, y + .62, y + .76, -5.64, -5.60, b=.006)
    cyl(brass, (x, y - .86, -5.68), (x, y - .86, -5.55), .035, sides=8)
    handwheel(red, iron, (x, y - .86, -5.53), (0, 0, 1), .07, r=.012, spokes=3, stem=.02)

def build_bulkhead(S):
    # the hero wall has real rivets everywhere, so it takes the plain paint, not the riveted picture
    plate, steel, iron = S['steel_paint'], S['steel_paint'], S['iron']
    # the plate: courses that lap, each riveted along its edges
    ys = [-.2, 1.0, 2.75, 4.5, 6.2, 8.2]
    for i, (y0, y1) in enumerate(zip(ys, ys[1:])):
        zf = -5.95 - (.03 if i % 2 else 0)
        plate.poly([(-6, y0, zf), (6, y0, zf), (6, y1, zf), (-6, y1, zf)], ref=(0, 0, 1))
        plate.poly([(-6, y1, zf), (6, y1, zf), (6, y1, -5.98), (-6, y1, -5.98)], ref=(0, 1 if i % 2 == 0 else -1, 0))
        x = -5.6
        while x < 5.6:
            for y in (y0 + .1, y1 - .1):
                rivet(iron, (x, y, zf), (0, 0, 1), r=.03, h=.016)
            x += .25
    # back of it: one plain face so nothing shows through
    plate.poly([(-6, -.2, -6.3), (6, -.2, -6.3), (6, 8.2, -6.3), (-6, 8.2, -6.3)], ref=(0, 0, -1))
    # stiffeners: heavy vertical channels between and outside the tubes
    for x in (-3.15, 0, 3.15):
        if x == 0:
            for y0, y1 in ((-.0, .28), (5.2, 8)):
                box(steel, x - .16, x + .16, y0, y1, -5.97, -5.82, b=.015)
        else:
            box(steel, x - .17, x + .17, 0, 8, -5.97, -5.82, b=.015)
            for k in range(30):
                rivet(iron, (x - .1, .15 + k * .27, -5.82), (0, 0, 1), r=.026, h=.013); rivet(iron, (x + .1, .15 + k * .27, -5.82), (0, 0, 1), r=.026, h=.013)
    box(steel, -6, 6, 5.25, 5.55, -5.97, -5.83, b=.015)    # a girder over the upper doors
    for k in range(44): rivet(iron, (-5.4 + k * .25, 5.3, -5.83), (0, 0, 1), r=.024, h=.012); rivet(iron, (-5.4 + k * .25, 5.5, -5.83), (0, 0, 1), r=.024, h=.012)
    for i, (x, y) in enumerate(((-1.5, 1.55), (1.5, 1.55), (-1.5, 3.95), (1.5, 3.95))):
        tube_door(S, x, y, i)
    # the middle: gauge board, firing valves
    box(steel, -.36, .36, 1.5, 4.6, -5.95, -5.86, b=.015)
    for y, r_ in ((4.28, .15), (3.84, .12), (3.46, .12), (3.08, .1)):
        gauge(S, (0, y, -5.82), (0, 0, 1), R=r_)
    for y in (2.62, 2.2, 1.78):
        cyl(S['brass'], (-.2, y, -5.86), (-.2, y, -5.74), .045, sides=8); handwheel(S['red_paint'], iron, (-.2, y, -5.7), (0, 0, 1), .085, r=.014, spokes=3, stem=.03)
        cyl(S['brass'], (.2, y, -5.86), (.2, y, -5.74), .045, sides=8); handwheel(S['red_paint'], iron, (.2, y, -5.7), (0, 0, 1), .085, r=.014, spokes=3, stem=.03)
    # the firing levers over the board
    for x in (-.24, -.08, .08, .24):
        cyl(S['brass'], (x, 4.66, -5.83), (x + .02 * (x > 0), 5.12, -5.62), .02, sides=5); tube(S['iron'], [(x + .02 * (x > 0), 5.08, -5.64), (x + .02 * (x > 0), 5.12, -5.62), (x + .02 * (x > 0), 5.16, -5.60)], [.015, .04, .015], sides=7, caps=False)
    # air flasks, floor to shoulder, either side
    for sx in (-1, 1):
        x = sx * 3.62
        tube(S['pipe_steel'], [(x, .05, -5.45), (x, .25, -5.45), (x, .5, -5.45), (x, 3.0, -5.45), (x, 3.25, -5.45), (x, 3.45, -5.45)], [.2, .34, .4, .4, .34, .14], sides=20)
        for y in (.75, 2.75):
            torus(iron, (x, y, -5.45), (0, 1, 0), .41, .025, seg=20, sides=4)
            box(iron, x - .05, x + .05, y - .04, y + .04, -5.97, -5.82, b=.008)
        valve(S, (x, 3.62, -5.45), (0, 0, 1), body_r=.09, wheel_R=.13)
        pipe_run(S['pipe_copper'], [(x, 3.5, -5.45), (x, 3.62, -5.45), (x, 3.62, -5.62), (x, 4.9, -5.62), (x, 5.05, -5.62)], .04, bend=.1, sides=6)
    # a header across the top, with drops to each door; the big trunk above it
    cyl(S['pipe_copper'], (-4.6, 5.0, -5.68), (4.6, 5.0, -5.68), .075, sides=10)
    for x in (-4, -2.4, -.6, .6, 2.4, 4):
        flange(S['brass'], (x, 5.0, -5.68), (1, 0, 0), .12, .05, bolts=None)
    for x in (-.78, .78):
        pipe_run(S['pipe_copper'], [(x, 5.0, -5.68), (x, 4.4, -5.68), (x * .95, 2.8, -5.68), (x * .95, 2.2, -5.68), (x * 1.0, 2.2, -5.83)], .04, bend=.12, sides=6)
        flange(S['brass'], (x * .95, 3.4, -5.68), (0, 1, 0), .07, .05)
    valve(S, (-3.15, 5.0, -5.68), (0, -.3, 1), body_r=.12, wheel_R=.17)
    valve(S, (3.15, 5.0, -5.68), (0, -.3, 1), body_r=.12, wheel_R=.17)
    cyl(S['pipe_steel'], (-5.2, 6.35, -5.45), (5.2, 6.35, -5.45), .4, sides=16)
    for x in (-3.4, -1.1, 1.1, 3.4):
        flange(S['iron'], (x, 6.35, -5.45), (1, 0, 0), .46, .06, bolts=None)
        for dx in (-.03, .03):
            for k in range(12):
                a = k * TAU / 12
                rivet(iron, (x + dx * 1.3, 6.35 + .42 * math.cos(a), -5.45 + .42 * math.sin(a)), (dx, math.cos(a), math.sin(a)), r=.02, h=.01)
    for x in (-2.2, 2.2):
        box(iron, x - .04, x + .04, 5.9, 6.84, -5.92, -5.0, b=.01)
    handwheel(S['red_paint'], iron, (-1.1, 6.35, -5.0), (0, 0, 1), .22, r=.028, spokes=5, stem=.1)
    # a speaking tube and a sound-powered box low on the left, a tool board low on the right
    pipe_run(S['brass'], [(-2.72, 5.3, -5.8), (-2.72, 2.6, -5.8), (-2.72, 2.2, -5.75)], .035, bend=.1, sides=6)
    tube(S['brass'], [(-2.72, 2.2, -5.75), (-2.72, 2.14, -5.67), (-2.72, 2.1, -5.6)], [.035, .05, .09], sides=8, caps=False)
    box(steel, 2.44, 2.92, .3, 1.0, -5.95, -5.84, b=.012)
    for k in range(3): cyl(iron, (2.54 + k * .14, .92, -5.84), (2.54 + k * .14, .92, -5.76), .012, sides=4); box(S['pipe_steel'], 2.52 + k * .14, 2.56 + k * .14, .4 + k * .06, .9, -5.8, -5.77, b=.004)

def torpedo(S, x, y, z_nose, r=.62, tail_props=True):
    """A Mark-whatever torpedo on its rack: bronze war nose towards the tube, body in sections, fins and two propellers towards the camera."""
    body, br, iron = S['torpedo'], S['brass'], S['iron']
    L = lambda t: z_nose + t * 11.6
    nose = [(0, .04), (.008, .2), (.024, .36), (.05, .5), (.09, .58), (.13, .615), (.16, 1)]
    tube(br, [(x, y, L(t)) for t, _ in nose], [rr * r / .62 if rr < 1 else r for _, rr in nose], sides=24)
    tail = [(.16, 1), (.82, 1), (.88, .94), (.93, .72), (.965, .46), (.985, .3)]
    tube(body, [(x, y, L(t)) for t, _ in tail], [rr * r for _, rr in tail], sides=24)
    # section joints + rivet rings
    for t in (.16, .36, .58, .82):
        tube(iron, [(x, y, L(t) - .025), (x, y, L(t) + .025)], r + .012, sides=24)
        for k in range(14):
            a = k * TAU / 14
            for s in (-.09, .09):
                rivet(iron, (x + r * math.cos(a), y + r * math.sin(a), L(t) + s), (math.cos(a), math.sin(a), 0), r=.018, h=.008)
    # lifting lug on top
    cyl(iron, (x, y + r, L(.47)), (x, y + r + .05, L(.47)), .06, sides=8)
    torus(iron, (x, y + r + .09, L(.47)), (1, 0, 0), .06, .015, seg=10, sides=4)
    if tail_props:
        zf0, zf1 = L(.9), L(.985)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            p = []
            for z_, a_, b_ in ((zf0, .38, .58), (zf1, .2, .58)):
                p.append((x + dx * a_ * r / .62, y + dy * a_ * r / .62, z_)); p.append((x + dx * b_ * 1.25 * r / .62, y + dy * b_ * 1.25 * r / .62, z_))
            q = [p[0], p[1], p[3], p[2]]
            th = .018
            nrm = (dy, dx, 0)
            for s in (-1, 1):
                S['iron'].poly([(a[0] + dy * th * s, a[1] + dx * th * s, a[2]) for a in q], ref=(dy * s, dx * s, 0))
        zp = [L(.998), L(1.022)]
        for j, z_ in enumerate(zp):
            cyl(iron, (x, y, zf1), (x, y, z_ + .05), .05, sides=8)
            for k in range(3):
                a = k * TAU / 3 + j * 1.05
                ca, sa = math.cos(a), math.sin(a)
                p0, p1 = (x + ca * .05, y + sa * .05, z_), (x + ca * .36, y + sa * .36, z_)
                wx, wy = -sa * .08, ca * .08
                br.poly([(p0[0] - wx * .6, p0[1] - wy * .6, z_ - .03), (p1[0] - wx, p1[1] - wy, z_ - .05), (p1[0] + wx, p1[1] + wy, z_ + .05), (p0[0] + wx * .6, p0[1] + wy * .6, z_ + .03)])
                br.poly([(p0[0] + wx * .6, p0[1] + wy * .6, z_ + .03), (p1[0] + wx, p1[1] + wy, z_ + .05), (p1[0] - wx, p1[1] - wy, z_ - .05), (p0[0] - wx * .6, p0[1] - wy * .6, z_ - .03)])

def saddle(S, x, y, r, z):
    """The rack under a torpedo: a curved shoe on two legs, a strap over the top."""
    steel, iron = S['steel_paint'], S['iron']
    box(steel, x - .78, x + .78, 0, y - r * .72, z - .2, z + .2, b=.02)
    for dx in (-.62, .62): box(steel, x + dx - .08, x + dx + .08, y - r * .72, y - .1, z - .17, z + .17, b=.012)
    torus(iron, (x, y, z), (0, 0, 1), r + .02, .022, seg=24, sides=4)
    for dx in (-.7, -.35, .35, .7): rivet(iron, (x + dx, y - r * .72, z + .2), (0, 0, 1), r=.03, h=.016)

def bunk(S, x0, x1, y, z0, z1, wall_x, seed):
    """A pipe berth slung on chains: pipe frame, sagging canvas, a blanket roll."""
    frame, cv = S['pipe_steel'], S['canvas']
    r = .035
    pipe_run(frame, [(x0, y, z0), (x1, y, z0), (x1, y, z1), (x0, y, z1), (x0, y, z0)], r, bend=.1, sides=6)
    def f(u, v):
        s = math.sin(u * math.pi) * math.sin(v * math.pi)
        wob = .03 * (vnoise(u * 6, v * 9, 1, seed) - .5)
        return (x0 + (x1 - x0) * u, y - .02 - .13 * s - wob * s, z0 + (z1 - z0) * v)
    n_u, n_v = 8, max(10, int((z1 - z0) / .35))
    us, vs = [i / n_u for i in range(n_u + 1)], [i / n_v for i in range(n_v + 1)]
    cv.grid(f, us, vs, (0, 1, 0), uvfn=lambda u, v: ((x1 - x0) * u, (z1 - z0) * v))
    cv.grid(f, us, vs, (0, -1, 0), uvfn=lambda u, v: ((x1 - x0) * u, (z1 - z0) * v))
    # blanket rolled at the aft end, a kitbag mid way
    zr = z1 - .55
    tube(cv, [(x0 + .1, y + .05, zr), (x0 + .4, y + .1, zr + .02), ((x0 + x1) / 2, y + .11, zr), (x1 - .4, y + .1, zr - .02), (x1 - .1, y + .05, zr)], [.08, .17, .19, .17, .08], sides=10)
    zm = (z0 + z1) / 2 + (seed % 3 - 1) * .8
    tube(cv, [((x0 + x1) / 2, y - .08, zm - .4), ((x0 + x1) / 2, y + .08, zm - .25), ((x0 + x1) / 2 + .03, y + .12, zm), ((x0 + x1) / 2, y + .08, zm + .25), ((x0 + x1) / 2, y - .08, zm + .4)], [.1, .22, .26, .22, .1], sides=9)
    # chains up to the hull on the outboard side, up to the next thing inboard
    inb = x0 if abs(x0) < abs(x1) else x1
    outb = x1 if inb == x0 else x0
    for z_ in (z0 + .08, z1 - .08):
        ytop = HY + math.sqrt(max(.1, (HR - .05) ** 2 - inb ** 2))
        chain(S['iron'], (inb, y + .02, z_), (inb, min(y + 1.5, ytop), z_))
        chain(S['iron'], (outb, y + .02, z_), (outb, min(y + 1.0, HY + math.sqrt(max(.1, (HR - .05) ** 2 - outb ** 2))), z_))

def crate(S, x, y0, z, w, h, d):
    """A tool chest the men sit on: same box as the previz, planks and iron."""
    wd, iron = S['wood'], S['iron']
    x0, x1, z0, z1 = x - w / 2, x + w / 2, z - d / 2, z + d / 2
    y1 = y0 + h
    rows = max(2, int(h / .2))
    for i in range(rows):
        a, b = y0 + h * i / rows, y0 + h * (i + 1) / rows - .006
        box(wd, x0 + .012, x1 - .012, a, b, z0 + .012, z1 - .012, b=.008, skip=((1, -1),))
    n = 4
    for i in range(n):
        a, b = z0 + d * i / n, z0 + d * (i + 1) / n - .008
        box(wd, x0, x1, y1 - .03, y1, a, b, b=.006)   # lid planks: top is exactly the seat height
    for dx in (-w / 2 + .1, w / 2 - .1):
        box(iron, x + dx - .03, x + dx + .03, y0, y1 - .002, z0 - .006, z1 + .006, b=.004)
    for zz in (z0, z1):
        for dy in (.1, h - .1):
            rivet(iron, (x - w / 2 + .1, y0 + dy, zz - .008 if zz == z0 else zz + .008), (0, 0, -1 if zz == z0 else 1), r=.016, h=.008)

def build_room_pipes(S):
    co, st, iron = S['pipe_copper'], S['pipe_steel'], S['iron']
    # ---- the tapping pipes, exact: positions and radii from world/s4.js (the hands hit them)
    tap = [(-2.05, .95, .17, co), (1.25, -2.7, .12, st), (-3.85, -1.8, .12, co)]
    for x, z, r, m in tap:
        cyl(m, (x, 0, z), (x, 4.75, z), r, sides=16)
        tube(iron, [(x, 0, z), (x, .1, z)], r * 2.1, sides=14)
        for k in range(8):
            a = k * TAU / 8
            cyl(iron, (x + r * 1.7 * math.cos(a), .1, z + r * 1.7 * math.sin(a)), (x + r * 1.7 * math.cos(a), .135, z + r * 1.7 * math.sin(a)), .02, sides=5, caps=True)
    # the brass collars on the kid's pipe, in the previz spots, and a joint high on each
    tube(S['brass'], [(-2.05, 1.12, .95), (-2.05, 1.28, .95)], .24, sides=16)
    tube(S['brass'], [(-2.05, 2.92, .95), (-2.05, 3.08, .95)], .24, sides=16)
    flange(S['iron'], (-2.05, 3.0, .95), (0, 1, 0), .25, .04, bolts=S['iron'], n=6, br=.016)
    flange(S['iron'], (1.25, 3.4, -2.7), (0, 1, 0), .2, .05, bolts=S['iron'], n=6, br=.014)
    flange(S['iron'], (-3.85, 3.6, -1.8), (0, 1, 0), .2, .05, bolts=S['iron'], n=6, br=.014)
    # a little gauge line on the kid's pipe, on the far side from the camera
    pipe_run(S['brass'], [(-2.2, 3.5, .8), (-2.4, 3.5, .6), (-2.4, 3.9, .6)], .018, bend=.08, sides=5)
    gauge(S, (-2.4, 4.02, .6), (.1, -.2, 1), R=.1)
    # ---- overhead bundles along the hull. x between -1.75 and .3 stays open at every height: the camera climbs through it (30.68 s, 31.8 s)
    LEFT = [(-2.4, 4.9, .16, co), (-2.78, 5.2, .1, st), (-1.98, 5.22, .09, st), (-3.2, 4.98, .085, co), (-2.95, 4.68, .06, st), (-2.2, 5.45, .055, co)]
    RIGHT = [(1.6, 5.2, .13, st), (2.02, 4.92, .1, co), (2.6, 4.75, .18, co), (3.08, 5.1, .1, st), (2.32, 5.32, .06, st), (1.25, 5.42, .05, co)]
    zA, zB = -5.9, 15.9
    for x, y, r, m in LEFT + RIGHT:
        cyl(m, (x, y, zA), (x, y, zB), r, sides=10 if r > .08 else 7, caps=False)
    # flanges with bolts, not in step between pipes
    R_ = random.Random(1927)
    for x, y, r, m in LEFT + RIGHT:
        if r < .08: continue
        z = -5.2 + R_.random() * 1.8
        while z < 9:
            flange(S['iron'] if R_.random() < .6 else S['brass'], (x, y, z), (0, 0, 1), r * 1.55, .05, bolts=iron, n=6, br=.012)
            z += 3.2 + R_.random() * 1.8
    # valves on the undersides, where they read against dark steel; wheels point down and slightly aft
    for (x, y, z, ax, wr) in ((-2.4, 4.68, -3.9, (0, -1, .3), .2), (-3.2, 4.8, -1.7, (0, -.8, .4), .13), (-2.4, 4.68, 2.4, (.2, -1, .2), .17), (2.6, 4.5, -3.6, (0, -1, .3), .2), (2.02, 4.74, -.9, (0, -1, .3), .15), (2.6, 4.5, 4.1, (0, -1, .1), .17), (1.6, 5.0, 2.6, (0, -1, .3), .14)):
        valve(S, (x, y, z), ax, body_r=.16 if wr > .16 else .12, wheel_R=wr, stem_len=.26)
    # hangers from the frames, rods up to the hull at each frame
    for fz in FRAMES:
        z = fz + .55
        if z > 15.5: continue
        for x, y in ((-2.5, 5.55), (2.2, 5.5)):
            box(iron, x - .95 if x < 0 else x - .95, x + .75 if x < 0 else x + 1.05, y - .03, y + .03, z - .05, z + .05, b=.008)
            for dx in (-.8, .6):
                top = HY + math.sqrt(HR ** 2 - (x + dx) ** 2) - .25
                cyl(iron, (x + dx, y, z), (x + dx, top, z), .02, sides=5, caps=False)
            for px, py, pr, _ in (LEFT if x < 0 else RIGHT):
                if pr >= .085:
                    torus(iron, (px, py, z), (0, 0, 1), pr + .012, .012, seg=10, sides=4)
                    cyl(iron, (px, py + pr, z), (px, y, z), .012, sides=4, caps=False)
    # wire bundles high on the hull each side, on hangers, plus a sag or two
    for s in (-1, 1):
        for k, (dth, r) in enumerate(((.0, .03), (.045, .022), (.09, .026), (.13, .018))):
            th = s * (math.radians(62) + dth)
            p = hp(HR - .42, th, 0)
            cyl(S['black'], (p[0], p[1], -5.9), (p[0], p[1], 15.9), r, sides=5, caps=False)
        for fz in FRAMES:
            th = s * math.radians(66)
            a = hp(HR - .33, th - s * .08, fz + .9); b = hp(HR - .33, th + s * .12, fz + .9)
            box(iron, min(a[0], b[0]) - .02, max(a[0], b[0]) + .02, min(a[1], b[1]) - .02, max(a[1], b[1]) + .02, fz + .87, fz + .93, b=.005)
    # high side pipes (previz: y 3.9, y 3.7), moved out onto the hull above the berths
    cyl(st, (-5.05, 4.55, -5.9), (-5.05, 4.55, 15.9), .1, sides=8, caps=False)
    cyl(co, (5.0, 4.6, -5.9), (5.0, 4.6, 15.9), .09, sides=8, caps=False)
    # one pipe across, well behind the men: the only thing that crosses the open slot, at z -4.7
    cyl(co, (-3.3, 4.78, -4.7), (3.3, 4.78, -4.7), .08, sides=8, caps=False)
    valve(S, (-.5, 4.78, -4.7), (0, -1, .35), body_r=.13, wheel_R=.18, stem_len=.25)
    flange(iron, (.9, 4.78, -4.7), (1, 0, 0), .13, .05, bolts=iron, n=6, br=.012)
    pipe_run(co, [(-3.3, 4.78, -4.7), (-3.3, 4.95, -4.7), (-3.2, 4.98, -4.2)], .08, bend=.14, sides=8, caps=False)
    pipe_run(co, [(3.3, 4.78, -4.7), (3.3, 4.75, -4.3), (2.75, 4.75, -4.2)], .08, bend=.14, sides=8, caps=False)
    # tops of the tapping pipes turn into the bundles
    pipe_run(co, [(-2.05, 4.75, .95), (-2.05, 5.02, .95), (-2.32, 5.02, .95)], .17, bend=.14, sides=14, caps=False)
    pipe_run(st, [(1.25, 4.75, -2.7), (1.25, 5.2, -2.7), (1.52, 5.2, -2.7)], .12, bend=.14, sides=12, caps=False)
    pipe_run(co, [(-3.85, 4.75, -1.8), (-3.85, 4.98, -1.8), (-3.28, 4.98, -1.8)], .12, bend=.14, sides=12, caps=False)
    # the loading rail: an I-beam on the centre line, right of the camera's slot, with a chain fall
    x = .75; yb = 6.42
    box(S['steel_paint'], x - .14, x + .14, yb - .24, yb - .2, -5.9, 7.6, b=.006)
    box(S['steel_paint'], x - .03, x + .03, yb - .22, yb + .1, -5.9, 7.6, b=.004)
    box(S['steel_paint'], x - .14, x + .14, yb + .08, yb + .12, -5.9, 7.6, b=.006)
    for fz in FRAMES[:5]:
        top = HY + math.sqrt(HR ** 2 - x ** 2) - .3
        box(iron, x - .05, x + .05, yb + .1, top, fz - .04, fz + .04, b=.006)
    zc = -1.15
    box(iron, x - .22, x + .22, yb - .42, yb - .24, zc - .18, zc + .18, b=.02)
    tube(iron, [(x, yb - .42, zc), (x, yb - .52, zc), (x, yb - .75, zc), (x, yb - .92, zc), (x, yb - 1.0, zc)], [.05, .13, .16, .13, .05], sides=10)
    chain(iron, (x + .09, yb - .9, zc), (x + .09, 4.6, zc))
    chain(iron, (x - .09, yb - .9, zc), (x - .09, 5.0, zc))
    torus(iron, (x + .09, 4.52, zc), (1, 0, .3), .09, .02, seg=10, sides=4, a0=-.3, a1=TAU * .72)

def build_lamp(S, p, cable_top):
    """The failing lamp: a bulb in a wire cage, a shade over it, the cable up. mesh lamp_bulb is the bulb, so the renderer can drive it."""
    iron, x, y, z = S['iron'], p[0], p[1], p[2]
    tube(S['lamp_bulb'], [(x, y - .17, z), (x, y - .12, z), (x, y, z), (x, y + .1, z), (x, y + .17, z)], [.02, .11, .17, .12, .06], sides=12)
    tube(S['brass'], [(x, y + .15, z), (x, y + .3, z)], [.07, .06], sides=10)
    for k, r in ((-.2, .15), (-.02, .23), (.14, .2)):
        torus(iron, (x, y + k, z), (0, 1, 0), r, .012, seg=16, sides=4)
    for k in range(6):
        a = k * TAU / 6
        c, s = math.cos(a), math.sin(a)
        tube(iron, [(x + .03 * c, y - .27, z + .03 * s), (x + .15 * c, y - .2, z + .15 * s), (x + .23 * c, y - .02, z + .23 * s), (x + .2 * c, y + .14, z + .2 * s), (x + .08 * c, y + .24, z + .08 * s)], .009, sides=3, caps=False)
    tube(iron, [(x, y + .24, z), (x, y + .34, z), (x, y + .36, z)], [.34, .12, .05], sides=14, caps=False)  # tin shade
    sagging(S['black'], (x, y + .34, z), cable_top, .06, .016)

def build_torpedo():
    S = Set()
    build_hull(S)
    print('  hull', S['plate_riveted'].tris(), S['iron'].tris(), flush=True)
    build_deck(S)
    build_bulkhead(S)
    build_room_pipes(S)
    # torpedoes: the right one exactly where the hands tap it, nose to the tubes; a second on the left, clear of Lt and the wire pipe
    torpedo(S, 3.5, 1.1, -4.3, r=.62)
    for z in (-2, 1.9, 4.4): saddle(S, 3.5, 1.1, .62, z)
    torpedo(S, -4.75, .95, -5.0, r=.58)
    for z in (-3.2, .8): saddle(S, -4.75, .95, .58, z)
    # berths slung above the torpedoes (nothing lower than a head, nothing inboard of the men)
    bunk(S, 3.2, 4.65, 3.42, -5.2, -.4, 1, 3); bunk(S, 3.2, 4.65, 3.42, .1, 5.5, 1, 4)
    bunk(S, 3.5, 4.75, 4.86, -5.2, 2.2, 1, 7)
    bunk(S, -5.25, -4.12, 3.42, -5.2, 1.5, -1, 5)
    bunk(S, -4.85, -3.82, 4.82, -5.2, 2.2, -1, 8)
    # the seats and the tall crate, the same boxes as the previz
    crate(S, -1.1, 0, .95, 1.0, .55, .9); crate(S, 1.55, 0, .3, 1.0, .55, .9); crate(S, -2.8, 0, -1.8, 1.1, .55, .9); crate(S, -3.6, 0, 3.2, 1.1, 1.1, .9)
    # lockers aft along the hull, seen only passing them
    for x0, x1, z0, z1 in ((-5.15, -4.45, 6.0, 15.7), (4.55, 5.15, 11.2, 15.7)):
        box(S['steel_paint'], x0, x1, .16, 2.2, z0, z1, b=.02)
        z = z0 + .9
        while z < z1:
            bx = x1 if x0 < 0 else x0
            box(S['iron'], bx - .012, bx + .012, .25, 2.1, z - .012, z + .012, b=.004)
            z += .9
    # lamps: the failing one exactly at LP; the two lesser lights of the previz hang from the bundles
    build_lamp(S, (.9, 4.15, 1.4), (.75, 6.18, 1.4))
    build_small_lamp(S, (-2.6, 3.72, -3.5), (-2.6, 4.75, -3.5))
    build_small_lamp(S, (3.0, 3.9, 7.0), (2.9, 4.75, 7.0))
    # the aft wall the camera flies through: front face z 15.95, back face z 16.25
    pl = S['plate_riveted']
    pl.poly([(-7, -2, 15.95), (7, -2, 15.95), (7, 8, 15.95), (-7, 8, 15.95)], ref=(0, 0, -1))
    pl.poly([(-7, -2, 16.25), (7, -2, 16.25), (7, 8, 16.25), (-7, 8, 16.25)], ref=(0, 0, 1))   # the painted rivets do this one: the camera's on it for one frame
    return S

def build_small_lamp(S, p, top):
    x, y, z = p
    tube(S['glass'], [(x, y - .12, z), (x, y - .06, z), (x, y + .04, z), (x, y + .12, z)], [.02, .08, .11, .05], sides=10)
    tube(S['iron'], [(x, y + .1, z), (x, y + .2, z)], [.13, .05], sides=10, caps=False)
    for k in range(4):
        a = k * TAU / 4
        tube(S['iron'], [(x + .03 * math.cos(a), y - .17, z + .03 * math.sin(a)), (x + .13 * math.cos(a), y - .05, z + .13 * math.sin(a)), (x + .12 * math.cos(a), y + .12, z + .12 * math.sin(a))], .008, sides=3, caps=False)
    cyl(S['iron'], (x, y + .2, z), top, .018, sides=5, caps=False)

# ---------------------------------------------------------------------------------------------------------------- THE S-4 (own frame as world/s4.js sub(): long axis z, nose -z, centre y 0, the renderer moves her)
SUB_R = 6.0; SUB_L = 28.0
def sub_r(z):
    az = abs(z)
    return SUB_R if az <= SUB_L else math.sqrt(max(0, SUB_R ** 2 - ((az - SUB_L) / 2.6) ** 2))
def sub_dent(th, z):
    """Where the cutter's bow hit her: forward of the tower on the starboard side (+x), pushed in."""
    d = ((th - 1.25) / .42) ** 2 + ((z + 13.5) / 3.4) ** 2
    return 1.15 * math.exp(-d) * (.75 + .5 * vnoise(th * 5, z, 1.1, 21))
def sp(r, th, z, extra=0): return ((r - extra) * math.sin(th), (r - extra) * math.cos(th), z)
def build_sub():
    S = Set()
    H, iron, blk = S['hull_wreck'], S['iron'], S['black']
    N = 24
    edges = [-math.pi + TAU * i / N for i in range(N + 1)]
    fz = [-43.55, -43, -42, -40.5, -38.5, -36, -33, -30, -28]
    zs = fz + [z * 1.0 for z in range(-27, -1)] + [-1 + .5 * i for i in range(1, 51)] + [z * 1.0 for z in range(25, 28)] + [-z for z in reversed(fz)]
    zs = sorted(set(zs))
    def R(i, th, z):
        off = .03 if i % 2 else 0
        return max(.01, sub_r(z) + off * min(1, sub_r(z) / SUB_R) - sub_dent(th, z) + .03 * (vnoise(th * 3, z, 2.2, 3) - .5))
    for i in range(N):
        ths = [edges[i] + (edges[i + 1] - edges[i]) * k / 4 for k in range(5)]
        H.grid(lambda th, z: sp(R(i, th, z), th, z), ths, zs, (math.sin(ths[1]), math.cos(ths[1]), 0), uvfn=lambda th, z: (z, th * SUB_R))
        # lap edge
        th = edges[i + 1]
        for a, b in zip(zs, zs[1:]):
            if abs(a) < SUB_L:
                o = 1 if i % 2 else -1
                H.poly([sp(R(i, th, a), th, a), sp(R(i, th, b), th, b), sp(R(i + 1, th, b), th, b), sp(R(i + 1, th, a), th, a)], ref=(math.cos(th) * -o, -math.sin(th) * -o, 0))
        # butts, staggered
        z = -27 + 2.2 * (i % 3)
        while z < 27:
            if 0 < edges[i] + .1 < math.pi * .85 or z > 0:
                t2 = [edges[i], (edges[i] + edges[i + 1]) / 2, edges[i + 1]]
                H.grid(lambda th, zz: sp(R(i, th, z) + .018, th, zz), t2, [z - .12, z + .12], (math.sin(t2[1]), math.cos(t2[1]), 0), uvfn=lambda th, zz: (zz, th * SUB_R), smooth=False)
            z += 6.6
    # rivets on the side the camera sees (starboard, +x, where the diver stands): lap rows, close pitch around the diver
    for i in range(0, N):
        th0 = edges[i]
        if not (.05 < th0 < 2.95): continue
        for s in (-.018, .018):
            z = -26
            while z < 27:
                hero = -2 < z < 24
                rivet(iron, sp(R(i if s > 0 else i - 1, th0 + s, z) + .002, th0 + s, z), (math.sin(th0), math.cos(th0), 0), r=.04, h=.022)
                z += .34 if hero else .9
    # frames as rows of rivets every 2.2 in the hero part
    z = -1.0
    while z < 24:
        for th in [.25 + .055 * k for k in range(42)]:
            i = int((th + math.pi) / (TAU / N)) % N
            rivet(iron, sp(R(i, th, z) + .004, th, z), (math.sin(th), math.cos(th), 0), r=.034, h=.018)
        z += 2.2
    # the rubbing strake along the tank top, flood holes in a row under it
    for sg in (1, -1):
        th = sg * math.radians(93)
        H.grid(lambda t, z: sp(sub_r(z) + .09 - sub_dent(th, z), t, z), [th - .022 * sg, th + .022 * sg], [-27 + i * 1.0 for i in range(55)], (sg, 0, 0), uvfn=lambda t, z: (z, t * SUB_R))
        for zz in [-25 + 1.45 * k for k in range(35)]:
            t0 = sg * math.radians(113)
            if sub_dent(t0, zz) > .2: continue
            pts = [sp(sub_r(zz) + .02, t0 + .025 * math.sin(k * TAU / 10), zz + .32 * math.cos(k * TAU / 10)) for k in range(10)]
            blk.poly(pts, ref=(sg, 0, 0))
    # torn plate in the dent: dark wound + curled edges, on the ship's real damaged side
    wound = [sp(SUB_R - 1.05, 1.25 + .17 * math.cos(k * TAU / 12) * (1 + .3 * math.sin(k * 3)), -13.5 + 1.4 * math.sin(k * TAU / 12) * (1 + .2 * math.cos(k * 2))) for k in range(12)]
    blk.poly(wound, ref=(1, .3, 0))
    rd = random.Random(44)
    for k in range(9):
        a = k * TAU / 9
        th, z = 1.25 + .2 * math.cos(a), -13.5 + 1.7 * math.sin(a)
        p0 = sp(SUB_R - sub_dent(th, z) + .02, th, z)
        out = (math.sin(th) * (.3 + rd.random() * .4), math.cos(th) * (.3 + rd.random() * .4), math.sin(a) * .4)
        w = (0, .22 + rd.random() * .3, .3)
        H.poly([tuple(p0[i] - w[i] for i in range(3)), tuple(p0[i] + w[i] for i in range(3)), tuple(p0[i] + out[i] + w[i] * .4 for i in range(3)), tuple(p0[i] + out[i] * 1.2 - w[i] * .2 for i in range(3))], ref=(1, 0, 0))
    # ---- the deck casing: a flat top on the hull, side plates with limber slots (previz box: y 5.6..5.95, width 5, length 58)
    Y_D = 6.08
    zd = [-29, -22, -16, -9.6, -3, 3.8, 10, 16, 22, 29]
    for a, b in zip(zd, zd[1:]):
        H.poly([(-2.5, Y_D, a + .01), (2.5, Y_D, a + .01), (2.5, Y_D, b - .01), (-2.5, Y_D, b - .01)], ref=(0, 1, 0))
    for sg in (-1, 1):
        H.poly([(sg * 2.5, Y_D, -29), (sg * 2.5, Y_D, 29), (sg * 3.45, 4.75, 29), (sg * 3.45, 4.75, -29)], ref=(sg, 1, 0))
        z = -27
        while z < 27:
            mid = (sg * 2.98, 5.42, z)
            blk.poly([(sg * (2.98 + .1 * .6 * c), 5.42 + .1 * -.75 * c, z + .22 * s) for c, s in ((math.cos(k * TAU / 8), math.sin(k * TAU / 8)) for k in range(8))], ref=(sg, 1, 0))
            z += .9 if -9 < z < 4 else 1.1
    for x in (-2, -1, 0, 1, 2):
        z = -28.5
        while z < 28.5:
            if not (-8 < z < 4 and abs(x) < 2.3): rivet(iron, (x, Y_D, z), (0, 1, 0), r=.03, h=.014)
            z += 1.1
    # stanchions + rail wire, a few bent by the ram
    rs = random.Random(9)
    for sg in (-1, 1):
        last = None
        for z in range(-26, 27, 2):
            if -9 <= z <= 4: last = None; continue
            bend = (.7 + rs.random() * .6) if (-22 < z < -10 and sg > 0) else 0
            base = (sg * 2.4, Y_D, z); top = (sg * (2.4 + bend), Y_D + 1.5 - bend * .5, z + bend * .3)
            cyl(iron, base, top, .07, sides=6)
            if last and bend == 0: sagging(iron, last, top, .05, .022, n=3, sides=4)
            last = top if bend == 0 else None
    # jumping wire bow to tower to stern
    tube(iron, [(0, 8.2, -40), (0, 12, -7)], .035, sides=4, caps=False)
    tube(iron, [(0, 13.3, 1), (0, 7.5, 38)], .035, sides=4, caps=False)
    # deck gun forward of the tower
    tube(S['iron'], [(0, Y_D, -14), (0, Y_D + .3, -14), (0, Y_D + 1.4, -14)], [.5, .32, .24], sides=10)
    cyl(iron, (0, Y_D + 1.5, -15.9), (0, Y_D + 1.5, -12.8), .11, sides=8)
    box(iron, -.4, .4, Y_D + 1.2, Y_D + 1.9, -14.5, -13.4, b=.04)
    # ---- the tower: flat sides at x +-2.2 (the renderer's S-4 lettering sits on them), a faired nose, rails on top, ladder, voice pipe
    Y0, Y1 = 5.8, 11.3
    plan = [(-2.2, 3.5), (2.2, 3.5), (2.2, -7.5), (1.7, -8.8), (.9, -9.7), (0, -10.1), (-.9, -9.7), (-1.7, -8.8), (-2.2, -7.5)]
    for a, b in zip(plan, plan[1:] + plan[:1]):
        out = ((a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2 + 3.3)
        H.poly([(a[0], Y0, a[1]), (b[0], Y0, b[1]), (b[0], Y1, b[1]), (a[0], Y1, a[1])], ref=out)
    H.poly([(p[0], Y1, p[1]) for p in plan], ref=(0, 1, 0))
    for y in (6.4, 10.8):
        for a, b in zip(plan, plan[1:] + plan[:1]):
            L = math.hypot(b[0] - a[0], b[1] - a[1])
            n = int(L / .3)
            for k in range(n):
                t = (k + .5) / n
                o = norm(((a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2 + 3.3))
                rivet(iron, (a[0] + (b[0] - a[0]) * t, y, a[1] + (b[1] - a[1]) * t), o, r=.04, h=.02)
    # plate lines on the tower, above and below the lettering; the tower's skin overlaps in courses, so it never reads as one box
    for sg in (-1, 1):
        for y, h in ((6.05, .34), (6.72, .05), (10.3, .05), (10.95, .32)):
            box(H, sg * 2.2 - .028, sg * 2.2 + .028, y, y + h, -7.4, 3.4, b=.01)
        for z in (-6.2, 2.1):
            box(H, sg * 2.2 - .03, sg * 2.2 + .03, 5.9, 11.2, z - .09, z + .09, b=.01)
        # flood slots along the foot and two scuppers
        for z in [-6.8 + .75 * k for k in range(14)]:
            blk.poly([(sg * 2.232, 6.22 + .07 * math.sin(k * TAU / 8), z + .2 * math.cos(k * TAU / 8)) for k in range(8)], ref=(sg, 0, 0))
        # ladder rungs behind the lettering
        for k in range(12):
            cyl(iron, (sg * 2.34, 6.3 + k * .42, 2.6), (sg * 2.34, 6.3 + k * .42, 3.2), .03, sides=4)
    # upper tower + bridge rail + periscopes as in the previz
    box(H, -1.5, 1.5, 11.3, 13.3, -5, 1, b=.05)
    for x_, z_ in ((-1.5, -5), (1.5, -5), (1.5, 1), (-1.5, 1), (-1.5, -5)):
        pass
    for a, b in (((-2, -6.5), (2, -6.5)), ((2, -6.5), (2, 3)), ((2, 3), (-2, 3)), ((-2, 3), (-2, -6.5))):
        cyl(iron, (a[0], 12.4, a[1]), (b[0], 12.4, b[1]), .05, sides=5, caps=False)
    for x_, z_ in ((-2, -6.5), (2, -6.5), (2, 3), (-2, 3), (-2, -2), (2, -2)):
        cyl(iron, (x_, 11.3, z_), (x_, 12.45, z_), .05, sides=5)
    tube(iron, [(0, 12, -3.2), (0, 18, -3.2)], [.16, .1], sides=8)
    tube(iron, [(0, 12.2, -.8), (0, 16.75, -.8)], [.12, .08], sides=8)
    cyl(iron, (0, 17.9, -3.2), (0, 17.9, -2.9), .13, sides=8)
    # planes, rudder, screws
    for sg in (-1, 1):
        for z0, z1, y in ((-33, -30, 1.5), (31, 34, 0)):
            H.poly([(sg * sub_r(z0) * .8, y, z0), (sg * (sub_r(z0) + 3.2), y - .1, z0 + .5), (sg * (sub_r(z1) + 3), y - .1, z1 - .3), (sg * sub_r(z1) * .8, y, z1)], ref=(0, 1, 0))
            H.poly([(sg * sub_r(z0) * .8, y - .08, z0), (sg * (sub_r(z0) + 3.2), y - .18, z0 + .5), (sg * (sub_r(z1) + 3), y - .18, z1 - .3), (sg * sub_r(z1) * .8, y - .08, z1)], ref=(0, -1, 0))
        cyl(iron, (sg * 3.8, -1.8, 30), (sg * 4.0, -1.9, 37.5), .12, sides=8)
        for k in range(3):
            a = k * TAU / 3 + sg
            S['brass'].poly([(sg * 4.0, -1.9, 37.4), (sg * 4.0 + 1.1 * math.cos(a) - .2 * math.sin(a), -1.9 + 1.1 * math.sin(a) + .2 * math.cos(a), 37.1), (sg * 4.0 + 1.1 * math.cos(a) + .2 * math.sin(a), -1.9 + 1.1 * math.sin(a) - .2 * math.cos(a), 37.7)])
            S['brass'].poly([(sg * 4.0, -1.9, 37.4), (sg * 4.0 + 1.1 * math.cos(a) + .2 * math.sin(a), -1.9 + 1.1 * math.sin(a) - .2 * math.cos(a), 37.7), (sg * 4.0 + 1.1 * math.cos(a) - .2 * math.sin(a), -1.9 + 1.1 * math.sin(a) + .2 * math.cos(a), 37.1)])
    box(H, -.1, .1, -6.2, 3.2, 35, 38.3, b=.03)
    return S

# ---------------------------------------------------------------------------------------------------------------- SEABED (zone coordinates: add (-400, 0, 0))
def sand_h(x, z):
    """y 0 under the action. Dunes only outside it, sand banked up against the hull."""
    r = max(0, max(-3.5 - x, x - 25) / 8) + max(0, max(-26 - z, z - 17) / 8)
    k = min(1, r)
    warp = 6 * vnoise(x, z, 13, 2) + 1.2 * vnoise(x, z, 3.5, 6)
    u = (x * .55 + z * .83) + warp
    patch = smooth01(.3, .68, vnoise(x, z, 8.5, 7))          # ripples come and go: stretches of them, flat sand between
    ripple = (.012 + .042 * patch) * math.sin(u * TAU / 1.9) + .01 * patch * math.sin(u * TAU / .95 + 1)
    dune = 2.8 * (vnoise(x, z, 34, 3) - .4) * k + 1.3 * k * vnoise(x, z, 13, 4)
    bank = .9 * smooth01(-1.5, -3.5, x) * (.7 + .6 * vnoise(x, z, 6, 5))
    return ripple * (1 + k * 2) + dune + bank
def boulder(m, c, r, seed, flat=.65):
    """Icosphere, displaced, flat shaded, set into the sand."""
    t = (1 + 5 ** .5) / 2
    V = [norm(v) for v in ((-1, t, 0), (1, t, 0), (-1, -t, 0), (1, -t, 0), (0, -1, t), (0, 1, t), (0, -1, -t), (0, 1, -t), (t, 0, -1), (t, 0, 1), (-t, 0, -1), (-t, 0, 1))]
    F = [(0, 11, 5), (0, 5, 1), (0, 1, 7), (0, 7, 10), (0, 10, 11), (1, 5, 9), (5, 11, 4), (11, 10, 2), (10, 7, 6), (7, 1, 8), (3, 9, 4), (3, 4, 2), (3, 2, 6), (3, 6, 8), (3, 8, 9), (4, 9, 5), (2, 4, 11), (6, 2, 10), (8, 6, 7), (9, 8, 1)]
    for _ in range(3 if r > 1.5 else 2):
        nf, cache = [], {}
        def mid(a, b):
            k = (min(a, b), max(a, b))
            if k not in cache:
                V.append(norm(tuple((V[a][i] + V[b][i]) / 2 for i in range(3)))); cache[k] = len(V) - 1
            return cache[k]
        for a, b, cc in F:
            ab, bc, ca = mid(a, b), mid(b, cc), mid(cc, a)
            nf += [(a, ab, ca), (b, bc, ab), (cc, ca, bc), (ab, bc, ca)]
        F = nf
    def disp(v):
        n = .6 + .75 * vnoise(v[0] * 1.7 + seed, v[2] * 1.7, 1, seed) * vnoise(v[1] * 1.7, v[2] * 1.7 + seed, 1, seed + 1) + .28 * vnoise(v[0] * 4, v[1] * 4 + v[2] * 3, 1, seed + 2) + .1 * vnoise(v[0] * 9 + v[2] * 7, v[1] * 9, 1, seed + 3)
        return (c[0] + v[0] * r * n * (1 + .3 * ((seed * 7) % 3 - 1) * .3), c[1] + v[1] * r * n * flat, c[2] + v[2] * r * n)
    P = [disp(v) for v in V]
    # shared vertices, smooth: a stone, not a low-poly gem. UVs from the two axes that vary most, 1 UV = 1 D
    base = len(m.v)
    m.v.extend(P)
    for a, b, cc in F:
        if P[a][1] < c[1] - r * .35 and P[b][1] < c[1] - r * .35 and P[cc][1] < c[1] - r * .35: continue
        o = sub_(((P[a][0] + P[b][0] + P[cc][0]) / 3, (P[a][1] + P[b][1] + P[cc][1]) / 3, (P[a][2] + P[b][2] + P[cc][2]) / 3), c)
        ids = (a, b, cc) if dot(cross(sub_(P[b], P[a]), sub_(P[cc], P[a])), o) > 0 else (a, cc, b)
        m.f.append([base + i for i in ids]); m.smooth.append(True)
        for i in ids: m.uv.append((P[i][0] + P[i][1] * .35, P[i][2] + P[i][1] * .35))
def euler_dir(rx, ry, rz, v):
    """world/s4.js rotation.set: three's XYZ euler, applied to a vector."""
    x, y, z = v
    c, s = math.cos(rz), math.sin(rz); x, y = x * c - y * s, x * s + y * c
    c, s = math.cos(ry), math.sin(ry); x, z = x * c + z * s, -x * s + z * c
    c, s = math.cos(rx), math.sin(rx); y, z = y * c - z * s, y * s + z * c
    return (x, y, z)
def girder(S, a, b, w=.3, seed=1, torn=True):
    """A riveted angle-iron spar between two points, on the previz spar's line, ends torn off."""
    H, iron = S['hull_wreck'], S['iron']
    A, B = Vector(a), Vector(b)
    d = (B - A).normalized(); u = d.cross(Vector((0, 0, 1))).normalized() if abs(d.z) < .9 else Vector((1, 0, 0)); v = d.cross(u).normalized()
    L = (B - A).length; n = max(2, int(L / .8))
    rr = random.Random(seed)
    rows = []
    for i in range(n + 1):
        t = i / n
        c = A + (B - A) * t + (u * (rr.random() - .5) + v * (rr.random() - .5)) * .012
        w_ = w * (.6 + .4 * rr.random() if (i == 0 or i == n) and torn else 1)
        rows.append((c + u * w_ * .5 + v * w_ * .5, c + u * w_ * .5 - v * w_ * .5, c - u * w_ * .5 - v * w_ * .5, c - u * w_ * .5 + v * w_ * .5, c + u * (w_ * .5 - w * .16) + v * (w_ * .5 - w * .16)))
    # an H: two flanges and a web
    for i in range(n):
        a0, a1 = rows[i], rows[i + 1]
        for q, r_ in (((a0[0], a0[1], a1[1], a1[0]), u), ((a0[3], a0[2], a1[2], a1[3]), -u)):
            H.poly([tuple(p) for p in q], ref=tuple(r_))
            H.poly([tuple(p - r_ * w * .08) for p in q], ref=tuple(-r_))
        m0, m1 = (A + (B - A) * (i / n)), (A + (B - A) * ((i + 1) / n))
        for sg in (1, -1):
            H.poly([tuple(m0 + u * w * .42), tuple(m0 - u * w * .42), tuple(m1 - u * w * .42), tuple(m1 + u * w * .42)], ref=tuple(v * sg))
    k = .15
    while k < L - .1:
        for s_ in (-1, 1):
            p = A + d * k + u * w * .5 * s_ + v * w * .28
            rivet(iron, tuple(p), tuple(u * s_), r=.03, h=.016)
            p = A + d * k + u * w * .5 * s_ - v * w * .28
            rivet(iron, tuple(p), tuple(u * s_), r=.03, h=.016)
        k += .32
def build_seabed():
    S = Set()
    fine_x = [-14 + i * .5 for i in range(int((32 + 14) / .5) + 1)]
    fine_z = [-36 + i * .5 for i in range(int((22 + 36) / .5) + 1)]
    xs = [-150, -110, -80, -60, -45, -34, -26, -20, -17] + fine_x + [35, 39, 44, 50, 58, 68, 80, 100, 125, 150]
    zs = [-150, -115, -90, -72, -60, -50, -44, -40, -38] + fine_z + [24, 27, 31, 36, 42, 50, 62, 80, 110, 150]
    S['sand'].grid(lambda x, z: (x, sand_h(x, z), z), xs, zs, (0, 1, 0), uvfn=lambda x, z: (x, z))
    # the previz spars, on their lines
    def line(cx, cy, cz, half, rot):
        d = euler_dir(*rot, (0, half, 0)) if abs(rot[2]) >= 0 and half > 0 else None
        return (cx - d[0], cy - d[1], cz - d[2]), (cx + d[0], cy + d[1], cz + d[2])
    a, b = line(-1.5, 3, -10.4, 3, (0, 0, .5)); girder(S, a, b, .34, 1)
    a, b = line(-.4, 2.5, -11.4, 2.5, (.3, 0, .9)); girder(S, a, b, .28, 2)
    d = euler_dir(0, .4, .35, (1.5, 0, 0)); c = (.6, 2.71, -11)
    girder(S, (c[0] - d[0], c[1] - d[1], c[2] - d[2]), (c[0] + d[0], c[1] + d[1], c[2] + d[2]), .24, 3)
    # the loop of cable that snags him, same place: thicker near the bottom, it hangs
    ax = euler_dir(.2, .5, 0, (0, 0, 1))
    torus(S['iron'], (.9, 2.5, -10.9), ax, .8, .05, seg=22, sides=6)
    # more wreck behind that line, never in front of it: ribs standing out of the sand, a bent plate, hanging cable
    # (diver 2 walks off from (.5, -9.1) to (6, -20) at 29.2 s: everything stays either side of that line)
    # (and from (6, -20) to (4.2, -8.4) at 24.3 s, so that side of the wreck stops at x 1.5, the far side starts at x 6.5)
    for x, z, h, lean, sd in ((-.5, -13.2, 5.2, -.35, 11), (.75, -14.6, 4.2, -.2, 12), (7, -13.2, 3.2, .3, 13), (-2.6, -13, 6.5, -.5, 14), (7.4, -16.4, 2.2, .55, 15)):
        girder(S, (x, -.2, z), (x + lean * h, h, z - .15 * h), .22, sd)
    girder(S, (-1.9, 4.6, -13.3), (.9, 3.7, -14.6), .2, 16)
    girder(S, (-2.3, 3.2, -13.2), (1.0, 2.4, -14.8), .18, 17)
    sagging(S['iron'], (-1.3, 4.9, -11.2), (.8, 3.6, -14.3), .7, .03, n=9)
    sagging(S['iron'], (-.9, 3.7, -11.4), (1.3, 2.3, -11.6), .9, .03, n=9)
    # torn plate sheets on the ribs
    H = S['hull_wreck']
    def sheet(c, w, h, nrm, seed):
        a, u, v = basis(nrm)
        rr = random.Random(seed)
        us = [-1 + 2 * i / 5 for i in range(6)]; vs = [-1 + 2 * i / 4 for i in range(5)]
        def f(s, t):
            bend = .22 * math.sin(s * 1.7 + seed) + .14 * math.cos(t * 2.1 + seed)
            return tuple(c[i] + u[i] * s * w + v[i] * t * h + a[i] * bend for i in range(3))
        H.grid(f, us, vs, a, uvfn=lambda s, t: (s * w, t * h)); H.grid(f, us, vs, tuple(-x for x in a), uvfn=lambda s, t: (s * w, t * h))
    sheet((.05, 1.2, -13.7), 1.05, 1.1, (.1, .2, 1), 3); sheet((-1.3, 3.8, -13.9), .9, .8, (-.1, -.1, 1), 4); sheet((7.7, .7, -12.2), 1.1, .7, (-.2, .5, 1), 5)
    # boulders where the camera's backgrounds are: behind the wreck, out past the divers, a low reef closing the view each way
    rk = S['rock']
    for x, z, r, sd in ((8, -14, 1.6, 1), (11.5, -18, 2.4, 2), (15, -22, 3.2, 3), (6, -24, 2.6, 4), (-1, -24, 3.4, 5), (22, -16, 2.6, 6), (26, -7, 2.2, 7), (28, 3, 3, 8), (25, 13, 2.6, 9), (7, -32, 5, 10), (20, -31, 6, 11), (-9, -33, 6, 12), (33, -18, 6.5, 13), (36, 8, 7, 14), (30, 25, 6, 15), (10, 30, 5.5, 16), (-5, 34, 6, 17), (5.5, 13.5, 1.1, 18), (15.5, 8, 1.2, 19), (21, -1.5, 1.3, 20), (7.5, 5.5, .6, 21), (4.8, -3.2, .55, 22), (11, -11.5, .8, 23)):
        boulder(rk, (x, sand_h(x, z) - r * .18, z), r, sd)
    return S

# ---------------------------------------------------------------------------------------------------------------- SHIPS (group frame as world/s4.js ship(): along x, bow +x, deck y 0)
def half_beam(x):
    if x <= -34: return 5 * math.sqrt(max(0, 1 - ((-34 - x) / 6.2) ** 2))
    if x <= 22: return 5.0
    t = (x - 22) / 24      # quadratic as the previz outline: (22, 5) ctrl (36, 3) to (46, 0)
    u = t
    return (1 - u) ** 2 * 5 + 2 * u * (1 - u) * 3 + 0
def sheer(x): return 0 if x <= 20 else 2.5 * ((x - 20) / 26) ** 1.5
BOTTOM = -10.6
def hull_pt(x, f, sd):
    """f 0 at the deck edge, 1 at the bottom."""
    y0 = sheer(x); y = y0 + (BOTTOM - y0) * f
    rake = 7.5 * f * smooth01(26, 46, x)
    flare = 1 - .22 * f ** 2 - .35 * f * smooth01(30, 46, x)
    return (x - rake, y, sd * half_beam(x) * flare)
def build_ship(kind):
    S = Set()
    PAINT, iron, blk, W = S['ship_paint'], S['iron'], S['black'], S['white_paint']
    D = S['deck_wood']
    st = [-40.2, -40, -39.5, -38.5, -37, -35, -33, -30] + [-27 + 3 * i for i in range(16)] + [24, 26, 28, 30, 32, 34, 36, 38, 40, 41.5, 43, 44.5, 45.5, 46]
    fs = [0, .03, .1, .22, .36, .5, .62, .74, .86, 1]
    for sd in (1, -1):
        PAINT.grid(lambda x, f: hull_pt(x, f * .86, sd), st, fs, (0, 0, sd), uvfn=lambda x, f: (x, -9 * f))
        S['boot_red'].grid(lambda x, f: hull_pt(x, .86 + .14 * f, sd), st, [0, .5, 1], (0, 0, sd), uvfn=lambda x, f: (x, f))
        # strake laps on the side: thin raised bands + rivets where the camera climbs her side
        for j, f in enumerate((.1, .24, .38, .52, .66, .8)):
            PAINT.grid(lambda x, q: tuple(a + b for a, b in zip(hull_pt(x, f + q * .012, sd), (0, 0, sd * .025))), [-34 + 3 * i for i in range(19)], [0, 1], (0, 0, sd), uvfn=lambda x, q: (x, q), smooth=False)
            if sd == 1:
                x = -10.0
                while x < 18:
                    p = hull_pt(x, f, sd)
                    rivet(iron, (p[0], p[1] - .03, p[2] + .025), (0, -.1, 1), r=.05, h=.024)
                    x += .4
        # butts
        for x in [-30 + 4 * i for i in range(13)]:
            PAINT.grid(lambda q, f: tuple(a + b for a, b in zip(hull_pt(x + q, f, sd), (0, 0, sd * .02))), [-.07, .07], [0, .2, .4, .6, .86], (0, 0, sd), uvfn=lambda q, f: (q, f * 9), smooth=False)
        # rubbing strake under the deck edge, and the portholes
        tube(iron, [hull_pt(x, .03, sd)[:2] + (sd * (half_beam(x) * 1.0 + .06),) for x in [-34 + 4 * i for i in range(14)] + [20, 24, 28, 32, 36, 40, 44]], .07, sides=5, caps=False)
        for x in [-27 + 3.1 * i for i in range(15)]:
            p = hull_pt(x, .26, sd)
            torus(S['brass'], (p[0], p[1], p[2] + sd * .02), (0, 0, sd), .24, .035, seg=12, sides=4)
            blk.poly([(p[0] + .23 * math.cos(k * TAU / 10), p[1] + .23 * math.sin(k * TAU / 10), p[2] + sd * .024) for k in range(10)], ref=(0, 0, sd))
    # the transom: closes the stern at x -40 (half_beam goes to 0 there), keel line, stem bar
    tube(iron, [hull_pt(x, 0.0, 1)[:2] + (0,) for x in [46]] + [(46 - 7.5 * f, 2.5 + (BOTTOM - 2.5) * f, 0) for f in (.2, .5, .8, 1)], .13, sides=6)
    # the deck: exact y 0 up to x 20, then the sheer. Margin plank + waterway
    us = st[1:] if False else st
    # Flow's planks run along v, so v runs along the ship; the planks themselves are in the picture
    D.grid(lambda x, f: (x, sheer(x), f * half_beam(x) * .985), us, [-1, -.5, 0, .5, 1], (0, 1, 0), uvfn=lambda x, f: (f * 5, x), smooth=False)
    for sd in (1, -1):
        tube(iron, [(x, sheer(x) + .02, sd * half_beam(x) * .985) for x in us[3:-1]], .045, sides=4, caps=False)
    # bulwark at the forecastle: a plate from x 20 to the stem, rail on top
    for sd in (1, -1):
        xs = [20 + 2 * i for i in range(13)]
        for a, b in zip(xs, xs[1:]):
            ya, yb = sheer(a), sheer(b); za, zb = sd * half_beam(a) * .99, sd * half_beam(b) * .99
            PAINT.poly([(a, ya, za), (b, yb, zb), (b, yb + 1.1, zb), (a, ya + 1.1, za)], ref=(0, 0, sd))
            PAINT.poly([(a, ya, za - sd * .05), (b, yb, zb - sd * .05), (b, yb + 1.1, zb - sd * .05), (a, ya + 1.1, za - sd * .05)], ref=(0, 0, -sd))
            PAINT.poly([(a, ya + 1.1, za), (b, yb + 1.1, zb), (b, yb + 1.1, zb - sd * .05), (a, ya + 1.1, za - sd * .05)], ref=(0, 1, 0))
        # hawse pipe + anchor on the bow, seen from dead ahead
        p = hull_pt(36, .16, sd)
        torus(iron, (p[0], p[1], p[2] + sd * .04), (0, 0, sd), .36, .09, seg=12, sides=5)
        blk.poly([(p[0] + .34 * math.cos(k * TAU / 10), p[1] + .34 * math.sin(k * TAU / 10), p[2] + sd * .05) for k in range(10)], ref=(0, 0, sd))
        cyl(iron, (p[0], p[1] - .3, p[2] + sd * .1), (p[0] - .2, p[1] - 2.2, p[2] + sd * .1), .1, sides=6)
        cyl(iron, (p[0] - .95, p[1] - 2.0, p[2] + sd * .1), (p[0] + .55, p[1] - 2.4, p[2] + sd * .1), .1, sides=6)
    # railings (previz: x -36..20 at z 4.8, 3 D spacing, wires at .75 and 1.3). Rescue: port side open at x 7..18, the diving station
    for sd in (1, -1):
        rx = [x for x in range(-36, 21, 3)]
        z = sd * 4.8
        runs, cur = [], []
        for x in rx:
            if kind == 'rescue' and sd == -1 and 7 <= x <= 18:
                if cur: runs.append(cur); cur = []
                continue
            cyl(iron, (x, 0, z), (x, 1.35, z), .05, sides=6)
            cyl(iron, (x, 0, z), (x, .06, z), .1, sides=6)
            cur.append(x)
        if cur: runs.append(cur)
        for r in runs:
            if len(r) < 2: continue
            cyl(iron, (r[0], 1.3, z), (r[-1], 1.3, z), .035, sides=5)
            cyl(iron, (r[0], .75, z), (r[-1], .75, z), .022, sides=4)
    # ---- the house (previz: 12 x 5.4 x 6 at z -1.6, bridge 10 x 3 x 5 above, roof .3 with overhang)
    box(W, -6, 6, 0, 5.4, -4.6, 1.4, b=.05)
    box(W, -5, 5, 5.4, 8.4, -4.1, .9, b=.05)
    box(blk, -5.3, 5.3, 8.4, 8.7, -4.4, 1.2, b=.04)
    box(iron, -6.1, 6.1, 0, .22, -4.7, 1.5, b=.02)
    for x in [-5 + 2 * i for i in range(6)]:
        box(W, x - .05, x + .05, .1, 5.3, 1.4, 1.46, b=.012)
    for x in [-5.5 + .5 * i for i in range(23)]:
        for y in (.32, 5.25):
            rivet(iron, (x, y, 1.4), (0, 0, 1), r=.04, h=.02)
        for y in (.32, 5.25):
            rivet(iron, (x, y, -4.6), (0, 0, -1), r=.04, h=.02)
    # a door and portholes on the camera side, away from the skipper's head; the same on the front
    box(iron, -2.1, -.7, .05, 3.6, 1.4, 1.5, b=.02); box(W, -2.0, -.8, .12, 3.5, 1.45, 1.54, b=.015)
    cyl(S['brass'], (-1, 1.8, 1.5), (-1, 1.8, 1.64), .06, sides=8)
    for x, y in ((1.15, 3.95), (4.95, 3.95), (-4.2, 3.95)):
        torus(S['brass'], (x, y, 1.42), (0, 0, 1), .3, .045, seg=14, sides=5)
        blk.poly([(x + .28 * math.cos(k * TAU / 12), y + .28 * math.sin(k * TAU / 12), 1.43) for k in range(12)], ref=(0, 0, 1))
    for z in (-3.4, -1.6, .2):
        torus(S['brass'], (6.02, 3.4, z), (1, 0, 0), .3, .045, seg=14, sides=5)
        blk.poly([(6.03, 3.4 + .28 * math.sin(k * TAU / 12), z + .28 * math.cos(k * TAU / 12)) for k in range(12)], ref=(1, 0, 0))
    # the wall behind the skipper (x 1.8 .. 4.6 in frame, his head at x 3, y 2.55): low pipe, fire buckets on a rack, a tall steam pipe and a hose reel beside his head, never behind it
    if kind != 'rescue':
        cyl(iron, (-6, 1.05, 1.54), (6, 1.05, 1.54), .05, sides=6, caps=False)
        for x in (-4, -1, 2, 5): box(iron, x - .03, x + .03, .98, 1.12, 1.4, 1.6, b=.006)
        box(iron, 1.25, 2.3, 1.22, 1.28, 1.44, 1.66, b=.008)
        for k in range(3):
            x_ = 1.45 + k * .34
            tube(S['boot_red'], [(x_, 1.28, 1.56), (x_, 1.55, 1.56), (x_, 1.62, 1.56)], [.11, .14, .145], sides=10, caps=True)
            torus(iron, (x_, 1.62, 1.56), (0, 1, 0), .145, .012, seg=10, sides=3)
        cyl(S['pipe_steel'], (4.22, .05, 1.56), (4.22, 5.35, 1.56), .06, sides=7, caps=False)
        for y in (.9, 2.5, 4.3): flange(iron, (4.22, y, 1.56), (0, 1, 0), .1, .04)
        for k in range(5):
            torus(S['canvas'], (4.82, 1.5, 1.62 + k * .05), (0, 0, 1), .3 - k * .012, .035, seg=14, sides=4)
        cyl(iron, (4.82, 1.5, 1.4), (4.82, 1.5, 1.92), .04, sides=6)
    # bridge windows on both sides and the front; previz panes kept at y 6.2 on the +z side
    for i in range(-2, 3):
        box(blk, i * 2 - .55, i * 2 + .55, 5.65, 6.75, .88, .96, b=.01)
        box(blk, i * 2 - .55, i * 2 + .55, 5.65, 6.75, -4.16, -4.08, b=.01)
    for z in (-3.1, -1.6, -.1):
        box(blk, 4.98, 5.06, 5.65, 6.75, z - .6, z + .6, b=.01)
    # bridge wings: a walkway across at y 5.4 with its rail, on stanchions outside the frame
    box(D, -5, 5, 5.3, 5.42, .9, 3.1, b=.012)
    box(D, 4.9, 5.9, 5.3, 5.42, -5.6, 3.1, b=.012) if False else None
    for x in (-5, -2.5, 0, 2.5, 5):
        cyl(iron, (x, 5.42, 3.05), (x, 6.5, 3.05), .035, sides=5)
    cyl(iron, (-5, 6.45, 3.05), (5, 6.45, 3.05), .03, sides=5); cyl(iron, (-5, 5.95, 3.05), (5, 5.95, 3.05), .02, sides=4)
    for x in (-5.45, 5.45):
        cyl(iron, (x, 0, 3.0), (x, 5.3, 3.0), .06, sides=6)
    box(iron, -5.5, 5.5, 5.2, 5.3, 2.96, 3.04, b=.008)
    # ladder up the house's forward corner
    for k in range(13):
        cyl(iron, (6.1, .4 * (k + 1), 1.1), (6.1, .4 * (k + 1), .55), .025, sides=4)
    cyl(iron, (6.1, 0, 1.12), (6.1, 5.4, 1.12), .03, sides=4); cyl(iron, (6.1, 0, .53), (6.1, 5.4, .53), .03, sides=4)
    # searchlight + compass + a vent on top of the bridge
    tube(iron, [(1.5, 8.7, -1.6), (1.5, 9.2, -1.6)], .08, sides=6)
    tube(iron, [(1.0, 9.5, -1.6), (1.4, 9.5, -1.6), (1.9, 9.5, -1.6), (2.15, 9.5, -1.6)], [.3, .42, .46, .42], sides=14)
    tube(W, [(-2.5, 8.7, -2.5), (-2.5, 9.6, -2.5)], .3, sides=10)
    # funnels: the previz one at x -9, a sister aft of it: she reads as a four-stacker's cousin
    fun = [(-9, 0), (-16, 0)] if kind != 'rescue' else [(-9, 0)]
    for fx, fzz in fun:
        z_ = -1.0
        tube(blk, [(fx, 2.2, z_), (fx, 8.6, z_)], [1.32, 1.12], sides=20)
        torus(W, (fx, 7.4, z_), (0, 1, 0), 1.16, .05, seg=20, sides=4)
        torus(iron, (fx, 8.55, z_), (0, 1, 0), 1.12, .06, seg=20, sides=4)
        for a in (0.7, 2.3, 4.0, 5.4):
            cyl(iron, (fx + 1.1 * math.cos(a), 7.8, z_ + 1.1 * math.sin(a)), (fx + 3.6 * math.cos(a), 0, z_ + 3.6 * math.sin(a)), .018, sides=3, caps=False)
    box(W, -21, -7.5, 0, 2.2, -3.6, 1.6, b=.04)
    # ventilator cowls
    for vx, vz in ((-5.5, 3.1), (-12, 3.3), (-19, 3.2), (-25, -3.2), (9.5, -3.3)):
        if kind == 'rescue' and vx > 7: continue
        tube(W, [(vx, 0, vz), (vx, 1.5, vz), (vx, 1.95, vz + .05), (vx, 2.2, vz + .35), (vx, 2.3, vz + .6)], [.2, .2, .25, .38, .46], sides=10, caps=False)
    # mast (previz x 6.5 z -1), topmast, yard, stays. Rear mast aft
    tube(blk, [(6.5, -.2, -1), (6.5, 12.5, -1)], [.2, .13], sides=8)
    tube(blk, [(6.5, 12.3, -1), (6.5, 16, -1)], [.09, .04], sides=6)
    cyl(blk, (6.5, 11.3, -3.4), (6.5, 11.3, 1.4), .05, sides=5)
    box(iron, 6.0, 7.0, 9.8, 10.1, -1.5, -.5, b=.02)
    for z_ in (-4.8, 2.8):
        cyl(iron, (6.5, 11.3, -1), (6.5, 0, z_), .018, sides=3, caps=False)
    cyl(iron, (6.5, 11.8, -1), (22, .2, 0), .018, sides=3, caps=False)
    cyl(iron, (6.5, 15.5, -1), (43, sheer(43) + 1.1, 0), .014, sides=3, caps=False)
    tube(blk, [(-28, 0, -1), (-28, 11, -1)], [.15, .08], sides=7)
    cyl(iron, (-28, 10.5, -1), (6.5, 15, -1), .014, sides=3, caps=False)
    cyl(iron, (-28, 10.5, -1), (-39, .4, 0), .014, sides=3, caps=False)
    # forecastle: windlass, chain, capstan, jack staff
    fy = sheer(31)
    tube(iron, [(31, fy, 0), (31, fy + .5, 0), (31, fy + .9, 0)], [.5, .34, .5], sides=12)
    for sd in (1, -1):
        cyl(iron, (29, sheer(29) + .55, sd * .4), (29, sheer(29) + .55, sd * 1.6), .28, sides=10)
        sagging(iron, (29.4, sheer(29) + .6, sd * 1.0), (35.6, sheer(36) + .1, sd * 2.4), .1, .05, n=5, sides=4)
    cyl(iron, (45.2, sheer(45) + .8, 0), (46.2, sheer(45) + 3.4, 0), .035, sides=4)
    # hatch coaming, bollards, life boats on davits
    if kind != 'rescue':
        box(D, 9.5, 13, 0, .45, -2.2, 1.0, b=.03); box(S['canvas'], 9.6, 12.9, .45, .55, -2.1, .9, b=.03)
        # the gun on the foredeck
        tube(iron, [(16.5, 0, 0), (16.5, .3, 0), (16.5, 1.3, 0)], [.5, .3, .22], sides=10)
        box(iron, 16.1, 16.9, 1.2, 1.7, -.3, .3, b=.03)
        cyl(iron, (16.6, 1.5, 0), (19.6, 1.72, 0), .08, sides=8)
        box(iron, 15.7, 16.0, .9, 1.9, -.55, .55, b=.02)
    for x in (-32, 18):
        for sd in (1, -1):
            if kind == 'rescue' and x == 18: continue
            cyl(iron, (x, 0, sd * 3.9), (x, .55, sd * 3.9), .16, sides=8); cyl(iron, (x + .7, 0, sd * 3.9), (x + .7, .55, sd * 3.9), .16, sides=8)
    for bx, sd in ((-24, 1), (-24, -1), (-13, -1)):
        z0 = sd * 3.7
        tube(W, [(bx - 3, 3.0, z0), (bx - 2.3, 2.75, z0), (bx - 1, 2.6, z0), (bx + 1, 2.6, z0), (bx + 2.3, 2.75, z0), (bx + 3, 3.05, z0)], [.08, .5, .7, .7, .5, .08], sides=10)
        box(S['canvas'], bx - 2.2, bx + 2.2, 3.1, 3.2, z0 - .55, z0 + .55, b=.03)
        for dv in (-2.6, 2.6):
            pipe_run(iron, [(bx + dv, 0, sd * 3.1), (bx + dv, 4.2, sd * 3.1), (bx + dv, 4.6, z0)], .05, bend=.3, sides=5)
            cyl(iron, (bx + dv, 4.5, z0), (bx + dv * .9, 3.1, z0), .012, sides=3, caps=False)
    box(W, -36, -28.5, 0, 2.3, -3, 3, b=.04)
    # ---- rescue ship: the diving station. Everything low behind the two men or out of the frame, and the lane from the port gap clear
    if kind == 'rescue':
        # winch forward of the station, big enough to read in the wide
        wx, wz = 5.5, -.5
        box(iron, wx - .9, wx + .9, 0, .25, wz - 1.2, wz + 1.2, b=.03)
        for sg in (-1, 1): box(S['steel_paint'], wx - .55, wx + .55, .25, 1.4, wz + sg * 1.05 - .06, wz + sg * 1.05 + .06, b=.015)
        tube(S['pipe_steel'], [(wx, .85, wz - 1.0), (wx, .85, wz + 1.0)], .4, sides=12)
        for k in range(9): torus(S['rope'], (wx, .85, wz - .9 + k * .22), (0, 0, 1), .44, .05, seg=14, sides=4)
        cyl(iron, (wx, .85, wz - 1.1), (wx, .85, wz - 1.6), .08, sides=6); cyl(iron, (wx, .85, wz - 1.6), (wx + .5, 1.2, wz - 1.6), .05, sides=5)
        # the derrick behind the men: post at the frame's far edge, the boom crossing high over both heads against the sky, block and fall hanging clear of them.
        # In the shot +x is frame left: the diver (x 13.8) is left, the Navy man (x 12) right. Heads top out at y 3.3; the boom stays above y 4.6 between them.
        dx, dz = 15.8, 4.4
        tube(S['steel_paint'], [(dx, 0, dz), (dx, 9.5, dz)], [.2, .1], sides=10)
        box(iron, dx - .32, dx + .32, 0, .1, dz - .32, dz + .32, b=.02)
        for k in range(8): rivet(iron, (dx + .26 * math.cos(k * TAU / 8), .1, dz + .26 * math.sin(k * TAU / 8)), (0, 1, 0), r=.03, h=.02)
        hd = (9.9, 6.7, 4.5)
        tube(S['steel_paint'], [(dx - .1, 4.5, dz), ((dx + hd[0]) / 2, (4.5 + hd[1]) / 2, dz + .05), hd], [.07, .13, .06], sides=8)
        cyl(iron, (dx, 9.3, dz), hd, .02, sides=3, caps=False)
        cyl(iron, (dx, 8.9, dz), (dx + 3, 0, 4.7), .02, sides=3, caps=False)
        cyl(iron, hd, (hd[0], 5.05, hd[2]), .018, sides=3, caps=False); cyl(iron, (hd[0] + .08, 6.65, hd[2]), (hd[0] + .08, 5.05, hd[2]), .018, sides=3, caps=False)
        tube(iron, [(hd[0] + .04, 5.1, hd[2]), (hd[0] + .04, 4.95, hd[2]), (hd[0] + .04, 4.72, hd[2]), (hd[0] + .04, 4.58, hd[2])], [.05, .13, .13, .05], sides=8)
        torus(iron, (hd[0] + .04, 4.46, hd[2]), (0, 0, 1), .1, .024, seg=10, sides=4, a0=-1, a1=TAU * .7)
        # the air hose looped over the boom, down to the rail right of the Navy man's head: the line of the hose is what says "diving"
        sagging(S['rope'], (10.9, 6.3, 4.55), (10.1, 1.3, 4.68), .22, .035, n=10)
        # hose + rope coils low on the deck between and beside the men, a rail hung with hose
        torus(S['rope'], (12.9, .08, 4.15), (0, 1, 0), .42, .07, seg=16, sides=5); torus(S['rope'], (12.9, .2, 4.15), (0, 1, 0), .36, .07, seg=16, sides=5); torus(S['rope'], (12.9, .32, 4.15), (0, 1, 0), .3, .06, seg=16, sides=5)
        torus(S['rope'], (14.9, .08, 3.95), (0, 1, 0), .38, .06, seg=16, sides=5); torus(S['rope'], (14.9, .19, 3.95), (0, 1, 0), .34, .06, seg=16, sides=5)
        for x0, x1 in ((13.2, 14.8), (9.6, 10.9)):
            sagging(S['rope'], (x0, 1.3, 4.72), (x1, 1.3, 4.72), .55, .035, n=8)
            sagging(S['rope'], (x0 + .2, 1.3, 4.66), (x1 - .1, 1.3, 4.66), .75, .03, n=8)
        # air flasks on a rack against the rail, between the key and the pump
        for k in range(3):
            x_ = 11.15 + k * .3
            tube(S['pipe_steel'], [(x_, .02, 4.45), (x_, .1, 4.45), (x_, .9, 4.45), (x_, 1.02, 4.45), (x_, 1.08, 4.45)], [.05, .13, .13, .08, .03], sides=9)
        box(iron, 11.0, 11.85, .55, .6, 4.28, 4.33, b=.006); cyl(iron, (11.0, 0, 4.3), (11.0, .6, 4.3), .018, sides=4); cyl(iron, (11.85, 0, 4.3), (11.85, .6, 4.3), .018, sides=4)
        # the air pump on its skid, beside the Navy man's key: wheels both sides
        px, pz = 10.55, 4.05
        box(S['wood'], px - .55, px + .55, 0, .12, pz - .34, pz + .34, b=.015)
        box(S['wood'], px - .42, px + .42, .12, 1.05, pz - .28, pz + .28, b=.02)
        for sg in (-1, 1):
            torus(iron, (px + sg * .5, .86, pz), (1, 0, 0), .4, .03, seg=16, sides=4)
            cyl(iron, (px + sg * .5, .86, pz - .36), (px + sg * .5, .86, pz + .36), .02, sides=4)
            cyl(iron, (px + sg * .5, .86, pz), (px, .86, pz), .03, sides=5)
        # the ladder over the side at the open rail, and a shot line
        for sg in (-1, 1): cyl(iron, (8.3 + sg * .45, 1.0, -4.98), (8.3 + sg * .45, -7.5, -5.2), .04, sides=4)
        for k in range(16): cyl(iron, (7.85, .4 - k * .5, -5.0 - k * .012), (8.75, .4 - k * .5, -5.0 - k * .012), .022, sides=3)
    return S

# ---------------------------------------------------------------------------------------------------------------- THE RUM RUNNER (zone coordinates: add (400, 0, -400)). Bow +x. Deck y 0, she floats at y -1.4 (previz box 16 x 2.2 x 6)
def boat_beam(x):
    t = (x + 8) / 16
    if x > 3: return 3.0 * math.sqrt(max(0, 1 - ((x - 3) / 5.3) ** 2))
    if x < -6.5: return 3.0 - .35 * (-6.5 - x) / 1.5
    return 3.0
def build_boat():
    S = Set()
    HL, DK, iron, W = S['hull_wood'], S['deck_wood'], S['iron'], S['white_paint']
    st = [-8, -7.5, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 6.8, 7.4, 7.9, 8.2]
    fs = [0, .2, .4, .6, .8, 1]
    def bp(x, f, sd):
        y = .35 * smooth01(1, 8, x) ** 1.4 + (-2.2 - .35 * smooth01(1, 8, x) ** 1.4) * f
        return (x - 1.2 * f * smooth01(3, 8, x), y, sd * boat_beam(x) * (1 - .3 * f * f))
    for sd in (1, -1):
        HL.grid(lambda x, f: bp(x, f, sd), st, fs, (0, 0, sd), uvfn=lambda x, f: (x, -2.2 * f))
        # lapped planks: raised bands
        for f in (.12, .28, .44, .6, .76):
            HL.grid(lambda x, q: tuple(a + b for a, b in zip(bp(x, f + q * .03, sd), (0, 0, sd * .018))), st[1:-1], [0, 1], (0, 0, sd), uvfn=lambda x, q: (x, q), smooth=False)
        # bulwark: low plank wall, cap rail
        xs = st[1:-1]
        for a, b in zip(xs, xs[1:]):
            pa, pb = bp(a, 0, sd), bp(b, 0, sd)
            HL.poly([pa, pb, (pb[0], pb[1] + .48, pb[2]), (pa[0], pa[1] + .48, pa[2])], ref=(0, 0, sd))
            HL.poly([(pa[0], pa[1], pa[2] - sd * .06), (pb[0], pb[1], pb[2] - sd * .06), (pb[0], pb[1] + .48, pb[2] - sd * .06), (pa[0], pa[1] + .48, pa[2] - sd * .06)], ref=(0, 0, -sd))
        tube(S['wood'], [(x, bp(x, 0, sd)[1] + .5, bp(x, 0, sd)[2] - sd * .03) for x in xs], .05, sides=5, caps=False)
        for x in (-6, -3.5, -1, 1.5, 4):
            box(S['wood'], x - .05, x + .05, 0, bp(x, 0, sd)[1] + .48, bp(x, 0, sd)[2] - sd * .14 - .05, bp(x, 0, sd)[2] - sd * .14 + .05, b=.008)
    # the transom
    HL.poly([bp(-8, 0, 1), bp(-8, 0, -1), bp(-8, 1, -1), bp(-8, 1, 1)], ref=(-1, 0, 0))
    # deck planks (top y -.0 where the man stands, as in the previz top)
    for k, z in enumerate([-3 + .5 * i for i in range(12)]):
        x0 = -7.9; x1 = 4.6 + (1 - abs(z + .25) / 3) * 3
        DK.poly([(x0, 0, z + .012), (x1, 0, z + .012), (x1, 0, z + .488), (x0, 0, z + .488)], ref=(0, 1, 0), uv=[(z, x0), (z, x1), (z + .5, x1), (z + .5, x0)])
    DK.poly([(-8, -.03, -3), (8, -.03, -3), (8, -.03, 3), (-8, -.03, 3)], ref=(0, 1, 0))
    # the little deck house forward of the man, wheel inside, a stove pipe; a hatch and a mast
    box(W, 1.0, 4.4, 0, 2.5, -1.7, 1.7, b=.05)
    box(S['wood'], .85, 4.55, 2.5, 2.62, -1.85, 1.85, b=.03)
    for z, x in ((1.72, 1.7), (1.72, 3.5)):
        box(S['black'], x - .34, x + .34, 1.3, 2.05, z - .02, z + .02, b=.01)
    box(S['black'], .98, 1.02, 1.3, 2.05, -.5, .5, b=.01)
    tube(S['black'], [(2.2, 2.62, -.8), (2.2, 3.6, -.8)], .11, sides=7)
    box(S['wood'], -7, -5.2, 0, .32, -1.3, 1.3, b=.03)
    box(S['canvas'], -6.9, -5.3, .32, .42, -1.2, 1.2, b=.03)
    tube(S['wood'], [(5.4, 0, 0), (5.4, 7, 0)], [.12, .06], sides=7)
    cyl(S['wood'], (5.4, 4.4, 0), (1, 3.6, 0), .05, sides=5)
    cyl(iron, (5.4, 6.8, 0), (8, .5, 0), .012, sides=3, caps=False)
    cyl(iron, (5.4, 6.8, 0), (-7.8, .6, 0), .012, sides=3, caps=False)
    for sd in (1, -1): cyl(iron, (5.4, 5.8, 0), (4.8, .3, sd * 2.5), .012, sides=3, caps=False)
    # rope, a barrel on its side, a jerry can row by the stern, sacks
    torus(S['rope'], (-.4, .07, -2.3), (0, 1, 0), .4, .065, seg=14, sides=5); torus(S['rope'], (-.4, .19, -2.3), (0, 1, 0), .34, .06, seg=14, sides=5)
    tube(S['wood'], [(-6, .42, 2.2), (-5.7, .42, 2.2), (-5.3, .42, 2.2), (-4.9, .42, 2.2), (-4.6, .42, 2.2)], [.32, .4, .44, .4, .32], sides=12)
    torus(iron, (-5.7, .42, 2.2), (1, 0, 0), .405, .02, seg=12, sides=3); torus(iron, (-4.9, .42, 2.2), (1, 0, 0), .405, .02, seg=12, sides=3)
    return S

# ---------------------------------------------------------------------------------------------------------------- KIT: one root per asset, at the origin, local +y out of the surface it sits on
def build_kit():
    K = Set()
    # the whiskey crate: 1.1 D as the previz. Lid + rails, UV 0..1 on each big face for the label picture
    m = K['crate_whiskey']
    s = .55
    for ax, sg, ref in ((0, 1, (0, 0, 1)), (0, -1, (0, 0, -1))):
        z = s * sg
        m.poly([(-s, -s + s, z), (s, -s + s, z), (s, s + s, z), (-s, s + s, z)], ref=ref, uv=[(0, 0), (1, 0), (1, 1), (0, 1)])
    for sg in (1, -1):
        x = s * sg
        m.poly([(x, 0, -s), (x, 0, s), (x, 2 * s, s), (x, 2 * s, -s)], ref=(sg, 0, 0), uv=[(0, 0), (1, 0), (1, 1), (0, 1)])
    m.poly([(-s, 2 * s, -s), (s, 2 * s, -s), (s, 2 * s, s), (-s, 2 * s, s)], ref=(0, 1, 0), uv=[(0, 0), (1, 0), (1, 1), (0, 1)])
    for y in (.06, 1.04):
        box(K['crate_rail'], -s - .025, s + .025, y - .05, y + .05, -s - .025, s + .025, b=.01)
    for x in (-s, s):
        for z in (-s, s):
            box(K['crate_rail'], x - .05, x + .05, 0, 1.1, z - .05, z + .05, b=.01)
    # rocks
    for i, (name, sd) in enumerate((('rock_a', 31), ('rock_b', 37), ('rock_c', 41))):
        boulder(K[name], (0, 0, 0), .45 + i * .08, sd, flat=.55 + i * .1)
    # a barnacle patch: little cones on a low hump, local +y out of the hull
    bk = K['barnacle']
    r = random.Random(5)
    for i in range(10):
        a, d = r.random() * TAU, r.random() ** .6 * .3
        x, z = d * math.cos(a), d * math.sin(a)
        rr = .028 + r.random() * .036
        tube(bk, [(x, -.01, z), (x, rr * .9, z), (x, rr * 1.05, z)], [rr * 1.1, rr * .7, rr * .3], sides=5, caps=False, smooth=False)    # a cone, open at the top
    # a shard of plate, half buried, one torn edge
    sh = K['plate_shard']
    o = [(-.5, -.24), (-.1, -.34), (.4, -.28), (.55, .05), (.28, .22), (.32, .36), (-.05, .28), (-.32, .34), (-.46, .08)]
    for sg in (1, -1):
        sh.poly([(x, .16 * x + .1 + sg * .012 + .06 * math.sin(z * 6), z) for x, z in o], ref=(0, sg, 0))
    for k in range(5):
        p = o[k * 2 % len(o)]; rivet(sh, (p[0] * .75, .16 * p[0] * .75 + .115, p[1] * .75), (0, 1, 0), r=.03, h=.015)
    # a stub of rib
    rb = K['rib_stub']
    tube(rb, [(0, -.2, 0), (.05, .3, 0), (.2, .75, .03), (.42, 1.1, .05)], [.09, .08, .07, .03], sides=5)
    # debris on the torpedo room's deck: a nut + bolt heap, an oil can
    bb = K['bolt_heap']
    r = random.Random(8)
    for i in range(7):
        a, d = r.random() * TAU, r.random() * .13
        x, z = d * math.cos(a), d * math.sin(a)
        an = r.random() * 3
        cyl(bb, (x, .018, z), (x + .07 * math.cos(an), .02, z + .07 * math.sin(an)), .015, sides=5)
        cyl(bb, (x, .002, z), (x, .03, z), .028, sides=6)
    can = K['oil_can']
    tube(can, [(0, 0, 0), (0, .12, 0), (0, .17, 0), (0, .22, 0)], [.1, .1, .07, .018], sides=9)
    cyl(can, (0, .17, .05), (0, .33, .19), .012, sides=4, caps=False)
    torus(can, (0, .12, -.13), (1, 0, 0), .05, .008, seg=8, sides=3)
    # a clamp for the pipes, a loose rag lump
    cl = K['rag']
    tube(cl, [(-.13, .02, 0), (-.05, .05, .04), (.04, .06, -.01), (.13, .02, .03)], [.05, .075, .08, .04], sides=6)
    return K

# ---------------------------------------------------------------------------------------------------------------- SCATTER: real geometry nodes, built in code, read back from the evaluated instances
def helper_mesh(name, coll, verts, edges=()):
    me = bpy.data.meshes.new(name)
    me.from_pydata([to_blender(v) for v in verts], list(edges), [])
    me.update()
    ob = bpy.data.objects.new(name, me); coll.objects.link(ob)
    return ob

def make_scatter_group(name, cfg, helpers):
    ng = bpy.data.node_groups.new(name, 'GeometryNodeTree')
    ng.interface.new_socket('Geometry', in_out='INPUT', socket_type='NodeSocketGeometry')
    ng.interface.new_socket('Geometry', in_out='OUTPUT', socket_type='NodeSocketGeometry')
    N = ng.nodes.new; L = ng.links.new
    gi, go = N('NodeGroupInput'), N('NodeGroupOutput')
    seed = cfg['seed']
    def val(v):
        n = N('ShaderNodeValue'); n.outputs[0].default_value = v; return n.outputs[0]
    def op(o, a, b):
        n = N('ShaderNodeMath'); n.operation = o
        for i, x in enumerate((a, b)):
            if isinstance(x, (int, float)): n.inputs[i].default_value = x
            else: L(x, n.inputs[i])
        return n.outputs[0]
    def mr(v, a, b, c, d, smooth=False):
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
    def noise(scale, w):
        n = N('ShaderNodeTexNoise'); n.noise_dimensions = '4D'
        n.inputs['W'].default_value = w; n.inputs['Scale'].default_value = scale; n.inputs['Detail'].default_value = 2.0
        return n.outputs[0]
    def prox(ob, mode):
        info = N('GeometryNodeObjectInfo'); info.transform_space = 'RELATIVE'
        info.inputs['Object'].default_value = ob
        p = N('GeometryNodeProximity'); p.target_element = mode
        L(info.outputs['Geometry'], p.inputs[0])
        return p.outputs['Distance']
    terms = []
    if cfg.get('seam'):
        terms.append(op('MULTIPLY', op('POWER', mr(prox(helpers[cfg['seam']], 'EDGES'), 0, cfg['seamFall'], 1, 0), cfg.get('seamPow', 2)), cfg.get('seamW', 1)))
    if cfg.get('hot'):
        terms.append(op('MULTIPLY', op('POWER', mr(prox(helpers[cfg['hot']], 'POINTS'), 0, cfg['hotFall'], 1, 0), cfg.get('hotPow', 1.5)), cfg.get('hotW', 1)))
    st = terms[0] if terms else val(1)
    for t in terms[1:]: st = op('MAXIMUM', st, t)
    mask = op('ADD', st, cfg.get('amb', 0))
    if cfg.get('nL'): mask = op('MULTIPLY', mask, mr(noise(cfg['nL'][0], seed * 1.37), cfg['nL'][1], cfg['nL'][2], 0, 1, True))
    if cfg.get('nM'): mask = op('MULTIPLY', mask, mr(noise(cfg['nM'][0], seed * 2.11), cfg['nM'][1], cfg['nM'][2], cfg['nM'][3], 1, True))
    if cfg.get('band'):
        pos = N('GeometryNodeInputPosition'); sep = N('ShaderNodeSeparateXYZ'); L(pos.outputs[0], sep.inputs[0])
        b = cfg['band']
        mask = op('MULTIPLY', mask, mr(sep.outputs['Z'], b[0], b[1], 0, 1))
        mask = op('MULTIPLY', mask, mr(sep.outputs['Z'], b[2], b[3], 1, 0))
    dist = N('GeometryNodeDistributePointsOnFaces')
    L(gi.outputs[0], dist.inputs['Mesh'])
    dist.inputs['Seed'].default_value = seed
    L(op('MULTIPLY', mask, cfg['base']), dist.inputs['Density'])
    al = N('FunctionNodeAlignRotationToVector'); al.axis = 'Z'
    L(dist.outputs['Normal'], al.inputs['Vector'])
    rot = al.outputs[0]
    if cfg.get('upright'):
        al2 = N('FunctionNodeAlignRotationToVector'); al2.axis = 'Y'; al2.pivot_axis = 'Z'
        L(rot, al2.inputs['Rotation']); al2.inputs['Vector'].default_value = (0, 0, 1)
        rot = al2.outputs[0]
    spin = cfg.get('spin', 3.14159)
    if spin:
        com = N('ShaderNodeCombineXYZ'); L(rand(-spin, spin, seed + 5), com.inputs['Z'])
        e2r = N('FunctionNodeEulerToRotation'); L(com.outputs[0], e2r.inputs[0])
        rr_ = N('FunctionNodeRotateRotation'); rr_.rotation_space = 'LOCAL'
        L(rot, rr_.inputs['Rotation']); L(e2r.outputs[0], rr_.inputs['Rotate By'])
        rot = rr_.outputs[0]
    com = N('ShaderNodeCombineXYZ')
    w = rand(cfg['w'][0], cfg['w'][1], seed + 7)
    if cfg['kind'] == 'decal':
        L(w, com.inputs['X']); L(op('MULTIPLY', w, rand(cfg['aspect'][0], cfg['aspect'][1], seed + 11)), com.inputs['Y']); L(rand(cfg['alpha'][0], cfg['alpha'][1], seed + 13), com.inputs['Z'])
    else:
        L(w, com.inputs['X']); L(w, com.inputs['Y']); L(w, com.inputs['Z'])
    inst = N('GeometryNodeInstanceOnPoints')
    L(dist.outputs['Points'], inst.inputs['Points']); L(rot, inst.inputs['Rotation']); L(com.outputs[0], inst.inputs['Scale'])
    ci = N('GeometryNodeCollectionInfo'); ci.transform_space = 'ORIGINAL'
    ci.inputs['Collection'].default_value = cfg['coll']
    ci.inputs['Separate Children'].default_value = True; ci.inputs['Reset Children'].default_value = True
    L(ci.outputs[0], inst.inputs['Instance'])
    inst.inputs['Pick Instance'].default_value = True
    ri = N('FunctionNodeRandomValue'); ri.data_type = 'INT'
    ri.inputs['Min'].default_value, ri.inputs['Max'].default_value = 0, len(cfg['coll'].objects) - 1
    ri.inputs['Seed'].default_value = seed + 3
    L(ri.outputs['Value'], inst.inputs['Instance Index'])
    L(inst.outputs[0], go.inputs[0])
    return ng

def surf(name, S_build):
    m = MB(); S_build(m)
    return m.to_mesh(name)

R3 = __import__('mathutils').Matrix(((1, 0, 0), (0, 0, 1), (0, -1, 0)))     # blender -> three
R3T = R3.transposed()

TORP_LANES = [((-1.1, .95), .75), ((1.55, .3), .75), ((-3.25, .5), .65), ((.25, -2.7), .7), ((-2.8, -1.8), .75), ((2.3, 3.3), .7), ((.28, 1.34), .7), ((1.6, 1.8), .7), ((2.3, -3.3), .7), ((1.3, -3.0), .6)]
def seabed_clear(x, z, r):
    """Marks and walks stay clear; also the fall line (rocks are low, so only the floor lanes matter)."""
    pts = [(-.95, 1.2), (12, 3.4), (18, -5.6), (6, -20), (9, -5), (2.4, -8.7), (4.2, -8.4), (.5, -9.1), (1.45, -5)]
    for p in pts:
        if math.hypot(x - p[0], z - p[1]) < 1.1 + r: return False
    for a, b in (((9, -5), (2.4, -8.7)), ((2.4, -8.7), (-.95, 1.2)), ((6, -20), (4.2, -8.4)), ((4.2, -8.4), (.5, -9.1)), ((.5, -9.1), (6, -20)), ((12, 3.4), (12, 3.4))):
        dx, dz = b[0] - a[0], b[1] - a[1]; L2 = dx * dx + dz * dz or 1
        t = max(0, min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / L2))
        if math.hypot(x - a[0] - t * dx, z - a[1] - t * dz) < .8 + r: return False
    return True

def scatter_all(coll, kit_objs, places):
    hc = bpy.data.collections.new('helpers'); bpy.context.scene.collection.children.link(hc)
    sc = bpy.data.collections.new('scatter'); bpy.context.scene.collection.children.link(sc)
    dcol = {}
    for key, r in CELLS.items():
        c = bpy.data.collections.new('decals_' + key); hc.children.link(c); dcol[key] = c
        for i in r:
            me = bpy.data.meshes.new('dc_%02d' % i)
            me.from_pydata([(-.5, -.5, 0), (.5, -.5, 0), (.5, .5, 0), (-.5, .5, 0)], [], [(0, 1, 2, 3)]); me.update()
            ob = bpy.data.objects.new('dc_%02d' % i, me); c.objects.link(ob)
    kc = {}
    for name, ob in kit_objs.items():
        c = bpy.data.collections.new('k_' + name); hc.children.link(c); c.objects.link(ob); kc[name] = c
    # the surfaces and the seams, place by place. All in the glb's own coordinates.
    def hull_surface(m):
        ths = [-TH_MAX + 2 * TH_MAX * i / 44 for i in range(45)]; zs = [-5.9 + i * .5 for i in range(44)]
        m.grid(lambda th, z: hp(HR - .05, th, z), ths, zs, inward(ths[0]), smooth=False)
    def bulk_surface(m):
        m.grid(lambda x, y: (x, y, -5.93), [-5 + i * .5 for i in range(21)], [0 + i * .5 for i in range(16)], (0, 0, 1), smooth=False)
    def deck_surface(m):
        m.grid(lambda x, z: (x, 0, z), [-5 + i * .5 for i in range(21)], [-5.9 + i * .5 for i in range(44)], (0, 1, 0), smooth=False)
    def sub_surface(m):
        ths = [.1 + (2.75 - .1) * i / 26 for i in range(27)]; zs = [-27 + i for i in range(55)]
        m.grid(lambda th, z: sp(sub_r(z) + .05 - sub_dent(th, z), th, z), ths, zs, (1, 0, 0), smooth=False)
    def sand_surface(m):
        m.grid(lambda x, z: (x, sand_h(x, z), z), [-3 + i for i in range(36)], [-30 + i for i in range(50)], (0, 1, 0), smooth=False)
    def ship_side(m):
        for sd in (1, -1):
            m.grid(lambda x, f: tuple(a + b for a, b in zip(hull_pt(x, f, sd), (0, 0, sd * .04))), [-34 + 2 * i for i in range(28)], [0, .15, .3, .45, .6, .75, .86], (0, 0, sd), smooth=False)
    def ship_deck(m):
        m.grid(lambda x, z: (x, 0, z), [-20 + i for i in range(40)], [-4.6 + .92 * i for i in range(11)], (0, 1, 0), smooth=False)
    def boat_side(m):
        for sd in (1, -1):
            m.grid(lambda x, f: (x, -2.2 * f, sd * (3.03 - .9 * f * f)), [-7.5 + i for i in range(11)], [0, .25, .5, .75], (0, 0, sd), smooth=False)
    def house_face(m):
        m.grid(lambda x, y: (x, y, 1.46), [-6 + i * .5 for i in range(25)], [.1 + .44 * i for i in range(12)], (0, 0, 1), smooth=False)
    # seams and hot points
    N = HULL_STRAKES
    edges = [-TH_MAX + 2 * TH_MAX * i / N for i in range(N + 1)]
    v, e = [], []
    for th in edges[1:-1]:
        v += [hp(HR, th, -5.9), hp(HR, th, 15.9)]; e.append((len(v) - 2, len(v) - 1))
    for z in FRAMES:
        ths = [-TH_MAX + 2 * TH_MAX * i / 24 for i in range(25)]
        for a, b in zip(ths, ths[1:]):
            v += [hp(HR, a, z), hp(HR, b, z)]; e.append((len(v) - 2, len(v) - 1))
    H = dict(hull_seams=helper_mesh('h_hull_seams', hc, v, e))
    v = []
    for x, y in ((-1.5, 1.55), (1.5, 1.55), (-1.5, 3.95), (1.5, 3.95)):
        for k in range(10):
            a = k * TAU / 10
            v.append((x + 1.2 * math.cos(a), y + 1.2 * math.sin(a), -5.93))
    for x in (-3.15, 3.15, -3.62, 3.62):
        for y in (.3, 2, 4, 5.25): v.append((x, y, -5.93))
    v += [(x, 5.2, -5.93) for x in (-4, -2, 0, 2, 4)]
    H['bulk_hot'] = helper_mesh('h_bulk_hot', hc, v)
    v, e = [], []
    for a, b in (((-5, -5.9), (5, -5.9)), ((-4.8, -5.9), (-4.8, 15.9)), ((4.8, -5.9), (4.8, 15.9))):
        v += [(a[0], 0, a[1]), (b[0], 0, b[1])]; e.append((len(v) - 2, len(v) - 1))
    H['deck_seam'] = helper_mesh('h_deck_seam', hc, v, e)
    H['deck_hot'] = helper_mesh('h_deck_hot', hc, [(-2.05, 0, .95), (1.25, 0, -2.7), (-3.85, 0, -1.8), (-1.1, 0, .4), (1.55, 0, -.2), (-2.8, 0, -2.3), (3.5, 0, -2), (3.5, 0, 1.9), (3.5, 0, 4.4), (-4.75, 0, -3.2), (-4.75, 0, .8), (-1.5, 0, -5.9), (1.5, 0, -5.9), (-3.6, 0, -5.4), (3.6, 0, -5.4), (-3.6, 0, 2.6)])
    v, e = [], []
    for i in range(24):
        th = -math.pi + TAU * i / 24
        if .05 < th < 2.9:
            v += [sp(SUB_R, th, -27), sp(SUB_R, th, 27)]; e.append((len(v) - 2, len(v) - 1))
    H['sub_seams'] = helper_mesh('h_sub_seams', hc, v, e)
    H['sub_hot'] = helper_mesh('h_sub_hot', hc, [sp(SUB_R, 1.25 + (k % 3 - 1) * .2, -13.5 + (k - 4) * .9) for k in range(9)] + [sp(SUB_R, 1.75, z) for z in range(-24, 26, 2)] + [(2.2, 5.9, z) for z in (-7, -2, 3)])
    H['sand_hot'] = helper_mesh('h_sand_hot', hc, [(-3, 0, z) for z in range(-28, 18, 2)] + [(x, 0, -11) for x in (-2, 0, 2, 4)] + [(x, 0, -14) for x in (-1, 1, 3, 5)] + [(5.5, 0, 13.5), (15.5, 0, 8), (21, 0, -1.5), (8, 0, -14), (22, 0, -16)])
    v, e = [], []
    for sd in (1, -1):
        for f in (.1, .24, .38, .52, .66, .8):
            a, b = hull_pt(-34, f, sd), hull_pt(24, f, sd)
            v += [a, b]; e.append((len(v) - 2, len(v) - 1))
    H['ship_seams'] = helper_mesh('h_ship_seams', hc, v, e)
    H['ship_deck_hot'] = helper_mesh('h_ship_deck_hot', hc, [(x, 0, 1.5) for x in (-6, -3, 0, 3, 6)] + [(x, 0, 4.7) for x in range(-20, 20, 3)] + [(5.5, 0, -.5), (12, 0, -4.7), (9.4, 0, 3.9), (15.6, 0, 4.3)])
    H['house_hot'] = helper_mesh('h_house_hot', hc, [(x, .3, 1.46) for x in (-5, -3, -1, 1, 3, 5)] + [(x, 3.95, 1.46) for x in (1.15, 4.95, -4.2)] + [(x, 5.3, 1.46) for x in (-5, 0, 5)])
    H['boat_hot'] = helper_mesh('h_boat_hot', hc, [(x, 0, 3.03) for x in range(-8, 5)] + [(x, 0, -3.03) for x in range(-8, 5)])

    LOUD = (.11, .40, .60)
    D = dcol
    LAYERS = {
        'torpedo': [
            dict(name='hull_rust', sf='hull', kind='decal', coll=D['rust'], base=1.3, seam='hull_seams', seamFall=.9, amb=.03, nL=LOUD, nM=(.8, .35, .62, .25), seed=11, w=(.32, .7), aspect=(1.3, 2.0), alpha=(.45, 1), upright=True, spin=.12, surface='wall'),
            dict(name='hull_patch', sf='hull', kind='decal', coll=D['patch'], base=.4, seam='hull_seams', seamFall=1.3, amb=.05, nL=(.09, .42, .62), seed=13, w=(.5, 1.1), aspect=(.7, 1.1), alpha=(.4, .95), upright=True, spin=3.14, surface='wall'),
            dict(name='hull_oil', sf='hull', kind='decal', coll=D['oil'], base=.9, amb=1, nL=(.13, .38, .58), seed=17, w=(.4, .9), aspect=(1, 1.5), alpha=(.4, .9), upright=True, spin=.2, band=(0, .1, 1.6, 3), surface='wall'),
            dict(name='bulk_rust', sf='bulk', kind='decal', coll=D['rust'], base=2.8, hot='bulk_hot', hotFall=.9, hotPow=1.2, amb=.02, nL=(.2, .3, .55), seed=19, w=(.3, .85), aspect=(1.5, 2.6), alpha=(.5, 1), upright=True, spin=.08, surface='wall'),
            dict(name='bulk_patch', sf='bulk', kind='decal', coll=D['patch'], base=.55, hot='bulk_hot', hotFall=1.2, amb=.1, nL=LOUD, seed=23, w=(.5, 1.3), aspect=(.7, 1.3), alpha=(.45, 1), upright=True, spin=3.14, surface='wall'),
            dict(name='bulk_oil', sf='bulk', kind='decal', coll=D['oil'], base=1.2, amb=1, nL=(.2, .32, .55), seed=29, w=(.5, 1.3), aspect=(.8, 1.5), alpha=(.45, 1), upright=True, spin=.2, band=(-1, 0, 1.1, 2.1), surface='wall'),
            dict(name='deck_oil', sf='deck', kind='decal', coll=D['oil'], base=2.2, seam='deck_seam', seamFall=1.2, hot='deck_hot', hotFall=1.5, amb=.02, nL=(.12, .34, .58), seed=31, w=(.45, 1.4), aspect=(.7, 1.3), alpha=(.45, 1), surface='floor'),
            dict(name='deck_patch', sf='deck', kind='decal', coll=D['patch'], base=.5, seam='deck_seam', seamFall=1.5, hot='deck_hot', hotFall=1.2, amb=.03, nL=LOUD, seed=37, w=(.5, 1.5), aspect=(.8, 1.2), alpha=(.4, .9), surface='floor'),
            dict(name='k_bolts', sf='deck', kind='kit', coll=kc['bolt_heap'], base=.9, seam='deck_seam', seamFall=.9, hot='deck_hot', hotFall=.7, amb=.0, nL=(.2, .3, .6), seed=41, w=(.8, 1.3)),
            dict(name='k_rag', sf='deck', kind='kit', coll=kc['rag'], base=.15, seam='deck_seam', seamFall=1.2, hot='deck_hot', hotFall=.8, amb=.0, nL=(.2, .3, .6), seed=43, w=(.9, 1.5)),
            dict(name='k_can', sf='deck', kind='kit', coll=kc['oil_can'], base=.06, seam='deck_seam', seamFall=1, hot='deck_hot', hotFall=.8, amb=.0, seed=47, w=(.9, 1.1)),
        ],
        'sub': [
            dict(name='sub_rust', sf='sub', kind='decal', coll=D['rust'], base=.8, seam='sub_seams', seamFall=1.1, hot='sub_hot', hotFall=2.2, amb=.02, nL=LOUD, nM=(.5, .35, .62, .25), seed=51, w=(.5, 1.1), aspect=(1.2, 1.7), alpha=(.45, 1), upright=True, spin=.1, surface='wall'),
            dict(name='sub_growth', sf='sub', kind='decal', coll=D['growth'], base=.65, amb=1, nL=(.09, .34, .55), seed=53, w=(.7, 1.4), aspect=(.8, 1.2), alpha=(.5, 1), upright=True, spin=.4, band=(-6, -5, -.6, 1.5), surface='wall'),
            dict(name='sub_barn', sf='sub', kind='decal', coll=D['barnacle'], base=.75, seam='sub_seams', seamFall=.8, amb=.1, nL=(.13, .4, .6), seed=57, w=(.4, 1.0), aspect=(.8, 1.2), alpha=(.6, 1), upright=True, spin=3.14, band=(-6, -5, 2, 4), surface='wall'),
            dict(name='k_barn', sf='sub', kind='kit', coll=kc['barnacle'], base=.55, amb=1, nL=(.17, .46, .6), seed=59, w=(.5, .95), band=(-6, -5, -2.8, -1)),
        ],
        'seabed': [
            dict(name='sand_dark', sf='sand', kind='decal', coll=D['growth'], base=.07, hot='sand_hot', hotFall=5, amb=.25, nL=(.05, .36, .58), seed=61, w=(1.5, 3.5), aspect=(.8, 1.2), alpha=(.25, .6), surface='floor'),
            dict(name='k_rock_a', sf='sand', kind='kit', coll=kc['rock_a'], base=.25, hot='sand_hot', hotFall=3.5, amb=.03, nL=(.07, .34, .55), seed=63, w=(.5, 1.5)),
            dict(name='k_rock_b', sf='sand', kind='kit', coll=kc['rock_b'], base=.2, hot='sand_hot', hotFall=3.5, amb=.03, nL=(.08, .36, .56), seed=65, w=(.45, 1.3)),
            dict(name='k_rock_c', sf='sand', kind='kit', coll=kc['rock_c'], base=.15, hot='sand_hot', hotFall=2.5, amb=.02, nL=(.09, .34, .56), seed=67, w=(.35, 1.0)),
            dict(name='k_shard', sf='sand', kind='kit', coll=kc['plate_shard'], base=.5, hot='sand_hot', hotFall=4, amb=.0, nM=(.5, .35, .6, .2), seed=69, w=(.6, 1.6)),
            dict(name='k_rib', sf='sand', kind='kit', coll=kc['rib_stub'], base=.14, hot='sand_hot', hotFall=3, amb=.0, nL=(.1, .3, .6), seed=71, w=(.7, 1.6)),
        ],
        'sea': [
            dict(name='side_wear', sf='side', kind='decal', coll=D['wear'], base=.45, seam='ship_seams', seamFall=1.2, amb=.05, nL=LOUD, seed=73, w=(.8, 2.2), aspect=(1, 2), alpha=(.35, .9), upright=True, spin=.12, surface='wall'),
            dict(name='side_rust', sf='side', kind='decal', coll=D['rust'], base=.32, seam='ship_seams', seamFall=.9, amb=.02, nL=(.1, .42, .62), seed=75, w=(.5, 1.5), aspect=(1.5, 3), alpha=(.4, .9), upright=True, spin=.08, surface='wall'),
            dict(name='deck_wear', sf='sdeck', kind='decal', coll=D['wear'], base=.35, hot='ship_deck_hot', hotFall=2.4, amb=.02, nL=LOUD, seed=77, w=(.7, 1.8), aspect=(.8, 1.2), alpha=(.3, .7), surface='floor'),
            dict(name='house_wear', sf='house', kind='decal', coll=D['wear'], base=2.2, hot='house_hot', hotFall=1.5, amb=.05, nL=(.15, .36, .6), seed=79, w=(.45, 1.3), aspect=(1.3, 2.3), alpha=(.35, .85), upright=True, spin=.08, surface='wall'),
        ],
        'storm': [
            dict(name='side_rust', sf='side', kind='decal', coll=D['rust'], base=.7, seam='ship_seams', seamFall=1.1, amb=.04, nL=LOUD, seed=81, w=(.6, 1.9), aspect=(1.5, 3), alpha=(.45, 1), upright=True, spin=.08, surface='wall'),
            dict(name='deck_rust', sf='sdeck', kind='decal', coll=D['patch'], base=.8, hot='ship_deck_hot', hotFall=2.2, amb=.05, nL=LOUD, seed=83, w=(.6, 1.7), aspect=(.8, 1.3), alpha=(.4, .9), surface='floor'),
            dict(name='deck_oil', sf='sdeck', kind='decal', coll=D['oil'], base=.6, hot='ship_deck_hot', hotFall=1.6, amb=.02, nL=(.13, .36, .6), seed=85, w=(.5, 1.3), aspect=(.8, 1.3), alpha=(.4, .9), surface='floor'),
        ],
        'boat': [
            dict(name='side_wear', sf='bside', kind='decal', coll=D['wear'], base=.7, hot='boat_hot', hotFall=1.8, amb=.2, nL=LOUD, seed=87, w=(.5, 1.2), aspect=(1, 1.8), alpha=(.4, .9), upright=True, spin=.12, surface='wall'),
        ],
    }
    SURFS = dict(hull=hull_surface, bulk=bulk_surface, deck=deck_surface, sub=sub_surface, sand=sand_surface, side=ship_side, sdeck=ship_deck, house=house_face, bside=boat_side)
    meshes = {}
    objs = {}
    for place, layers in LAYERS.items():
        if place not in places: continue
        for cfg in layers:
            if cfg['sf'] not in meshes: meshes[cfg['sf']] = surf('surf_' + cfg['sf'], SURFS[cfg['sf']])
            ng = make_scatter_group(f'sc_{place}_{cfg["name"]}', cfg, H)
            ob = bpy.data.objects.new(f'sc_{place}_{cfg["name"]}', meshes[cfg['sf']])
            sc.objects.link(ob)
            md = ob.modifiers.new('scatter', 'NODES'); md.node_group = ng
            objs[ob.name] = (place, cfg)
    vl = bpy.context.view_layer
    vl.layer_collection.children['helpers'].exclude = True
    vl.update()
    dg = bpy.context.evaluated_depsgraph_get()
    OUTD = {p: dict(instances={}, decals=[]) for p in LAYERS if p in places}
    raw = {}
    idx = 0
    for inst in dg.object_instances:
        if not inst.is_instance or inst.parent is None: continue
        pn = inst.parent.name
        if pn not in objs: continue
        place, cfg = objs[pn]
        raw[pn] = raw.get(pn, 0) + 1
        loc, rq, sca = inst.matrix_world.decompose()
        p = R3 @ loc
        rm = R3 @ rq.to_matrix() @ R3T
        nr = (rm[0][1], rm[1][1], rm[2][1])
        x, y, z = p
        if cfg['kind'] == 'decal':
            idx += 1
            cell = int(inst.instance_object.name.split('_')[1].split('.')[0])
            w_, a_, h_ = sca.x, sca.z, sca.y    # blender local (x, y, z): decal holds w, h, alpha
            surf_kind = cfg['surface']
            n = (round(nr[0], 4), round(nr[1], 4), round(nr[2], 4))
            if surf_kind == 'floor':
                n = (0, 1, 0); bu = (1, 0, 0)
            elif abs(n[1]) > .93:
                surf_kind = 'ceiling'; bu = (1, 0, 0)
            else:
                bu = norm(cross((0, 1, 0), n))
            bv = cross(n, bu)
            ux = (rm[0][0], rm[1][0], rm[2][0])
            spin = math.atan2(dot(ux, bv), dot(ux, bu))
            if place == 'torpedo':
                if cfg['sf'] == 'hull':
                    off = .004 + (idx % 7) * .0007
                    x += n[0] * off; y += n[1] * off; z += n[2] * off
                elif cfg['sf'] == 'bulk':
                    z = -5.915 + (idx % 7) * .0007
                    if y < .05: continue
                    if any(math.hypot(x - dx_, y - dy_) < .85 for dx_, dy_ in ((-1.5, 1.55), (1.5, 1.55), (-1.5, 3.95), (1.5, 3.95))): continue     # would sit behind a tube door, unseen
                else:
                    y = .003 + (idx % 9) * .0006
            elif surf_kind == 'floor' and place != 'seabed':
                y = .006 + (idx % 9) * .0006
            elif surf_kind == 'floor':
                y += .03 + (idx % 9) * .0006;
            OUTD[place]['decals'].append(dict(cell=cell, pos=[round(x, 4), round(y, 4), round(z, 4)], normal=list(n), spin=round(spin, 3), size=[round(sca.x, 3), round(sca.y, 3)], surface=surf_kind, alpha=round(sca.z, 3)))
        else:
            name = cfg['coll'].name[2:]
            s = sca.x
            if place == 'torpedo':
                if any(math.hypot(x - c[0], z - c[1]) < r_ for c, r_ in TORP_LANES): continue
                if -1.8 < x < .4 and z > 3: continue
                y = .002
            elif place == 'seabed':
                if not seabed_clear(x, z, s * .7): continue
                # the foregrounds of the diver's shots (camera at x -2.. 3, z 3..14) stay low: flat shards only
                if -3 < x < 4 and 2.5 < z < 15 and (name != 'plate_shard' or s > 1): continue
                if name == 'rib_stub' and (z > -3 or x < 2): continue
                y -= .06 * s
            qq = rm.to_quaternion()
            OUTD[place]['instances'].setdefault(name, []).append([round(v, 4) for v in (x, y, z, qq.x, qq.y, qq.z, qq.w, s, s, s)])
    for pn, c in raw.items(): print('  ', pn, c)
    return OUTD

# ---------------------------------------------------------------------------------------------------------------- main
def main():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    OUT.mkdir(parents=True, exist_ok=True)
    root = bpy.context.scene.collection
    coll = bpy.data.collections.new('set'); root.children.link(coll)
    builders = dict(torpedo=build_torpedo, sub=build_sub, seabed=build_seabed, sea=lambda: build_ship('cutter'), boat=build_boat, storm=lambda: build_ship('rescue'))
    for name, fn in builders.items():
        if name in PLACES:
            write_place(name, fn(), coll)
    kit_coll = bpy.data.collections.new('kit'); root.children.link(kit_coll)
    K = build_kit()
    objs = write_place('kit', K, kit_coll)
    kit_objs = {o.name: o for o in objs}
    for o in objs: kit_coll.objects.unlink(o)
    OUTD = scatter_all(coll, kit_objs, PLACES)
    # whiskey crates: the previz's exact stack, placed by hand (scatter format)
    if 'boat' in PLACES:
        arr = []
        for x, y, z in ((-2.9, 0, -1.1), (-2.9, 1.15, -1.1), (-1.75, 0, -1.3), (-4.05, 0, -1.2), (-3.3, 0, .2), (-5.2, 0, -1.6), (-4.6, 0, -.0)):
            a = .1 * x / 2
            arr.append([x, y, z, 0, round(math.sin(a), 4), 0, round(math.cos(a), 4), 1, 1, 1])
        OUTD['boat']['instances']['crate_whiskey'] = arr
        OUTD['boat']['instances']['crate_rail'] = arr
    path = OUT / 'scatter.json'
    prev = json.load(open(path)) if path.exists() else {}
    prev.update(OUTD)
    prev['meta'] = dict(built='2026-11-04', tool='blender/build_s4.py', decalCells={k: [r[0], r[-1]] for k, r in CELLS.items()},
                        decalSpin='plane basis u, v, normal. Normals are real, not axis aligned (curved hulls). wall: u = up x normal, v = normal x u (image top = world up). floor: u = +x, v = -z. ceiling: u = +x, v = normal x u. Spin is counter-clockwise around the normal, size = [along u, along v]',
                        kitAxes='local +y out of the surface it sits on')
    atomic_json(path, prev)
    for p, d in OUTD.items():
        print('SCATTER', p, {k: len(v) for k, v in d['instances'].items()}, 'decals', len(d['decals']))
    bpy.context.preferences.filepaths.save_version = 0
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT / 's4.blend'), compress=True)
    print('BUILD OK')

main()
