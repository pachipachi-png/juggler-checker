# 新デザイン（データカウンター風、2026-10-30 オーナー決定）の機種ページを作る。
# 使い方（リポジトリのルートで）：python3 tools/design_a/genA.py tools/design_a/<key>.py
# データファイルは m = dict(...) 。B（2つ目の回数）・checks（示唆）・warn・extra_js は省略できる。
# 作り直すとその機種の index.html を上書きする（関連リンク <!--RELATED--> は今のページから引き継ぐ）。
import json, re, sys, os
R = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')) + '/'
m = {}
exec(open(sys.argv[1], encoding='utf-8').read())
key = m['key']
old = open(R + key + '/index.html', encoding='utf-8').read()
related = re.search(r'<!--RELATED-->.*?<!--/RELATED-->', old, re.S).group(0)

A, B = m['A'], m.get('B')
BB = B or dict(id='_noB', label='', btn='', spec=[1]*6)
hasChecks = bool(m.get('checks'))
def esc(s): return s
chk = ''
for grp, cols, items in m.get('checks', []):
    chk += f'        <p class="sub">{grp}</p>\n        <div class="tiles" style="grid-template-columns:repeat({cols},minmax(0,1fr));">\n'
    for lb, al, nm, tg in items:
        chk += f'          <label class="tile"><input type="checkbox" data-allow="{al}" data-name="{nm}"><span class="tn">{lb}</span><span class="tv">{tg}</span></label>\n'
    chk += '        </div>\n'
refs = ''.join(f'        <li>{x}</li>\n' for x in m.get('refs', []))
know = ''.join(f'      <li>{x}</li>\n' for x in m['know'])
rows = ''.join(f'        <tr{" class=\"hi\"" if i>=3 else ""}><td>{i+1}</td><td>{A["spec"][i]:.1f}</td>{f'<td>{B["spec"][i]:.1f}</td>' if B else ''}<td>{m["payout"][i]:.1f}</td></tr>\n' for i in range(6))
uchi = ''.join(f'    <h3>{h}</h3>\n    <ol class="steps">\n' + ''.join(f'      <li>{s}</li>\n' for s in st) + '    </ol>\n' for h, st in m['uchi'])
links = ''.join(f'    <a class="outlink ref-out" data-sec="uchikata{i or ""}" href="{u}" target="_blank" rel="noopener">{t} ↗</a>\n' for i, (u, t) in enumerate(m['links']))
guide = ''.join(f'    <h3>{h}</h3>\n    <p>{p}</p>\n' for h, p in m['guide'])
share = json.dumps({"key": key, "name": m['full'], "tags": m['tags'], "boxes": [{"id": "main", "btn": "calcBtn", "wrap": "pieWrap", "legend": "legend", "after": "evOutput", "label": "判別", "title": "判別結果をシェア", "xLabel": "𝕏でシェア", "fields": [
    {"id": "totalG", "q": "g", "label": "通常時", "unit": "G"},
    {"id": A['id'], "q": m['qa'], "label": A['label'], "unit": "回", "rateOf": "totalG"}] + ([{"id": B['id'], "q": m['qb'], "label": B['label'], "unit": "回", "rateOf": "totalG"}] if B else [])}], **({"hints": "#floorGroup input[type=checkbox]"} if hasChecks else {})}, ensure_ascii=False)
