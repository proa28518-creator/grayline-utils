# check_s4.py: checks the exported files against the film. Places the glbs as world/s4.js places its groups, then tests the real marks, walks and camera paths.
#   node blender/s4_cams.mjs                                                                       (camera keys -> blender/check/s4_cams.json)
#   blender --background --factory-startup --python blender/check_s4.py                            numbers only
#   ... -- --render [t t t ...]                                                                    also clay images from the camera's real positions, blender/check/s4_<t>.png
# Clay images show geometry only, never the final look. Stand-ins (capsules) mark the characters.
import bpy, json, math, struct, sys
from pathlib import Path
from mathutils import Matrix, Vector
from mathutils.bvhtree import BVHTree

HERE = Path(__file__).resolve().parent
A = HERE.parent / 'world' / 'assets' / 's4'
CK = HERE / 'check'; CK.mkdir(exist_ok=True)
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
fails = []
def check(ok, msg):
    print(('OK   ' if ok else 'FAIL ') + msg, flush=True)
    if not ok: fails.append(msg)

ZONE = dict(room=(0, 0), sea=(400, 0), boat=(400, -400), storm=(400, 400), bed=(-400, 0))
def to_b(p): return Vector((p[0], -p[2], p[1]))
REST = (-7.6, 4.6, -8)
# name: (file, offset in three axes, rotation about three z (radians), zone)
PLACE = [('torpedo.glb', (0, 0, 0), 0, 'room'), ('seabed.glb', (-400, 0, 0), 0, 'bed'), ('sub.glb', (-400 + REST[0], REST[1], REST[2]), .1, 'bed'),
         ('sea.glb', (400, 0, 0), 0, 'sea'), ('boat.glb', (400, 0, -400), 0, 'boat'), ('sea.glb', (408, 0, -444), 0, 'boat'), ('storm.glb', (396, 0, 399), 0, 'storm')]
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
zone_objs = {k: [] for k in ZONE}
for fn, off, rz, z in PLACE:
    if not (A / fn).exists(): print('   missing', fn); continue
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=str(A / fn))
    new = [o for o in bpy.data.objects if o not in before]
    M = Matrix.Translation(to_b(off)) @ Matrix.Rotation(rz, 4, Vector((0, -1, 0)))   # three z = blender -y
    for o in new:
        if o.parent is None: o.matrix_world = M @ o.matrix_world
    bpy.context.view_layer.update()
    zone_objs[z] += [o for o in new if o.type == 'MESH']
    tr = sum(len(o.data.loop_triangles) if o.data.calc_loop_triangles() is None else 0 for o in new if o.type == 'MESH')
    print(f'{fn}: {len([o for o in new if o.type == "MESH"])} meshes, {tr} tris, {(A / fn).stat().st_size / 1e6:.2f} MB')

SC = json.load(open(A / 'scatter.json')) if (A / 'scatter.json').exists() else {}
kit_src = {}
if (A / 'kit.glb').exists():
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=str(A / 'kit.glb'))
    for o in bpy.data.objects:
        if o not in before and o.type == 'MESH': kit_src[o.name.split('.')[0]] = o
    print('kit:', {k: len(o.data.polygons) for k, o in kit_src.items()})
