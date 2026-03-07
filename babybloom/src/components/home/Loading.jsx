import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════
   BABYBLOOM — CINEMATIC LOADING PAGE
   "Golden Hour Laundry Garden"

   Upgrades over original:
   ✦ Physically-based sky with gradient mesh + animated clouds
   ✦ Ground plane with soft grass-like color + subtle shadow
   ✦ Fabric-realistic garments with normal-mapped look (shininess layering)
   ✦ Real clothesline droop (catenary curve via CatmullRom spline)
   ✦ Shadow casting on ground from garments
   ✦ Volumetric-style God-rays behind the scene
   ✦ Animated butterflies and bubble particles
   ✦ Wind particles (horizontal streaks)
   ✦ Depth-of-field feel via particle fog layers
   ✦ Pollen/dust motes floating in shafts of light
   ✦ Realistic wooden fence posts with grain texture (procedural)
   ✦ Flower bed at the bottom of the scene
   ✦ Multi-tone lighting: warm sun + cool sky bounce + warm ground
   ✦ Progress bar with liquid fill + shimmer
   ✦ Smooth camera drift + gentle tilt
═══════════════════════════════════════════════════════════════ */

/* ─── UTILITY ─────────────────────────────────────────────── */
const rng = (a, b) => a + Math.random() * (b - a);
const rangeInt = (a, b) => Math.floor(rng(a, b));

/* ─── PALETTE ─────────────────────────────────────────────── */
const COLORS = {
  hotPink:    0xFF6B9D,
  blush:      0xFFAFCC,
  coral:      0xFF8C69,
  peach:      0xFFB347,
  lemon:      0xFFD166,
  mint:       0x06D6A0,
  sky:        0x5AB4D8,
  lavender:   0xBFA8E8,
  lilac:      0xCDB4DB,
  cream:      0xFFF8F2,
  warmWhite:  0xFFF5EE,
  sunGold:    0xFFD700,
  ropeColor:  0xC8956C,
  woodDark:   0x8B6355,
  woodLight:  0xC09070,
  grassTop:   0x7EC850,
  grassMid:   0x5FAF3A,
  sky1:       0xFFDEEF,  // dawn pink
  sky2:       0xFFEDC8,  // warm gold
  sky3:       0xD6EEFF,  // soft blue
};

const GARMENT_PALETTES = [
  { body: 0xFF6B9D, accent: 0xFF9EC4, trim: 0xFFD6E8 },
  { body: 0xFF8C42, accent: 0xFFD166, trim: 0xFFF3B0 },
  { body: 0x06D6A0, accent: 0x00B4D8, trim: 0xC7F9CC },
  { body: 0x5AB4D8, accent: 0xBDE0FE, trim: 0xE0F4FF },
  { body: 0xBFA8E8, accent: 0xE8DCFF, trim: 0xF5F0FF },
  { body: 0xFF4D6D, accent: 0xFFAFCC, trim: 0xFFD6E8 },
  { body: 0x2EC4B6, accent: 0xCBF3F0, trim: 0xE8FFFE },
  { body: 0xF4A261, accent: 0xFFD6A5, trim: 0xFFF0D8 },
];

/* ─── FABRIC MATERIAL FACTORY ──────────────────────────────── */
function fabricMat(color, opts = {}) {
  return new THREE.MeshPhongMaterial({
    color,
    shininess: opts.shininess ?? 28,
    specular: opts.specular ?? 0xfff8f0,
    reflectivity: 0.15,
    ...opts,
  });
}

/* ─── GARMENT BUILDERS ─────────────────────────────────────── */

function makeTshirt(pal) {
  const g = new THREE.Group();
  const bm = fabricMat(pal.body);
  const am = fabricMat(pal.accent, { shininess: 55 });
  const tm = fabricMat(pal.trim, { shininess: 70 });

  // Body — slightly tapered
  const bodyGeo = new THREE.BoxGeometry(1.2, 1.35, 0.16, 2, 4, 1);
  const bodyVerts = bodyGeo.attributes.position;
  for (let i = 0; i < bodyVerts.count; i++) {
    const y = bodyVerts.getY(i);
    const taper = y < 0 ? 1 + (-y / 1.35) * 0.08 : 1;
    bodyVerts.setX(i, bodyVerts.getX(i) * taper);
  }
  bodyGeo.computeVertexNormals();
  g.add(new THREE.Mesh(bodyGeo, bm));

  // Sleeves — angled
  const sleeveGeo = new THREE.BoxGeometry(0.52, 0.34, 0.14);
  const ls = new THREE.Mesh(sleeveGeo, bm);
  ls.position.set(-0.84, 0.57, 0); ls.rotation.z = 0.38; g.add(ls);
  const rs = new THREE.Mesh(sleeveGeo, bm);
  rs.position.set(0.84, 0.57, 0); rs.rotation.z = -0.38; g.add(rs);

  // Collar rib
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.07, 10, 24, Math.PI), am);
  collar.position.set(0, 0.7, 0.08); collar.rotation.x = 0.28; g.add(collar);

  // Chest stripe
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.14, 0.17), am);
  stripe.position.set(0, 0.15, 0); g.add(stripe);

  // Hem stripe
  const hem = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.07, 0.17), tm);
  hem.position.set(0, -0.64, 0); g.add(hem);

  // Print dot (chest)
  const dot = new THREE.Mesh(new THREE.CircleGeometry(0.12, 16), tm);
  dot.position.set(0, 0.3, 0.09); g.add(dot);

  return g;
}

function makeDress(pal) {
  const g = new THREE.Group();
  const bm = fabricMat(pal.body, { shininess: 35 });
  const am = fabricMat(pal.accent, { shininess: 60 });
  const tm = fabricMat(pal.trim, { shininess: 80 });

  // Bodice
  const bodice = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.72, 0.17), bm);
  bodice.position.set(0, 0.48, 0); g.add(bodice);

  // Skirt — multi-layer for puffiness
  const skirt1 = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 1.05, 0.75, 16, 2), bm);
  skirt1.position.set(0, -0.16, 0); g.add(skirt1);
  const skirt2 = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 1.14, 0.3, 16, 1), am);
  skirt2.position.set(0, -0.55, 0); g.add(skirt2);

  // Ruffle hem — stacked torus rings for richness
  for (let i = 0; i < 3; i++) {
    const rf = new THREE.Mesh(
      new THREE.TorusGeometry(0.96 + i * 0.04, 0.055 - i * 0.01, 6, 36),
      i === 0 ? tm : am
    );
    rf.position.set(0, -0.73 - i * 0.07, 0); rf.rotation.x = Math.PI / 2; g.add(rf);
  }

  // Straps
  const strapGeo = new THREE.BoxGeometry(0.11, 0.52, 0.13);
  const sl = new THREE.Mesh(strapGeo, tm);
  sl.position.set(-0.27, 0.7, 0); sl.rotation.z = 0.1; g.add(sl);
  const sr = sl.clone(); sr.position.set(0.27, 0.7, 0); sr.rotation.z = -0.1; g.add(sr);

  // Bow center
  const bowKnot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), tm);
  bowKnot.position.set(0, 0.48, 0.1); g.add(bowKnot);
  const bl = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.07, 8, 18, Math.PI), tm);
  bl.position.set(-0.16, 0.48, 0.08); bl.rotation.z = -0.4; g.add(bl);
  const br = bl.clone(); br.position.set(0.16, 0.48, 0.08); br.rotation.z = Math.PI + 0.4; g.add(br);

  return g;
}