ccfg = {"key": key, "name": m['cname'], "g": {"id": "totalG", "label": "通常時G数"}, "counts": [{"id": A['id'], "label": A['label']}] + ([{"id": B['id'], "label": B['label'], "optional": True}] if B else []), "hiFrom": 4, "judge": "calcBtn", "wrap": "pieWrap", "legend": "legend", "note": m['cnote']}
if hasChecks: ccfg["checks"] = {"selector": "#floorGroup input[type=checkbox]", "title": m['checktitle'], "short": "示唆", "optional": True}
counter = json.dumps(ccfg, ensure_ascii=False)
bcell = f'''<div><label for="{B['id']}">{B['label']}{'（任意）' if B.get('opt') else ''}</label><input type="number" id="{B['id']}" inputmode="numeric" placeholder="-"></div>''' if B else ''
btap = f'''<button type="button" data-add="{B['id']}" data-n="1">{B['btn']} +1</button>''' if B else ''
brate = f'''<span>{B['btn']} <b id="liveB">―</b><small id="liveBNote"></small></span>''' if B else ''
cellcols = 3 if B else 2
tapcols = 4 if B else 3
warn_html = f'''<p class="warn">{m['warn']}</p>''' if m.get('warn') else ''
if hasChecks:
    hints_html = f'''    <div class="sh"><h2>見えたら押す</h2><small>「〇以上濃厚」だけ計算に使う</small></div>
    <div id="floorGroup">
{chk}    </div>
    <p class="floor" id="floorNow">絞り込み：なし</p>
    <ul class="refs">
{refs}    </ul>
    <a class="outlink ref-out" data-sec="settei" href="{m['hintlink'][0]}" target="_blank" rel="noopener">{m['hintlink'][1]} ↗</a>'''
else:
    hints_html = f'''    <div class="sh"><h2>示唆</h2><small>まだ未公表</small></div>
    <div id="floorGroup"></div>
    <p class="floor" id="floorNow" style="font-size:13px;color:var(--text);">{m['nohint']}</p>''' + (('\n    <ul class="refs">\n' + refs + '    </ul>') if m.get('refs') else '')
th_b = f"<th>{B['label']}</th>" if B else ''