R3 = Matrix(((1, 0, 0), (0, 0, -1), (0, 1, 0)))
PLACE_OF = dict(torpedo=[(0, 0, 0, 0, 'room')], seabed=[(-400, 0, 0, 0, 'bed')], sub=[(-400 + REST[0], REST[1], REST[2], .1, 'bed')], sea=[(400, 0, 0, 0, 'sea'), (408, 0, -444, 0, 'boat')], boat=[(400, 0, -400, 0, 'boat')], storm=[(396, 0, 399, 0, 'storm')])
from mathutils import Quaternion
inst_total = 0
for place, data in SC.items():
    if place == 'meta': continue
    for name, arr in data.get('instances', {}).items():
        src = kit_src.get(name)
        if not src: print('   no kit asset', name); continue
        for ox, oy, oz, rz, z in PLACE_OF.get(place, []):
            MP = Matrix.Translation(to_b((ox, oy, oz))) @ Matrix.Rotation(rz, 4, Vector((0, -1, 0)))
            for e in arr:
                q = Quaternion((e[6], e[3], e[4], e[5]))
                rb = R3 @ q.to_matrix() @ R3.transposed()
                sb = Matrix.Diagonal((e[7], e[9], e[8]))
                ob = bpy.data.objects.new(name + '_i', src.data)
                ob.matrix_world = MP @ Matrix.Translation(to_b(e[:3])) @ (rb @ sb).to_4x4()
                scene.collection.objects.link(ob)
                zone_objs[z].append(ob); inst_total += 1
for o in kit_src.values(): o.hide_render = True; o.hide_viewport = True
print('kit instances placed', inst_total)
bpy.context.view_layer.update()
BV, TRIS = {}, {}
for z, obs in zone_objs.items():
    V, P = [], []
    for o in obs:
        if o.type != 'MESH': continue
        if o.data.materials and o.data.materials[0] and o.data.materials[0].name.startswith('void'): pass
        n = len(V); M = o.matrix_world
        V += [M @ v.co for v in o.data.vertices]
        P += [tuple(i + n for i in p.vertices) for p in o.data.polygons]
    TRIS[z] = sum(len(p) - 2 for p in P)
    BV[z] = BVHTree.FromPolygons(V, P, epsilon=0) if P else None
print('TRIS per zone (with instances)', TRIS)

# ---- the people, from films/s4_cam/film.mjs. (zone, x, z, head y) relative to the zone
PEOPLE = dict(kid=('room', -1.1, .95, 1.75), lt=('room', -3.25, .5, 2.7), chief=('room', 1.55, .3, 1.85), big=('room', .25, -2.7, 2.7), wire=('room', -2.8, -1.8, 1.75), cook=('room', 2.3, 3.3, 2.3),
              skipper=('sea', 3, 3.4, 2.55), smug=('boat', -1, 1.2, 2.3), navy=('storm', 8, 2.6, 2.55), dvdeck=('storm', 9.8, 2.2, 2.5),
              diver1=('bed', -.95, 1.2, 2.5), fall1=('bed', 12, 3.4, 2.6), fall2=('bed', 18, -5.6, 2.6), diver2=('bed', .5, -9.1, 2.45))
WALKS = dict(chief=[('room', (1.55, .3), (.28, 1.34)), ('room', (.28, 1.34), (1.6, 1.8))], big=[('room', (.25, -2.7), (2.3, -3.3))],
             diver1=[('bed', (9, -5), (2.4, -8.7)), ('bed', (2.4, -8.7), (-.95, 1.2))], diver2=[('bed', (6, -20), (4.2, -8.4)), ('bed', (4.2, -8.4), (.5, -9.1)), ('bed', (.5, -9.1), (6, -20))])
def W(z, x, y, zz): o = ZONE[z]; return to_b((o[0] + x, y, o[1] + zz))

# ---- nothing inside the body of anyone standing at a mark. Hands reach pipes, so the test is the torso: within .3 D of the axis, between hips and head top
bad = 0
for n, (z, x, zz, hy) in PEOPLE.items():
    if not BV[z]: continue
    for y in (hy - .9, hy - .4, hy, hy + .5):
        if y < .62: continue
        hit = BV[z].find_nearest(W(z, x, y, zz))
        if hit[0] and hit[3] < .3:
            print(f'   near {n} y {y:.2f}: {hit[3]:.2f} D'); bad += 1
