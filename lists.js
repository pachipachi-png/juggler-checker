// 設定示唆くん 機種一覧の描画（トップ index.html と 全機種一覧 list/index.html で共通）
// machines.js を先に読み込むこと。tools/build_lists.js も同じ関数で静的HTMLを作る。
(function (root) {
  var NEW_DAYS = 7;    // 導入日からこの日数までは「新台」（2026-11-01 オーナー指示で21→7日。過ぎたら「よく見られている台」へ）
  var SOON_DAYS = 7;   // 導入日のこの日数前から「導入予定」として新台に出す（2026-11-01 14→7日）
  var HOT_MAX = 10;    // トップの「話題の機種」の表示数

  function norm(str) {
    return (str || '')
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[ぁ-ゖ]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) + 0x60); })
      .replace(/[\s・\-ー_／/]/g, '');
  }
  function ready() {
    return MACHINES.filter(function (m) { return m.status === 'ready'; })
      .sort(function (a, b) { return (a.hot == null ? 99 : a.hot) - (b.hot == null ? 99 : b.hot); });
  }
  function days(m, today) {
    if (!m.date) return null;
    var d = new Date(m.date + 'T00:00:00+09:00');
    return Math.floor((today - d) / 86400000);
  }
  function isNew(m, today) {
    var n = days(m, today);
    return n != null && n >= -SOON_DAYS && n <= NEW_DAYS;
  }
  function md(m) {
    var p = m.date.split('-');
    return (+p[1]) + '/' + (+p[2]);
  }
  // 名前の横のラベル。「新台」「人気機種」は見出しと重なるので出さない
  function tagOf(m) {
    return (m.tag && !/新台|人気機種/.test(m.tag)) ? m.tag : '';
  }
  // 判別のしやすさ（★）：ease.p3000（3000Gで設定6を「高設定80%以上」と出せる割合）から出す（2026-11-01 オーナー決定）
  // ★5＝80%以上／★4＝60%以上／★3＝30%以上／★2＝10%以上／★1＝10%未満。言葉は★4〜5＝しやすい、★2〜3＝ふつう、★1＝しにくい
  function stars(m) {
    if (!m.ease || m.ease.p3000 == null) return 0;
    var p = m.ease.p3000;
    return p >= 80 ? 5 : p >= 60 ? 4 : p >= 30 ? 3 : p >= 10 ? 2 : 1;
  }
  function easeLv(n) { return n >= 4 ? 'easy' : n >= 2 ? 'normal' : 'hard'; }
  var EASE_WORD = { easy: 'しやすい', normal: 'ふつう', hard: 'しにくい' };
  function starStr(n) { return '<b>' + '★★★★★'.slice(0, n) + '</b><i>' + '★★★★★'.slice(n) + '</i>'; }
  function easeHtml(m) {
    var n = stars(m);
    if (!n) return '';
    var lv = easeLv(n);
    return '<div class="ez ez-' + lv + '" title="3000G判別率 ' + m.ease.p3000 + '%"><span class="st">' + starStr(n) +
      '</span><span class="w">判別' + EASE_WORD[lv] + '</span>' + (m.ease.key ? '<span class="k">' + m.ease.key + '</span>' : '') + '</div>';
  }
  function badge(text, cls) {
    return text ? '<span class="badge ' + (cls || 'hot') + '">' + text + '</span>' : '';
  }
  function row(m, prefix, opt) {
    opt = opt || {};
    var sub = m.sub;
    if (opt.brand && m.maker && m.maker !== opt.brand) sub = '<span class="mk">' + m.maker + '</span>' + sub;
    var b = '';
    if (opt.today && m.date) {
      var n = days(m, opt.today);
      b = badge(md(m) + (n < 0 ? '導入予定' : '導入'), 'new');
    }
    b += badge(tagOf(m));
    return '<a class="row" href="' + prefix + m.path + '"><div class="t"><div class="n">' + m.name + b +
      '</div>' + easeHtml(m) + '<div class="s">' + sub + '</div></div><span class="arw">›</span></a>';
  }
  function seriesRow(key, list, prefix, brand) {
    var s = SERIES[key] || { name: key, sub: '' };
    var ns = list.map(stars).filter(Boolean), ez = '';
    if (ns.length) {
      var lo = Math.min.apply(null, ns), hi = Math.max.apply(null, ns);
      ez = '<div class="ez ez-' + easeLv(hi) + '"><span class="st">' + starStr(hi) + '</span><span class="w">' +
        (lo === hi ? '判別' + EASE_WORD[easeLv(hi)] : '機種で違う（★' + lo + '〜' + hi + '）') + '</span></div>';
    }
    return '<details class="series"><summary><div class="t"><div class="n">' + s.name +
      '<span class="cnt">' + list.length + '機種</span></div>' + ez + '<div class="s">' + s.sub +
      '</div></div><span class="arw">›</span></summary><div class="kids">' +
      list.map(function (m) { return row(m, prefix, { brand: brand }); }).join('') + '</div></details>';
  }
  // シリーズを1行にまとめる（最初に出てくる位置に置く）
  function collapse(list) {
    var out = [], seen = {};
    list.forEach(function (m) {
      if (!m.series) { out.push({ m: m }); return; }
      if (seen[m.series]) { seen[m.series].list.push(m); return; }
      seen[m.series] = { series: m.series, list: [m] };
      out.push(seen[m.series]);
    });
    return out.map(function (e) { return (e.series && e.list.length === 1) ? { m: e.list[0] } : e; });
  }
  function entryHtml(e, prefix, brand) {
    return e.m ? row(e.m, prefix, { brand: brand }) : seriesRow(e.series, e.list, prefix, brand);
  }

  // トップ：新台と話題の機種
  function renderTop(today) {
    var all = ready();
    var news = all.filter(function (m) { return isNew(m, today); })
      .sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : (a.hot || 99) - (b.hot || 99); });
    var old = all.filter(function (m) { return !isNew(m, today); });
    var rest = collapse(old.filter(function (m) { return m.pin; }).concat(old.filter(function (m) { return !m.pin; })));
    var easy = all.filter(function (m) { return stars(m) >= 4; })
      .sort(function (a, b) { return b.ease.p3000 - a.ease.p3000; });
    return {
      easyHtml: easy.map(function (m) { return row(m, ''); }).join('\n'),
      newHtml: news.map(function (m) { return row(m, '', { today: today }); }).join('\n'),
      newCount: news.length,
      hotHtml: rest.slice(0, HOT_MAX).map(function (e) { return entryHtml(e, ''); }).join('\n'),
      total: all.length
    };
  }

  // 全機種一覧：メーカー別
  function groups() {
    var g = {}, order = [];
    ready().forEach(function (m) {
      var k = MAKER_GROUP[m.maker] || m.maker || 'その他';
      if (!g[k]) { g[k] = []; order.push(k); }
      g[k].push(m);
    });
    order.sort(function (a, b) { return g[b].length - g[a].length || a.localeCompare(b, 'ja'); });
    return order.map(function (k) { return { name: k, list: g[k] }; });
  }
  function renderList() {
    var gs = groups();
    var jump = gs.map(function (x, i) { return '<a href="#mk-' + x.name + '">' + x.name + '</a>'; }).join('');
    var body = gs.map(function (x, i) {
      var brands = [];
      x.list.forEach(function (m) { if (m.maker && m.maker !== x.name && brands.indexOf(m.maker) < 0) brands.push(m.maker); });
      return '<section class="sec" id="mk-' + x.name + '"><h2 class="group">' + x.name + '<small>' + x.list.length + '機種' +
        (brands.length ? '（' + brands.join('・') + 'を含む）' : '') + '</small></h2><div class="rows">' +
        collapse(x.list).map(function (e) { return entryHtml(e, '../', x.name); }).join('') + '</div></section>';
    }).join('\n');
    var byEase = ['easy', 'normal', 'hard'].map(function (lv) {
      var ms = ready().filter(function (m) { return stars(m) && easeLv(stars(m)) === lv; })
        .sort(function (a, b) { return b.ease.p3000 - a.ease.p3000; });
      return '<section class="sec" id="ez-' + lv + '"><h2 class="group">判別' + EASE_WORD[lv] + '<small>' +
        { easy: '★4〜5', normal: '★2〜3', hard: '★1' }[lv] + '・' + ms.length + '機種</small></h2><div class="rows">' +
        ms.map(function (m) { return row(m, '../', {}); }).join('') + '</div></section>';
    }).join('\n');
    return { jump: jump, body: body, byEase: byEase, total: ready().length };
  }

  function searchHtml(q, prefix) {
    var k = norm(q);
    return ready().filter(function (m) { return norm(m.name + m.sub + m.keywords + (m.maker || '')).indexOf(k) >= 0; })
      .map(function (m) { return row(m, prefix); });
  }

  root.SSList = { renderTop: renderTop, renderList: renderList, searchHtml: searchHtml, norm: norm, stars: stars };

  // ブラウザ：検索と、トップの新台（日付で入れ替わる）の描き直し
  if (typeof document === 'undefined') return;
  document.addEventListener('DOMContentLoaded', function () {
    var page = document.body.getAttribute('data-page');
    var prefix = page === 'list' ? '../' : '';
    if (page === 'top') {
      var t = renderTop(new Date());
      var nw = document.getElementById('listNew');
      if (nw) { nw.innerHTML = t.newHtml; document.getElementById('secNew').style.display = t.newCount ? '' : 'none'; }
      var ht = document.getElementById('listHot');
      if (ht) ht.innerHTML = t.hotHtml;
      var ez = document.getElementById('listEasy');
      if (ez) ez.innerHTML = t.easyHtml;
    }
    // 全機種一覧：「メーカー別」「判別しやすい順」の切り替え
    var tg = document.getElementById('viewToggle');
    if (tg) tg.addEventListener('click', function (e) {
      var bt = e.target.closest('button');
      if (!bt) return;
      var v = bt.getAttribute('data-v');
      [].forEach.call(tg.querySelectorAll('button'), function (x) { x.classList.toggle('on', x === bt); });
      document.getElementById('viewMaker').style.display = v === 'maker' ? '' : 'none';
      document.getElementById('viewEase').style.display = v === 'ease' ? '' : 'none';
      var jp = document.getElementById('jump');
      if (jp) jp.style.display = v === 'maker' ? '' : 'none';
      if (typeof gtag === 'function') gtag('event', 'list_view', { view: v });
    });
    var q = document.getElementById('q');
    if (!q) return;
    var main = document.getElementById('mainLists');
    var res = document.getElementById('results');
    var resList = document.getElementById('listResults');
    var empty = document.getElementById('empty');
    var timer = null;
    // 検索欄の下のタグ：data-q があれば検索欄に入れて絞り込む（JS無しなら href 先へ）
    var quick = document.getElementById('quick');
    if (quick) quick.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      if (typeof gtag === 'function') gtag('event', 'quick_tag', { tag: a.textContent });
      if (!a.hasAttribute('data-q')) return;
      e.preventDefault();
      q.value = a.getAttribute('data-q');
      q.dispatchEvent(new Event('input'));
    });
    q.addEventListener('input', function () {
      var on = !!norm(q.value);
      var hits = on ? searchHtml(q.value, prefix) : [];
      main.style.display = on ? 'none' : '';
      resList.innerHTML = hits.join('');
      res.style.display = on && hits.length ? '' : 'none';
      empty.style.display = on && !hits.length ? 'block' : 'none';
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (q.value.trim() && typeof gtag === 'function') gtag('event', 'search', { search_term: q.value.trim(), page: page });
      }, 1200);
    });
  });
})(typeof window !== 'undefined' ? window : globalThis);
