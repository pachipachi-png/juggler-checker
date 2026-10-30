// 機種ページの解説セクション（id="guide"）を「見出し＋最初の段落は表示、残りは『続きを読む』でたたむ」形にする。
// details/summary を使うので JavaScript なしで開閉でき、たたんだ部分も HTML に残る（検索・審査で読まれる）。
// 使い方：リポジトリのルートで  node tools/build_guide_fold.js   （tools/build_lists.js の最後でも自動で実行される）
// 何度実行しても同じ結果になる（すでに guide-more があるページは触らない）。
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..');
const CSS = '<style>.guide-more>summary{list-style:none;cursor:pointer;display:block;margin:4px 0 2px;padding:9px 0;text-align:center;font-size:13.5px;font-weight:700;color:var(--teal);border:1px solid var(--line);border-radius:8px;}.guide-more>summary::-webkit-details-marker{display:none;}.guide-more .gm-c{display:none;}.guide-more[open]>summary .gm-o{display:none;}.guide-more[open]>summary .gm-c{display:inline;}.guide-more[open]>summary{margin-top:12px;}details.guide-more>summary::before,details.guide-more[open]>summary::before{content:none;}</style>';
const SUMMARY = '<summary><span class="gm-o">続きを読む ▼</span><span class="gm-c">閉じる ▲</span></summary>';

let done = 0, skipped = [];
for (const d of fs.readdirSync(R)) {
  const f = path.join(R, d, 'index.html');
  if (!fs.existsSync(f)) continue;
  let s = fs.readFileSync(f, 'utf8');
  const start = s.search(/<section[^>]*id="guide"[^>]*>/);
  if (start < 0) continue;
  const end = s.indexOf('</section>', start);
  let sec = s.slice(start, end);
  if (sec.includes('guide-more')) continue;
  const firstP = sec.indexOf('</p>');
  if (firstP < 0 || sec.indexOf('<p', firstP) < 0) { skipped.push(d); continue; }
  const cut = firstP + 4;
  const rest = sec.slice(cut).replace(/\s+$/, '');
  const indent = (sec.match(/\n(\s*)<h3/) || [, '    '])[1];
  sec = sec.slice(0, cut) + '\n' + indent + '<details class="guide-more">' + CSS + SUMMARY + rest + '\n' + indent + '</details>\n' + (s.slice(start, end).match(/\n(\s*)$/) || [, ''])[1];
  s = s.slice(0, start) + sec + s.slice(end);
  fs.writeFileSync(f, s);
  done++;
}
console.log('解説の折りたたみ', done, 'ページ', skipped.length ? '／スキップ: ' + skipped.join(', ') : '');
