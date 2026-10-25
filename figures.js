/* Home Sculpt Pilates – original vector illustrations (body figures, poses, scenes) */
(function (g) {
  const R = n => Math.round(n * 10) / 10;
  const P = p => R(p[0]) + ',' + R(p[1]);
  function cr(pts) {
    let d = '';
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += 'C' + P([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]) + ' ' +
        P([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]) + ' ' + P(p2);
    }
    return d;
  }
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const c = v => Math.max(0, Math.min(255, v));
    const r = c((n >> 16) + amt), gg = c(((n >> 8) & 255) + amt), b = c((n & 255) + amt);
    return '#' + ((1 << 24) + (r << 16) + (gg << 8) + b).toString(16).slice(1);
  }
  const DEF = { skin: '#F1C6A6', hair: '#3A2A24', outfit: '#F6B3CF' };
  let uid = 0;
  function wrap(vb, inner, pos, cls) {
    if (pos) return `<svg x="${pos.x}" y="${pos.y}" width="${pos.w}" height="${pos.h}" viewBox="${vb}">${inner}</svg>`;
    return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet" class="${cls || ''}">${inner}</svg>`;
  }

  /* ---------- Front-facing body figure ---------- */
  function body(o = {}, pos) {
    const fat = o.fat ?? 0.3, cv = o.curvy || 0;
    const sk = o.skin || DEF.skin, hr = o.hair || DEF.hair, of = o.outfit || DEF.outfit;
    const ofD = shade(of, -30), skD = shade(sk, -24), id = 'hsp' + (++uid);
    const s = 23 + 6 * fat, c = 18 + 9 * fat, w = 12.5 + 15 * fat - 3.5 * cv, h = 20 + 15 * fat + 5 * cv;
    const L = [[60 - s, 62], [60 - c, 82], [60 - w, 110], [60 - h, 136], [60 - h + 1.5, 160], [60 - h + 3, 178]];
    const Rr = L.map(p => [120 - p[0], p[1]]).reverse();
    const torso = `M52,51 Q${R(60 - s + 2)},52 ${P(L[0])} ${cr(L)} L58.5,178 L60,170 L61.5,178 L${P(Rr[0])} ${cr(Rr)} Q${R(60 + s - 2)},52 68,51 Z`;

    function leg(side) {
      const ox = 60 - h + 3, ix = 59, xl = (ox + ix) / 2, tw = (ix - ox) / 2;
      const xk = 60 - 7 - 3 * fat, kw = 5.5 + 3 * fat, cw = 6 + 3.5 * fat, xa = 60 - 8;
      let pts = [[xl - tw, 168], [xk - kw, 212], [xk - 0.5 - cw, 229], [xa - 3.2, 250],
        [xa + 3.2, 250], [xk - 0.5 + cw - 1.5, 229], [xk + kw, 212], [xl + tw, 168]];
      if (side > 0) pts = pts.map(p => [120 - p[0], p[1]]);
      const a = pts.slice(0, 4), b = pts.slice(4);
      const fx = side > 0 ? 120 - (xa - 1.5) : xa - 1.5;
      return `<path d="M${P(a[0])} ${cr(a)} L${P(b[0])} ${cr(b)} Z" fill="${sk}"/><ellipse cx="${R(fx)}" cy="253" rx="6" ry="3.4" fill="${skD}"/>`;
    }
    function arm(side) {
      const a = 4 + 3 * fat;
      const X = x => side > 0 ? 120 - x : x;
      const sx = 60 - s + 4.5, hx = 60 - Math.max(s + 1, h + a + 1.5), ex = Math.min(sx - 3, 60 - Math.max(s + 2, c + a + 1));
      const t = 0.3, bx = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * (ex - 1) + t * t * hx, by = (1 - t) * (1 - t) * 65 + 2 * (1 - t) * t * 103 + t * t * 140;
      return {
        arm: `<path d="M${R(X(sx))},65 Q${R(X(ex - 1))},103 ${R(X(hx))},140" stroke="${sk}" stroke-width="${R(2 * a)}" stroke-linecap="round" fill="none"/><circle cx="${R(X(hx))}" cy="141" r="${R(a + 0.6)}" fill="${sk}"/>`,
        sleeve: `<path d="M${R(X(sx))},65 L${R(X(bx))},${R(by)}" stroke="${of}" stroke-width="${R(2 * a + 2.5)}" stroke-linecap="round"/>`
      };
    }
    const aL = arm(-1), aR = arm(1);
    const hairBack = o.shortHair
      ? `<ellipse cx="60" cy="26" rx="15.5" ry="15" fill="${hr}"/>`
      : `<ellipse cx="60" cy="27" rx="16" ry="17.5" fill="${hr}"/>`;
    const bun = o.shortHair ? '' : `<circle cx="60" cy="9" r="6.5" fill="${hr}"/>`;
    const head = `<ellipse cx="60" cy="29" rx="13.2" ry="15" fill="${sk}"/>` +
      `<path d="M46.5,30 Q45,10 60,10 Q75,10 73.5,30 Q71,19 62,17.5 Q52,19 46.5,30Z" fill="${hr}"/>` +
      `<circle cx="54.6" cy="30" r="1.5" fill="#3B2B2B"/><circle cx="65.4" cy="30" r="1.5" fill="#3B2B2B"/>` +
      `<path d="M55.5,36.5 Q60,40 64.5,36.5" stroke="#B65F6A" stroke-width="1.4" fill="none" stroke-linecap="round"/>` +
      `<circle cx="51.5" cy="34.5" r="2.4" fill="#F29BAA" opacity=".35"/><circle cx="68.5" cy="34.5" r="2.4" fill="#F29BAA" opacity=".35"/>`;
    const abs = o.toned ? `<g stroke="${ofD}" stroke-width="1" opacity=".45" fill="none" stroke-linecap="round"><path d="M60,94 L60,126"/><path d="M53,104 Q56.5,106 59,104.5"/><path d="M61,104.5 Q63.5,106 67,104"/><path d="M53.5,114 Q56.5,116 59,114.5"/><path d="M61,114.5 Q63.5,116 66.5,114"/></g>` : '';
    let zones = '';
    if (o.zones) {
      const z = (k, sh) => `<g class="zone" data-zone="${k}" fill="#F45B9B" fill-opacity=".38" stroke="#F45B9B" stroke-width="1.2" stroke-dasharray="3 2">${sh}</g>`;
      const tx = (60 - h + 3 + 59) / 2;
      zones = z('chest', `<ellipse cx="60" cy="80" rx="${R(c * .85)}" ry="9"/>`) +
        z('belly', `<ellipse cx="60" cy="112" rx="${R(w + 1)}" ry="11"/>`) +
        z('butt', `<ellipse cx="${R(60 - h + 6)}" cy="142" rx="6" ry="11"/><ellipse cx="${R(60 + h - 6)}" cy="142" rx="6" ry="11"/>`) +
        z('thighs', `<ellipse cx="${R(tx)}" cy="190" rx="${R((59 - (60 - h + 3)) / 2 - 1)}" ry="15"/><ellipse cx="${R(120 - tx)}" cy="190" rx="${R((59 - (60 - h + 3)) / 2 - 1)}" ry="15"/>`) +
        z('arms', `<ellipse cx="${R(60 - s - 1)}" cy="92" rx="${R(5 + 3 * fat)}" ry="17"/><ellipse cx="${R(60 + s + 1)}" cy="92" rx="${R(5 + 3 * fat)}" ry="17"/>`) +
        z('back', `<ellipse cx="60" cy="62" rx="${R(s - 4)}" ry="6"/>`);
    }
    const defs = `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${ofD}"/><stop offset=".3" stop-color="${of}"/><stop offset=".7" stop-color="${of}"/><stop offset="1" stop-color="${ofD}"/></linearGradient></defs>`;
    const inner = defs + hairBack + bun + `<rect x="54" y="38" width="12" height="16" rx="4" fill="${skD}"/>` +
      leg(-1) + leg(1) + aL.arm + aR.arm + `<path d="${torso}" fill="url(#${id})"/>` + aL.sleeve + aR.sleeve + abs + zones + head;
    const vb = o.crop === 'bust' ? '14 0 92 118' : '0 0 120 262';
    return wrap(vb, inner, pos, o.cls);
  }

  /* ---------- Side-view exercise poses ---------- */
  const POSES = {
    kick: { H: [170, 70], N: [150, 80], P: [95, 82], far: { K: [95, 122], F: [57, 124], E: [146, 104], W: [146, 126] }, near: { K: [57, 78], F: [52, 42], E: [152, 104], W: [152, 126] } },
    bridge: { H: [48, 118], N: [68, 120], P: [118, 96], far: { K: [152, 76], F: [160, 124], E: [92, 124], W: [118, 125] }, near: { K: [156, 80], F: [166, 124], E: [94, 124], W: [120, 125] } },
    plank: { H: [183, 91], N: [165, 98], P: [112, 104], far: { K: [74, 113], F: [38, 123], E: [160, 124], W: [184, 124] }, near: { K: [74, 115], F: [40, 124], E: [166, 124], W: [190, 124] } },
    side: { H: [60, 88], N: [72, 104], P: [126, 112], far: { K: [165, 118], F: [203, 121], E: [66, 126], W: [92, 127] }, near: { K: [163, 98], F: [199, 84], E: [90, 96], W: [112, 104] } },
    rollup: { H: [131, 55], N: [122, 72], P: [100, 120], far: { K: [140, 121], F: [178, 123], E: [146, 80], W: [172, 88] }, near: { K: [140, 123], F: [178, 124], E: [150, 84], W: [176, 92] } }
  };
  function pose(name, o = {}, pos) {
    const p = POSES[name], sk = o.skin || DEF.skin, hr = o.hair || DEF.hair, of = o.outfit || DEF.outfit;
    const skD = shade(sk, -25), ofD = shade(of, -30);
    const ln = (a, b, w, c) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
    const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const arms = (L, s) => ln(p.N, L.E, 7.5, s) + ln(L.E, L.W, 6.5, s) + `<circle cx="${L.W[0]}" cy="${L.W[1]}" r="3.6" fill="${s}"/>`;
    const legs = (L, s, o2) => ln(p.P, L.K, 13, s) + ln(L.K, L.F, 9, s) + `<circle cx="${L.F[0]}" cy="${L.F[1]}" r="4.6" fill="${s}"/>` + ln(p.P, lerp(p.P, L.K, .5), 15, o2);
    const dx = p.H[0] - p.N[0], dy = p.H[1] - p.N[1], d = Math.hypot(dx, dy), u = [dx / d, dy / d];
    const head = ln(p.N, p.H, 7, sk) +
      `<circle cx="${R(p.H[0] + u[0] * 11)}" cy="${R(p.H[1] + u[1] * 11)}" r="4.5" fill="${hr}"/>` +
      `<circle cx="${R(p.H[0] + u[0] * 1.5)}" cy="${R(p.H[1] + u[1] * 1.5)}" r="10.5" fill="${hr}"/>` +
      `<circle cx="${R(p.H[0] - u[0])}" cy="${R(p.H[1] - u[1])}" r="9" fill="${sk}"/>`;
    const mat = o.mat === false ? '' : `<rect x="14" y="126" width="212" height="6" rx="3" fill="#F6B3CF"/>`;
    const inner = mat + arms(p.far, skD) + legs(p.far, skD, ofD) + ln(p.N, p.P, 22, of) + legs(p.near, sk, of) + arms(p.near, sk) + head;
    return wrap('0 0 240 140', inner, pos, o.cls);
  }

  /* ---------- Composed scenes for info screens ---------- */
  const SH = `<defs><filter id="hspSh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000" flood-opacity=".12"/></filter></defs>`;
  function card(x, y, title, sub, pz) {
    return `<g filter="url(#hspSh)"><rect x="${x}" y="${y}" width="132" height="100" rx="12" fill="#fff"/></g>` +
      `<rect x="${x + 8}" y="${y + 8}" width="116" height="56" rx="8" fill="#F3EEF1"/>` +
      pose(pz, { mat: true }, { x: x + 10, y: y + 10, w: 112, h: 54 }) +
      `<text x="${x + 10}" y="${y + 80}" font-size="10.5" font-weight="700" fill="#1E1E24">${title}</text>` +
      `<text x="${x + 10}" y="${y + 93}" font-size="8.5" fill="#7A7A85">${sub}</text>`;
  }
  function devices(pz) {
    return `<rect x="22" y="36" width="210" height="130" rx="9" fill="#2B2B33"/><rect x="30" y="44" width="194" height="114" rx="3" fill="#F3EEF1"/>` +
      pose(pz, {}, { x: 40, y: 56, w: 174, h: 101 }) +
      `<text x="127" y="62" font-size="12" font-weight="700" text-anchor="middle" fill="#C9C3C7">0:21</text>` +
      `<circle cx="127" cy="100" r="14" fill="#fff" opacity=".75"/><path d="M122,92 L134,100 L122,108Z" fill="#F45B9B"/>` +
      `<rect x="40" y="150" width="174" height="3" rx="1.5" fill="#DCD6DA"/><rect x="40" y="150" width="62" height="3" rx="1.5" fill="#F45B9B"/>` +
      `<path d="M8,166 L246,166 L256,178 L-2,178Z" fill="#C9C9D1"/>` +
      `<rect x="232" y="74" width="70" height="134" rx="12" fill="#2B2B33"/><rect x="237" y="82" width="60" height="118" rx="7" fill="#F3EEF1"/>` +
      body({ fat: .2, toned: true }, { x: 245, y: 90, w: 44, h: 104 }) +
      `<rect x="243" y="194" width="48" height="2.5" rx="1.25" fill="#F45B9B"/>`;
  }
  const scenes = {
    crush: () => `<ellipse cx="160" cy="224" rx="110" ry="6" fill="#000" opacity=".05"/>` +
      body({ fat: .22, toned: true }, { x: 104, y: 6, w: 102, h: 222 }) +
      `<rect x="226" y="70" width="32" height="152" rx="16" fill="#F6B3CF"/><ellipse cx="242" cy="78" rx="16" ry="8" fill="#EE93B8"/><ellipse cx="242" cy="78" rx="6" ry="3" fill="#F6B3CF"/>` +
      `<g fill="#BDB6DA"><rect x="38" y="204" width="48" height="8" rx="4"/><rect x="34" y="194" width="13" height="28" rx="5"/><rect x="77" y="194" width="13" height="28" rx="5"/></g>`,
    fit: () => devices('rollup'),
    kick: () => pose('kick', {}, { x: 10, y: 30, w: 300, h: 175 }),
    zones: () => devices('bridge'),
    posture: () => pose('plank', {}, { x: 10, y: 54, w: 300, h: 175 }) + card(12, 8, 'Core Strength Workout', '12 min &#183; Beginner', 'side'),
    ace: () => pose('side', {}, { x: 4, y: 58, w: 300, h: 175 }) +
      `<g filter="url(#hspSh)"><rect x="160" y="10" width="152" height="90" rx="12" fill="#fff"/></g>` +
      ['Step-by-step videos', 'Form cues for each move', 'Beginner-friendly'].map((t, i) =>
        `<circle cx="176" cy="${34 + i * 24}" r="7" fill="#F45B9B"/><path d="M172.5,${34 + i * 24} l2.5,2.5 l4.5,-5" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/><text x="188" y="${38 + i * 24}" font-size="10" font-weight="600" fill="#1E1E24">${t}</text>`).join(''),
    energy: () => body({ fat: .2, toned: true, skin: '#E0A882', hair: '#2A1C17' }, { x: 40, y: 8, w: 100, h: 218 }) + card(170, 60, 'Morning Energy Boost', '10 min &#183; All levels', 'rollup')
  };
  function scene(name) {
    return `<svg viewBox="0 0 320 230" xmlns="http://www.w3.org/2000/svg" font-family="Inter,system-ui,sans-serif">${SH}${scenes[name]()}</svg>`;
  }

  g.HSPFig = { body, pose, scene };
})(window);
