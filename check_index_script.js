const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const start = html.indexOf('<script>');
if (start === -1) {
  console.error('No <script> tag found');
  process.exit(1);
}
const script = html.slice(start + 8, html.indexOf('</script>', start));
try {
  new Function(script);
  console.log('OK');
} catch (e) {
  console.error('ERROR:', e.message);
  console.error(e.stack);
  process.exit(1);
}
