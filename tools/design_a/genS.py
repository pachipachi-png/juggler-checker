# 終了画面などの示唆一覧ページ（<key>/shuryo/index.html）を作る。
# 使い方: python3 tools/design_a/genS.py tools/design_a/<key>.py
# データは genA と同じ <key>.py の screens・checks・refs を使い、CSS は親ページ（<key>/index.html）から取る。
import sys, re, json, os, datetime
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import screens as SCR
src = sys.argv[1]
g = {}
exec(open(src, encoding='utf-8').read(), g)
m = g['m']
key, S = m['key'], m['screens']
parent = open(f'{key}/index.html', encoding='utf-8').read()
css = re.search(r'<style>(.*?)</style>', parent, re.S).group(1)
short, full = m['short'], m['full']
url = f'https://pachipachi-png.com/{key}/shuryo/'
NM = SCR.names(S)
title = S.get('ptitle', f'{short} {NM}の示唆一覧（画像つき）| 設定示唆くん')
h1 = S.get('ph1', f'{short}<br>{NM}の示唆一覧')
desc = S.get('pdesc', f'{full}の{NM}を画像つきで一覧にしました。設定の濃厚パターンや示唆、モード・状態の示唆と、判別ツールで使える示唆の一覧もまとめています。')
gallery = SCR.block(S, short, '', only_inline=False, link=False, hid='gallery')
# 文字の一覧（濃厚系のボタン群をそのまま表に）
rows = ''
for grp, cols, items in m.get('checks', []):
    def tagtxt(t):
        t2 = re.sub(r'^(\d)↑$', r'設定\1以上濃厚', t)
        return '設定6濃厚' if t == '6' else t2
    li = ''.join(f'<li><b>{re.sub("<br>", "", lb)}</b>　{tagtxt(tg)}</li>' for lb, al, nm, tg in items)
    rows += f'    <h3>{grp}</h3>\n    <ul class="hlist">{li}</ul>\n'
refs = ''.join(f'      <li>{x}</li>\n' for x in m.get('refs', []))
ld = json.dumps({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "設定示唆くん", "item": "https://pachipachi-png.com/"},
    {"@type": "ListItem", "position": 2, "name": f"{short} 設定判別", "item": f"https://pachipachi-png.com/{key}/"},
    {"@type": "ListItem", "position": 3, "name": f"{NM}の示唆一覧", "item": url}]}, ensure_ascii=False)
gtag = re.search(r'(<!-- Google tag.*?</script>\s*<script>.*?</script>)', parent, re.S).group(1)
ads = re.search(r'(<script async src="https://pagead2[^>]*></script>)', parent).group(1)
html = f'''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="設定示唆くん">
<meta property="og:title" content="{short} {NM}の示唆一覧 | 設定示唆くん">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="https://pachipachi-png.com/ogp.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DotGothic16&family=M+PLUS+1p:wght@500;700;800&display=swap" rel="stylesheet">
<style>{css}
  .crumb{{margin:6px 16px 0;font-size:12px;color:var(--muted);}}
  .crumb a{{color:var(--muted);}}
  .sbody{{margin:0 16px;}}
  .sbody h3{{font-size:14px;margin:16px 0 6px;}}
  .hlist{{margin:0;padding-left:18px;font-size:13px;}}
  .hlist li{{margin-bottom:3px;}}
  .cta{{display:block;margin:14px 0;padding:12px;border-radius:4px;background:var(--amber);color:var(--bg);font-weight:800;text-align:center;text-decoration:none;font-size:15px;}}
  .legend2{{font-size:12px;color:var(--muted);margin:0 0 8px;}}
</style>
<script type="application/ld+json">{ld}</script>
{gtag}
{ads}
</head>
<body>
<div class="wrap">
<nav class="bar-top"><a href="../../">設定示唆くん</a><span><a href="../../list/" style="font-size:12px;font-weight:500;color:var(--muted);">機種一覧</a></span></nav>
<p class="crumb"><a href="../../">トップ</a> ＞ <a href="../">{short} 設定判別</a> ＞ {NM}</p>
<header class="hero">
  <div>
    <h1>{h1}</h1>
    <p>{S.get('lead', '')}</p>
  </div>
</header>

<section class="sbody">
  <a class="cta" href="../">見えた示唆を入れて設定判別する →</a>
  <p class="legend2">黄色の文字＝判別ツールで使える「〇以上濃厚」。青＝モード・状態の示唆。グレー＝期待度アップ・推察など。</p>
{gallery}
  <div class="sh"><h2>示唆の一覧（文字）</h2><small>判別ツールのボタンと同じ</small></div>
{rows}
  <h3>そのほかの示唆・注意</h3>
  <ul class="hlist">
{refs}  </ul>
  <a class="cta" href="../">{short}の設定判別ツールを開く →</a>
</section>

<div class="ad-slot">広告スペース</div>

<footer>
  示唆は各解析サイトの公開値です。示唆の出方は店長カスタムで変わる場合があります。遊技は自己責任・適正な範囲で。18歳未満の方はパチンコ・パチスロを遊技できません。<br>
  <a href="../../">機種一覧</a><a href="../../privacy.html">プライバシーポリシー</a><a href="../../about.html">運営者情報</a><a href="../../contact.html">お問い合わせ</a>
</footer>
</div>
</body>
</html>
'''
os.makedirs(f'{key}/shuryo', exist_ok=True)
open(f'{key}/shuryo/index.html', 'w', encoding='utf-8').write(html)
print('written', f'{key}/shuryo/index.html', len(html))
