const menuButton=document.querySelector('.hamb');const nav=document.querySelector('.topbar nav');if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.textContent=open?'✕':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.textContent='☰'}))}
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.hero-left,.section-head,.process-card,.work-card,.edit-suite,.social-card,.about-inner,.contact').forEach(el=>{el.classList.add('reveal');observer.observe(el)});
const audio=document.querySelector('.audio');if(audio){audio.innerHTML='';for(let i=0;i<48;i++){const bar=document.createElement('span');bar.style.height=(5+Math.abs(Math.sin(i*1.7))*20+Math.abs(Math.cos(i*.61))*7)+'px';audio.appendChild(bar)}}

const enquiryForm=document.getElementById('enquiry-form');
if(enquiryForm){
  enquiryForm.addEventListener('submit',function(event){
    event.preventDefault();
    const data=new FormData(enquiryForm);
    const subject=`Portfolio enquiry — ${data.get('service')}`;
    const body=[
      `Name: ${data.get('name')}`,
      `Reply email: ${data.get('email')}`,
      `Service: ${data.get('service')}`,
      `Budget: ${data.get('budget')}`,
      '',
      'Project details:',
      data.get('details')
    ].join('\n');
    const mailto='mailto:abdullahahmad7085@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    window.location.href=mailto;
  });
}