check(bad == 0, f'{len(PEOPLE)} marks: nothing within .3 D of a body axis ({bad} points)')
bad = 0
for n, segs in WALKS.items():
    for z, a, b in segs:
        if not BV[z]: continue
        for k in range(21):
            t = k / 20; x, zz = a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t
            for y in (.3, 1.2, 2.2, 3.0):
                hit = BV[z].find_nearest(W(z, x, y, zz))
                if hit[0] and hit[3] < (.3 if y > .5 else .22):
                    hx, hz = hit[0].x - ZONE[z][0], -hit[0].y - ZONE[z][1]
                    if z == 'room' and any(math.hypot(hx - a_, hz - b_) < .3 for a_, b_ in ((-2.05, .95), (1.25, -2.7), (-3.85, -1.8))): continue   # the tapping pipes stand where the previz has them
                    if z == 'room' and hit[0].z < .6 and abs(hx - 1.55) < .6 and abs(hz - .3) < .5: continue                                         # his own crate as he gets up
                    if z == 'bed' and hz > -12.05 and hx < 2.3 and n == 'diver2': continue                                                           # the previz spars he's snagged on
                    print(f'   walk {n} at ({x:.2f},{zz:.2f}) y {y}: {hit[3]:.2f} D, hit ({hx:.2f},{hit[0].z:.2f},{hz:.2f})'); bad += 1
check(bad == 0, f'walk lanes clear ({bad} points)')

# ---- contact points that hands hit, and seat heights
def nearest(z, p): r = BV[z].find_nearest(W(z, *p)) if BV[z] else (None, None, None, 99); return r[3]
if BV['room']:
    for n, p, want in (('kid tool head on pipe', (-1.88, 1.82, 1.06), .1), ('lt tool head on pipe', (-2.22, 2.5, .98), .1), ('chief on torpedo', (2.8, 1.4, .5), .25), ('big on pipe', (1.13, 2.6, -2.6), .15), ('wire on pipe', (-3.73, 1.62, -1.7), .15), ('cook on torpedo', (2.86, 1.36, 3.48), .25)):
        d = nearest('room', p)
        check(d <= want, f'{n}: surface {d:.3f} D from the tool head (at most {want})')
    for n, x, zz in (('kid', -1.1, .95), ('chief', 1.55, .3), ('wire', -2.8, -1.8)):
        r = BV['room'].ray_cast(W('room', x, 1.2, zz), Vector((0, 0, -1)))
        check(r[0] is not None and abs(r[0].z - .55) < .02, f'seat under {n} at y {r[0].z if r[0] else -1:.3f}')
    r = BV['room'].ray_cast(W('room', .3, 1, 8.5), Vector((0, 0, -1)))
    check(r[0] is not None and abs(r[0].z) < .012, f'deck top y {r[0].z if r[0] else -1:.3f}')
if BV['bed']:
    for n, x, y, zz in (('diver knock point', -2.02, 2.2, 1.4), ):
        d = nearest('bed', (x, y, zz)); check(d < .35, f'{n}: hull {d:.3f} D away')
    r = BV['bed'].ray_cast(W('bed', -.95, 2, 1.2), Vector((0, 0, -1))); check(r[0] is not None and abs(r[0].z) < .09, f'sand at diver1 y {r[0].z if r[0] else -1:.3f}')
if BV['sea']:
    r = BV['sea'].ray_cast(W('sea', 3, 1, 3.4), Vector((0, 0, -1))); check(r[0] is not None and abs(r[0].z) < .012, f'deck at skipper y {r[0].z if r[0] else -1:.3f}')
if BV['storm']:
    for n, x, zz in (('navy', 8, 2.6), ('dvdeck', 9.8, 2.2)):
        r = BV['storm'].ray_cast(W('storm', x, 1, zz), Vector((0, 0, -1))); check(r[0] is not None and abs(r[0].z) < .012, f'deck at {n} y {r[0].z if r[0] else -1:.3f}')
if BV['boat']:
    r = BV['boat'].ray_cast(W('boat', -1, 1, 1.2), Vector((0, 0, -1))); check(r[0] is not None and abs(r[0].z + .0) < .1, f'deck at smuggler y {r[0].z if r[0] else -1:.3f}')

