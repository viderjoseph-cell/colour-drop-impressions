const EDITOR_PASSWORD = "colourdrop2026";

const gate = document.getElementById('gate');
const panel = document.getElementById('panel');
const pwInput = document.getElementById('pwInput');
const pwSubmit = document.getElementById('pwSubmit');
const pwError = document.getElementById('pwError');

function unlock(){
  gate.classList.add('hide');
  panel.classList.add('show');
  sessionStorage.setItem('cdi-editor-unlocked', '1');
  loadSiteContent();
}

if(sessionStorage.getItem('cdi-editor-unlocked') === '1'){
  unlock();
}

pwSubmit.addEventListener('click', tryUnlock);
pwInput.addEventListener('keydown', e => { if(e.key === 'Enter') tryUnlock(); });
function tryUnlock(){
  if(pwInput.value === EDITOR_PASSWORD){
    pwError.style.display = 'none';
    unlock();
  } else {
    pwError.style.display = 'block';
  }
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('cdi-editor-unlocked');
  location.reload();
});


let parsedDoc = null; 

const SERVICES = [1,2,3,4,5,6];

function buildServicesFields(){
  const host = document.getElementById('servicesHost');
  host.innerHTML = SERVICES.map(n => `
    <div class="svc-grid" style="margin-bottom:18px; padding-bottom:18px; border-bottom:1px dashed var(--line);">
      <div class="f-row"><label>Service ${n} — title</label><input data-field="svc${n}-title"></div>
      <div class="f-row"><label>Service ${n} — one-line description</label><input data-field="svc${n}-desc"></div>
      <div class="f-row" style="grid-column:1/-1;"><label>Service ${n} — examples line</label><input data-field="svc${n}-eg"></div>
    </div>
  `).join('');
}

async function loadSiteContent(){
  buildServicesFields();
  try {
    const res = await fetch('index.html', {cache: 'no-store'});
    if(!res.ok) throw new Error('index.html not found (status ' + res.status + ')');
    const text = await res.text();
    parsedDoc = new DOMParser().parseFromString(text, 'text/html');

    
    document.querySelectorAll('#editorForm [data-field]').forEach(input => {
      const key = input.dataset.field;
      if(key === 'phone1'){ input.value = parsedDoc.body.dataset.phone1 || ''; return; }
      if(key === 'phone2'){ input.value = parsedDoc.body.dataset.phone2 || ''; return; }
      if(key === 'email'){ input.value = parsedDoc.body.dataset.email || ''; return; }
      const target = parsedDoc.querySelector(`[data-field="${key}"]`);
      if(!target) { console.warn('No matching element for', key); return; }
      input.value = input.dataset.html === '1' ? target.innerHTML.trim() : target.textContent.trim();
    });

    document.getElementById('loadState').style.display = 'none';
    document.getElementById('editorForm').style.display = 'block';
  } catch(err){
    document.getElementById('loadState').innerHTML =
      `Couldn't load index.html (${err.message}).<br><br>Make sure admin.html and index.html are in the same folder and you're viewing this through a local server (not double-clicking the file) — see README.md.`;
  }
}

// ------------------------------------------------------------
// Generate updated index.html
// ------------------------------------------------------------
document.getElementById('generateBtn').addEventListener('click', () => {
  if(!parsedDoc){ alert('Content has not finished loading yet.'); return; }

  document.querySelectorAll('#editorForm [data-field]').forEach(input => {
    const key = input.dataset.field;
    const value = input.value;

    if(key === 'phone1'){ parsedDoc.body.setAttribute('data-phone1', value.trim()); return; }
    if(key === 'phone2'){ parsedDoc.body.setAttribute('data-phone2', value.trim()); return; }
    if(key === 'email'){ parsedDoc.body.setAttribute('data-email', value.trim()); return; }

    const target = parsedDoc.querySelector(`[data-field="${key}"]`);
    if(!target) return;
    if(input.dataset.html === '1'){
      target.innerHTML = value;
    } else {
      target.textContent = value;
    }
  });

  const html = '<!DOCTYPE html>\n' + parsedDoc.documentElement.outerHTML;
  const blob = new Blob([html], {type: 'text/html'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'index.html';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  const msg = document.getElementById('saveMsg');
  msg.style.display = 'inline';
  msg.textContent = '✓ Downloaded — replace the old index.html on your host with this one.';
  setTimeout(() => { msg.style.display = 'none'; }, 6000);
});
