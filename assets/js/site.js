(function(){if(location.pathname!=='/'&&location.pathname!=='/index.html')return;
  var m={'#contact':'/contact/','#footage':'/work/#footage','#equipment':'/about/#rov','#rov':'/about/#rov','#log':'/work/#log','#founders':'/about/','#about':'/about/','#how':'/about/#how'};
  if(m[location.hash])location.replace(m[location.hash]);})();
(function(){
  var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();
  var bar=document.getElementById('bar'),inner=document.body.classList.contains('inner'),tick=false;
  function onScroll(){tick=false;bar.classList.toggle('solid',inner||(window.scrollY||0)>60)}
  window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();

  // mobile menu
  var mt=document.getElementById('menu-toggle'),nav=document.getElementById('nav');
  if(mt&&nav){mt.addEventListener('click',function(){var o=nav.classList.toggle('open');mt.setAttribute('aria-expanded',o?'true':'false')})}

  // clip viewer
  var tiles=[].slice.call(document.querySelectorAll('.tile[data-src]'));
  var viewer=document.getElementById('viewer');
  if(viewer&&tiles.length){
    var vv=document.getElementById('v-video'),cur=0,list=tiles;
    var load=function(i){cur=(i+list.length)%list.length;var t=list[cur];
      document.getElementById('v-title').textContent=t.dataset.title;document.getElementById('v-meta').textContent=t.dataset.meta;
      document.getElementById('v-count').textContent=(cur+1)+' of '+list.length;
      vv.src=t.dataset.src;vv.muted=true;var p=vv.play();if(p&&p.catch)p.catch(function(){})};
    tiles.forEach(function(t){
      var pv=t.querySelector('video');
      t.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'&&pv){var p=pv.play();if(p&&p.catch)p.catch(function(){})}});
      t.addEventListener('pointerleave',function(){if(pv)pv.pause()});
      t.addEventListener('click',function(){if(pv)pv.pause();if(viewer.showModal){viewer.showModal();load(tiles.indexOf(t))}});
    });
    document.getElementById('v-close').addEventListener('click',function(){viewer.close()});
    document.getElementById('v-prev').addEventListener('click',function(){load(cur-1)});
    document.getElementById('v-next').addEventListener('click',function(){load(cur+1)});
    viewer.addEventListener('click',function(e){if(e.target===viewer)viewer.close()});
    viewer.addEventListener('close',function(){vv.pause();vv.removeAttribute('src');vv.load()});
    viewer.addEventListener('keydown',function(e){if(e.key==='ArrowRight')load(cur+1);if(e.key==='ArrowLeft')load(cur-1)});
  }

  // enquiry form
  var form=document.getElementById('enquiry');
  if(form){var status=document.getElementById('f-status'),btn=document.getElementById('f-send');
    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      if(!form.checkValidity()){status.className='form-status err';status.textContent='Add your name, email, what needs looking at and where it is.';var bad=form.querySelector(':invalid');if(bad)bad.focus();return}
      btn.disabled=true;btn.textContent='Sending…';status.className='form-status';status.textContent='';
      fetch('https://formsubmit.co/ajax/aroy@cleancurrent.ca',{method:'POST',headers:{'Accept':'application/json'},body:new FormData(form)})
        .then(function(r){return r.json().then(function(d){if(!r.ok||String(d.success)==='false')throw new Error(d.message||'failed')})})
        .then(function(){window.location.href='/contact/thanks/'})
        .catch(function(){status.className='form-status err';status.textContent="That didn't send. Email aroy@cleancurrent.ca instead.";btn.disabled=false;btn.textContent='Send'});
    })}

  document.querySelectorAll('.copy').forEach(function(b){b.addEventListener('click',function(){
    var t=b.getAttribute('data-copy');
    if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){b.textContent='Copied'},function(){b.textContent='Select and copy'});
  })});

  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hero=document.getElementById('hero-video');
  if(reduce&&hero){hero.removeAttribute('autoplay');try{hero.pause()}catch(e){}}
})();