# ---- the camera: sampled at 30 fps from the real keys (straight between keys)
SHOTS = json.load(open(CK / 's4_cams.json'))
def zone_of(p):
    best, bd = None, 1e9
    for z, o in ZONE.items():
        d = abs(p[0] - o[0]) + abs(p[2] - o[1])
        if d < bd: best, bd = z, d
    return best
def resolve(v):
    if isinstance(v, list): return v
    o = PEOPLE[v['who']]; z = ZONE[o[0]]
    return [z[0] + o[1] + v['offset'][0], v['offset'][1], z[1] + o[2] + v['offset'][2]]
def sample(t):
    for s in SHOTS:
        if s['t0'] - 1e-6 <= t < s['t1']:
            K = s['keys']
            if t <= K[0]['t']: k0 = k1 = K[0]
            elif t >= K[-1]['t']: k0 = k1 = K[-1]
            else:
                for a, b in zip(K, K[1:]):
                    if a['t'] <= t <= b['t']: k0, k1 = a, b; break
            u = 0 if k1['t'] == k0['t'] else (t - k0['t']) / (k1['t'] - k0['t'])
            u = u * u * (3 - 2 * u)
            pa, pb, ta, tb = resolve(k0['pos']), resolve(k1['pos']), resolve(k0['target']), resolve(k1['target'])
            mix = lambda a, b, u: [a[i] + (b[i] - a[i]) * u for i in range(3)]
            return mix(pa, pb, u), mix(ta, tb, u), k0['fov'] + (k1['fov'] - k0['fov']) * u, k0['roll'] + (k1['roll'] - k0['roll']) * u
    return None
close, block_t, faces = [], [], {}
t = 0
while t < 39.4:
    s = sample(t)
    if s:
        p, tg, fov, roll = s
        z = zone_of(p)
        if BV[z]:
            P = to_b(p)
            hit = BV[z].find_nearest(P)
            if hit[0] and hit[3] < .08: close.append((round(t, 2), z, round(hit[3], 3), [round(v, 2) for v in p]))
            T = to_b(tg); d = T - P; L = d.length
            if L > .5:
                r = BV[z].ray_cast(P, d.normalized(), L - .35)
                if r[0] is not None: block_t.append((round(t, 2), z, round(r[3], 2)))
                fw = d.normalized(); right = fw.cross(Vector((0, 0, 1))).normalized(); up = right.cross(fw)
                hv = math.tan(math.radians(fov) / 2); hh = hv * 9 / 16
                for n, (zz, x, zp, hy) in PEOPLE.items():
                    if zz != z: continue
                    H = W(zz, x, hy, zp); v = H - P; dz = v.dot(fw)
                    if dz < .4: continue
                    if abs(v.dot(right)) / dz > hh or abs(v.dot(up)) / dz > hv: continue
                    r = BV[z].ray_cast(P, v.normalized(), v.length - .25)
                    if r[0] is not None:
                        hx, hz = r[0].x - ZONE[z][0], -r[0].y - ZONE[z][1]
                        if z == 'room' and any(math.hypot(hx - a_, hz - b_) < .28 for a_, b_ in ((-2.05, .95), (1.25, -2.7), (-3.85, -1.8))): continue   # previz pipes, same place
                        faces.setdefault(n, []).append((round(t, 2), f'({hx:.1f},{r[0].z:.1f},{hz:.1f})'))
    t += 1 / 30
print('CAMERA within .08 D of a surface:', len(close))
for c in close: print('   ', c)
print('TARGET hidden by the set at', len(block_t), 'samples:', [b[0] for b in block_t])
for n, v in faces.items():
    print(f'FACE {n} hidden at', [a for a, b in v])
