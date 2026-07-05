const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const formStart = html.indexOf('<form id="venderForm"');
const formEnd = html.indexOf('</form>', formStart);
console.log('formStart', formStart, 'formEnd', formEnd, 'exists', formStart !== -1 && formEnd !== -1);
if (formStart !== -1 && formEnd !== -1) {
  const snippet = html.slice(formStart, formEnd + 7);
  console.log('form snippet length', snippet.length);
  console.log(snippet.includes('type="submit"'));
  console.log(snippet.includes('id="formTitle"'));
  const submitPos = snippet.indexOf('type="submit"');
  const closePos = snippet.lastIndexOf('</form>');
  console.log('submitPos', submitPos, 'closePos', closePos, 'submit before close', submitPos !== -1 && submitPos < closePos);
}
const scriptPos = html.indexOf('const venderForm = document.getElementById("venderForm")');
console.log('scriptPos', scriptPos, 'script after form', scriptPos > formEnd);
