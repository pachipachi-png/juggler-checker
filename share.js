// 判別結果のXシェア＋URLで入力を復元（機種ページ共通）
// 各ページで SettiShare.init({...}) を呼ぶ。判別結果（円グラフの凡例）が変わるたびにシェア欄を作り直す。
(function () {
  var css = ''
    + '.share-box{margin-top:14px;padding:14px;background:var(--panel-2);border-radius:10px;border:1px solid var(--line);}'
    + '.share-box .share-title{margin:0 0 6px;font-size:12.5px;font-weight:700;color:var(--teal);}'
    + '.share-box .share-text{font-size:13px;color:var(--muted);white-space:pre-wrap;margin:0 0 10px;}'
    + '.share-row{display:flex;gap:8px;}'
    + '.share-row>*{flex:1;text-align:center;text-decoration:none;}'
    + '.share-row a,.share-row button{font-family:"Zen Kaku Gothic New",sans-serif;font-weight:700;font-size:13.5px;border-radius:10px;padding:12px 10px;display:block;}'
    + '.share-x{background:#edeff2;color:#14171c;}';
  var $ = function (id) { return document.getElementById(id); };
  var ga = function (name, p) { if (typeof gtag === 'function') gtag('event', name, p); };
  var numOk = function (v) { return v !== null && /^\d{1,6}$/.test(v) ? v : ''; };

  function readPosterior(legend) {
    var rows = [].slice.call(legend.querySelectorAll('.legend-row'));
    return rows.map(function (r) {
      var s = r.textContent.match(/設定(\d)/), p = r.querySelector('.pct');
      return { s: s ? +s[1] : 0, p: p ? parseFloat(p.textContent) / 100 : 0 };
    }).filter(function (x) { return x.s > 0; });
  }
  function panelOpen(f) { return !f.opt || ($(f.opt.panel) && $(f.opt.panel).classList.contains('open')); }

  function makeBox(cfg, box) {
    var el = document.createElement('div');
    el.className = 'share-box'; el.id = 'shareBox_' + box.id; el.style.display = 'none';
    el.innerHTML = (box.title ? '<p class="share-title">' + box.title + '</p>' : '')
      + '<p class="share-text"></p><div class="share-row">'
      + '<a class="btn-primary share-x" href="#" target="_blank" rel="noopener">' + (box.xLabel || '𝕏で結果をシェア') + '</a>'
      + '<button class="btn-ghost" type="button">URLをコピー</button></div>'
      + '<p class="hint" style="margin-bottom:0;">URLを開くと、同じ数字とチェックが入った状態で判別結果が出ます。</p>';
    var after = $(box.after);
    after.parentNode.insertBefore(el, after.nextSibling);
    var xBtn = el.querySelector('a'), copyBtn = el.querySelector('button'), textEl = el.querySelector('.share-text');
    var url = '';
    xBtn.addEventListener('click', function () { ga('share', { method: 'x', machine: cfg.key, kind: box.id }); });
    copyBtn.addEventListener('click', function () {
      var u = url + '&utm_source=copy&utm_medium=share';
      var done = function () { copyBtn.textContent = 'コピーしました'; setTimeout(function () { copyBtn.textContent = 'URLをコピー'; }, 2000); };
      if (navigator.clipboard) navigator.clipboard.writeText(u).then(done, function () { window.prompt('このURLをコピーしてください', url); });
      else window.prompt('このURLをコピーしてください', url);
      ga('share', { method: 'copy', machine: cfg.key, kind: box.id });
    });

    function hintNames() {
      if (!cfg.hints) return [];
      return [].slice.call(document.querySelectorAll(cfg.hints)).filter(function (c) { return c.checked; }).map(function (c) { return c.dataset.name; });
    }
    function rebuild() {
      var wrap = $(box.wrap), legend = $(box.legend);
      if (!wrap || wrap.style.display === 'none' || !legend.children.length) { el.style.display = 'none'; return; }
      var post = readPosterior(legend);
      if (!post.length) { el.style.display = 'none'; return; }
      var params = new URLSearchParams(), parts = [];
      params.set('k', box.id);
      var s = box.serialize ? box.serialize() : null;
      if (s) { Object.keys(s.params).forEach(function (k) { params.set(k, s.params[k]); }); if (s.summary) parts.push(s.summary); }
      (box.fields || []).forEach(function (f) {
        var v = $(f.id).value.trim();
        if (v === '' || !panelOpen(f)) return;
        params.set(f.q, v);
        var t = f.label + v + f.unit;
        if (f.rateOf) { var g = parseFloat($(f.rateOf).value) || 0, n = parseFloat(v) || 0; if (g > 0 && n > 0) t += '（1/' + (g / n).toFixed(1) + '）'; }
        parts.push(t);
      });
      var names = hintNames();
      if (names.length) params.set('h', names.join(','));
      url = location.origin + location.pathname + '?' + params.toString();
      var best = post.reduce(function (a, b) { return b.p > a.p ? b : a; });
      var hi = post.filter(function (x) { return x.s >= 4; }).reduce(function (a, b) { return a + b.p; }, 0);
      var exp = post.reduce(function (a, b) { return a + b.s * b.p; }, 0);
      var text = cfg.name + (box.label ? '【' + box.label + '】' : '') + '\n' + parts.join('・');
      if (names.length) text += '\n示唆：' + names.join('・');
      text += '\n→ 推定 設定' + best.s + '（' + Math.round(best.p * 100) + '%）\n設定4以上 ' + Math.round(hi * 100) + '%・期待設定 ' + exp.toFixed(1) + '（参考値）\n' + cfg.tags;
      textEl.textContent = text;
      xBtn.href = 'https://x.com/intent/post?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url + '&utm_source=x&utm_medium=share');
      el.style.display = 'block';
    }
    var t = null, sched = function () { clearTimeout(t); t = setTimeout(rebuild, 60); };
    new MutationObserver(sched).observe($(box.legend), { childList: true, subtree: true, characterData: true });
    new MutationObserver(sched).observe($(box.wrap), { attributes: true, attributeFilter: ['style'] });

    box.restore = function (q) {
      var any = false;
      (box.fields || []).forEach(function (f) {
        var v = numOk(q.get(f.q));
        if (v === '') return;
        if (f.opt && !panelOpen(f) && $(f.opt.toggle)) $(f.opt.toggle).click();
        $(f.id).value = v; $(f.id).dispatchEvent(new Event('input', { bubbles: true })); any = true;
      });
      if (box.deserialize && box.deserialize(q)) any = true;
      return any;
    };
  }

  window.SettiShare = {
    init: function (cfg) {
      var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
      cfg.boxes.forEach(function (b) { makeBox(cfg, b); });
      window.addEventListener('load', function () {
        var q = new URLSearchParams(location.search);
        var k = q.get('k') || cfg.boxes[0].id;
        var box = cfg.boxes.filter(function (b) { return b.id === k; })[0];
        if (!box) return;
        var hs = (q.get('h') || '').split(',').filter(Boolean);
        var touched = box.restore(q);
        if (!touched) return;
        if (cfg.hints && hs.length) [].slice.call(document.querySelectorAll(cfg.hints)).forEach(function (c) {
          var on = hs.indexOf(c.dataset.name) >= 0;
          if (c.checked !== on) { c.checked = on; c.dispatchEvent(new Event('change', { bubbles: true })); }
        });
        ga('shared_link_open', { machine: cfg.key, kind: box.id });
        $(box.btn).click();
        var w = $(box.wrap); if (w) w.scrollIntoView({ block: 'center' });
      });
    }
  };
})();
