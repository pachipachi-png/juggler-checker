// 小役カウンター（機種ページ共通）
// 各ページで SettiCounter.init({...}) を呼ぶ。数える項目を1画面に大きいボタンで並べ、
// 押した数を判別ページの入力欄に書き込んで、その場で判別結果（凡例）を更新する。
(function () {
  var css = ''
    + '.sc-fab,.sc-ov button{width:auto;margin:0;letter-spacing:normal;}'
    + '.sc-fab{position:fixed;right:14px;bottom:16px;z-index:900;display:flex;align-items:center;gap:6px;'
    + 'background:var(--gold);color:#1a1408;border:none;border-radius:999px;padding:12px 18px;'
    + 'font-family:"Zen Kaku Gothic New",sans-serif;font-weight:900;font-size:14.5px;'
    + 'box-shadow:0 6px 20px #0008;cursor:pointer;touch-action:manipulation;}'
    + '.sc-fab .sc-dot{width:8px;height:8px;border-radius:50%;background:#1a1408;opacity:.35;}'
    + '.sc-fab.on .sc-dot{background:#c0392b;opacity:1;}'
    + '.sc-ov{position:fixed;inset:0;z-index:1000;background:var(--bg);color:var(--text);display:none;'
    + 'flex-direction:column;overscroll-behavior:contain;}'
    + '.sc-ov.open{display:flex;}'
    + '.sc-head{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--line);}'
    + '.sc-msel{width:100%;margin:0 0 12px;background:var(--panel-2);border:1px solid var(--line);border-radius:10px;'
    + 'color:var(--text);font-size:14px;padding:10px 12px;font-family:inherit;}'
    + '.sc-head h2{margin:0;font-size:15px;font-family:"Zen Kaku Gothic New",sans-serif;font-weight:900;flex:1;'
    + 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}'
    + '.sc-close{background:var(--panel-2);color:var(--text);border:1px solid var(--line);border-radius:10px;'
    + 'padding:8px 12px;font-size:13px;font-weight:700;font-family:inherit;cursor:pointer;}'
    + '.sc-res{padding:10px 16px;background:var(--panel);border-bottom:1px solid var(--line);font-size:13px;'
    + 'min-height:44px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;}'
    + '.sc-res b{color:var(--gold);font-size:16px;}'
    + '.sc-res .sc-bar{flex-basis:100%;height:6px;border-radius:3px;background:var(--panel-2);overflow:hidden;display:flex;}'
    + '.sc-res .sc-bar span{display:block;height:100%;}'
    + '.sc-body{flex:1;overflow-y:auto;padding:14px 16px 20px;-webkit-overflow-scrolling:touch;}'
    + '.sc-g{display:flex;align-items:center;gap:10px;margin-bottom:14px;}'
    + '.sc-g label{font-size:13px;color:var(--muted);flex-shrink:0;}'
    + '.sc-g input{flex:1;min-width:0;background:var(--panel-2);border:1px solid var(--line);border-radius:10px;'
    + 'color:var(--text);font-size:20px;font-weight:700;padding:10px 12px;font-family:inherit;}'
    + '.sc-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}'
    + '.sc-tile{position:relative;background:var(--panel);border:1px solid var(--line);border-radius:16px;'
    + 'min-height:118px;padding:12px;display:flex;flex-direction:column;justify-content:space-between;'
    + 'cursor:pointer;user-select:none;-webkit-user-select:none;touch-action:manipulation;'
    + '-webkit-tap-highlight-color:transparent;transition:transform .06s,background .12s;}'
    + '.sc-tile:active,.sc-tile.hit{transform:scale(.97);background:var(--panel-2);}'
    + '.sc-tile .sc-lb{font-size:13.5px;font-weight:700;color:var(--muted);padding-right:40px;}'
    + '.sc-tile .sc-n{font-size:40px;font-weight:900;font-family:"Zen Kaku Gothic New",sans-serif;line-height:1;'
    + 'font-variant-numeric:tabular-nums;}'
    + '.sc-tile .sc-rt{font-size:12px;color:var(--teal);min-height:16px;}'
    + '.sc-ov .sc-tile .sc-minus{position:absolute;top:8px;right:8px;width:40px;height:40px;border-radius:10px;padding:0;'
    + 'border:1px solid var(--line);background:var(--panel-2);color:var(--muted);font-size:22px;line-height:1;'
    + 'cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;}'
    + '.sc-tile.wide{grid-column:1 / -1;min-height:96px;}'
    + '.sc-use{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 14px;}'
    + '.sc-use>span{font-size:12.5px;color:var(--muted);margin-right:2px;}'
    + '.sc-ov .sc-uchip{background:transparent;border:1px dashed var(--line);border-radius:999px;padding:7px 12px;'
    + 'font-size:12.5px;color:var(--muted);cursor:pointer;font-family:inherit;touch-action:manipulation;}'
    + '.sc-ov .sc-uchip.on{border-style:solid;border-color:var(--teal);color:var(--teal);background:#16302c;}'
    + '.sc-off{display:none !important;}'
    + '.sc-sub{margin:18px 0 8px;font-size:13px;color:var(--muted);font-weight:700;}'
    + '.sc-chips{display:flex;flex-wrap:wrap;gap:8px;}'
    + '.sc-chip{background:var(--panel);border:1px solid var(--line);border-radius:999px;padding:10px 14px;'
    + 'font-size:13.5px;color:var(--text);cursor:pointer;font-family:inherit;touch-action:manipulation;}'
    + '.sc-chip small{color:var(--muted);margin-left:4px;}'
    + '.sc-chip.on{background:#3a2c10;border-color:var(--gold);color:var(--gold);}'
    + '.sc-foot{display:flex;gap:10px;padding:10px 16px calc(10px + env(safe-area-inset-bottom));'
    + 'border-top:1px solid var(--line);background:var(--panel);}'
    + '.sc-foot button{flex:1;padding:12px;border-radius:10px;border:1px solid var(--line);background:var(--panel-2);'
    + 'color:var(--text);font-weight:700;font-size:14px;font-family:inherit;cursor:pointer;touch-action:manipulation;}'
    + '.sc-foot .sc-reset.arm{border-color:var(--red);color:var(--red);}'
    + '.sc-note{font-size:11.5px;color:var(--muted);margin:14px 0 0;line-height:1.6;}'
    + '.sc-tip{margin:16px 0 0;padding:12px 14px;border:1px dashed var(--line);border-radius:12px;background:var(--panel);'
    + 'display:flex;align-items:center;gap:10px;}'
    + '.sc-tip p{margin:0;flex:1;font-size:12.5px;color:var(--muted);line-height:1.5;}'
    + '.sc-tip a{flex-shrink:0;padding:9px 14px;border-radius:10px;border:1px solid var(--gold);color:var(--gold);'
    + 'font-size:13px;font-weight:700;text-decoration:none;}'
    + '.sc-ov .sc-tile .sc-edit{position:absolute;right:8px;bottom:8px;padding:5px 9px;border-radius:8px;border:1px solid var(--line);'
    + 'background:var(--panel-2);color:var(--muted);font-size:11.5px;font-weight:700;cursor:pointer;font-family:inherit;line-height:1.2;}'
    + '.sc-ov .sc-tile .sc-calc{position:absolute;right:74px;bottom:8px;padding:5px 9px;border-radius:8px;border:1px solid var(--teal);'
    + 'background:var(--panel-2);color:var(--teal);font-size:11.5px;font-weight:700;cursor:pointer;font-family:inherit;line-height:1.2;}'
    + '.sc-pad-hint{margin:-4px 0 10px;font-size:12.5px;color:var(--muted);line-height:1.6;}'
    + '.sc-pad-res{margin:8px 0 0;font-size:13.5px;color:var(--teal);min-height:1.2em;}'
    + '.sc-pad{position:absolute;inset:0;z-index:5;background:#000a;display:none;align-items:flex-end;justify-content:center;}'
    + '.sc-pad.open{display:flex;}'
    + '.sc-pad-box{width:100%;max-width:560px;background:var(--panel);border-top:1px solid var(--line);border-radius:16px 16px 0 0;'
    + 'padding:16px 16px calc(16px + env(safe-area-inset-bottom));}'
    + '.sc-pad-box h3{margin:0 0 10px;font-size:15px;font-family:"Zen Kaku Gothic New",sans-serif;font-weight:900;}'
    + '.sc-pad-box input{width:100%;background:var(--panel-2);border:1px solid var(--line);border-radius:12px;color:var(--text);'
    + 'font-size:30px;font-weight:900;padding:12px 14px;font-family:inherit;box-sizing:border-box;}'
    + '.sc-pad-box .sc-pad-btns{display:flex;gap:10px;margin-top:12px;}'
    + '.sc-ov .sc-pad-box .sc-pad-btns button{flex:1;padding:13px;border-radius:10px;border:1px solid var(--line);background:var(--panel-2);'
    + 'color:var(--text);font-weight:700;font-size:15px;font-family:inherit;cursor:pointer;}'
    + '.sc-ov .sc-pad-box .sc-pad-btns .sc-pad-ok{background:var(--gold);border-color:var(--gold);color:#1a1408;}'
    + '.sc-toast{position:absolute;left:16px;right:16px;bottom:calc(76px + env(safe-area-inset-bottom));z-index:4;display:none;'
    + 'align-items:center;gap:10px;background:#2a2312;border:1px solid var(--gold-dim);border-radius:12px;padding:10px 12px;font-size:13.5px;color:#f0d9a6;}'
    + '.sc-toast.show{display:flex;}'
    + '.sc-toast span{flex:1;}'
    + '.sc-ov .sc-toast button{background:var(--gold);color:#1a1408;border:none;border-radius:8px;padding:8px 12px;font-weight:900;'
    + 'font-size:13.5px;font-family:inherit;cursor:pointer;}'
    + '.sc-free{margin-top:4px;}'
    + '.sc-free .sc-sub small{font-weight:400;margin-left:6px;}'
    + '.sc-fgrid:empty{display:none;}'
    + '.sc-ov .sc-tile .sc-del{position:absolute;right:8px;bottom:8px;padding:5px 9px;border-radius:8px;border:1px solid var(--line);'
    + 'background:var(--panel-2);color:var(--muted);font-size:11.5px;font-weight:700;cursor:pointer;font-family:inherit;line-height:1.2;}'
    + '.sc-ov .sc-tile .sc-del.arm{border-color:var(--red);color:var(--red);}'
    + '.sc-free-add{display:flex;gap:8px;margin-top:10px;}'
    + '.sc-free-add input{flex:1;min-width:0;background:var(--panel-2);border:1px dashed var(--line);border-radius:10px;'
    + 'color:var(--text);font-size:14px;padding:10px 12px;font-family:inherit;}'
    + '.sc-ov .sc-free-add button{flex-shrink:0;padding:10px 14px;border-radius:10px;border:1px solid var(--teal);background:transparent;'
    + 'color:var(--teal);font-weight:700;font-size:13.5px;font-family:inherit;cursor:pointer;}';

  var $ = function (id) { return document.getElementById(id); };
  var ga = function (name, p) { if (typeof gtag === 'function') gtag('event', name, p); };
  var buzz = function () { try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) {} };
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  var COLORS = ['#e8a93b', '#33b6a4', '#7fa7d9', '#d9668b', '#9b7fd9', '#6fd6a8'];

  function init(cfg) {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var KEY = 'settiCounter:' + cfg.key, BKEY = 'settiCounterBak:' + cfg.key;
    var checks = cfg.checks ? [].slice.call(document.querySelectorAll(cfg.checks.selector)) : [];
    var undo = [], taps = 0;
    var UKEY = 'settiCounterUse:' + cfg.key;
    // 自由カウント：利用者が名前を付けて好きなものを数える（判別の計算には使わない）。名前と数はこの端末に保存
    var FKEY = 'settiCounterFree:' + cfg.key;
    var free = (store.get(FKEY) || []).filter(function (x) { return x && typeof x.n === 'string'; });
    var saveFree = function () { store.set(FKEY, free); };
    // group を付けた任意項目は「数える項目」のボタン1つでまとめてON/OFFする
    var opts = [], grpSeen = {};
    (cfg.counts || []).forEach(function (c, i) {
      if (!c.optional) return;
      if (c.group) {
        var gk = 'grp:' + c.group;
        if (grpSeen[gk]) { grpSeen[gk].is.push(i); grpSeen[gk].ids.push(c.id); return; }
        grpSeen[gk] = { k: gk, label: c.group, i: i, is: [i], ids: [c.id], def: !c.defaultOff };
        opts.push(grpSeen[gk]);
      } else opts.push({ k: c.id, label: c.label, i: i, is: [i], ids: [c.id], def: !c.defaultOff });
    });
    if (cfg.checks && cfg.checks.optional) opts.push({ k: '__checks', label: cfg.checks.short || cfg.checks.title, def: !cfg.checks.defaultOff });
    var useP = store.get(UKEY) || {};
    var stash = {};
    var isOn = function (k) { return useP[k] === undefined ? (opts.filter(function (o) { return o.k === k; })[0] || { def: true }).def : !!useP[k]; };

    // ---------- 値の読み書き（判別ページの入力欄が正） ----------
    var val = function (id) { var el = $(id); return el ? Math.max(parseInt(el.value, 10) || 0, 0) : 0; };
    function write(id, n) {
      var el = $(id); if (!el) return;
      el.value = n > 0 ? String(n) : '';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
    function setCheck(i, on) {
      var c = checks[i]; if (!c || c.checked === on) return;
      c.checked = on; c.dispatchEvent(new Event('change', { bubbles: true }));
    }
    var G2 = cfg.g2 || [];
    function openPanelOf(c) {
      if (!c || !c.openPanel) return;
      var p = $(c.openPanel.panel); if (p && !p.classList.contains('open')) { var b = $(c.openPanel.btn); if (b) b.click(); }
    }
    var itemById = function (id) { return (cfg.counts || []).filter(function (c) { return c.id === id; })[0]; };
    function save() {
      var v = {}; (cfg.counts || []).forEach(function (c) { v[c.id] = val(c.id); }); v[cfg.g.id] = val(cfg.g.id);
      G2.forEach(function (g) { v[g.id] = val(g.id); });
      store.set(KEY, { v: v, c: checks.map(function (c) { return c.checked ? 1 : 0; }), s: stash, t: Date.now() });
      saveFree();
    }
    function snap() {
      var v = {}; (cfg.counts || []).forEach(function (c) { v[c.id] = val(c.id); }); v[cfg.g.id] = val(cfg.g.id);
      G2.forEach(function (g) { v[g.id] = val(g.id); });
      return { v: v, c: checks.map(function (c) { return c.checked ? 1 : 0; }), s: JSON.parse(JSON.stringify(stash)), f: free.map(function (x) { return x.c; }), t: Date.now() };
    }
    function restore(sn) {
      Object.keys(sn.v || {}).forEach(function (id) { write(id, sn.v[id]); });
      (sn.c || []).forEach(function (on, i) { setCheck(i, !!on); });
      stash = sn.s || {};
      (sn.f || []).forEach(function (n, i) { if (free[i]) free[i].c = n; });
      (cfg.counts || []).forEach(function (c) { if (val(c.id) > 0) openPanelOf(c); });
    }
    function used() {
      if (val(cfg.g.id) > 0) return true;
      return (cfg.counts || []).some(function (c) { return val(c.id) > 0; }) || checks.some(function (c) { return c.checked; })
        || free.some(function (x) { return x.c > 0; });
    }

    // ---------- 判別（GAのjudge_runは送らずにボタンを押す） ----------
    function silentCalc() {
      var btn = $(cfg.judge); if (!btn || val(cfg.g.id) <= 0) return;
      var g = window.gtag;
      window.gtag = function (a, b) { if (a === 'event' && b === 'judge_run') return; if (typeof g === 'function') return g.apply(this, arguments); };
      try { btn.click(); } finally { window.gtag = g; }
    }
    function readPost() {
      var lg = $(cfg.legend), wr = $(cfg.wrap);
      if (!lg || !wr || wr.style.display === 'none') return [];
      return [].slice.call(lg.querySelectorAll('.legend-row')).map(function (r) {
        var s = r.textContent.match(/設定(\d)/), p = r.querySelector('.pct');
        var sw = r.querySelector('.swatch');
        return { s: s ? +s[1] : 0, p: p ? parseFloat(p.textContent) / 100 : 0, c: sw ? sw.style.background : '' };
      }).filter(function (x) { return x.s > 0; });
    }

    // ---------- 画面 ----------
    var fab = document.createElement('button');
    fab.type = 'button'; fab.className = 'sc-fab';
    fab.innerHTML = '<span class="sc-dot"></span>小役カウンター';
    document.body.appendChild(fab);

    var ov = document.createElement('div');
    ov.className = 'sc-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', '小役カウンター');
    var tiles = (cfg.counts || []).map(function (c, i) {
      return '<div class="sc-tile' + (c.wide ? ' wide' : '') + '" data-i="' + i + '" role="button" aria-label="' + c.label + 'を1つ増やす">'
        + '<div class="sc-lb">' + c.label + '</div>'
        + '<button type="button" class="sc-minus" data-i="' + i + '" aria-label="' + c.label + 'を1つ減らす">−</button>'
        + '<div class="sc-n">0</div><div class="sc-rt"></div>'
        + (c.calc ? '<button type="button" class="sc-calc" data-i="' + i + '" aria-label="' + c.label + 'を' + (c.calc.label || '逆算') + '">' + (c.calc.label || '逆算') + '</button>' : '')
        + '<button type="button" class="sc-edit" data-i="' + i + '" aria-label="' + c.label + 'の数を入力">✎ 入力</button></div>';
    }).join('');
    var chips = checks.map(function (c, i) {
      var tag = c.parentNode && c.parentNode.querySelector('.tag');
      return '<button type="button" class="sc-chip" data-i="' + i + '">' + (c.dataset.short || c.dataset.name || ('項目' + (i + 1)))
        + (tag ? '<small>' + tag.textContent + '</small>' : '') + '</button>';
    }).join('');
    ov.innerHTML = '<div class="sc-head"><h2>' + cfg.name + ' 小役カウンター</h2>'
      + '<button type="button" class="sc-close">判別結果を見る</button></div>'
      + '<div class="sc-res" aria-live="polite"></div>'
      + '<div class="sc-body">'
      + (cfg.select ? '<select class="sc-msel" aria-label="機種"></select>' : '')
      + '<div class="sc-g"><label for="scG">' + cfg.g.label + '</label>'
      + '<input id="scG" type="number" inputmode="numeric" placeholder="データカウンターの数字"></div>'
      + G2.map(function (g, j) { return '<div class="sc-g sc-g2" data-j="' + j + '"><label for="scG2_' + j + '">' + g.label + '</label>'
        + '<input id="scG2_' + j + '" type="number" inputmode="numeric" placeholder="データカウンターの数字"></div>'; }).join('')
      + (opts.length ? '<div class="sc-use"><span>数える項目：</span>' + opts.map(function (o) { return '<button type="button" class="sc-uchip" data-k="' + o.k + '"></button>'; }).join('') + '</div>' : '')
      + '<div class="sc-grid">' + tiles + '</div>'
      + '<div class="sc-free"><div class="sc-sub">自由カウント<small>気になるものを名前を付けて数えられます（判別には使いません）</small></div>'
      + '<div class="sc-grid sc-fgrid"></div>'
      + '<div class="sc-free-add"><input type="text" maxlength="12" placeholder="例：チェリー、リーチ目" aria-label="数えたいものの名前">'
      + '<button type="button" class="sc-free-btn">＋ 追加</button></div></div>'
      + (chips ? '<div class="sc-checks"><div class="sc-sub">' + cfg.checks.title + '（タップで ON/OFF）</div><div class="sc-chips">' + chips + '</div></div>' : '')
      + '<p class="sc-note">押した数は判別ページの入力欄にそのまま入ります。数字は「✎ 入力」で直接入れられます。この端末に自動で保存されるので、画面を閉じても消えません。'
      + (cfg.note ? '<br>' + cfg.note : '') + '</p>'
      + '<div class="sc-tip"><p>勝ったら10円でもいいので投げ銭ください🍶</p>'
      + '<a class="sc-tip-a" href="https://ofuse.me/cec8e32a" target="_blank" rel="noopener">投げ銭する</a></div>'
      + '</div>'
      + '<div class="sc-toast" role="status"><span>リセットしました</span><button type="button" class="sc-toast-undo">元に戻す</button></div>'
      + '<div class="sc-pad" role="dialog" aria-label="数を入力"><div class="sc-pad-box"><h3></h3><p class="sc-pad-hint" hidden></p>'
      + '<input type="number" inputmode="numeric" min="0">'
      + '<p class="sc-pad-res" hidden></p><div class="sc-pad-btns"><button type="button" class="sc-pad-no">キャンセル</button><button type="button" class="sc-pad-ok">決定</button></div></div></div>'
      + '<div class="sc-foot"><button type="button" class="sc-undo">1つ戻す</button><button type="button" class="sc-reset">リセット</button></div>';
    document.body.appendChild(ov);

    var msel = ov.querySelector('.sc-msel');
    if (msel) {
      var src = $(cfg.select);
      var fill = function () { msel.innerHTML = src.innerHTML; msel.value = src.value; };
      fill(); src.addEventListener('change', function () { msel.value = src.value; });
      msel.addEventListener('change', function () { src.value = msel.value; src.dispatchEvent(new Event('change', { bubbles: true })); changed(); });
    }
    var gIn = ov.querySelector('#scG'), resEl = ov.querySelector('.sc-res');
    var undoBtn = ov.querySelector('.sc-undo'), resetBtn = ov.querySelector('.sc-reset');

    var fgrid = ov.querySelector('.sc-fgrid'), fIn = ov.querySelector('.sc-free-add input');
    function renderFree(g) {
      while (fgrid.children.length > free.length) fgrid.removeChild(fgrid.lastChild);
      free.forEach(function (x, i) {
        var t = fgrid.children[i];
        if (!t) {
          t = document.createElement('div'); t.className = 'sc-tile'; t.setAttribute('role', 'button'); t.dataset.f = i;
          t.innerHTML = '<div class="sc-lb"></div><button type="button" class="sc-minus" aria-label="1つ減らす">−</button>'
            + '<div class="sc-n">0</div><div class="sc-rt"></div><button type="button" class="sc-del">削除</button>';
          fgrid.appendChild(t);
        }
        t.dataset.f = i;
        t.querySelector('.sc-lb').textContent = x.n;
        t.setAttribute('aria-label', x.n + 'を1つ増やす');
        t.querySelector('.sc-n').textContent = x.c;
        t.querySelector('.sc-rt').textContent = (g > 0 && x.c > 0) ? '1/' + (g / x.c).toFixed(1) : '';
      });
    }
    function render() {
      var g = val(cfg.g.id);
      renderFree(g);
      opts.forEach(function (o) {
        var on = isOn(o.k), b = ov.querySelector('.sc-uchip[data-k="' + o.k + '"]');
        b.classList.toggle('on', on); b.textContent = (on ? '✓ ' : '＋ ') + o.label;
        if (o.k === '__checks') { var cs = ov.querySelector('.sc-checks'); if (cs) cs.classList.toggle('sc-off', !on); }
        else o.is.forEach(function (ti) { ov.querySelector('.sc-tile[data-i="' + ti + '"]').classList.toggle('sc-off', !on); });
      });
      if (document.activeElement !== gIn) gIn.value = g > 0 ? g : '';
      G2.forEach(function (gg, j) {
        var row = ov.querySelector('.sc-g2[data-j="' + j + '"]'), inp = row.querySelector('input'), n2 = val(gg.id);
        if (document.activeElement !== inp) inp.value = n2 > 0 ? n2 : '';
        row.classList.toggle('sc-off', !!gg.item && !isOn(gg.item));
      });
      (cfg.counts || []).forEach(function (c, i) {
        var t = ov.querySelector('.sc-tile[data-i="' + i + '"]'), n = val(c.id);
        t.querySelector('.sc-n').textContent = n;
        var gb = c.rateG ? val(c.rateG) : g;
        t.querySelector('.sc-rt').textContent = (c.rate !== false && gb > 0 && n > 0) ? '1/' + (gb / n).toFixed(1) : (c.hint || '');
      });
      checks.forEach(function (c, i) { ov.querySelector('.sc-chip[data-i="' + i + '"]').classList.toggle('on', c.checked); });
      var bak = !undo.length && store.get(BKEY);
      undoBtn.textContent = bak ? 'リセット前に戻す' : '1つ戻す';
      undoBtn.disabled = !undo.length && !bak; undoBtn.style.opacity = (undo.length || bak) ? 1 : .45;
      fab.classList.toggle('on', used());

      var post = readPost();
      if (g <= 0) { resEl.innerHTML = '<span style="color:var(--muted);">' + cfg.g.label + 'を入れると、押すたびに判別結果が出ます</span>'; return; }
      if (!post.length) { resEl.innerHTML = '<span style="color:var(--muted);">数を入れると判別結果が出ます</span>'; return; }
      var best = post.reduce(function (a, b) { return b.p > a.p ? b : a; });
      var hi = post.filter(function (x) { return x.s >= (cfg.hiFrom || 4); }).reduce(function (a, x) { return a + x.p; }, 0);
      var top = post.filter(function (x) { return x.s === 6; })[0];
      resEl.innerHTML = '最有力 <b>設定' + best.s + '</b> ' + (best.p * 100).toFixed(0) + '%'
        + '<span style="color:var(--muted);">／ 設定' + (cfg.hiFrom || 4) + '以上 ' + (hi * 100).toFixed(0) + '%'
        + (top && best.s !== 6 ? '／ 設定6 ' + (top.p * 100).toFixed(0) + '%' : '') + '</span>'
        + '<div class="sc-bar">' + post.map(function (x, i) { return '<span style="width:' + (x.p * 100) + '%;background:' + (x.c || COLORS[i % COLORS.length]) + '"></span>'; }).join('') + '</div>';
    }
    function changed() { save(); silentCalc(); render(); }

    function bump(i, d) {
      var c = cfg.counts[i], n = val(c.id);
      if (d < 0 && n <= 0) return;
      undo.push({ t: 'n', id: c.id, prev: n });
      store.del(BKEY); hideToast();
      write(c.id, n + d);
      if (d > 0) {
        taps++; buzz();
        if (c.openPanel) { var p = $(c.openPanel.panel); if (p && !p.classList.contains('open')) { var b = $(c.openPanel.btn); if (b) b.click(); } }
      }
      changed();
    }

    ov.querySelector('.sc-grid').addEventListener('click', function (e) {
      var ed = e.target.closest('.sc-edit');
      if (ed) { e.stopPropagation(); openPad(+ed.dataset.i); return; }
      var ca = e.target.closest('.sc-calc');
      if (ca) { e.stopPropagation(); openPad(+ca.dataset.i, true); return; }
      var m = e.target.closest('.sc-minus');
      if (m) { e.stopPropagation(); bump(+m.dataset.i, -1); return; }
      var t = e.target.closest('.sc-tile'); if (!t) return;
      t.classList.add('hit'); setTimeout(function () { t.classList.remove('hit'); }, 90);
      bump(+t.dataset.i, 1);
    });
    function addFree() {
      var n = (fIn.value || '').replace(/\s+/g, ' ').trim().slice(0, 12);
      if (!n) { fIn.focus(); return; }
      if (free.length >= 12) { fIn.value = ''; fIn.placeholder = '追加できるのは12個までです'; return; }
      free.push({ n: n, c: 0 }); fIn.value = ''; saveFree();
      ga('counter_free_add', { machine: cfg.key });
      render();
    }
    ov.querySelector('.sc-free-btn').addEventListener('click', addFree);
    fIn.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); addFree(); } });
    fgrid.addEventListener('click', function (e) {
      var t = e.target.closest('.sc-tile'); if (!t) return;
      var i = +t.dataset.f, x = free[i]; if (!x) return;
      var del = e.target.closest('.sc-del');
      if (del) {
        e.stopPropagation();
        if (!del.classList.contains('arm')) {
          del.classList.add('arm'); del.textContent = 'もう一度で削除';
          setTimeout(function () { del.classList.remove('arm'); del.textContent = '削除'; }, 3000);
          return;
        }
        free.splice(i, 1); undo = undo.filter(function (u) { return u.t !== 'f'; }); saveFree(); render(); return;
      }
      var m = e.target.closest('.sc-minus');
      var d = m ? -1 : 1;
      if (m) e.stopPropagation();
      if (d < 0 && x.c <= 0) return;
      undo.push({ t: 'f', i: i, prev: x.c }); store.del(BKEY); hideToast();
      x.c += d; saveFree();
      if (d > 0) { taps++; buzz(); t.classList.add('hit'); setTimeout(function () { t.classList.remove('hit'); }, 90); }
      render();
    });
    function setUse(k, on) {
      useP[k] = on; store.set(UKEY, useP);
      if (k === '__checks') {
        if (!on) { stash.__checks = checks.map(function (c) { return c.checked ? 1 : 0; }); checks.forEach(function (c, i) { setCheck(i, false); }); }
        else if (stash.__checks) { stash.__checks.forEach(function (x, i) { if (x) setCheck(i, true); }); delete stash.__checks; }
      } else {
        var og = opts.filter(function (x) { return x.k === k; })[0], members = og ? og.ids : [k];
        var ids = members.concat(G2.filter(function (g) { return g.item === k; }).map(function (g) { return g.id; }));
        ids.forEach(function (id) {
          if (!on) { var n = val(id); if (n > 0) stash[id] = n; write(id, 0); }
          else if (stash[id] > 0 && val(id) === 0) { write(id, stash[id]); delete stash[id]; }
        });
        if (on) members.forEach(function (id) { if (val(id) > 0) openPanelOf(itemById(id)); });
      }
      ga('counter_item', { machine: cfg.key, item: k, on: on });
      changed();
    }
    var useBox = ov.querySelector('.sc-use');
    if (useBox) useBox.addEventListener('click', function (e) {
      var b = e.target.closest('.sc-uchip'); if (!b) return;
      setUse(b.dataset.k, !isOn(b.dataset.k));
    });
    var chipBox = ov.querySelector('.sc-chips');
    if (chipBox) chipBox.addEventListener('click', function (e) {
      var ch = e.target.closest('.sc-chip'); if (!ch) return;
      var i = +ch.dataset.i, on = !checks[i].checked;
      undo.push({ t: 'c', i: i, prev: !on });
      setCheck(i, on); buzz(); changed();
    });
    gIn.addEventListener('input', function () {
      var n = Math.max(parseInt(gIn.value, 10) || 0, 0);
      var el = $(cfg.g.id); el.value = n > 0 ? String(n) : '';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      save(); clearTimeout(gIn._t); gIn._t = setTimeout(function () { silentCalc(); render(); }, 300);
    });
    G2.forEach(function (gg, j) {
      var inp = ov.querySelector('#scG2_' + j);
      inp.addEventListener('input', function () {
        var n = Math.max(parseInt(inp.value, 10) || 0, 0);
        var el = $(gg.id); el.value = n > 0 ? String(n) : '';
        el.dispatchEvent(new Event('input', { bubbles: true }));
        if (n > 0 && gg.item) openPanelOf(itemById(gg.item));
        save(); clearTimeout(inp._t); inp._t = setTimeout(function () { silentCalc(); render(); }, 300);
      });
    });
    undoBtn.addEventListener('click', function () {
      var u = undo.pop();
      if (!u) { var bk = store.get(BKEY); if (!bk) return; restore(bk); store.del(BKEY); hideToast(); ga('counter_reset_undo', { machine: cfg.key }); changed(); return; }
      if (u.t === 'n') write(u.id, u.prev);
      else if (u.t === 'f') { if (free[u.i]) free[u.i].c = u.prev; }
      else if (u.t === 'r') { restore(u.snap); store.del(BKEY); hideToast(); ga('counter_reset_undo', { machine: cfg.key }); }
      else setCheck(u.i, u.prev);
      changed();
    });
    var armT = null;
    resetBtn.addEventListener('click', function () {
      if (!resetBtn.classList.contains('arm')) {
        resetBtn.classList.add('arm'); resetBtn.textContent = 'もう一度押すとリセット';
        clearTimeout(armT); armT = setTimeout(function () { resetBtn.classList.remove('arm'); resetBtn.textContent = 'リセット'; }, 3000);
        return;
      }
      clearTimeout(armT); resetBtn.classList.remove('arm'); resetBtn.textContent = 'リセット';
      var before = snap(), had = used();
      (cfg.counts || []).forEach(function (c) { write(c.id, 0); });
      write(cfg.g.id, 0);
      G2.forEach(function (g) { write(g.id, 0); });
      checks.forEach(function (c, i) { setCheck(i, false); });
      free.forEach(function (x) { x.c = 0; }); saveFree();
      undo = had ? [{ t: 'r', snap: before }] : []; stash = {}; store.del(KEY);
      if (had) { store.set(BKEY, before); showToast(); }
      var wr = $(cfg.wrap); if (wr) wr.style.display = 'none';
      ga('counter_reset', { machine: cfg.key });
      render();
    });

    // ---------- 直接入力 ----------
    // calc を付けた項目は「逆算」ボタンから別の数（例：差枚）を入れて、項目の数を計算して入れる
    var pad = ov.querySelector('.sc-pad'), padIn = pad.querySelector('input'), padI = -1, padCalc = false;
    var padHint = pad.querySelector('.sc-pad-hint'), padRes = pad.querySelector('.sc-pad-res');
    function calcPreview() {
      if (!padCalc || padI < 0) return null;
      var c = cfg.counts[padI], v = padIn.value.trim();
      var r = (v === '' || isNaN(parseInt(v, 10))) ? null : c.calc.fn(parseInt(v, 10));
      padRes.textContent = r === null || r === undefined ? (c.calc.empty || '') : (c.calc.show ? c.calc.show(r) : (c.label + ' ' + r));
      return r;
    }
    function openPad(i, calc) {
      padI = i; padCalc = !!calc; var c = cfg.counts[i];
      pad.querySelector('h3').textContent = calc ? (c.calc.title || c.label + 'を逆算') : c.label + 'の数を入力';
      padHint.hidden = !calc; padRes.hidden = !calc; padHint.textContent = calc ? (c.calc.hint || '') : '';
      padIn.setAttribute('inputmode', calc ? 'text' : 'numeric');
      padIn.removeAttribute('min'); if (!calc) padIn.setAttribute('min', '0');
      padIn.placeholder = calc ? (c.calc.ph || '') : '';
      padIn.value = calc ? (c.calc.last !== undefined ? c.calc.last : '') : (val(c.id) || '');
      if (calc) calcPreview();
      pad.classList.add('open');
      setTimeout(function () { padIn.focus(); padIn.select(); }, 30);
    }
    padIn.addEventListener('input', calcPreview);
    function closePad() { pad.classList.remove('open'); padI = -1; padCalc = false; padIn.blur(); }
    function commitPad() {
      if (padI < 0) return;
      var c = cfg.counts[padI], prev = val(c.id), n;
      if (padCalc) {
        var r = calcPreview(); if (r === null || r === undefined) { closePad(); return; }
        c.calc.last = padIn.value.trim(); n = Math.max(Math.round(r), 0);
        ga('counter_calc', { machine: cfg.key, item: c.id });
      } else n = Math.max(parseInt(padIn.value, 10) || 0, 0);
      closePad();
      if (n === prev) return;
      undo.push({ t: 'n', id: c.id, prev: prev }); store.del(BKEY);
      write(c.id, n); if (n > 0) openPanelOf(c);
      ga('counter_direct', { machine: cfg.key, item: c.id });
      changed();
    }
    pad.querySelector('.sc-pad-ok').addEventListener('click', commitPad);
    pad.querySelector('.sc-pad-no').addEventListener('click', closePad);
    pad.addEventListener('click', function (e) { if (e.target === pad) closePad(); });
    padIn.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); commitPad(); } else if (e.key === 'Escape') closePad(); });
    // ---------- リセットの取り消し ----------
    var toast = ov.querySelector('.sc-toast'), toastT = null;
    function showToast() { toast.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(hideToast, 10000); }
    function hideToast() { toast.classList.remove('show'); clearTimeout(toastT); }
    toast.querySelector('.sc-toast-undo').addEventListener('click', function () { undoBtn.click(); });

    var openedAt = 0;
    function open() {
      undo = []; taps = 0; openedAt = Date.now(); hideToast(); closePad();
      ov.classList.add('open'); document.documentElement.style.overflow = 'hidden';
      silentCalc(); render();
      ga('counter_open', { machine: cfg.key });
    }
    function close() {
      ov.classList.remove('open'); document.documentElement.style.overflow = '';
      ga('counter_close', { machine: cfg.key, taps: taps, sec: Math.round((Date.now() - openedAt) / 1000) });
      var wr = $(cfg.wrap);
      if (wr && wr.style.display !== 'none') wr.scrollIntoView({ block: 'center' });
    }
    fab.addEventListener('click', open);
    ov.querySelector('.sc-close').addEventListener('click', close);
    ov.querySelector('.sc-tip-a').addEventListener('click', function () { ga('tip_click', { machine: cfg.key, from: 'counter' }); });

    // ---------- 保存分の復元（共有URLで開いた時は復元しない） ----------
    var saved = store.get(KEY);
    var fromShare = /[?&]k=/.test(location.search);
    if (saved && !fromShare && Date.now() - saved.t < 20 * 3600 * 1000) {
      Object.keys(saved.v || {}).forEach(function (id) { if (saved.v[id] > 0 && $(id) && !$(id).value) write(id, saved.v[id]); });
      (saved.c || []).forEach(function (on, i) { if (on) setCheck(i, true); });
      if (saved.s) stash = saved.s;
      (cfg.counts || []).forEach(function (c) {
        if (c.openPanel && val(c.id) > 0) { var p = $(c.openPanel.panel); if (p && !p.classList.contains('open')) { var b = $(c.openPanel.btn); if (b) b.click(); } }
      });
      silentCalc();
    } else if (saved && !fromShare) { store.del(KEY); free.forEach(function (x) { x.c = 0; }); saveFree(); }
    // ページ側で手入力した数もカウンターに反映
    document.addEventListener('input', function (e) { if (!ov.classList.contains('open') && e.target && e.target.id) { save(); fab.classList.toggle('on', used()); } }, true);
    render();
  }
  window.SettiCounter = { init: init };
})();