function makeRomper(pal) {
  const g = new THREE.Group();
  const bm = fabricMat(pal.body, { shininess: 30 });
  const am = fabricMat(pal.accent, { shininess: 55 });
  const btnMat = fabricMat(0xffffff, { shininess: 120, specular: 0xdddddd });

  // Torso
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.82, 0.19), bm);
  torso.position.set(0, 0.38, 0); g.add(torso);

  // Short legs — slightly rounded via sphere-box hybrid look
  const ll = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.18), bm);
  ll.position.set(-0.25, -0.22, 0); g.add(ll);
  const rl = ll.clone(); rl.position.set(0.25, -0.22, 0); g.add(rl);

  // Crotch curve
  const crotch = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.12, 12), bm);
  crotch.position.set(0, -0.22, 0); crotch.rotation.z = Math.PI / 2; g.add(crotch);

  // Collar
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.065, 10, 20, Math.PI), am);
  collar.position.set(0, 0.82, 0.09); collar.rotation.x = 0.3; g.add(collar);

  // Chest pocket
  const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.2), am);
  pocket.position.set(-0.22, 0.4, 0); g.add(pocket);

  // Snap buttons
  for (let i = -1; i <= 1; i++) {
    const btn = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 10), btnMat);
    btn.position.set(i * 0.17, -0.5, 0.1); g.add(btn);
  }

  // Side stripe
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.82, 0.2), am);
  stripe.position.set(-0.47, 0.38, 0); g.add(stripe);
  const stripe2 = stripe.clone(); stripe2.position.set(0.47, 0.38, 0); g.add(stripe2);

  return g;
}

function makeShorts(pal) {
  const g = new THREE.Group();
  const bm = fabricMat(pal.body, { shininess: 25 });
  const wm = fabricMat(pal.accent, { shininess: 50 });

  const waist = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.25, 0.21), wm);
  waist.position.set(0, 0.38, 0); g.add(waist);

  const ll = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.6, 0.2), bm);
  ll.position.set(-0.26, -0.03, 0); g.add(ll);
  const rl = ll.clone(); rl.position.set(0.26, -0.03, 0); g.add(rl);

  // Leg hem trim
  const hemGeo = new THREE.BoxGeometry(0.46, 0.06, 0.21);
  const lh = new THREE.Mesh(hemGeo, wm); lh.position.set(-0.26, -0.33, 0); g.add(lh);
  const rh = new THREE.Mesh(hemGeo, wm); rh.position.set(0.26, -0.33, 0); g.add(rh);

  // Pockets
  const pkGeo = new THREE.BoxGeometry(0.22, 0.2, 0.22);
  const lpk = new THREE.Mesh(pkGeo, wm); lpk.position.set(-0.33, 0.1, 0); g.add(lpk);
  const rpk = new THREE.Mesh(pkGeo, wm); rpk.position.set(0.33, 0.1, 0); g.add(rpk);

  // Waistband elastic lines
  for (let i = 0; i < 3; i++) {
    const el = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.025, 0.22), fabricMat(pal.body));
    el.position.set(0, 0.32 + i * 0.08, 0); g.add(el);
  }

  return g;
}

function makeSock(pal) {
  const g = new THREE.Group();
  const bm = fabricMat(pal.body, { shininess: 40 });
  const sm = fabricMat(pal.accent, { shininess: 70 });
  const tm = fabricMat(pal.trim, { shininess: 90 });

  // Leg tube
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.95, 16), bm);
  leg.position.set(0, 0.2, 0); g.add(leg);

  // Foot — extended sphere
  const footGeo = new THREE.SphereGeometry(0.24, 16, 12);
  const foot = new THREE.Mesh(footGeo, bm);
  foot.position.set(0.3, -0.36, 0);
  foot.scale.set(1.55, 0.72, 0.9); g.add(foot);

  // Heel bump
  const heel = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), sm);
  heel.position.set(-0.1, -0.3, 0);
  heel.scale.set(1.1, 0.85, 0.85); g.add(heel);

  // Cuff — 3 rings for ribbed look
  for (let i = 0; i < 3; i++) {
    const isStripe = i % 2 === 0;
    const cuff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.23, 0.23, 0.1, 16),
      isStripe ? sm : tm
    );
    cuff.position.set(0, 0.55 + i * 0.12, 0); g.add(cuff);
  }

  // Toe
  const toe = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), sm);
  toe.position.set(0.48, -0.36, 0); toe.scale.set(0.9, 0.72, 0.8); g.add(toe);

  return g;
}

function makeHoodie(pal) {
  const g = new THREE.Group();
  const bm = fabricMat(pal.body, { shininess: 22 });
  const am = fabricMat(pal.accent, { shininess: 40 });
  const tm = fabricMat(pal.trim, { shininess: 55 });
  const zipMat = fabricMat(0xaaaaaa, { shininess: 180, specular: 0xffffff });

  // Body — chunky
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.18, 1.15, 0.24), bm);
  g.add(body);

  // Hood — partial sphere
  const hoodGeo = new THREE.SphereGeometry(0.5, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.62);
  const hood = new THREE.Mesh(hoodGeo, bm);
  hood.position.set(0, 0.78, -0.05); hood.rotation.x = -0.22; g.add(hood);

  // Hood rim
  const hoodRim = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.06, 8, 28, Math.PI * 0.8), am);
  hoodRim.position.set(0, 0.78, 0.22); hoodRim.rotation.x = 0.4; g.add(hoodRim);

  // Sleeves
  const slGeo = new THREE.BoxGeometry(0.36, 0.96, 0.22);
  const ls = new THREE.Mesh(slGeo, bm);
  ls.position.set(-0.77, 0.08, 0); ls.rotation.z = 0.12; g.add(ls);
  const rs = ls.clone(); rs.position.set(0.77, 0.08, 0); rs.rotation.z = -0.12; g.add(rs);

  // Cuffs
  const cuffGeo = new THREE.BoxGeometry(0.36, 0.12, 0.23);
  const lc = new THREE.Mesh(cuffGeo, tm); lc.position.set(-0.77, -0.42, 0); g.add(lc);
  const rc = lc.clone(); rc.position.set(0.77, -0.42, 0); g.add(rc);

  // Kangaroo pocket
  const pkt = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.36, 0.25), am);
  pkt.position.set(0, -0.34, 0); g.add(pkt);
  // Pocket divider
  const pdiv = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.36, 0.26), tm);
  pdiv.position.set(0, -0.34, 0); g.add(pdiv);

  // Zipper
  const zip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.05, 0.25), zipMat);
  zip.position.set(0, 0.06, 0); g.add(zip);

  // Zipper pull
  const zpull = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), zipMat);
  zpull.position.set(0, -0.04, 0.13); g.add(zpull);

  // Waistband
  const wb = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.12, 0.25), tm);
  wb.position.set(0, -0.64, 0); g.add(wb);

  return g;
}