html = f'''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{m['title']} | 設定示唆くん</title>
<meta name="description" content="{m['desc']}">
<link rel="canonical" href="https://pachipachi-png.com/{key}/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="設定示唆くん">
<meta property="og:title" content="{m['ogt']}">
<meta property="og:description" content="{m['ogd']}">
<meta property="og:url" content="https://pachipachi-png.com/{key}/">
<meta property="og:image" content="https://pachipachi-png.com/ogp.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DotGothic16&family=M+PLUS+1p:wght@500;700;800&display=swap" rel="stylesheet">
<style>
  /* 案A：データカウンター風（2026-10-30 試作） */
  :root{{
    --bg:#0c0c0d; --panel:#17171a; --panel-2:#1f1f22; --line:#2c2c30; --text:#ebe8e1; --muted:#a9a59c;
    --amber:#ffb21e; --amber-dim:#3a2a0c; --led-bg:#120d05;
    /* counter.js・share.js が使う名前 */
    --gold:#ffb21e; --gold-dim:#6b4c10; --teal:#ffb21e; --red:#ff7a6b;
  }}
  *{{box-sizing:border-box;}}
  html,body{{margin:0;padding:0;}}
  body{{background:var(--bg);color:var(--text);font-family:'M PLUS 1p',sans-serif;line-height:1.7;padding-bottom:72px;}}
  .dot{{font-variant-numeric:tabular-nums;font-weight:700;}}
  .led{{font-family:'DotGothic16',monospace;font-weight:400;}}
  .wrap{{max-width:520px;margin:0 auto;}}
  a{{color:var(--amber);}}
  .bar-top{{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid var(--line);font-size:12px;}}
  .bar-top a{{text-decoration:none;font-weight:800;font-size:14px;letter-spacing:.04em;}}
  .bar-top span{{color:var(--muted);}}
  .hero{{display:flex;gap:14px;padding:18px 16px 14px;align-items:flex-end;}}
  .hero img{{width:140px;height:auto;flex-shrink:0;background:#fff;border-radius:4px;}}
  .hero .new{{align-self:flex-start;background:var(--amber);color:var(--bg);font-size:12px;padding:1px 6px;}}
  .hero h1{{margin:6px 0 4px;font-size:22px;line-height:1.3;font-weight:800;}}
  .hero p{{margin:0;font-size:12px;color:var(--muted);line-height:1.6;}}
  .lead{{margin:0 16px;padding:12px 14px;background:#1b1a17;border-top:3px solid var(--amber);font-size:13.5px;}}
  .lead b.h{{display:block;color:var(--amber);font-size:15.5px;font-weight:800;margin-bottom:2px;}}
  .lead p{{margin:0;}}
  .lead .warn{{margin-top:8px;padding-top:8px;border-top:1px dashed #3a3730;font-size:12px;color:var(--muted);}}
  .jump{{display:flex;gap:0;margin:14px 16px 0;border:1px solid var(--line);}}
  .jump a{{flex:1;text-align:center;padding:8px 0;font-size:12px;color:var(--muted);text-decoration:none;border-left:1px solid var(--line);}}
  .jump a:first-child{{border-left:none;}}
  .data{{margin:16px 16px 0;background:#050505;border:2px solid #2f2f31;border-radius:6px;padding:14px 12px 12px;}}
  .data-h{{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;}}
  .data-h .dot{{font-family:'DotGothic16',monospace;font-weight:400;font-size:13px;color:var(--muted);letter-spacing:.1em;}}
  .data-h small{{font-size:11px;color:var(--muted);}}
  .cells{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;}}
  .cells{{align-items:end;}}
  .cells label{{display:block;font-size:11px;color:var(--muted);margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}}
  .cells input{{width:100%;background:var(--led-bg);border:1px solid var(--amber-dim);color:var(--amber);font-family:'DotGothic16',monospace;font-size:26px;text-align:right;padding:6px;border-radius:3px;}}
  .cells input::placeholder{{color:#5a4316;}}
  input:focus,button:focus-visible,.tile:focus-within{{outline:2px solid var(--amber);outline-offset:1px;}}
  .taps{{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:8px;}}
  .taps button{{height:48px;background:#26262a;color:var(--text);border:1px solid #3a3a3e;border-radius:4px;font-family:inherit;font-weight:700;font-size:13px;cursor:pointer;}}
  .taps button:active{{background:#34343a;}}
  .taps button.undo{{color:var(--muted);font-weight:500;}}
  .rates{{display:flex;justify-content:space-between;gap:8px;margin-top:10px;font-size:13.5px;color:var(--muted);flex-wrap:wrap;}}
  .rates b{{color:var(--amber);font-weight:800;}}
  .rates small{{font-size:11px;margin-left:4px;}}
  .hint{{font-size:12px;color:var(--muted);line-height:1.6;margin:6px 0 0;}}
  .data .hint{{margin:8px 0 0;font-size:11.5px;color:var(--muted);line-height:1.6;}}
  .judge{{display:block;width:calc(100% - 32px);margin:12px 16px 0;height:54px;background:var(--amber);color:var(--bg);border:none;border-radius:4px;font-family:inherit;font-weight:800;font-size:17px;letter-spacing:.08em;cursor:pointer;}}
  .judge:active{{transform:translateY(1px);}}
  section{{margin:24px 16px 0;}}
  .sh{{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid var(--line);padding-bottom:6px;margin:0 0 10px;}}
  .sh h2{{margin:0;font-size:15.5px;font-weight:800;}}
  .sh small{{font-size:12px;color:var(--muted);}}
  #pieWrap{{margin-top:2px;}}
  .legend-row{{display:flex;align-items:center;gap:8px;font-variant-numeric:tabular-nums;font-size:13px;margin-bottom:6px;}}
  .legend-row .sl{{width:44px;color:var(--muted);}}
  .legend-row.hi .sl{{color:var(--amber);}}
  .legend-row .track{{flex:1;height:14px;background:#1b1b1d;}}
  .legend-row .swatch{{display:block;height:14px;background:#5c5a55;}}
  .legend-row.hi .swatch{{background:var(--amber);}}
  .legend-row .pct{{width:50px;text-align:right;}}
  .legend-row.cut{{opacity:.35;}}
  .summary{{font-size:13.5px;line-height:1.7;}}
  .summary .big{{font-variant-numeric:tabular-nums;font-weight:800;color:var(--amber);font-size:21px;}}
  .summary .meta{{display:block;font-size:12px;color:var(--muted);margin-top:4px;}}
  .ev{{margin-top:12px;padding:12px;border:1px solid var(--line);display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap;}}
  .ev .n{{font-variant-numeric:tabular-nums;font-weight:800;font-size:22px;}}
  .ev .n.pos{{color:var(--amber);}} .ev .n.neg{{color:#ff7a6b;}}
  .ev small{{font-size:11.5px;color:var(--muted);}}
  .tip{{margin-top:12px;font-size:12.5px;color:var(--muted);}}
  .tip a{{font-weight:700;}}
  .sub{{margin:12px 0 6px;font-size:12px;color:var(--muted);}}
  .tiles{{display:grid;gap:6px;}}
  .tile{{position:relative;min-height:56px;background:#1b1a17;border:1px solid #3a3a3e;border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;cursor:pointer;text-align:center;padding:4px 2px;}}
  .tile input{{position:absolute;opacity:0;width:1px;height:1px;}}
  .tile .tn{{font-size:12px;font-weight:700;line-height:1.3;}}
  .tile .tv{{font-variant-numeric:tabular-nums;font-size:12px;color:var(--muted);}}
  .tile:has(input:checked){{background:var(--amber);border-color:var(--amber);color:var(--bg);}}
  .tile:has(input:checked) .tv{{color:var(--bg);}}
  .floor{{margin:10px 0 0;font-size:12.5px;color:var(--muted);}}
  .floor b{{color:var(--amber);font-weight:700;}}
  .refs{{margin:12px 0 0;padding-left:18px;font-size:12px;color:var(--muted);}}
  .refs li{{margin-bottom:4px;}}
  .outlink{{display:inline-block;margin-top:10px;font-size:12.5px;text-decoration:none;}}
  .memo{{margin:24px 16px 0;padding:14px;border:1px dashed #3a3a3e;font-size:13px;}}
  .memo .dot{{display:block;font-weight:700;color:var(--amber);font-size:12px;margin-bottom:4px;}}
  .memo p{{margin:0;}}
  .list{{margin:0;padding-left:18px;font-size:13px;}}
  .list li{{margin-bottom:6px;}} .list b{{color:var(--amber);font-weight:700;}}
  table.t{{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums;font-size:13.5px;}}
  table.t th{{color:var(--muted);font-weight:400;text-align:right;padding:6px 0;}}
  table.t th:first-child,table.t td:first-child{{text-align:left;}}
  table.t td{{text-align:right;padding:6px 0;border-top:1px solid #222224;}}
  table.t tr.hi td{{color:var(--amber);}}
  .note{{margin:8px 0 0;font-size:11.5px;color:var(--muted);}}
  .steps{{margin:4px 0 0;padding-left:20px;font-size:13px;}} .steps li{{margin-bottom:5px;}}
  h3{{font-size:13.5px;margin:14px 0 4px;}}
  .guide p{{font-size:13.5px;line-height:1.85;margin:4px 0 10px;}}
  details summary{{cursor:pointer;font-size:13px;color:var(--muted);list-style:none;}}
  details summary::-webkit-details-marker{{display:none;}}
  details summary::before{{content:'＋ ';}} details[open] summary::before{{content:'－ ';}}
  #specBody input{{width:100%;background:var(--panel-2);border:1px solid var(--line);color:var(--text);font-family:inherit;font-variant-numeric:tabular-nums;font-size:13px;text-align:right;padding:4px;}}
  .row2{{display:grid;grid-template-columns:1fr 1fr;gap:10px;}}
  .row2 label{{display:block;font-size:11.5px;color:var(--muted);margin-bottom:4px;}}
  .row2 input{{width:100%;background:var(--panel-2);border:1px solid var(--line);color:var(--text);padding:8px;font-family:inherit;font-size:14px;border-radius:3px;}}
  .card{{background:transparent;}}
  .btn-primary{{background:var(--amber);color:var(--bg);border:none;border-radius:4px;padding:10px 12px;font-weight:800;text-decoration:none;display:inline-block;text-align:center;font-family:inherit;}}
  .btn-ghost{{background:transparent;border:1px solid var(--line);color:var(--text);border-radius:4px;padding:10px 12px;font-family:inherit;}}
  .rel{{margin:28px 16px 0;}}
  .rel h2{{font-size:15px;margin:0 0 10px;}}
  .rel li a{{border-radius:3px !important;}}
  .ad-slot{{display:none;}}
  footer{{margin-top:28px;padding:16px;border-top:1px solid var(--line);font-size:11.5px;color:#8d8980;}}
  footer a{{color:#8d8980;margin-right:12px;}}
</style>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ZFM94DE8Y3"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());
  gtag('config', 'G-ZFM94DE8Y3');
</script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9150472731628445" crossorigin="anonymous"></script>
</head>
<body>
<div class="wrap">
<nav class="bar-top"><a href="../">設定示唆くん</a><span><a href="../list/" style="font-size:12px;font-weight:500;color:var(--muted);">機種一覧</a></span></nav>

<header class="hero">
  <img src="{m['img'][0]}" width="140" height="{round(140*397/260)}" alt="{m['img'][2]}">
  <div>
    <span class="new" style="font-weight:800;">{m['newtag']}</span>
    <h1>{m['h1']}</h1>
    <p>{m['specline']}</p>
  </div>
</header>

<div class="lead">
  <b class="h">{m['lead_h']}</b>
  <p>{m['lead']}</p>
  {warn_html}
</div>

<nav class="jump" aria-label="ページ内の目次"><a href="#mainCard">判別</a><a href="#hints">示唆</a><a href="#gousei">設定差</a><a href="#uchikata">打ち方</a><a href="#guide">解説</a></nav>

<div id="mainCard">
<div class="data">
  <div class="data-h"><span class="dot">DATA</span><small>通常時だけ数える</small></div>
  <div class="cells" style="grid-template-columns:repeat({cellcols},minmax(0,1fr));">
    <div><label for="totalG">総回転</label><input type="number" id="totalG" inputmode="numeric" placeholder="0"></div>
    <div><label for="{A['id']}">{A['label']}</label><input type="number" id="{A['id']}" inputmode="numeric" placeholder="0"></div>
    {bcell}
  </div>
  <div class="taps" style="grid-template-columns:repeat({tapcols},minmax(0,1fr));">
    <button type="button" data-add="totalG" data-n="100">+100G</button>
    <button type="button" data-add="{A['id']}" data-n="1">{A['btn']} +1</button>
    {btap}
    <button type="button" class="undo" id="undoBtn">1つ戻す</button>
  </div>
  <div class="rates dot">
    <span>{A['btn']} <b id="liveA">―</b><small id="liveANote"></small></span>
    {brate}
  </div>
  <p class="hint">{m['inhint']}</p>
</div>
<button class="judge" id="calcBtn">判別する</button>

<section id="result">
  <div class="sh"><h2>結果</h2><small>確率の目安</small></div>
  <div id="pieWrap" style="display:none;"><div id="legend"></div></div>
  <div id="topSetting" class="summary"><p style="margin:0;font-size:12.5px;color:var(--muted);">数字を入れて「判別する」を押すと、設定1〜6の可能性がここに出ます。</p></div>
  <div class="ev" id="evOutput" style="display:none;"></div>
  <div class="tip" id="tipPromptCalc" style="display:none;">勝ったら10円でもいいので <a href="https://ofuse.me/cec8e32a" target="_blank" rel="noopener">投げ銭</a> ください。</div>
</section>
</div>

<section id="optionalCard">
  <div id="hints">
{hints_html}
  </div>
  <details style="margin-top:16px;">
    <summary>期待差枚の計算条件</summary>
    <div class="row2" style="margin-top:8px;">
      <div><label for="closingTime">閉店時刻</label><input type="time" id="closingTime" value="22:45"></div>
      <div><label for="spinsPerHour">1時間の回転数</label><input type="number" id="spinsPerHour" value="700"></div>
    </div>
    <button class="btn-ghost" id="recalcBtn" type="button" style="width:100%;margin-top:10px;">この条件で再計算</button>
  </details>
</section>

<div class="memo"><span class="dot">運営メモ {m['memo'][0]}</span><p>{m['memo'][1]}</p></div>

<section id="know">
  <div class="sh"><h2>先に知っておくこと</h2></div>
  <ul class="list">
{know}  </ul>
</section>

<section id="gousei">
  <div class="sh"><h2>設定差・機械割</h2></div>
  <table class="t">
    <thead><tr><th>設定</th><th>{A['label']}</th>{th_b}<th>機械割</th></tr></thead>
    <tbody>
{rows}    </tbody>
  </table>
  <p class="note">確率は「1/〇〇」の分母。{m['ratenote']}</p>
</section>

<section id="uchikata">
  <div class="sh"><h2>打ち方</h2></div>
{uchi}  <p class="note">{m['uchinote']}</p>
{links}</section>

<section id="guide" class="guide">
  <div class="sh"><h2>{m['short']}の設定判別の考え方と数えるコツ</h2></div>
{guide}</section>

<section id="specCard">
  <details>
    <summary>計算に使う設定差を見る・編集する</summary>
    <table class="t" style="margin-top:8px;">
      <thead><tr><th>設定</th><th>{A['label']}</th>{th_b}<th>機械割%</th></tr></thead>
      <tbody id="specBody"></tbody>
    </table>
    <p class="note">{m['dates']}</p>
  </details>
</section>

{related}

<div class="ad-slot">広告スペース</div>

<footer>
  数値は各解析サイトの公開値（2026年10月時点）。結果は確率の目安で、設定を保証するものではありません。遊技は自己責任・適正な範囲で。18歳未満の方はパチンコ・パチスロを遊技できません。<br>
  <a href="../">機種一覧</a><a href="../privacy.html">プライバシーポリシー</a><a href="../about.html">運営者情報</a><a href="../contact.html">お問い合わせ</a>
</footer>
</div>

<script>
const SETS = [1,2,3,4,5,6], N = 6;
const HAS_B = {'true' if B else 'false'}, HAS_CHECKS = {'true' if hasChecks else 'false'};
const SPEC = {{ a: {json.dumps(A['spec'])}, b: {json.dumps(BB['spec'])}, payout: {json.dumps(m['payout'])} }};
const BET = 3, LABEL_A = {json.dumps(A['label'], ensure_ascii=False)}, LABEL_B = {json.dumps(BB['label'], ensure_ascii=False)};
const $ = id => document.getElementById(id);
const specBody = $('specBody');
for(let s=0; s<N; s++){{
  const tr = document.createElement('tr');
  tr.innerHTML = `<td>${{SETS[s]}}</td><td><input type="number" step="0.1" class="aInput" value="${{SPEC.a[s].toFixed(1)}}"></td>${{HAS_B ? `<td><input type="number" step="0.1" class="bInput" value="${{SPEC.b[s].toFixed(1)}}"></td>` : ''}}<td><input type="number" step="0.1" class="payoutInput" value="${{SPEC.payout[s].toFixed(1)}}"></td>`;
  specBody.appendChild(tr);
}}
const readCol = cls => [...document.querySelectorAll('.' + cls)].map(el => parseFloat(el.value) || 1);
const totalG = $('totalG'), aCount = $({json.dumps(A['id'])}), bCount = $({json.dumps(BB['id'])}) || {{ value: '', addEventListener(){{}}, dispatchEvent(){{}} }};
const num = el => Math.max(parseFloat(el.value) || 0, 0);
function nearLabel(r, arr){{
  if(r >= Math.max(...arr)) return '設定1より重い';
  if(r <= Math.min(...arr)) return '設定6より軽い';
  let best = 0; arr.forEach((v, i) => {{ if(Math.abs(v - r) < Math.abs(arr[best] - r)) best = i; }});
  return `設定${{SETS[best]}}付近`;
}}
const rate = (g, k) => k > 0 ? `1/${{(g/k).toFixed(1)}}` : '―';
function live(el, cls, b, n){{
  const g = num(totalG), k = num(el);
  if(g > 0 && k > 0){{ $(b).textContent = rate(g, k); $(n).textContent = nearLabel(g/k, readCol(cls)); }}
  else {{ $(b).textContent = '―'; $(n).textContent = ''; }}
}}
function updateLive(){{ live(aCount, 'aInput', 'liveA', 'liveANote'); if(HAS_B) live(bCount, 'bInput', 'liveB', 'liveBNote'); }}
[totalG, aCount, bCount].forEach(el => el.addEventListener('input', updateLive));
specBody.addEventListener('input', updateLive);

// タップで足す（データカウンターのように）
const undo = [];
document.querySelectorAll('[data-add]').forEach(b => b.addEventListener('click', () => {{
  const el = $(b.dataset.add), before = el.value;
  el.value = num(el) + Number(b.dataset.n);
  undo.push([el, before]); if(undo.length > 50) undo.shift();
  el.dispatchEvent(new Event('input', {{ bubbles: true }}));
}}));
$('undoBtn').addEventListener('click', () => {{
  const u = undo.pop(); if(!u) return;
  u[0].value = u[1]; u[0].dispatchEvent(new Event('input', {{ bubbles: true }}));
}});

// 示唆
const floorChecks = [...document.querySelectorAll('#floorGroup input[type=checkbox]')];
function currentAllow(){{
  const on = floorChecks.filter(c => c.checked);
  let allow = new Set(SETS);
  on.forEach(c => {{ const a = new Set(c.dataset.allow.split(',').map(Number)); allow = new Set([...allow].filter(s => a.has(s))); }});
  return {{ allow, names: on.map(c => c.dataset.name) }};
}}
const allowLabel = allow => [...allow].join('・');
function updateFloorText(){{
  const {{ allow, names }} = currentAllow(), el = $('floorNow');
  if(!names.length) el.innerHTML = '絞り込み：なし';
  else if(!allow.size) el.innerHTML = '<span style="color:var(--red);">押した示唆が矛盾しています。見間違いがないか確認してください。</span>';
  else el.innerHTML = `絞り込み：設定<b>${{allowLabel(allow)}}</b>で計算（${{names.join('・')}}）`;
}}
floorChecks.forEach(c => c.addEventListener('change', updateFloorText));

// 計算
const binomLL = (k, n, p) => k*Math.log(p) + Math.max(n - k, 0)*Math.log(Math.max(1 - p, 1e-12));
function showMsg(t){{ $('topSetting').innerHTML = `<p style="margin:0;font-size:13px;color:var(--muted);">${{t}}</p>`; $('pieWrap').style.display = 'none'; $('evOutput').style.display = 'none'; $('tipPromptCalc').style.display = 'none'; }}
$('calcBtn').addEventListener('click', () => {{
  const g = num(totalG), a = num(aCount), useB = HAS_B && bCount.value.trim() !== '', b = useB ? num(bCount) : 0;
  if(g <= 0){{ showMsg('総回転（通常時）を入れてください。'); return; }}
  if(aCount.value.trim() === ''){{ showMsg(`${{LABEL_A}}の回数を入れてください（0回なら0）。`); return; }}
  if(a > g || b > g){{ showMsg('回数がゲーム数を超えています。'); return; }}
  const {{ allow, names }} = currentAllow();
  if(!allow.size){{ showMsg('押した示唆が矛盾しています。見間違いがないか確認してください。'); return; }}
  const av = readCol('aInput'), bv = readCol('bInput'), payout = readCol('payoutInput');
  const ll = SETS.map((s, i) => !allow.has(s) ? -Infinity : binomLL(a, g, 1/av[i]) + (useB ? binomLL(b, g, 1/bv[i]) : 0));
  const mx = Math.max(...ll), w = ll.map(v => v === -Infinity ? 0 : Math.exp(v - mx)), sum = w.reduce((x, y) => x + y, 0), post = w.map(x => x / sum);
  const exp = post.reduce((acc, p, i) => acc + p*SETS[i], 0);
  if (typeof gtag === 'function') gtag('event', 'judge_run', {{ machine: {json.dumps(key)}, has_b: useB }});
  const top = Math.max(...post), best = post.indexOf(top), hi = post[3] + post[4] + post[5];
  $('legend').innerHTML = post.map((p, i) => `<div class="legend-row${{i >= 3 ? ' hi' : ''}}${{allow.has(SETS[i]) ? '' : ' cut'}}"><span class="sl">設定${{SETS[i]}}</span><span class="track"><span class="swatch" style="width:${{top > 0 ? (p/top*100).toFixed(1) : 0}}%;"></span></span><span class="pct">${{(p*100).toFixed(1)}}%</span></div>`).join('');
  $('pieWrap').style.display = 'block';
  const parts = [`通常時${{g}}G`, `${{LABEL_A}} ${{a}}回（${{rate(g, a)}}）`];
  if(useB) parts.push(`${{LABEL_B}} ${{b}}回（${{rate(g, b)}}）`);
  if(names.length) parts.push(`示唆：${{names.join('・')}}`);
  let say;
  const minAllow = Math.min(...allow);
  if(names.length && allow.size === 1) say = `示唆で設定${{[...allow][0]}}に絞れました。`;
  else if(names.length && minAllow >= 4) say = `示唆で設定${{minAllow}}以上に絞れています。あとは回数で上の設定を見ます。`;
  else if(hi >= 0.8) say = '高設定（4以上）の可能性がかなり高い。';
  else if(hi >= 0.6) say = '高設定寄り。ただしまだ決めきれない。';
  else if(hi <= 0.3) say = HAS_CHECKS ? '低設定寄り。示唆が出ないなら深追いは禁物。' : '低設定寄り。数字が戻らないなら深追いは禁物。';
  else say = HAS_CHECKS ? 'まだ何とも言えない範囲。示唆が1つ出れば大きく変わります。' : 'まだ何とも言えない範囲。回すほど差がはっきりします。';
  $('topSetting').innerHTML = `<div>設定4以上 <span class="big">${{(hi*100).toFixed(0)}}%</span>　期待設定 <span class="big">${{exp.toFixed(1)}}</span></div>{m.get('extra_js','')}<div style="margin-top:4px;">${{say}}</div><span class="meta">${{parts.join(' ／ ')}}</span>`;
  const sph = parseFloat($('spinsPerHour').value) || 0;
  const [hh, mm] = $('closingTime').value.split(':').map(Number);
  const closing = new Date(); closing.setHours(hh, mm, 0, 0);
  let hours = Math.max((closing - new Date()) / 3600000, 0);
  if(hours > 15) hours = 0; // 閉店後〜朝（翌日の閉店まで数えない）
  const remainG = sph * hours;
  const net = payout.map(p => BET * (p/100 - 1) * remainG);
  const ev = Math.round(post.reduce((x, p, i) => x + p*net[i], 0)) || 0;
  const sign = v => v > 0 ? '+' : (v < 0 ? '' : '±');
  $('evOutput').style.display = 'flex';
  $('evOutput').innerHTML = `<span><small>閉店まで（約${{Math.round(remainG).toLocaleString()}}G）の期待差枚</small></span><span class="n ${{ev >= 0 ? 'pos' : 'neg'}}">${{sign(ev)}}${{ev.toLocaleString()}}枚</span>`;
  $('tipPromptCalc').style.display = 'block';
}});
document.querySelectorAll('a.ref-out').forEach(a => a.addEventListener('click', () => {{
  if (typeof gtag === 'function') gtag('event', 'outbound_ref', {{ machine: {json.dumps(key)}, section: a.dataset.sec }});
}}));
// 判別後は入力やチェックを変えると自動で計算し直す
(function(){{
  const btn = $('calcBtn'); let done = false, timer = null;
  btn.addEventListener('click', () => {{ done = true; }});
  function silent(){{ const g = window.gtag; window.gtag = function(a, b){{ if(a === 'event' && b === 'judge_run') return; if(typeof g === 'function') return g.apply(this, arguments); }}; try {{ btn.click(); }} finally {{ window.gtag = g; }} }}
  function auto(){{ if(!done) return; clearTimeout(timer); timer = setTimeout(silent, 300); }}
  ['optionalCard', 'specCard', 'mainCard'].forEach(id => {{ const el = $(id); el.addEventListener('input', auto); el.addEventListener('change', auto); }});
  $('recalcBtn').addEventListener('click', () => {{ btn.click(); $('result').scrollIntoView({{ behavior: 'smooth', block: 'start' }}); }});
}})();
</script>
<script src="../share.js"></script>
<script>
SettiShare.init({share});
</script>
<script src="../counter.js"></script>
<script>
SettiCounter.init({counter});
</script>
</body>
</html>
'''
out = sys.argv[2] if len(sys.argv) > 2 else R + key + '/index.html'
open(out, 'w', encoding='utf-8').write(html)
print('written', out, len(html))
