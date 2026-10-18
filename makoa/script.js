"use strict";
document.body.classList.add('js');
const menu=document.querySelector('#nav');const toggle=document.querySelector('.nav-toggle');
function closeNav(){menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));menu.classList.toggle('open',open);});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeNav));document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeNav();if(document.activeElement.closest('#nav'))toggle.focus();}});
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
let current='cafe';const search=document.querySelector('#menu-search');const groups=[...document.querySelectorAll('.menu-group')];
function filter(){const q=normalize(search.value.trim());let count=0;groups.forEach(group=>{let visible=0;group.querySelectorAll('li').forEach(item=>{const show=(q||current==='all'||group.dataset.category===current)&&(!q||normalize(item.textContent).includes(q));item.hidden=!show;if(show){visible++;count++;}});group.hidden=!visible;});document.querySelector('#result-count').textContent=count+' productos '+(q?'en la búsqueda':'en esta selección');document.querySelector('#no-results').hidden=count!==0;}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{current=button.dataset.filter;search.value='';document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));filter();}));search.addEventListener('input',filter);filter();
const methods={'V60':[15,'Un filtro cónico, un vertido a mano y una pausa alrededor de la mesa.'],'Chemex':[15,'Una jarra de líneas simples para compartir la preparación en la mesa.'],'Aeropress':[15,'Un método de inmersión y presión, preparado para tu pausa.'],'Prensa francesa':[14,'Una preparación por inmersión, servida sin prisa.'],'Origami':[15,'Un filtro de pliegues que convierte la preparación en un pequeño ritual.']};
document.querySelectorAll('[data-method]').forEach(button=>button.addEventListener('click',()=>{const name=button.dataset.method;document.querySelectorAll('[data-method]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelector('#method-name').textContent=name;document.querySelector('#method-note').textContent=methods[name][1];document.querySelector('#method-price').textContent='S/ '+methods[name][0].toFixed(2);}));
const reduced=matchMedia('(prefers-reduced-motion:reduce)');let observer;
if(!reduced.matches&&'IntersectionObserver'in window){observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.animate([{opacity:.55,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:550,easing:'cubic-bezier(.2,.8,.2,1)',fill:'none'});observer.unobserve(entry.target);}}),{threshold:.14});document.querySelectorAll('.hero-copy h1,.hero-copy>p,.ritual figure,.ritual h2,.ritual-copy>p,.menu-intro h2,.menu-sheet,.essence h2,.brand-letter,.preview-copy h2,.menu-preview').forEach(el=>observer.observe(el));}
document.addEventListener('visibilitychange',()=>{document.querySelector('.hero-image>img').style.animationPlayState=document.hidden?'paused':'running';});

// Demonstrative business actions only: no network requests, storage, or personal data.
const demoDialog=document.querySelector('#business-demo');
const demoOrder=document.querySelector('#order-panel');
const demoReserve=document.querySelector('#reserve-panel');
const demoResult=document.querySelector('#demo-result');
const productSelect=document.querySelector('#demo-product');
const quantityInput=document.querySelector('#demo-quantity');
const cartList=document.querySelector('#demo-cart');
const cart=new Map();
const catalogue=[...document.querySelectorAll('.menu-group li')].map((li,id)=>({id,name:li.querySelector('span').textContent.trim(),price:Number(li.querySelector('strong').textContent.replace('S/','').trim())}));
catalogue.forEach(item=>{const option=document.createElement('option');option.value=String(item.id);option.textContent=item.name+' - S/ '+item.price.toFixed(2);productSelect.append(option);});
let demoOpener=null;
function setDemoMode(mode){
 const order=mode==='order';demoOrder.hidden=!order;demoReserve.hidden=order;demoResult.hidden=true;
 document.querySelectorAll('[data-demo-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.demoMode===mode)));
}
document.querySelectorAll('[data-demo]').forEach(button=>button.addEventListener('click',()=>{
 demoOpener=button;closeNav();setDemoMode(button.dataset.demo);
 if(button.hasAttribute('data-selected-method')){const method=document.querySelector('#method-name').textContent;const item=catalogue.find(p=>p.name===method);if(item)productSelect.value=String(item.id);}
 demoDialog.showModal();document.body.classList.add('demo-open');
}));
document.querySelectorAll('[data-demo-mode]').forEach(b=>b.addEventListener('click',()=>setDemoMode(b.dataset.demoMode)));
document.querySelector('.demo-close').addEventListener('click',()=>demoDialog.close());
demoDialog.addEventListener('close',()=>{document.body.classList.remove('demo-open');if(demoOpener?.isConnected)demoOpener.focus();});
function renderCart(){
 cartList.replaceChildren();let total=0,count=0;
 cart.forEach((quantity,id)=>{
  const item=catalogue[id];count+=quantity;total+=quantity*item.price;
  const li=document.createElement('li'),copy=document.createElement('div'),name=document.createElement('p'),detail=document.createElement('span'),remove=document.createElement('button');
  copy.className='cart-item-copy';name.textContent=item.name;detail.textContent=quantity+' × S/ '+item.price.toFixed(2)+' = S/ '+(quantity*item.price).toFixed(2);copy.append(name,detail);
  remove.className='remove-cart';remove.type='button';remove.textContent='Quitar';remove.setAttribute('aria-label','Quitar '+item.name);remove.addEventListener('click',()=>{cart.delete(id);renderCart();demoResult.hidden=true;document.querySelector('#demo-product').focus();});
  li.append(copy,remove);cartList.append(li);
 });
 if(!count){const empty=document.createElement('li');empty.className='empty-cart';empty.textContent='Elige algo para empezar tu pausa.';cartList.append(empty);}
 document.querySelector('#demo-cart-count').textContent=count+' '+(count===1?'unidad':'unidades');
 document.querySelector('#demo-total').textContent='S/ '+total.toFixed(2);document.querySelector('#demo-order-review').disabled=count===0;
}
document.querySelector('#demo-order-form').addEventListener('submit',e=>{
 e.preventDefault();const id=Number(productSelect.value),quantity=Number(quantityInput.value);if(!Number.isInteger(quantity)||quantity<1||quantity>12||!catalogue[id])return;
 cart.set(id,Math.min(12,(cart.get(id)||0)+quantity));renderCart();demoResult.hidden=true;
});
function showDemoResult(title,copy){document.querySelector('#demo-result-title').textContent=title;document.querySelector('#demo-result-copy').textContent=copy;demoResult.hidden=false;demoResult.scrollIntoView({block:'nearest',behavior:reduced.matches?'instant':'smooth'});}
document.querySelector('#demo-order-review').addEventListener('click',()=>{
 if(!cart.size)return;let total=0;const lines=[];cart.forEach((quantity,id)=>{const item=catalogue[id];total+=quantity*item.price;lines.push(quantity+' × '+item.name);});
 showDemoResult('Tu pedido de ejemplo está listo.',lines.join('\n')+'\nTotal referencial: S/ '+total.toFixed(2)+'.\nPrecios aportados por la marca; no se ha realizado una compra.');
});
const today=new Date();const localDate=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
document.querySelector('#demo-date').min=localDate;document.querySelector('#demo-date').value=localDate;
demoReserve.addEventListener('submit',e=>{
 e.preventDefault();const date=document.querySelector('#demo-date').value;if(!date)return;
 const formatted=new Intl.DateTimeFormat('es-PE',{day:'numeric',month:'long',year:'numeric'}).format(new Date(date+'T12:00:00'));
 showDemoResult('Una mesa, en modo demostración.',document.querySelector('#demo-guests').value+' personas · '+formatted+' · '+document.querySelector('#demo-time').value+' h.\nEsta es una vista de ejemplo; la mesa no está reservada.');
});
renderCart();