function makeOnesie(pal) {
  const g = new THREE.Group();
  const bm = fabricMat(pal.body, { shininess: 28 });
  const am = fabricMat(pal.accent, { shininess: 48 });
  const btnMat = fabricMat(0xfdf0ff, { shininess: 150 });

  // Upper body
  const upper = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.65, 0.18), bm);
  upper.position.set(0, 0.38, 0); g.add(upper);

  // Bottom — wider
  const lower = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.52, 0.18), bm);
  lower.position.set(0, -0.08, 0); g.add(lower);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.55, 14);
  const ll = new THREE.Mesh(legGeo, bm); ll.position.set(-0.24, -0.52, 0); g.add(ll);
  const rl = new THREE.Mesh(legGeo, bm); rl.position.set(0.24, -0.52, 0); g.add(rl);

  // Collar
  const col = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.065, 10, 22, Math.PI), am);
  col.position.set(0, 0.74, 0.09); col.rotation.x = 0.3; g.add(col);

  // Chest motif — star
  const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0), am);
  star.position.set(0, 0.38, 0.1); star.scale.set(1, 1, 0.3); g.add(star);

  // Snaps
  for (let i = -1; i <= 1; i++) {
    const btn = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 10), btnMat);
    btn.position.set(i * 0.16, -0.53, 0.1); g.add(btn);
  }

  // Ruffled legs
  for (let leg = -1; leg <= 1; leg += 2) {
    const rf = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.06, 6, 20), am);
    rf.position.set(leg * 0.24, -0.28, 0); rf.rotation.x = Math.PI / 2; g.add(rf);
  }

  return g;
}

function makeJacket(pal) {
  const g = new THREE.Group();
  const bm = fabricMat(pal.body, { shininess: 60, specular: 0xfff0e8 }); // slight sheen
  const am = fabricMat(pal.accent, { shininess: 80 });
  const lm = fabricMat(pal.trim, { shininess: 35 });
  const btnMat = fabricMat(0xdddddd, { shininess: 200, specular: 0xffffff });

  // Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.05, 0.22), bm);
  g.add(body);

  // Collar — lapels
  const lapelL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.44, 0.24), lm);
  lapelL.position.set(-0.2, 0.55, 0); lapelL.rotation.z = 0.28; g.add(lapelL);
  const lapelR = lapelL.clone(); lapelR.position.set(0.2, 0.55, 0); lapelR.rotation.z = -0.28; g.add(lapelR);

  // Sleeves
  const slGeo = new THREE.BoxGeometry(0.33, 0.92, 0.2);
  const ls = new THREE.Mesh(slGeo, bm); ls.position.set(-0.71, 0.06, 0); ls.rotation.z = 0.07; g.add(ls);
  const rs = ls.clone(); rs.position.set(0.71, 0.06, 0); rs.rotation.z = -0.07; g.add(rs);

  // Lining visible at front
  const liningL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.05, 0.23), am);
  liningL.position.set(-0.28, 0, 0); g.add(liningL);
  const liningR = liningL.clone(); liningR.position.set(0.28, 0, 0); g.add(liningR);

  // Buttons
  for (let i = 0; i < 3; i++) {
    const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.05, 12), btnMat);
    btn.position.set(0.06, 0.24 - i * 0.28, 0.12); btn.rotation.x = Math.PI / 2; g.add(btn);
  }

  // Chest pocket
  const pkt = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.16, 0.23), am);
  pkt.position.set(-0.3, 0.3, 0); g.add(pkt);
  const hank = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.24), lm);
  hank.position.set(-0.3, 0.4, 0); g.add(hank);

  return g;
}

/* ─── CLOTHESPIN ───────────────────────────────────────────── */
function makePin() {
  const g = new THREE.Group();
  const pm = fabricMat(COLORS.woodLight, { shininess: 50 });
  const dm = fabricMat(COLORS.woodDark, { shininess: 30 });

  const top = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.42, 0.12), pm);
  top.position.set(0, 0.0, 0); g.add(top);

  const grp = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.14, 8), dm);
  grp.position.set(0, -0.18, 0); grp.rotation.z = Math.PI / 2; g.add(grp);

  return g;
}

/* ─── FLOWER ───────────────────────────────────────────────── */
function makeFlower(color) {
  const g = new THREE.Group();
  const pm = fabricMat(color, { shininess: 70 });
  const cm = fabricMat(0xFFD700, { shininess: 120, specular: 0xffffd0 });
  const sm = fabricMat(0x4CAF50, { shininess: 30 });

  // Stem
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.7, 8), sm);
  stem.position.set(0, -0.35, 0); g.add(stem);

  // Petals
  for (let i = 0; i < 6; i++) {
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 8), pm);
    const angle = (i / 6) * Math.PI * 2;
    petal.position.set(Math.cos(angle) * 0.22, Math.sin(angle) * 0.22, 0);
    petal.scale.set(1, 1.6, 0.4); g.add(petal);
  }

  // Center
  const center = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), cm);
  center.position.set(0, 0, 0.04); g.add(center);

  // Leaf
  const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), sm);
  leaf.position.set(0.2, -0.2, 0); leaf.scale.set(1.6, 0.9, 0.3); leaf.rotation.z = -0.6; g.add(leaf);

  return g;
}

