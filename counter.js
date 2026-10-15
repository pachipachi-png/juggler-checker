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
    + '.sc-note{font-size:11.5px;color:var(--muted);margin:14px 0 0;line-height:1.6;}';

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
    var KEY = 'settiCounter:' + cfg.key;
    var checks = cfg.checks ? [].slice.call(document.querySelectorAll(cfg.checks.selector)) : [];
    var undo = [], taps = 0;

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
    function save() {
      var v = {}; (cfg.counts || []).forEach(function (c) { v[c.id] = val(c.id); }); v[cfg.g.id] = val(cfg.g.id);
      store.set(KEY, { v: v, c: checks.map(function (c) { return c.checked ? 1 : 0; }), t: Date.now() });
    }
    function used() {
      if (val(cfg.g.id) > 0) return true;
      return (cfg.counts || []).some(function (c) { return val(c.id) > 0; }) || checks.some(function (c) { return c.checked; });
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
        + '<div class="sc-n">0</div><div class="sc-rt"></div></div>';
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
      + '<div class="sc-grid">' + tiles + '</div>'
      + (chips ? '<div class="sc-sub">' + cfg.checks.title + '（タップで ON/OFF）</div><div class="sc-chips">' + chips + '</div>' : '')
      + '<p class="sc-note">押した数は判別ページの入力欄にそのまま入ります。この端末に自動で保存されるので、画面を閉じても消えません。'
      + (cfg.note ? '<br>' + cfg.note : '') + '</p>'
      + '</div>'
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

    function render() {
      var g = val(cfg.g.id);
      if (document.activeElement !== gIn) gIn.value = g > 0 ? g : '';
      (cfg.counts || []).forEach(function (c, i) {
        var t = ov.querySelector('.sc-tile[data-i="' + i + '"]'), n = val(c.id);
        t.querySelector('.sc-n').textContent = n;
        t.querySelector('.sc-rt').textContent = (c.rate !== false && g > 0 && n > 0) ? '1/' + (g / n).toFixed(1) : (c.hint || '');
      });
      checks.forEach(function (c, i) { ov.querySelector('.sc-chip[data-i="' + i + '"]').classList.toggle('on', c.checked); });
      undoBtn.disabled = !undo.length; undoBtn.style.opacity = undo.length ? 1 : .45;
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
      write(c.id, n + d);
      if (d > 0) {
        taps++; buzz();
        if (c.openPanel) { var p = $(c.openPanel.panel); if (p && !p.classList.contains('open')) { var b = $(c.openPanel.btn); if (b) b.click(); } }
      }
      changed();
    }

    ov.querySelector('.sc-grid').addEventListener('click', function (e) {
      var m = e.target.closest('.sc-minus');
      if (m) { e.stopPropagation(); bump(+m.dataset.i, -1); return; }
      var t = e.target.closest('.sc-tile'); if (!t) return;
      t.classList.add('hit'); setTimeout(function () { t.classList.remove('hit'); }, 90);
      bump(+t.dataset.i, 1);
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
    undoBtn.addEventListener('click', function () {
      var u = undo.pop(); if (!u) return;
      if (u.t === 'n') write(u.id, u.prev); else setCheck(u.i, u.prev);
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
      (cfg.counts || []).forEach(function (c) { write(c.id, 0); });
      write(cfg.g.id, 0);
      checks.forEach(function (c, i) { setCheck(i, false); });
      undo = []; store.del(KEY);
      var wr = $(cfg.wrap); if (wr) wr.style.display = 'none';
      ga('counter_reset', { machine: cfg.key });
      render();
    });

    var openedAt = 0;
    function open() {
      undo = []; taps = 0; openedAt = Date.now();
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

    // ---------- 保存分の復元（共有URLで開いた時は復元しない） ----------
    var saved = store.get(KEY);
    var fromShare = /[?&]k=/.test(location.search);
    if (saved && !fromShare && Date.now() - saved.t < 20 * 3600 * 1000) {
      Object.keys(saved.v || {}).forEach(function (id) { if (saved.v[id] > 0 && $(id) && !$(id).value) write(id, saved.v[id]); });
      (saved.c || []).forEach(function (on, i) { if (on) setCheck(i, true); });
      (cfg.counts || []).forEach(function (c) {
        if (c.openPanel && val(c.id) > 0) { var p = $(c.openPanel.panel); if (p && !p.classList.contains('open')) { var b = $(c.openPanel.btn); if (b) b.click(); } }
      });
      silentCalc();
    } else if (saved && !fromShare) { store.del(KEY); }
    // ページ側で手入力した数もカウンターに反映
    document.addEventListener('input', function (e) { if (!ov.classList.contains('open') && e.target && e.target.id) { save(); fab.classList.toggle('on', used()); } }, true);
    render();
  }
  window.SettiCounter = { init: init };
})();
