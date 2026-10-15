'use strict';
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; navigation.classList.toggle('open', open); menuButton.setAttribute('aria-expanded', String(open)); });
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); } });
window.matchMedia('(min-width: 641px)').addEventListener('change', event => { if(event.matches) closeMenu(); });
const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project-card');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => { filter.classList.toggle('active', filter === button); filter.setAttribute('aria-pressed', String(filter === button)); });
  let count = 0;
  projects.forEach(project => { const visible = button.dataset.filter === 'all' || project.dataset.category === button.dataset.filter; project.hidden = !visible; if(visible) count++; });
  document.querySelector('#project-count').textContent = count + (count === 1 ? ' concepto' : ' conceptos');
}));
const area = document.querySelector('#area');
const areaOutput = document.querySelector('#area-output');
area.addEventListener('input', () => { areaOutput.textContent = area.value + ' m²'; });
const briefForm = document.querySelector('#brief-form');
const briefResult = document.querySelector('#brief-result');
let preparedBrief = '';
briefForm.addEventListener('input', () => { briefResult.hidden = true; preparedBrief = ''; });
briefForm.addEventListener('submit', event => {
  event.preventDefault();
  if(!briefForm.reportValidity()) return;
  const space = document.querySelector('#space').value;
  const style = document.querySelector('#style').value;
  const idea = document.querySelector('#idea').value.trim();
  if(!idea) { document.querySelector('#idea').setCustomValidity('Describe brevemente tu idea.'); document.querySelector('#idea').reportValidity(); return; }
  preparedBrief = ['FORMA — BRIEF CONCEPTUAL', '', 'Tipo de espacio: '+space, 'Superficie aproximada: '+area.value+' m²', 'Dirección visual: '+style, 'Idea: '+idea, '', 'Demo local. Estudio ficticio. No se ha enviado información ni generado una cotización.'].join('\n');
  document.querySelector('#brief-summary').textContent = `${space} · ${area.value} m² · ${style}. ${idea}`;
  briefResult.hidden = false;
});
document.querySelector('#idea').addEventListener('input', event => event.target.setCustomValidity(''));
document.querySelector('#download-brief').addEventListener('click', () => {
  if(!preparedBrief) return;
  const file = new Blob([preparedBrief], {type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(file);
  const link = document.createElement('a'); link.href = url; link.download = 'forma-brief.txt'; document.body.append(link); link.click(); link.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000);
});