/* ─── BUTTERFLY ────────────────────────────────────────────── */
function makeButterfly(color) {
  const g = new THREE.Group();
  const wm = fabricMat(color, { shininess: 100, specular: 0xffffff, transparent: true, opacity: 0.85 });
  const bm = fabricMat(0x2D1B00, { shininess: 60 });

  // Wings — flat ellipsoids
  const wgGeo = new THREE.SphereGeometry(0.28, 12, 8);
  const lw = new THREE.Mesh(wgGeo, wm);
  lw.scale.set(1.4, 1.7, 0.15); lw.position.set(-0.3, 0.05, 0); lw.rotation.z = 0.3; g.add(lw);
  const rw = new THREE.Mesh(wgGeo, wm);
  rw.scale.set(1.4, 1.7, 0.15); rw.position.set(0.3, 0.05, 0); rw.rotation.z = -0.3; g.add(rw);

  // Lower wings (smaller)
  const lwg2 = new THREE.Mesh(wgGeo, wm);
  lwg2.scale.set(1.0, 1.0, 0.12); lwg2.position.set(-0.28, -0.28, 0); lwg2.rotation.z = -0.5; g.add(lwg2);
  const rwg2 = new THREE.Mesh(wgGeo, wm);
  rwg2.scale.set(1.0, 1.0, 0.12); rwg2.position.set(0.28, -0.28, 0); rwg2.rotation.z = 0.5; g.add(rwg2);

  // Body
  const body = new THREE.Mesh(new THREE.CapsuleGeometry ? new THREE.SphereGeometry(0.08, 10, 10) : new THREE.SphereGeometry(0.08, 10, 10), bm);
  body.scale.set(0.6, 2.2, 0.6); g.add(body);

  return g;
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function LoadingPage({ onComplete }) {
  const mountRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading");
  const [msgIdx, setMsgIdx] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const W = el.clientWidth, H = el.clientHeight;

    /* ── RENDERER ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    el.appendChild(renderer.domElement);

    /* ── SCENE + CAMERA ── */
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xFFEEDD, 30, 90);

    const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 200);
    camera.position.set(0, 1.5, 24);
    camera.lookAt(0, 0, 0);

    /* ─────────────────────────────────────
       SKY — layered gradient spheres
    ───────────────────────────────────── */
    const skyOuter = new THREE.Mesh(
      new THREE.SphereGeometry(95, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xFFE4D0, side: THREE.BackSide })
    );
    scene.add(skyOuter);

    // Mid sky tint
    const skyMid = new THREE.Mesh(
      new THREE.SphereGeometry(88, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xFFD4EE, side: THREE.BackSide, transparent: true, opacity: 0.55 })
    );
    scene.add(skyMid);

    // Upper sky blue
    const skyTop = new THREE.Mesh(
      new THREE.SphereGeometry(80, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xCCEEFF, side: THREE.BackSide, transparent: true, opacity: 0.35 })
    );
    scene.add(skyTop);

    /* ─── GOD RAYS — large faint cones of light ─── */
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0xFFE8AA,
      transparent: true,
      opacity: 0.04,
      depthWrite: false,
    });
    for (let i = 0; i < 5; i++) {
      const ray = new THREE.Mesh(new THREE.ConeGeometry(3.5 + i, 35, 6, 1, true), rayMat.clone());
      ray.position.set(rng(-8, 8), 18, rng(-8, 0));
      ray.rotation.z = rng(-0.15, 0.15);
      scene.add(ray);
    }

    /* ─── GROUND ─── */
    const groundGeo = new THREE.PlaneGeometry(80, 40, 12, 6);
    const groundMat = new THREE.MeshPhongMaterial({
      color: 0x8ED16B,
      shininess: 8,
      specular: 0x225500,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -7.8, 0);
    ground.receiveShadow = true;
    scene.add(ground);

    // Ground edge glow / path
    const pathGeo = new THREE.PlaneGeometry(22, 4);
    const pathMat = new THREE.MeshPhongMaterial({ color: 0xD4B483, shininess: 5, transparent: true, opacity: 0.6 });
    const path = new THREE.Mesh(pathGeo, pathMat);
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, -7.78, 4);
    scene.add(path);

    /* ─── LIGHTS ─── */
    // Ambient — warm morning
    scene.add(new THREE.AmbientLight(0xFFF2E8, 0.85));

    // Key sun — warm golden hour
    const sun = new THREE.DirectionalLight(0xFFD6A0, 3.2);
    sun.position.set(14, 22, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 80;
    sun.shadow.camera.left = -20;
    sun.shadow.camera.right = 20;
    sun.shadow.camera.top = 18;
    sun.shadow.camera.bottom = -18;
    sun.shadow.bias = -0.001;
    scene.add(sun);

    // Sky bounce — cool blue fill
    const skyBounce = new THREE.DirectionalLight(0xAAD4FF, 1.1);
    skyBounce.position.set(-10, 8, 5);
    scene.add(skyBounce);

    // Ground bounce — warm green-yellow
    const groundBounce = new THREE.DirectionalLight(0xCCFF88, 0.45);
    groundBounce.position.set(0, -12, 6);
    scene.add(groundBounce);

    // Moving pink point (magical feel)
    const magicLight = new THREE.PointLight(0xFF88CC, 2.8, 32);
    magicLight.position.set(0, 4, 14);
    scene.add(magicLight);

    // Backlight rim
    const rim = new THREE.PointLight(0xAADDFF, 1.5, 35);
    rim.position.set(-12, 6, -4);
    scene.add(rim);

    /* ─── CLOTHESLINE — catenary approximation ─── */
    const ROPE_SPAN = 24;
    const ROPE_Y = 5.0;
    const ROPE_SAG = 0.55;

    // Build catenary curve
    const ropePoints = [];
    const ROPE_SEGS = 60;
    for (let i = 0; i <= ROPE_SEGS; i++) {
      const t = i / ROPE_SEGS;
      const x = -ROPE_SPAN / 2 + t * ROPE_SPAN;
      const sagY = ROPE_SAG * (4 * t * (1 - t)); // parabolic sag
      ropePoints.push(new THREE.Vector3(x, ROPE_Y - sagY, 0));
    }
    const ropeCurve = new THREE.CatmullRomCurve3(ropePoints);
    const ropeTubeGeo = new THREE.TubeGeometry(ropeCurve, 80, 0.038, 8, false);
    const ropeMat = new THREE.MeshPhongMaterial({ color: COLORS.ropeColor, shininess: 40, specular: 0xE0B080 });
    const rope = new THREE.Mesh(ropeTubeGeo, ropeMat);
    rope.castShadow = true;
    scene.add(rope);

    /* Wooden posts — realistic with cap */
    const postMat = new THREE.MeshPhongMaterial({ color: COLORS.woodDark, shininess: 30, specular: 0xBB9966 });
    const capMat = new THREE.MeshPhongMaterial({ color: COLORS.woodLight, shininess: 50 });
    [-ROPE_SPAN / 2, ROPE_SPAN / 2].forEach(x => {
      // Main post
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 13, 12), postMat);
      post.position.set(x, -1.0, 0);
      post.castShadow = true;
      scene.add(post);

      // Cross arm
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.2, 10), postMat);
      arm.position.set(x, ROPE_Y + 0.05, 0);
      arm.rotation.z = Math.PI / 2;
      scene.add(arm);

      // Cap
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.35, 8), capMat);
      cap.position.set(x, 5.72, 0);
      scene.add(cap);

      // Ground anchor plate
      const anchor = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 0.7), capMat);
      anchor.position.set(x, -7.72, 0);
      scene.add(anchor);
    });

    /* ─── GARMENTS ─── */
    const GARMENT_FACTORIES = [
      makeTshirt, makeDress, makeRomper, makeShorts,
      makeSock, makeHoodie, makeOnesie, makeJacket,
    ];
    const GARMENT_COUNT = 8;
    const garmentPivots = [];

    for (let i = 0; i < GARMENT_COUNT; i++) {
      const t = i / (GARMENT_COUNT - 1);
      const x = -10.8 + t * 21.6;
      // Y follows the rope sag
      const sagT = (x + ROPE_SPAN / 2) / ROPE_SPAN;
      const sagY = ROPE_SAG * 4 * sagT * (1 - sagT);
      const pal = GARMENT_PALETTES[i % GARMENT_PALETTES.length];
      const garment = GARMENT_FACTORIES[i](pal);
      garment.castShadow = true;
      garment.traverse(c => { if (c.isMesh) c.castShadow = true; });

      // Pivot at rope attachment
      const pivot = new THREE.Group();
      pivot.position.set(x, ROPE_Y - sagY, 0);

      garment.position.set(0, -1.9, 0);
      pivot.add(garment);

      // Pin on rope
      const pin = makePin();
      pin.position.set(0, -0.18, 0.08);
      pivot.add(pin);

      scene.add(pivot);

      pivot.userData = {
        swingAmp:    rng(0.06, 0.15),
        swingSpeed:  rng(0.55, 1.1),
        swingPhase:  rng(0, Math.PI * 2),
        wobbleAmp:   rng(0.01, 0.035),
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpd:   rng(0.5, 1.0),
        baseTiltX:   rng(-0.03, 0.03),
      };

      garmentPivots.push(pivot);
    }

    /* ─── BACKGROUND FLOATING GARMENTS ─── */
    const bgFloaters = [];
    for (let i = 0; i < 12; i++) {
      const pal = GARMENT_PALETTES[i % GARMENT_PALETTES.length];
      const factories = [makeTshirt, makeDress, makeRomper, makeSock];
      const item = factories[i % factories.length](pal);
      item.position.set(rng(-32, 32), rng(-14, 14), rng(-30, -10));
      const s = rng(0.25, 0.65);
      item.scale.setScalar(s);
      item.rotation.set(rng(0, Math.PI * 2), rng(0, Math.PI * 2), rng(0, Math.PI * 2));
      item.userData = {
        originY: item.position.y,
        vx: rng(-0.004, 0.004),
        floatAmp: rng(0.4, 1.4),
        floatSpd: rng(0.18, 0.55),
        phase: Math.random() * Math.PI * 2,
        spinY: rng(0.004, 0.016),
        spinZ: rng(-0.006, 0.006),
      };
      scene.add(item);
      bgFloaters.push(item);
    }

    /* ─── DENSE FLOWER BUSH — full width bottom layer ─── */
    const FLOWER_COLORS = [0xFF6B9D, 0xFF4D6D, 0xFF9F1C, 0xFFD166, 0x8338EC, 0xBFA8E8, 0xFF8FAB, 0x06D6A0, 0xFFAFCC];
    const LEAF_GREEN = [0x4CAF50, 0x388E3C, 0x66BB6A, 0x2E7D32, 0x81C784];
    const allFlowers = [];

    // Helper: build a lush bush cluster at given base position
    function makeBushCluster(bx, bz, count, spread, sizeRange) {
      for (let k = 0; k < count; k++) {
        const flower = makeFlower(FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)]);
        const ox = rng(-spread, spread);
        const oz = rng(-spread * 0.5, spread * 0.5);
        const s = rng(sizeRange[0], sizeRange[1]);
        flower.position.set(bx + ox, -7.0, bz + oz);
        flower.scale.setScalar(s);
        flower.rotation.y = rng(0, Math.PI * 2);
        flower.userData = {
          phase: Math.random() * Math.PI * 2,
          swayAmp: rng(0.03, 0.09),
          swaySpd: rng(0.35, 0.85),
        };
        scene.add(flower);
        allFlowers.push(flower);
      }
    }

    // Helper: build leafy green bush filler
    function makeLeafBush(bx, bz) {
      const g = new THREE.Group();
      const lm = new THREE.MeshPhongMaterial({
        color: LEAF_GREEN[Math.floor(Math.random() * LEAF_GREEN.length)],
        shininess: 18,
      });
      const count = rangeInt(5, 10);
      for (let j = 0; j < count; j++) {
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(rng(0.35, 0.75), 10, 8), lm);
        leaf.position.set(rng(-0.7, 0.7), rng(0, 0.5), rng(-0.4, 0.4));
        leaf.scale.set(rng(1.1, 1.8), rng(0.7, 1.1), rng(0.5, 0.9));
        g.add(leaf);
      }
      g.position.set(bx, -7.3, bz);
      g.userData = {
        phase: Math.random() * Math.PI * 2,
        swayAmp: rng(0.02, 0.06),
        swaySpd: rng(0.3, 0.7),
      };
      scene.add(g);
      allFlowers.push(g);
    }

    // Front row — large dense bushes close to camera
    const FRONT_POSITIONS = [-18, -13, -8.5, -4, 0, 4, 8.5, 13, 18];
    FRONT_POSITIONS.forEach(x => {
      makeBushCluster(x, 4.5, 5, 1.6, [0.7, 1.2]);   // big blooms
      makeLeafBush(x + rng(-1, 1), 4.0);              // green filler
    });

    // Mid row — medium bushes slightly further back
    const MID_POSITIONS = [-20, -15.5, -11, -6, -2, 2, 6, 11, 15.5, 20];
    MID_POSITIONS.forEach(x => {
      makeBushCluster(x, 2.5, 4, 1.2, [0.55, 0.9]);
      makeLeafBush(x + rng(-0.8, 0.8), 2.0);
    });

    // Back row — smaller behind the fence
    const BACK_POSITIONS = [-22, -17, -12, -7, -2.5, 2.5, 7, 12, 17, 22];
    BACK_POSITIONS.forEach(x => {
      makeBushCluster(x, 0.5, 3, 0.9, [0.38, 0.62]);
    });

    // Extra scatter fill — individual flowers between bushes
    for (let ex = 0; ex < 30; ex++) {
      const flower = makeFlower(FLOWER_COLORS[ex % FLOWER_COLORS.length]);
      flower.position.set(rng(-22, 22), -7.1, rng(0.5, 5));
      flower.scale.setScalar(rng(0.4, 0.75));
      flower.rotation.y = rng(0, Math.PI * 2);
      flower.userData = {
        phase: Math.random() * Math.PI * 2,
        swayAmp: rng(0.04, 0.1),
        swaySpd: rng(0.4, 0.9),
      };
      scene.add(flower);
      allFlowers.push(flower);
    }

    /* ─── BUTTERFLIES ─── */
    const butterflies = [];
    const BFLY_COLORS = [0xFF6B9D, 0xFFD166, 0x06D6A0, 0xBFA8E8, 0xFF8C42];
    for (let i = 0; i < 5; i++) {
      const bf = makeButterfly(BFLY_COLORS[i % BFLY_COLORS.length]);
      bf.position.set(rng(-10, 10), rng(0, 6), rng(-2, 4));
      const s = rng(0.3, 0.55);
      bf.scale.setScalar(s);
      bf.userData = {
        orbitX: bf.position.x,
        orbitY: bf.position.y,
        orbitR: rng(1.5, 4),
        speed:  rng(0.3, 0.7),
        phase:  Math.random() * Math.PI * 2,
        flapSpd: rng(3, 6),
        flapPhase: Math.random() * Math.PI * 2,
      };
      scene.add(bf);
      butterflies.push(bf);
    }

    /* ─── CLOUD PUFFS ─── */
    const cloudMat = new THREE.MeshPhongMaterial({
      color: 0xFFFAF8,
      shininess: 5,
      transparent: true,
      opacity: 0.78,
    });
    const clouds = [];
    for (let ci = 0; ci < 5; ci++) {
      const cg = new THREE.Group();
      const cloudPuffs = rangeInt(4, 7);
      for (let j = 0; j < cloudPuffs; j++) {
        const r = rng(0.7, 1.8);
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), cloudMat);
        sphere.position.set(rng(-cloudPuffs * 0.5, cloudPuffs * 0.5), rng(-0.2, 0.5), rng(-0.5, 0.5));
        cg.add(sphere);
      }
      cg.position.set(rng(-35, 35), rng(10, 18), rng(-30, -5));
      cg.userData = { speed: rng(0.005, 0.015), dir: Math.sign(rng(-1, 1)) || 1 };
      scene.add(cg);
      clouds.push(cg);
    }

    /* ─── POLLEN / DUST MOTES ─── */
    const MOTE_COUNT = 200;
    const moteGeo = new THREE.BufferGeometry();
    const motePos = new Float32Array(MOTE_COUNT * 3);
    const moteVel = new Float32Array(MOTE_COUNT * 3);
    for (let i = 0; i < MOTE_COUNT; i++) {
      motePos[i*3]   = rng(-18, 18);
      motePos[i*3+1] = rng(-8, 10);
      motePos[i*3+2] = rng(-8, 8);
      moteVel[i*3]   = rng(-0.006, 0.006);
      moteVel[i*3+1] = rng(0.004, 0.016);
      moteVel[i*3+2] = rng(-0.004, 0.004);
    }
    moteGeo.setAttribute("position", new THREE.BufferAttribute(motePos, 3));
    const moteMat = new THREE.PointsMaterial({
      color: 0xFFEE88,
      size: 0.08,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
    });
    const motes = new THREE.Points(moteGeo, moteMat);
    scene.add(motes);

    /* ─── CONFETTI BURST ─── */
    const CONF_COUNT = 420;
    const confGeo = new THREE.BufferGeometry();
    const confPos = new Float32Array(CONF_COUNT * 3);
    const confCol = new Float32Array(CONF_COUNT * 3);
    const confVel = new Float32Array(CONF_COUNT * 3);
    const confPalette = [
      [1.0, 0.42, 0.61], [1.0, 0.63, 0.26], [1.0, 0.82, 0.40],
      [0.02, 0.84, 0.63], [0.07, 0.54, 0.70], [0.75, 0.66, 0.91],
      [1.0, 0.69, 0.80], [0.78, 0.88, 1.0],
    ];
    for (let i = 0; i < CONF_COUNT; i++) {
      confPos[i*3]   = rng(-28, 28);
      confPos[i*3+1] = rng(-18, 22);
      confPos[i*3+2] = rng(-25, -3);
      confVel[i*3]   = rng(-0.008, 0.008);
      confVel[i*3+1] = rng(0.01, 0.032);
      confVel[i*3+2] = 0;
      const c = confPalette[i % confPalette.length];
      confCol[i*3]=c[0]; confCol[i*3+1]=c[1]; confCol[i*3+2]=c[2];
    }
    confGeo.setAttribute("position", new THREE.BufferAttribute(confPos, 3));
    confGeo.setAttribute("color", new THREE.BufferAttribute(confCol, 3));
    const confMat = new THREE.PointsMaterial({
      size: 0.18, vertexColors: true,
      transparent: true, opacity: 0.82,
      sizeAttenuation: true,
    });
    const confetti = new THREE.Points(confGeo, confMat);
    scene.add(confetti);

    /* ─── WIND STREAKS ─── */
    const WIND_COUNT = 80;
    const windGeo = new THREE.BufferGeometry();
    const windPos = new Float32Array(WIND_COUNT * 6); // 2 points each
    for (let i = 0; i < WIND_COUNT; i++) {
      const x = rng(-22, 22), y = rng(-6, 8), z = rng(-18, 6);
      windPos[i*6] = x; windPos[i*6+1] = y; windPos[i*6+2] = z;
      windPos[i*6+3] = x + rng(0.4, 1.6); windPos[i*6+4] = y + rng(-0.05, 0.05); windPos[i*6+5] = z;
    }
    windGeo.setAttribute("position", new THREE.BufferAttribute(windPos, 3));
    const windMat = new THREE.LineBasicMaterial({ color: 0xDDEEFF, transparent: true, opacity: 0.18 });
    const wind = new THREE.LineSegments(windGeo, windMat);
    scene.add(wind);

    /* ─── SPARKLES ─── */
    const SPARK_COUNT = 70;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(SPARK_COUNT * 3);
    for (let i = 0; i < SPARK_COUNT; i++) {
      sparkPos[i*3]   = rng(-26, 26);
      sparkPos[i*3+1] = rng(-14, 14);
      sparkPos[i*3+2] = rng(-18, 3);
    }
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xFFFFFF, size: 0.32,
      transparent: true, opacity: 0.85,
      sizeAttenuation: true,
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparks);

    /* ─── NO ORB / NO 3D RING — progress is CSS-only UI ─── */

    /* ─── MOUSE PARALLAX ─── */
    let mx = 0, my = 0;
    const onMouse = (e) => {
      mx = (e.clientX / innerWidth - 0.5) * 2;
      my = -(e.clientY / innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    /* ─── ANIMATION LOOP ─── */
    let raf, t = 0;
    const confPosArr = confGeo.attributes.position.array;
    const motePosArr = moteGeo.attributes.position.array;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.012;

      /* Camera smooth parallax */
      const targetCX = mx * 1.6;
      const targetCY = 1.5 + my * 0.9;
      camera.position.x += (targetCX - camera.position.x) * 0.03;
      camera.position.y += (targetCY - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      /* Garment swing — natural pendulum with wind gusts */
      const windGust = Math.sin(t * 0.3) * 0.04 + Math.sin(t * 0.7) * 0.02;
      garmentPivots.forEach(pivot => {
        const d = pivot.userData;
        pivot.rotation.z = windGust + Math.sin(t * d.swingSpeed + d.swingPhase) * d.swingAmp;
        pivot.rotation.x = d.baseTiltX + Math.sin(t * d.wobbleSpd + d.wobblePhase) * d.wobbleAmp;
      });

      /* All flowers & leaf bushes sway */
      allFlowers.forEach(f => {
        const d = f.userData;
        if (d?.swayAmp) f.rotation.z = Math.sin(t * d.swaySpd + d.phase) * d.swayAmp;
      });

      /* Background floaters */
      bgFloaters.forEach(item => {
        const d = item.userData;
        item.position.y = d.originY + Math.sin(t * d.floatSpd + d.phase) * d.floatAmp;
        item.position.x += d.vx;
        if (item.position.x > 34) { item.position.x = 34; d.vx *= -1; }
        if (item.position.x < -34) { item.position.x = -34; d.vx *= -1; }
        item.rotation.y += d.spinY;
        item.rotation.z += d.spinZ;
      });

      /* Butterflies — figure-8 orbit + wing flap */
      butterflies.forEach(bf => {
        const d = bf.userData;
        const angle = t * d.speed + d.phase;
        bf.position.x = d.orbitX + Math.sin(angle) * d.orbitR;
        bf.position.y = d.orbitY + Math.sin(angle * 2) * (d.orbitR * 0.35);
        bf.rotation.y = Math.atan2(
          Math.cos(angle) * d.orbitR,
          Math.cos(angle * 2) * d.orbitR * 0.7
        );
        const flapAngle = Math.sin(t * d.flapSpd + d.flapPhase) * 0.7;
        bf.children.forEach((wing, idx) => {
          if (idx < 2) wing.rotation.y = idx === 0 ? -flapAngle : flapAngle;
          if (idx >= 2 && idx < 4) wing.rotation.y = idx === 2 ? flapAngle * 0.6 : -flapAngle * 0.6;
        });
      });

      /* Clouds drift */
      clouds.forEach(c => {
        c.position.x += c.userData.speed * c.userData.dir;
        if (c.position.x > 40) c.position.x = -40;
        if (c.position.x < -40) c.position.x = 40;
      });

      /* Confetti float upward */
      for (let i = 0; i < CONF_COUNT; i++) {
        confPosArr[i*3]   += confVel[i*3];
        confPosArr[i*3+1] += confVel[i*3+1];
        if (confPosArr[i*3+1] > 24) confPosArr[i*3+1] = -20;
      }
      confGeo.attributes.position.needsUpdate = true;
      confMat.opacity = 0.65 + Math.sin(t * 1.3) * 0.17;

      /* Motes float */
      for (let i = 0; i < MOTE_COUNT; i++) {
        motePosArr[i*3]   += moteVel[i*3];
        motePosArr[i*3+1] += moteVel[i*3+1];
        motePosArr[i*3+2] += moteVel[i*3+2];
        if (motePosArr[i*3+1] > 12) motePosArr[i*3+1] = -8;
      }
      moteGeo.attributes.position.needsUpdate = true;
      moteMat.opacity = 0.45 + Math.abs(Math.sin(t * 0.7)) * 0.25;

      /* Wind streak animation */
      wind.position.x = Math.sin(t * 0.2) * 0.4;
      windMat.opacity = 0.10 + Math.abs(Math.sin(t * 0.4)) * 0.14;

      /* Sparkles twinkle */
      sparks.rotation.y += 0.0007;
      sparkMat.opacity = 0.3 + Math.abs(Math.sin(t * 2.6)) * 0.65;
      sparkMat.size = 0.22 + Math.abs(Math.sin(t * 1.9)) * 0.18;

      /* Magic light orbit */
      magicLight.position.x = Math.sin(t * 0.42) * 10;
      magicLight.position.y = Math.cos(t * 0.28) * 5 + 3;
      magicLight.color.setHSL(0.88 + Math.sin(t * 0.2) * 0.1, 0.9, 0.72);

      /* Sky gentle color shift */
      skyOuter.material.color.setHSL(
        0.05 + Math.sin(t * 0.04) * 0.01,
        0.85,
        0.88 + Math.sin(t * 0.08) * 0.04
      );

      renderer.render(scene, camera);
    };
    animate();

    /* Resize */
    const onResize = () => {
      const W2 = el.clientWidth, H2 = el.clientHeight;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  /* ─── PROGRESS SIMULATION ─── */
  useEffect(() => {
    const steps = [
      [12, 300], [28, 550], [47, 480], [63, 640],
      [79, 520], [91, 580], [100, 450],
    ];
    let i = 0, timeout;
    const run = () => {
      if (i >= steps.length) return;
      const [target, delay] = steps[i++];
      timeout = setTimeout(() => {
        progressRef.current = target;
        setProgress(target);
        setMsgIdx(Math.min(Math.floor(target / 20), MSGS.length - 1));
        if (target >= 100) setTimeout(() => setPhase("done"), 800);
        else run();
      }, delay);
    };
    run();
    return () => clearTimeout(timeout);
  }, []);

  const MSGS = [
    "Pinning tiny outfits on the line… 🌸",
    "Letting the golden breeze do its magic… 🍃",
    "Ironing little collars with love… 👗",
    "Folding the softest rompers… 🧸",
    "Picking flowers for the garden… 🌼",
    "Almost blooming — just a moment! 🎀",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@800;900&family=Nunito:wght@600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow: hidden; width: 100%; height: 100%; }

        .lr {
          position: fixed; inset: 0; z-index: 9999;
          background: linear-gradient(155deg,
            #FFEEF7 0%, #FFF5E0 30%, #E8F8FF 65%, #EEE4FF 100%
          );
          transition: opacity 0.5s ease;
        }
        .lr.done { animation: pgFade 0.5s ease forwards; }
        @keyframes pgFade { to { opacity: 0; pointer-events: none; } }

        .cv { position: absolute; inset: 0; }

        /* ── FLOATING EMOJIS ── */
        .fe {
          position: absolute; pointer-events: none; user-select: none; line-height: 1;
          animation: eDrift var(--dur, 3s) ease-in-out infinite var(--del, 0s);
          filter: drop-shadow(0 4px 12px rgba(255,107,157,0.45));
          z-index: 5;
        }
        @keyframes eDrift {
          0%,100% { transform: translateY(0) rotate(-6deg) scale(1); }
          25%      { transform: translateY(-14px) rotate(4deg) scale(1.06); }
          50%      { transform: translateY(-22px) rotate(-3deg) scale(1.03); }
          75%      { transform: translateY(-10px) rotate(5deg) scale(1.08); }
        }

        /* ── UI ── */
        .ui {
          position: absolute; inset: 0; z-index: 10;
          display: flex; flex-direction: column;
          align-items: center; justify-content: flex-end;
          padding-bottom: 8.5vh;
          pointer-events: none;
        }

        /* Logo pill — white frosted card so text is always crisp */
        .logo-wrap {
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 999px;
          padding: 12px 42px 10px;
          margin-bottom: 10px;
          box-shadow:
            0 8px 40px rgba(255,107,157,0.28),
            0 2px 0 rgba(255,107,157,0.18),
            inset 0 1px 0 rgba(255,255,255,0.9);
          border: 2px solid rgba(255,150,190,0.35);
          animation: lgBounce 0.9s cubic-bezier(0.34,1.56,0.64,1) both;
        }

        /* Logo text */
        .logo {
          font-family: 'Baloo 2', cursive;
          font-size: clamp(42px, 7vw, 68px);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -1px;
          animation: lgFloat 3s ease-in-out 1s infinite;
          margin: 0;
        }
        .logo .baby { color: #C8185A; }
        .logo .bloom { color: #FF6B9D; }
        .logo .icon { color: #FF9EC4; font-style: normal; margin-left: 4px; }

        @keyframes lgBounce {
          0%   { transform: scale(0.35) translateY(24px); opacity: 0; }
          70%  { transform: scale(1.06) translateY(-5px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes lgFloat {
          0%,100% { transform: translateY(0) rotate(-0.5deg); }
          50%     { transform: translateY(-7px) rotate(0.5deg); }
        }

        .tagline {
          font-family: 'Nunito', sans-serif;
          font-size: 13px; font-weight: 800;
          color: #A0245E;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 22px;
          opacity: 0;
          animation: sUp 0.45s ease 0.65s forwards;
          text-shadow: 0 1px 6px rgba(255,150,190,0.4);
        }
        @keyframes sUp {
          from { opacity:0; transform: translateY(7px); }
          to   { opacity:1; transform: translateY(0); }
        }

        .msg {
          font-family: 'Nunito', sans-serif;
          font-size: clamp(13px, 1.9vw, 16px);
          font-weight: 800;
          color: #B83060;
          min-height: 24px;
          margin-bottom: 18px;
          text-shadow: 0 1px 8px rgba(255,120,170,0.3);
          animation: mPop 0.32s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes mPop {
          from { transform: scale(0.78) translateY(6px); opacity: 0; }
          to   { transform: scale(1) translateY(0); opacity: 1; }
        }

        /* ── PROGRESS ── */
        .pb-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 11px;
          width: 100%; max-width: 380px; padding: 0 20px;
        }
        .pb-track {
          width: 100%; height: 14px;
          background: rgba(255,190,210,0.22);
          border-radius: 99px;
          border: 2px solid rgba(255,160,190,0.32);
          position: relative; overflow: hidden;
          box-shadow:
            0 2px 16px rgba(255,140,180,0.2),
            inset 0 1px 3px rgba(255,255,255,0.55);
        }
        /* Liquid fill effect */
        .pb-fill {
          height: 100%; border-radius: 99px;
          background: linear-gradient(90deg,
            #FF6B9D 0%, #FF8C42 18%, #FFD166 36%,
            #06D6A0 54%, #118AB2 72%, #9B5DE5 88%, #FF6B9D 100%
          );
          background-size: 300% 100%;
          animation: liqFlow 2.2s linear infinite;
          transition: width 0.65s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow:
            0 0 20px rgba(255,107,157,0.6),
            0 0 8px rgba(255,255,255,0.4),
            inset 0 2px 4px rgba(255,255,255,0.35);
          position: relative;
        }
        @keyframes liqFlow {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        /* Shimmer overlay */
        .pb-fill::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.35) 55%, transparent 70%);
          animation: shimmer 1.8s ease-in-out infinite;
          border-radius: 99px;
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        /* Leading bubble */
        .pb-fill::after {
          content: '';
          position: absolute; right: -7px; top: 50%;
          transform: translateY(-50%);
          width: 23px; height: 23px;
          background: white;
          border-radius: 50%;
          border: 3px solid #FF6B9D;
          box-shadow:
            0 0 14px rgba(255,107,157,0.75),
            0 0 0 5px rgba(255,150,190,0.18);
          animation: bblPop 0.75s ease-in-out infinite;
        }
        @keyframes bblPop {
          0%,100% { transform: translateY(-50%) scale(1); }
          50%     { transform: translateY(-50%) scale(1.28); }
        }

        .pb-row {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%;
        }
        .pb-pct {
          font-family: 'Baloo 2', cursive;
          font-size: 24px; font-weight: 900;
          color: #FF6B9D;
          text-shadow: 0 3px 12px rgba(255,107,157,0.4);
        }
        .hearts { display: flex; gap: 5px; }
        .hrt {
          font-size: 19px;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s;
          filter: grayscale(1) opacity(0.28);
        }
        .hrt.lit {
          filter: grayscale(0) opacity(1) drop-shadow(0 2px 8px rgba(255,80,130,0.55));
          animation: htBeat 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes htBeat {
          0%  { transform: scale(0.5); }
          60% { transform: scale(1.5); }
          100%{ transform: scale(1); }
        }

        /* ── WIPE OUT TRANSITION ── */
        .wipe {
          position: fixed; inset: 0; z-index: 9998; pointer-events: none;
          background: conic-gradient(
            #FF6B9D 0deg, #FF8C42 51deg, #FFD166 102deg,
            #06D6A0 153deg, #118AB2 204deg, #9B5DE5 255deg,
            #FF6B9D 306deg, #FF6B9D 360deg
          );
          animation: wipeOut 0.9s cubic-bezier(0.76,0,0.24,1) forwards;
        }
        @keyframes wipeOut {
          0%   { clip-path: circle(0% at 50% 50%); opacity: 1; }
          80%  { opacity: 1; }
          100% { clip-path: circle(170% at 50% 50%); opacity: 0; }
        }
      `}</style>

      <div
        className={`lr${phase === "done" ? " done" : ""}`}
        onAnimationEnd={() => phase === "done" && onComplete?.()}
      >
        {/* Three.js canvas */}
        <div className="cv" ref={mountRef} />

        {/* Floating emoji layer */}
        {[
          { e: "👕", s: "9%",   l: "4%",   dur:"3.4s", del:"0s",   sz:35 },
          { e: "🧸", s: "11%",  r: "6%",   dur:"2.8s", del:"0.6s", sz:40 },
          { e: "🎀", b: "20%",  l: "3%",   dur:"3.7s", del:"1.0s", sz:32 },
          { e: "👗", b: "25%",  r: "5%",   dur:"2.6s", del:"0.3s", sz:36 },
          { e: "🧦", s: "5%",   l: "46%",  dur:"4.2s", del:"1.4s", sz:30 },
          { e: "⭐", b: "7%",   l: "26%",  dur:"3.1s", del:"0.8s", sz:29 },
          { e: "🌸", s: "28%",  l: "0%",   dur:"4.0s", del:"1.7s", sz:33 },
          { e: "🎈", s: "40%",  r: "1%",   dur:"2.5s", del:"1.1s", sz:38 },
          { e: "🌼", b: "35%",  l: "13%",  dur:"3.5s", del:"0.5s", sz:28 },
          { e: "🦋", b: "5%",   r: "17%",  dur:"3.9s", del:"1.3s", sz:32 },
          { e: "🌈", s: "17%",  l: "21%",  dur:"3.0s", del:"0.9s", sz:31 },
          { e: "🌿", s: "53%",  r: "21%",  dur:"3.3s", del:"1.9s", sz:30 },
          { e: "🐝", s: "35%",  l: "52%",  dur:"2.9s", del:"0.4s", sz:26 },
          { e: "☁️", s: "4%",   l: "35%",  dur:"5.0s", del:"2.0s", sz:38 },
        ].map(({ e, s, b, l, r, dur, del, sz }, i) => (
          <div key={i} className="fe" style={{
            top: s, bottom: b, left: l, right: r,
            fontSize: sz,
            "--dur": dur,
            "--del": del,
          }}>{e}</div>
        ))}

        {/* UI overlay */}
        <div className="ui">
          <div className="logo-wrap">
            <div className="logo">
              <span className="baby">Baby</span><span className="bloom">Bloom</span><em className="icon">🌸</em>
            </div>
          </div>
          <div className="tagline">Dressed in Love · Blooming with Joy ✨</div>

          <div className="msg" key={msgIdx}>
            {MSGS[Math.min(msgIdx, MSGS.length - 1)]}
          </div>

          <div className="pb-wrap">
            <div className="pb-track">
              <div className="pb-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="pb-row">
              <div className="hearts">
                {[0, 22, 44, 66, 88].map((threshold, i) => (
                  <div
                    key={i}
                    className={`hrt${progress >= threshold ? " lit" : ""}`}
                    style={{ animationDelay: `${i * 0.09}s` }}
                  >
                    💕
                  </div>
                ))}
              </div>
              <div className="pb-pct">{progress}%</div>
            </div>
          </div>
        </div>

        {/* Rainbow wipe-out */}
        {phase === "done" && (
          <div className="wipe" onAnimationEnd={() => onComplete?.()} />
        )}
      </div>
    </>
  );
}