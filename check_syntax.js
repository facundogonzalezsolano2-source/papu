const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scripts = [];
let idx = 0;
while (true) {
  const start = html.indexOf('<script', idx);
  if (start === -1) break;
  const closeStart = html.indexOf('>', start);
  if (closeStart === -1) break;
  const endTag = '</script>';
  const end = html.indexOf(endTag, closeStart);
  if (end === -1) break;
  const tag = html.slice(start, closeStart + 1);
  const content = html.slice(closeStart + 1, end);
  scripts.push({ tag, content, start, end });
  idx = end + endTag.length;
}

scripts.forEach((s, i) => {
  const hasSrc = /src=/.test(s.tag);
  console.log('script', i + 1, 'src?', hasSrc, 'len', s.content.length);
  if (!hasSrc) {
    try {
      new Function(s.content);
      console.log('  ok');
    } catch (e) {
      console.log('  ERR', e.toString());
      console.log('  TAG:', s.tag);
      const lines = s.content.split('\n');
      lines.forEach((line, idx) => {
        if (line.includes('Regex') || line.includes('/') || line.includes('replace(') || line.includes('`')) {
          console.log(`${idx + 1}: ${line}`);
        }
      });
    }
  }
});
