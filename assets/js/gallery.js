(function(){
  var links=[].slice.call(document.querySelectorAll('.shot a'));
  var box=document.querySelector('.lightbox');
  if(!box||!links.length||!box.showModal)return;
  var img=box.querySelector('img'),cap=box.querySelector('.lb-cap'),i=0;
  function show(n){i=(n+links.length)%links.length;var a=links[i];img.src=a.getAttribute('href');img.alt=a.querySelector('img').alt;cap.textContent=a.dataset.cap||'';}
  links.forEach(function(a,n){a.addEventListener('click',function(e){e.preventDefault();show(n);box.showModal();});});
  box.querySelector('.lb-close').addEventListener('click',function(){box.close();});
  box.querySelector('.lb-prev').addEventListener('click',function(){show(i-1);});
  box.querySelector('.lb-next').addEventListener('click',function(){show(i+1);});
  box.addEventListener('click',function(e){if(e.target===box)box.close();});
  document.addEventListener('keydown',function(e){if(!box.open)return;if(e.key==='ArrowLeft')show(i-1);if(e.key==='ArrowRight')show(i+1);});
  box.addEventListener('close',function(){links[i].focus();});
})();