SEAMS = [(0, 2.05), (2.6, 3.7), (8.7, 8.7), (11.6, 11.95), (15.0, 15.15), (17.5, 17.8), (30.62, 30.95), (31.66, 31.85), (34.86, 35.3), (35.86, 36.08), (5.2, 6.3)]
real = {n: [a for a, b in v if not any(s0 - .001 <= a <= s1 + .001 for s0, s1 in SEAMS) and a > 2.05] for n, v in faces.items()}
real = {n: v for n, v in real.items() if v}
check(not real, f'no face hidden by the set outside the seam flights: {real}')

# ---- decals sit on what they decorate: centre within .12 D of a surface, and how far their corners float or sink (their alpha is zero well inside the corner)
for place, data in SC.items():
    if place == 'meta' or not data.get('decals') or place not in PLACE_OF: continue
    ox, oy, oz, rz, z = PLACE_OF[place][0]
    if not BV[z]: continue
    MP = Matrix.Translation(to_b((ox, oy, oz))) @ Matrix.Rotation(rz, 4, Vector((0, -1, 0)))
    far, worst, corners = 0, 0, []
    for d in data['decals']:
        n = Vector(d['normal'])
        u = Vector((1, 0, 0)) if d['surface'] in ('floor', 'ceiling') else Vector((0, 1, 0)).cross(n).normalized()
        v = n.cross(u)
        c, s = math.cos(d['spin']), math.sin(d['spin'])
        uu, vv = u * c + v * s, v * c - u * s
        P = Vector(d['pos'])
        h = BV[z].find_nearest(MP @ to_b(P))
        if h[3] > .12: far += 1
        worst = max(worst, h[3])
        for a, e in ((-.35, -.35), (.35, -.35), (.35, .35), (-.35, .35)):     # corners of the visible part of a cell
            h2 = BV[z].find_nearest(MP @ to_b(P + uu * (a * d['size'][0]) + vv * (e * d['size'][1])))
            corners.append(h2[3])
    corners.sort()
    print(f'DECALS {place}: {len(data["decals"])}, centre furthest {worst:.3f} D, visible corner 95% {corners[int(len(corners) * .95)]:.3f} D, max {corners[-1]:.3f} D')
    check(far <= len(data['decals']) * .05, f'{place}: {far} decals more than .12 D off a surface')

