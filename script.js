'use strict';
const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#navigation');
function closeMenu(){navigation.classList.remove('open');menuButton.setAttribute('aria-expanded','false');}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';navigation.classList.toggle('open',open);menuButton.setAttribute('aria-expanded',String(open));});
navigation.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus();}});
window.matchMedia('(min-width:701px)').addEventListener('change',event=>{if(event.matches)closeMenu();});

const filters=[...document.querySelectorAll('.filter')];
const projects=[...document.querySelectorAll('.project-card')];
filters.forEach(button=>button.addEventListener('click',()=>{
 filters.forEach(filter=>{const selected=filter===button;filter.classList.toggle('is-active',selected);filter.setAttribute('aria-pressed',String(selected));});
 let count=0;projects.forEach(project=>{project.hidden=button.dataset.filter!=='all'&&project.dataset.category!==button.dataset.filter;if(!project.hidden)count++;});
 document.querySelector('.project-grid').classList.toggle('is-filtered',button.dataset.filter!=='all');
 document.querySelector('#project-count').textContent=count+(count===1?' concepto':' conceptos');
}));
const materials={piedra:{name:'Travertino claro',description:'Poros abiertos, tacto mineral y una luz que se vuelve suave. El punto de equilibrio del espacio.'},madera:{name:'Roble ahumado',description:'Veta profunda y tonos cálidos. Una materia que acompaña el paso del tiempo y aporta recogimiento.'},lino:{name:'Lino natural',description:'Trama visible, tacto ligero y tonos sin estridencias. La capa que invita a quedarse un poco más.'}};
document.querySelectorAll('.material-choice').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('.material-choice').forEach(choice=>{const selected=choice===button;choice.classList.toggle('is-active',selected);choice.setAttribute('aria-pressed',String(selected));});
 const material=materials[button.dataset.material];document.querySelector('#material-name').textContent=material.name;document.querySelector('#material-description').textContent=material.description;
}));

const area=document.querySelector('#area');
area.addEventListener('input',()=>{document.querySelector('#area-output').textContent=area.value+' m²';});
const form=document.querySelector('#brief-form'),result=document.querySelector('#brief-result'),idea=document.querySelector('#idea');
let preparedBrief='';
form.addEventListener('input',()=>{result.hidden=true;preparedBrief='';idea.setCustomValidity('');});
form.addEventListener('change',()=>{result.hidden=true;preparedBrief='';});
form.addEventListener('submit',event=>{
 event.preventDefault();const text=idea.value.trim();
 if(!text){idea.setCustomValidity('Describe brevemente lo que quieres transformar.');idea.reportValidity();return;}
 idea.setCustomValidity('');if(!form.reportValidity())return;
 const space=document.querySelector('#space').value,style=document.querySelector('#style').value;
 preparedBrief=['FORMA — UN PRIMER TRAZO','','Tipo de espacio: '+space,'Superficie: '+area.value+' m²','Dirección visual: '+style,'Material explorado: '+document.querySelector('#material-name').textContent,'Idea: '+text,'','Demo conceptual. Marca ficticia. No se han enviado datos ni generado una cotización.'].join('\n');
 document.querySelector('#brief-summary').textContent=space+' · '+area.value+' m²\n'+style+'\n'+text;result.hidden=false;
});
document.querySelector('#download-brief').addEventListener('click',()=>{
 if(!preparedBrief)return;
 const url=URL.createObjectURL(new Blob([preparedBrief],{type:'text/plain;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download='forma-brief.txt';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
});

const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;observer.unobserve(entry.target);if(!motion.matches)entry.target.animate([{opacity:.35,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:560,easing:'cubic-bezier(.23,1,.32,1)'});});},{threshold:.08});
 document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));
}
document.addEventListener('visibilitychange',()=>{document.querySelector('.hero-image img').style.animationPlayState=document.hidden?'paused':'running';});
