
(function(){
  var v=document.getElementById('dive-video');if(!v)return;
  var D=null,dur=84,svgNS='http://www.w3.org/2000/svg';
  var $=function(id){return document.getElementById(id)};
  var scrub=$('scrub'),ov=$('overview'),play=$('playbtn'),reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cards=['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  function el(n,a,p){var e=document.createElementNS(svgNS,n);for(var k in a)e.setAttribute(k,a[k]);(p||null)&&p.appendChild(e);return e}
  function fmt(s){s=Math.max(0,Math.round(s));return Math.floor(s/60)+':'+('0'+s%60).slice(-2)}
  function lerp(a,b,f){return a+(b-a)*f}
  function sample(t){var c=D.clip,i=0;while(i<c.length-2&&c[i+1][0]<=t)i++;var A=c[i],B=c[i+1],f=Math.min(1,Math.max(0,(t-A[0])/((B[0]-A[0])||1)));
    var dh=((B[2]-A[2]+540)%360)-180;return{d:lerp(A[1],B[1],f),h:(A[2]+dh*f+360)%360,m:A[5]}}
  var cmk,cdot,omk,dmin,dmax;
  function y1(d){return 12+(d-dmin)/(dmax-dmin)*118}
  function build(){
    var c=D.clip.filter(function(r){return r[0]>=0&&r[0]<=dur});
    dmin=Math.floor(Math.min.apply(0,c.map(function(r){return r[1]}))-1);dmax=Math.ceil(Math.max.apply(0,c.map(function(r){return r[1]}))+1);
    for(var g=0;g<=dur;g+=10){el('line',{x1:g/dur*1000,x2:g/dur*1000,y1:0,y2:150,class:'grid'},scrub)}
    var pts=c.map(function(r){return (r[0]/dur*1000).toFixed(1)+','+y1(r[1]).toFixed(1)}).join(' ');
    el('polygon',{points:'0,150 '+pts+' 1000,150',class:'area'},scrub);el('polyline',{points:pts,class:'line'},scrub);
    [].forEach.call(document.querySelectorAll('.chapter'),function(b){var x=b.dataset.t/dur*1000;el('line',{x1:x,x2:x,y1:0,y2:150,class:'chap'},scrub)});
    var t1=el('text',{x:6,y:16,class:'axis'},scrub);t1.textContent=(dmin*0.3048).toFixed(0)+' m';
    var t2=el('text',{x:6,y:146,class:'axis'},scrub);t2.textContent=(dmax*0.3048).toFixed(0)+' m';
    cmk=el('line',{x1:0,x2:0,y1:0,y2:150,class:'marker'},scrub);
    var P=D.profile,T=P[P.length-1][0],pm=Math.max.apply(0,P.map(function(r){return r[1]}))*1.05;
    function y2(d){return 4+d/pm*82}
    for(var m=0;m<=T;m+=300){var x=m/T*1000;el('line',{x1:x,x2:x,y1:0,y2:90,class:'grid'},ov);if(m>0&&m<T-120){var tx=el('text',{x:x+4,y:86,class:'axis'},ov);tx.textContent=(m/60)+' min'}}
    el('rect',{x:D.t0/T*1000,y:0,width:dur/T*1000,height:90,class:'band'},ov);
    var op=P.map(function(r){return (r[0]/T*1000).toFixed(1)+','+y2(r[1]).toFixed(1)}).join(' ');
    el('polygon',{points:'0,0 '+op+' 1000,0',class:'area'},ov);el('polyline',{points:op,class:'line'},ov);
    omk=el('line',{x1:0,x2:0,y1:0,y2:90,class:'marker'},ov);ov._T=T;
    update(0)}
  function update(t){if(!D)return;var s=sample(t),m=s.d*0.3048;
    $('h-m').textContent=m.toFixed(1);$('h-ft').textContent=Math.round(s.d);
    var h=Math.round(s.h)%360;$('h-hdg').textContent=h;$('h-card').textContent=cards[Math.round(h/22.5)%16];
    $('h-comp').setAttribute('transform','rotate('+h+')');
    $('h-mode').textContent=s.m==='ALT_HOLD'?'Depth hold':s.m==='MANUAL'?'Manual':s.m==='STABILIZE'?'Stabilize':s.m;
    var dt=D.t0+t;$('h-time').textContent=('0'+Math.floor(dt/60)).slice(-2)+':'+('0'+Math.floor(dt%60)).slice(-2);
    var x=t/dur*1000;cmk.setAttribute('x1',x);cmk.setAttribute('x2',x);
    var ox=(D.t0+t)/ov._T*1000;omk.setAttribute('x1',ox);omk.setAttribute('x2',ox);
    $('scrub-read').textContent=fmt(t)+' / '+fmt(dur);
    scrub.setAttribute('aria-valuenow',Math.round(t));scrub.setAttribute('aria-valuetext',fmt(t)+', depth '+m.toFixed(1)+' metres')}
  var raf=0;function loop(){update(v.currentTime||0);raf=v.paused?0:requestAnimationFrame(loop)}
  function seek(t){t=Math.max(0,Math.min(dur-0.05,t));if(v.preload==='none'){v.preload='auto';v.load()}
    var go=function(){try{v.currentTime=t}catch(e){}update(t)};if(v.readyState>=1)go();else{v.addEventListener('loadedmetadata',go,{once:true});update(t)}}
  function doPlay(){if(v.preload==='none'){v.preload='auto'}var p=v.play();if(p&&p.catch)p.catch(function(){})}
  v.addEventListener('play',function(){play.textContent='Pause';play.setAttribute('aria-label','Pause the dive');if(!raf)raf=requestAnimationFrame(loop)});
  v.addEventListener('pause',function(){play.textContent='Play';play.setAttribute('aria-label','Play the dive')});
  v.addEventListener('ended',function(){v.currentTime=0;doPlay()});
  v.addEventListener('seeked',function(){update(v.currentTime)});
  play.addEventListener('click',function(){v.paused?doPlay():v.pause()});
  v.addEventListener('click',function(){v.paused?doPlay():v.pause()});
  [].forEach.call(document.querySelectorAll('.chapter'),function(b){b.addEventListener('click',function(){seek(+b.dataset.t);doPlay()})});
  var drag=false,wasPlaying=false;
  function tAt(e){var r=scrub.getBoundingClientRect();return (e.clientX-r.left)/r.width*dur}
  scrub.addEventListener('pointerdown',function(e){drag=true;wasPlaying=!v.paused;v.pause();scrub.setPointerCapture(e.pointerId);seek(tAt(e))});
  scrub.addEventListener('pointermove',function(e){if(drag)seek(tAt(e))});
  scrub.addEventListener('pointerup',function(){drag=false;if(wasPlaying)doPlay()});
  scrub.addEventListener('keydown',function(e){var t=v.currentTime||0,k=e.key;
    if(k==='ArrowRight'||k==='ArrowUp'){seek(t+(e.shiftKey?10:2));e.preventDefault()}
    else if(k==='ArrowLeft'||k==='ArrowDown'){seek(t-(e.shiftKey?10:2));e.preventDefault()}
    else if(k==='Home'){seek(0);e.preventDefault()}else if(k==='End'){seek(dur-1);e.preventDefault()}
    else if(k===' '||k==='Enter'){v.paused?doPlay():v.pause();e.preventDefault()}});
  fetch('/assets/data/dive-2026-11-20.json').then(function(r){return r.json()}).then(function(j){D=j;dur=j.dur;build()}).catch(function(){document.querySelector('.charts').hidden=true;document.querySelector('.hud').hidden=true});
  if('IntersectionObserver' in window){new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){if(!reduce&&v.paused&&!v._touched){v._touched=1;doPlay()}}else if(!v.paused){v.pause()}})},{threshold:.5}).observe(v)}
})();
