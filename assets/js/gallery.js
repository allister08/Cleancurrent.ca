(function(){
  var links=[].slice.call(document.querySelectorAll('.shot a'));
  var box=document.querySelector('.lightbox');
  if(!box||!links.length||!box.showModal)return;
  var img=box.querySelector('img'),vid=box.querySelector('video'),cap=box.querySelector('.lb-cap'),i=0;
  function stop(){vid.pause();vid.removeAttribute('src');vid.load();}
  function show(n){
    i=(n+links.length)%links.length;var a=links[i],href=a.getAttribute('href');
    stop();cap.textContent=a.dataset.cap||'';
    if(a.hasAttribute('data-video')){img.hidden=true;img.removeAttribute('src');vid.hidden=false;vid.poster=a.querySelector('img').src;vid.src=href;var p=vid.play();if(p&&p.catch)p.catch(function(){});}
    else{vid.hidden=true;img.hidden=false;img.src=href;img.alt=a.querySelector('img').alt;}
  }
  links.forEach(function(a,n){a.addEventListener('click',function(e){e.preventDefault();box.showModal();show(n);});});
  box.querySelector('.lb-close').addEventListener('click',function(){box.close();});
  box.querySelector('.lb-prev').addEventListener('click',function(){show(i-1);});
  box.querySelector('.lb-next').addEventListener('click',function(){show(i+1);});
  box.addEventListener('click',function(e){if(e.target===box)box.close();});
  document.addEventListener('keydown',function(e){if(!box.open)return;if(e.key==='ArrowLeft')show(i-1);if(e.key==='ArrowRight')show(i+1);});
  box.addEventListener('close',function(){stop();links[i].focus();});
})();