# ---------------------------------------------------------------------------------------------------------------- clay images
if '--render' in ARGS:
    times = [float(a) for a in ARGS[ARGS.index('--render') + 1:]] or [1.0, 5.0, 8.3, 9.0, 10.8, 11.8, 13.0, 14.5, 16.8, 20.0, 22.0, 23.0, 26.3, 28.5, 31.4, 31.8, 32.1, 34.3, 37]
    mat = bpy.data.materials.new('clay'); mat.use_nodes = True
    b = next(n for n in mat.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'); b.inputs['Base Color'].default_value = (.5, .5, .5, 1); b.inputs['Roughness'].default_value = .75
    m2 = bpy.data.materials.new('stand'); m2.use_nodes = True
    b2 = next(n for n in m2.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'); b2.inputs['Base Color'].default_value = (.9, .2, .1, 1)
    for o in bpy.data.objects:
        if o.type == 'MESH' and o.data.materials:
            for i in range(len(o.data.materials)): o.data.materials[i] = mat
        elif o.type == 'MESH': o.data.materials.append(mat)
    # the decals as flat dark quads, so their spread and direction can be judged
    dm = bpy.data.materials.new('decal'); dm.use_nodes = True
    bd = next(n for n in dm.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'); bd.inputs['Base Color'].default_value = (.03, .02, .015, 1); bd.inputs['Alpha'].default_value = .5
    dm.surface_render_method = 'BLENDED'
    for place, data in SC.items():
        if place == 'meta': continue
        for ox, oy, oz, rz, z in PLACE_OF.get(place, [])[:1]:
            MP = Matrix.Translation(to_b((ox, oy, oz))) @ Matrix.Rotation(rz, 4, Vector((0, -1, 0)))
            verts, polys = [], []
            for d in data.get('decals', []):
                n = Vector(d['normal'])
                up = Vector((0, 1, 0))
                u = Vector((1, 0, 0)) if d['surface'] in ('floor', 'ceiling') else up.cross(n).normalized()
                v = n.cross(u)
                c, s = math.cos(d['spin']), math.sin(d['spin'])
                uu, vv = u * c + v * s, v * c - u * s
                P = Vector(d['pos']) + n * .01
                b0 = len(verts)
                for a, e in ((-.5, -.5), (.5, -.5), (.5, .5), (-.5, .5)):
                    verts.append(MP @ to_b(P + uu * (a * d['size'][0]) + vv * (e * d['size'][1])))
                polys.append((b0, b0 + 1, b0 + 2, b0 + 3))
            if verts:
                me = bpy.data.meshes.new('dec_' + place); me.from_pydata([tuple(q) for q in verts], [], polys); me.update(); me.materials.append(dm)
                scene.collection.objects.link(bpy.data.objects.new('dec_' + place, me))
    for n, (z, x, zz, hy) in PEOPLE.items():
        for rad, loc, sc in ((.32, (x, (hy - .3) / 2, zz), (1, 1, 1)), ):
            bpy.ops.mesh.primitive_cylinder_add(radius=.32, depth=max(.2, hy - .3), location=W(z, x, (hy - .3) / 2, zz)); bpy.context.object.data.materials.append(m2)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=.6, location=W(z, x, hy, zz)); bpy.context.object.data.materials.append(m2)
    def point(z, x, y, zz, e, col=(1, .9, .75), r=.3):
        l = bpy.data.lights.new('l', 'POINT'); l.energy = e; l.color = col; l.shadow_soft_size = r
        o = bpy.data.objects.new('l', l); o.location = W(z, x, y, zz); scene.collection.objects.link(o)
    point('room', .9, 3.85, 1.4, 90); point('room', -2.6, 3.4, -3.5, 25); point('room', 3, 3.5, 7, 22); point('room', 0, 3, 11, 20); point('room', -2.5, 4.2, -5, 12)
    sun = bpy.data.objects.new('sun', bpy.data.lights.new('sun', 'SUN')); sun.data.energy = 2.2; sun.data.angle = .3; sun.rotation_euler = (.75, .2, .7); scene.collection.objects.link(sun)
    w = bpy.data.worlds.new('w'); scene.world = w; w.use_nodes = True
    w.node_tree.nodes['Background'].inputs[0].default_value = (.5, .55, .6, 1); w.node_tree.nodes['Background'].inputs[1].default_value = .35
    scene.render.engine = 'BLENDER_EEVEE'
    scene.eevee.taa_render_samples = 16
    scene.render.resolution_x, scene.render.resolution_y = 432, 768
    scene.render.image_settings.file_format = 'JPEG'
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); scene.collection.objects.link(cam); scene.camera = cam
    cam.data.sensor_fit = 'VERTICAL'; cam.data.clip_start = .03; cam.data.clip_end = 900
    for t in times:
        s = sample(t)
        if not s: continue
        p, tg, fov, roll = s
        P, T = to_b(p), to_b(tg)
        cam.location = P
        q = (T - P).to_track_quat('-Z', 'Y')
        cam.rotation_mode = 'QUATERNION'; cam.rotation_quaternion = q @ __import__('mathutils').Quaternion((0, 0, 1), math.radians(roll))
        cam.data.angle_y = math.radians(fov)
        # the sun must not reach inside the room
        inside = zone_of(p) == 'room'
        sun.hide_render = inside
        scene.world.node_tree.nodes['Background'].inputs[1].default_value = .04 if inside else .35
        scene.render.filepath = str(CK / f's4_{t:05.2f}.jpg')
        bpy.ops.render.render(write_still=True)
    print('RENDERED', len(times), flush=True)
print('DONE, fails:', len(fails), fails[:6])
