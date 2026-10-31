// Stage 2 (Vercel): login + saving stories to Supabase. Falls back to Stage 1 local mode if config.js is not filled in.
(async function(){
let C=null;try{C=await(await fetch('/api/config')).json()}catch(e){}
if(!C||!C.url||!C.key||!window.supabase){S.msg='Local mode: add SUPABASE_URL and SUPABASE_ANON_KEY in Vercel, then redeploy.';render();return}
var EV=C;
const sb=supabase.createClient(EV.url,EV.key);S.user=null;S.ready=false;S.err='';
const A={en:{rt:'Try AI again',del:'Delete',cf:'Delete this recording and its transcript forever?',pr:'The AI is listening to your story...',orig:'Original text',rv:'AI transcripts can contain mistakes. Please review them with your family.',tr:'Sample story. Record one to see the AI transcript.',dm:'Try the demo',dn:'Shared demo account for testing. Please do not save private recordings here.',ud:'Sign in with demo account',fl:'Please enter your email and a password of 6 or more characters.',em:'Email',pw:'Password (6+ characters)',si:'Sign in',su:'Create family vault',so:'Sign out',ld:'Loading...',wel:'Welcome to EverVoice',sub:'Sign in to keep your family stories safe and private.',chk:'Check your email to confirm, then sign in.'},
ur:{rt:'اے آئی دوبارہ آزمائیں',del:'حذف کریں',cf:'کیا یہ ریکارڈنگ اور اس کا ٹرانسکرپٹ ہمیشہ کے لیے حذف کر دیں؟',pr:'اے آئی آپ کی کہانی سن رہا ہے...',orig:'اصل متن',rv:'اے آئی کے ٹرانسکرپٹ میں غلطیاں ہو سکتی ہیں۔ براہ کرم خاندان کے ساتھ جانچ لیں۔',tr:'نمونہ کہانی۔ اے آئی ٹرانسکرپٹ دیکھنے کے لیے ایک کہانی ریکارڈ کریں۔',dm:'ڈیمو آزمائیں',dn:'یہ آزمائش کے لیے مشترکہ ڈیمو اکاؤنٹ ہے۔ براہ کرم یہاں نجی ریکارڈنگ محفوظ نہ کریں۔',ud:'ڈیمو اکاؤنٹ سے لاگ اِن کریں',fl:'براہ کرم ای میل اور کم از کم 6 حروف کا پاس ورڈ درج کریں۔',em:'ای میل',pw:'پاس ورڈ (کم از کم 6 حروف)',si:'لاگ اِن',su:'خاندانی البم بنائیں',so:'لاگ آؤٹ',ld:'لوڈ ہو رہا ہے...',wel:'ایور وائس میں خوش آمدید',sub:'اپنی خاندانی کہانیاں محفوظ رکھنے کے لیے لاگ اِن کریں۔',chk:'تصدیق کے لیے ای میل دیکھیں، پھر لاگ اِن کریں۔'},
ar:{rt:'جرّب الذكاء الاصطناعي مجددًا',del:'حذف',cf:'هل تريد حذف هذا التسجيل ونصه المفرّغ نهائيًا؟',pr:'الذكاء الاصطناعي يستمع إلى قصتك...',orig:'النص الأصلي',rv:'قد تحتوي النصوص المفرّغة بالذكاء الاصطناعي على أخطاء. يرجى مراجعتها مع عائلتك.',tr:'قصة نموذجية. سجّل قصة لترى النص المفرّغ.',dm:'جرّب النسخة التجريبية',dn:'حساب تجريبي مشترك للاختبار. يرجى عدم حفظ تسجيلات خاصة هنا.',ud:'الدخول بالحساب التجريبي',fl:'يرجى إدخال البريد الإلكتروني وكلمة مرور من 6 أحرف أو أكثر.',em:'البريد الإلكتروني',pw:'كلمة المرور (6 أحرف فأكثر)',si:'تسجيل الدخول',su:'أنشئ خزنة العائلة',so:'تسجيل الخروج',ld:'جارٍ التحميل...',wel:'مرحبًا بك في إيفر فويس',sub:'سجّل الدخول لحفظ قصص عائلتك بخصوصية.',chk:'تحقق من بريدك للتأكيد، ثم سجّل الدخول.'}};
for(const l in A)Object.assign(T[l],A[l]);
const DEMO={email:'demo@evervoice.app',password:'EverVoice-Demo-2026'};
const baseViews=views,baseRender=render;
views=function(){const x=t();if(!S.ready)return `<p class="soft">${x.ld}</p>`;if(S.user)return baseViews();
return `<section class="elder"><h1>${x.wel}</h1><p class="soft">${x.sub}</p><div class="card w" style="width:min(420px,100%);text-align:start"><label for="em">${x.em}</label><input id="em" type="email" autocomplete="email" style="width:100%;padding:12px;border-radius:12px;border:2px solid var(--card);font-size:18px"><label for="pw">${x.pw}</label><input id="pw" type="password" autocomplete="current-password" style="width:100%;padding:12px;border-radius:12px;border:2px solid var(--card);font-size:18px"><p style="margin:12px 0"><button class="go" id="si">${x.si}</button> <button class="chip" id="su">${x.su}</button></p><p class="soft" role="status">${S.err}</p></div><div class="card" style="width:min(420px,100%);text-align:start"><h2 style="margin:0 0 6px">${x.dm}</h2><p class="soft" dir="ltr" style="text-align:start">${DEMO.email}<br>${DEMO.password}</p><p class="soft">${x.dn}</p><button class="go" id="dm">${x.ud}</button></div></section>`};
render=function(){baseRender();document.querySelectorAll('[data-ai]').forEach(b=>b.onclick=()=>ai(b.dataset.ai,b.dataset.p));document.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>del(b.dataset.del,b.dataset.p));if(S.user){const b=document.createElement('button');b.className='chip';b.textContent=t().so;b.onclick=()=>sb.auth.signOut();$('langs').appendChild(b)}
if($('si')){const go=async(up,cr)=>{const c=cr||{email:$('em').value.trim(),password:$('pw').value};S.err='';if(!c.email||c.password.length<6){S.err=t().fl;render();return}const r=up?await sb.auth.signUp(c):await sb.auth.signInWithPassword(c);if(r.error)S.err=r.error.message;else if(up&&!r.data.session)S.err=t().chk;if(S.err)render()};$('si').onclick=()=>go(false);$('su').onclick=()=>go(true);$('dm').onclick=()=>go(false,DEMO)}};
async function load(){const{data,error}=await sb.from('stories').select('*').order('created_at',{ascending:false});if(error){S.msg=error.message;S.stories=[{k:'demo'}];return}
const paths=data.filter(r=>r.audio_path).map(r=>r.audio_path),m={};
if(paths.length){const{data:u}=await sb.storage.from('audio').createSignedUrls(paths,3600);(u||[]).forEach(o=>m[o.path]=o.signedUrl)}
S.stories=data.length?data.map(r=>({id:r.id,path:r.audio_path,k:r.kind,title:r.title,url:m[r.audio_path],tx:r.transcript,tr:r.translations||{},tags:r.tags||[],mood:r.mood})):[{k:'demo'}]}
async function toWav(b){const ctx=new(window.AudioContext||window.webkitAudioContext)();const buf=await ctx.decodeAudioData(await b.arrayBuffer());ctx.close();
const n=Math.ceil(buf.duration*16000),oc=new OfflineAudioContext(1,n,16000),src=oc.createBufferSource();src.buffer=buf;src.connect(oc.destination);src.start();
const d=(await oc.startRendering()).getChannelData(0),o=new DataView(new ArrayBuffer(44+n*2)),w=(p,s)=>[...s].forEach((c,i)=>o.setUint8(p+i,c.charCodeAt(0)));
w(0,'RIFF');o.setUint32(4,36+n*2,true);w(8,'WAVEfmt ');o.setUint32(16,16,true);o.setUint16(20,1,true);o.setUint16(22,1,true);o.setUint32(24,16000,true);o.setUint32(28,32000,true);o.setUint16(32,2,true);o.setUint16(34,16,true);w(36,'data');o.setUint32(40,n*2,true);
for(let i=0;i<n;i++){const v=Math.max(-1,Math.min(1,d[i]));o.setInt16(44+i*2,v<0?v*32768:v*32767,true)}return new Blob([o],{type:'audio/wav'})}
async function once(body){const ss=(await sb.auth.getSession()).data.session;const r=await fetch('/api/process',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+ss.access_token},body:JSON.stringify(body)});const raw=await r.text();let j;try{j=JSON.parse(raw)}catch(e){throw new Error('Server replied '+r.status+': '+raw.slice(0,60))}if(!r.ok)throw new Error(j.error||'AI error');return j}
async function call(body,n=4){for(let i=1;;i++){try{return await once(body)}catch(e){if(i>=n||!/demand|busy|too long|unavailable|overload|try again|replied 50[234]/i.test(e.message))throw e;S.msg=t().pr+' ('+(i+1)+'/'+n+')';render();await new Promise(w=>setTimeout(w,2500*i))}}}
async function ai(id,path){S.msg=t().pr;render();
try{const mem=S.stories.filter(s=>s.title&&s.id!==id).slice(0,5).map(s=>s.title);const j=await call({mode:'transcribe',path,memory:mem});
const tags=[...new Set([].concat(j.people||[],j.places||[],j.years||[],j.themes||[]).map(String))].slice(0,8);
const u=await sb.from('stories').update({title:j.title||null,transcript:j.transcript||null,tags,mood:j.mood||null}).eq('id',id);if(u.error)throw u.error;
if(j.followup)S.fq=j.followup;S.msg=t().saved;await load();render();
if(j.transcript){try{const k=await call({mode:'translate',text:j.transcript});await sb.from('stories').update({translations:k.translations||{}}).eq('id',id);await load();render()}catch(e){S.msg='Translation: '+e.message;render()}}
}catch(e){S.msg='AI: '+e.message;await load();render()}}
async function del(id,path){if(!confirm(t().cf))return;if(path)await sb.storage.from('audio').remove([path]);const r=await sb.from('stories').delete().eq('id',id);S.msg=r.error?r.error.message:'';await load();render()}
async function save(blob,title,kind){let ok=true;try{blob=await toWav(blob)}catch(e){ok=false}
const ty=(blob.type||'audio/webm').split(';')[0],p=S.user.id+'/'+Date.now()+'.'+(ty.includes('wav')?'wav':ty.includes('mp4')?'m4a':ty.includes('mpeg')?'mp3':ty.includes('ogg')?'ogg':'webm');
const up=await sb.storage.from('audio').upload(p,blob,{contentType:ty});if(up.error){S.msg=up.error.message;render();return}
const ins=await sb.from('stories').insert({title,kind,audio_path:p,consent:true}).select('id').single();if(ins.error){S.msg=ins.error.message;render();return}
await load();if(ok&&blob.size<18e6)await ai(ins.data.id,p);else{S.msg=t().saved;render()}}
toggle=async function(){if(S.rec){mr.stop();return}
try{const s=await navigator.mediaDevices.getUserMedia({audio:true}),ch=[];mr=new MediaRecorder(s);mr.ondataavailable=e=>ch.push(e.data);
mr.onstop=()=>{s.getTracks().forEach(k=>k.stop());S.rec=false;const q=t().q[S.qi];S.qi=(S.qi+1)%3;save(new Blob(ch,{type:mr.mimeType}),q,'real')};mr.start();S.rec=true;S.msg='';render()}catch(e){S.msg=t().noMic;render()}};
addFile=function(){const f=$('f').files[0];if(!f)return;if(!$('c').checked){S.msg=t().needc;render();return}save(f,f.name,$('s').checked?'demo':'real')};
async function init(s){S.user=s?s.user:null;if(S.user)await load();S.ready=true;S.msg='';render()}
sb.auth.onAuthStateChange((ev,s)=>{if(ev==='INITIAL_SESSION'||ev==='SIGNED_IN'||ev==='SIGNED_OUT')init(s)});
})();
