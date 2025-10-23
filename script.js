// script.js
(function(){
  if(!window.toiConfig) {
    console.error("config.js табылмады. config.js қосыңыз.");
    return;
  }

  // DOM refs
  const elNames = document.getElementById('names');
  const elDate = document.getElementById('date');
  const elTitle = document.getElementById('page-title');
  const playToggle = document.getElementById('play-toggle');
  const bgMusic = document.getElementById('bg-music');
  const mapIframe = document.getElementById('map-iframe');
  const mapLink = document.getElementById('map-link');
  const guestInput = document.getElementById('guest-name');
  const btnComing = document.getElementById('coming');
  const btnNotComing = document.getElementById('not-coming');
  const resultText = document.getElementById('rsvp-result');
  const listComing = document.getElementById('list-coming');
  const listNotComing = document.getElementById('list-notcoming');

  // apply config
  elNames.textContent = toiConfig.names || "Аты & Аты";
  elDate.textContent = toiConfig.dateReadable || "";
  elTitle.textContent = toiConfig.siteTitle || "Тойға шақыру";
  mapIframe.src = toiConfig.mapIframeSrc || "";
  mapLink.href = toiConfig.mapIframeSrc || "#";

  // music setup
  if(toiConfig.music){
    bgMusic.src = toiConfig.music;
    bgMusic.preload = "auto";
    bgMusic.volume = 0.6;
  }

  // play/pause handling with autoplay caveat
  let playing = false;
  async function playMusic(){
    try{
      await bgMusic.play();
      playing = true;
      playToggle.textContent = "Музыка: Тоқтау";
    }catch(e){
      // браузер блоктауы — қолданушы әрекетін күтіңіз
      playToggle.textContent = "Музыканы қосу (басып ашыңыз)";
      console.warn("Автоматты ойнату бөгеттелді:", e);
    }
  }
  function pauseMusic(){
    bgMusic.pause();
    playing = false;
    playToggle.textContent = "Музыка: Ойнату";
  }

  // try autoplay if configured
  if(toiConfig.musicAutoplay){
    playMusic();
  }

  playToggle.addEventListener('click', ()=>{
    if(playing) pauseMusic();
    else playMusic();
  });

  // RSVP helpers
  function sendWhatsApp(phone, msg){
    const encoded = encodeURIComponent(msg);
    // universal wa.me link
    const link = `https://wa.me/${phone.replace(/\D/g,'')}?text=${encoded}`;
    window.open(link, '_blank');
  }

  async function sendToEndpoint(payload){
    if(!toiConfig.rsvpEndpoint) return {ok:false, msg:"No endpoint set"};
    try{
      const res = await fetch(toiConfig.rsvpEndpoint, {
        method: "POST",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      const text = await res.text();
      return {ok: true, msg: text};
    }catch(e){
      return {ok:false, msg: e.message};
    }
  }

  function addToLocalList(name, status){
    // add to visible lists in-page (temporary, only for display)
    const li = document.createElement('li');
    li.textContent = `${name} • ${new Date().toLocaleString()}`;
    if(status === "coming") listComing.prepend(li);
    else listNotComing.prepend(li);
  }

  async function handleRsvp(status){
    const name = (guestInput.value || "").trim();
    if(!name){
      resultText.textContent = "Атыңызды енгізіңіз, өтінемін.";
      return;
    }
    resultText.textContent = "Жіберілуде...";
    // send to configured endpoint if exists
    const payload = {
      name, status, time: new Date().toISOString(), event: toiConfig.names, date: toiConfig.dateISO
    };
    const endpointRes = await sendToEndpoint(payload);
    if(endpointRes.ok){
      resultText.textContent = "Рақмет! Сіздің жауабыңыз жазылды.";
    } else {
      // егер endpoint жоқ немесе жіберілмесе — ескерту ретінде көрсетіледі
      resultText.textContent = "Жауабыңыз локалды түрде көрсетілді. (Егер сервер орнатылса, автоматты түрде сақталады.)";
    }
    // show in-page list
    addToLocalList(name, status);

    // WhatsApp message
    let msg = status === "coming" ? toiConfig.whatsappMessageWhenComing : toiConfig.whatsappMessageWhenNotComing;
    // ауыстыру: [Аты-жөнім] тізбегін қонақ атына ауыстыру
    msg = msg.replace("[Аты-жөнім]", name);
    if(toiConfig.whatsappNumber){
      sendWhatsApp(toiConfig.whatsappNumber, msg);
    }
  }

  btnComing.addEventListener('click', ()=> handleRsvp("coming"));
  btnNotComing.addEventListener('click', ()=> handleRsvp("notcoming"));

  // Simple animated particle canvas background
  // lightweight particle effect
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = innerWidth;
  let H = canvas.height = innerHeight;
  window.addEventListener('resize', ()=>{ W = canvas.width = innerWidth; H = canvas.height = innerHeight; });

  const particles = [];
  const P_COUNT = Math.floor((W*H)/60000) + 18;
  for(let i=0;i<P_COUNT;i++){
    particles.push({
      x: Math.random()*W,
      y: Math.random()*H,
      r: 0.5 + Math.random()*2.2,
      vx: (Math.random()-0.5)*0.2,
      vy: -0.05 - Math.random()*0.2,
      alpha: 0.1 + Math.random()*0.4
    });
  }
  function frame(){
    ctx.clearRect(0,0,W,H);
    // gradient light
    const g = ctx.createLinearGradient(0,0,W,H);
    g.addColorStop(0, "rgba(255,217,150,0.02)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,H);

    for(const p of particles){
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if(p.y < -10){ p.y = H + 10; p.x = Math.random()*W; }
      if(p.x < -20) p.x = W + 20;
      if(p.x > W + 20) p.x = -20;
    }
    requestAnimationFrame(frame);
  }
  frame();

  // If autoplay failed at page load, try again on first user gesture
  function resumeOnInteraction(){
    if(!playing && toiConfig.musicAutoplay && bgMusic.src){
      bgMusic.play().then(()=>{playing = true; playToggle.textContent = "Музыка: Тоқтау";}).catch(()=>{});
    }
    window.removeEventListener('pointerdown', resumeOnInteraction);
    window.removeEventListener('keydown', resumeOnInteraction);
  }
  window.addEventListener('pointerdown', resumeOnInteraction);
  window.addEventListener('keydown', resumeOnInteraction);

  // Expose a small debug function when author opens console
  window.__ToiDebug = {
    addGuestLocal: addToLocalList,
    config: toiConfig
  };

})();
