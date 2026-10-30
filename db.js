// Stage 2 (Vercel): login + saving stories to Supabase. Falls back to Stage 1 local mode if config.js is not filled in.
(async function(){
let C=null;try{C=await(await fetch('/api/config')).json()}catch(e){}
if(!C||!C.url||!C.key||!window.supabase){S.msg='Local mode: add SUPABASE_URL and SUPABASE_ANON_KEY in Vercel, then redeploy.';render();return}
var EV=C;
const sb=supabase.createClient(EV.url,EV.key);S.user=null;S.ready=false;S.err='';
const A={en:{em:'Email',pw:'Password (6+ characters)',si:'Sign in',su:'Create family vault',so:'Sign out',ld:'Loading...',wel:'Welcome to EverVoice',sub:'Sign in to keep your family stories safe and private.',chk:'Check your email to confirm, then sign in.'},
ur:{em:'ای میل',pw:'پاس ورڈ (کم از کم 6 حروف)',si:'لاگ اِن',su:'خاندانی البم بنائیں',so:'لاگ آؤٹ',ld:'لوڈ ہو رہا ہے...',wel:'ایور وائس میں خوش آمدید',sub:'اپنی خاندانی کہانیاں محفوظ رکھنے کے لیے لاگ اِن کریں۔',chk:'تصدیق کے لیے ای میل دیکھیں، پھر لاگ اِن کریں۔'},
ar:{em:'البريد الإلكتروني',pw:'كلمة المرور (6 أحرف فأكثر)',si:'تسجيل الدخول',su:'أنشئ خزنة العائلة',so:'تسجيل الخروج',ld:'جارٍ التحميل...',wel:'مرحبًا بك في إيفر فويس',sub:'سجّل الدخول لحفظ قصص عائلتك بخصوصية.',chk:'تحقق من بريدك للتأكيد، ثم سجّل الدخول.'}};
for(const l in A)Object.assign(T[l],A[l]);
const baseViews=views,baseRender=render;
views=function(){const x=t();if(!S.ready)return `<p class="soft">${x.ld}</p>`;if(S.user)return baseViews();
return `<section class="elder"><h1>${x.wel}</h1><p class="soft">${x.sub}</p><div class="card w" style="width:min(420px,100%);text-align:start"><label for="em">${x.em}</label><input id="em" type="email" autocomplete="email" style="width:100%;padding:12px;border-radius:12px;border:2px solid var(--card);font-size:18px"><label for="pw">${x.pw}</label><input id="pw" type="password" autocomplete="current-password" style="width:100%;padding:12px;border-radius:12px;border:2px solid var(--card);font-size:18px"><p style="margin:12px 0"><button class="go" id="si">${x.si}</button> <button class="chip" id="su">${x.su}</button></p><p class="soft" role="status">${S.err}</p></div></section>`};
render=function(){baseRender();if(S.user){const b=document.createElement('button');b.className='chip';b.textContent=t().so;b.onclick=()=>sb.auth.signOut();$('langs').appendChild(b)}
if($('si')){const go=async up=>{const c={email:$('em').value.trim(),password:$('pw').value};S.err='';const r=up?await sb.auth.signUp(c):await sb.auth.signInWithPassword(c);if(r.error)S.err=r.error.message;else if(up&&!r.data.session)S.err=t().chk;if(S.err)render()};$('si').onclick=()=>go(false);$('su').onclick=()=>go(true)}};
async function load(){const{data,error}=await sb.from('stories').select('*').order('created_at',{ascending:false});if(error){S.msg=error.message;S.stories=[{k:'demo'}];return}
const paths=data.filter(r=>r.audio_path).map(r=>r.audio_path),m={};
if(paths.length){const{data:u}=await sb.storage.from('audio').createSignedUrls(paths,3600);(u||[]).forEach(o=>m[o.path]=o.signedUrl)}
S.stories=data.length?data.map(r=>({k:r.kind,title:r.title,url:m[r.audio_path]})):[{k:'demo'}]}
async function save(blob,title,kind){const ty=(blob.type||'audio/webm').split(';')[0],p=S.user.id+'/'+Date.now()+'.'+(ty.includes('mp4')?'m4a':ty.includes('mpeg')?'mp3':ty.includes('ogg')?'ogg':'webm');
const up=await sb.storage.from('audio').upload(p,blob,{contentType:ty});if(up.error){S.msg=up.error.message;render();return}
const ins=await sb.from('stories').insert({title,kind,audio_path:p,consent:true});if(ins.error){S.msg=ins.error.message;render();return}
await load();S.msg=t().saved;render()}
toggle=async function(){if(S.rec){mr.stop();return}
try{const s=await navigator.mediaDevices.getUserMedia({audio:true}),ch=[];mr=new MediaRecorder(s);mr.ondataavailable=e=>ch.push(e.data);
mr.onstop=()=>{s.getTracks().forEach(k=>k.stop());S.rec=false;const q=t().q[S.qi];S.qi=(S.qi+1)%3;save(new Blob(ch,{type:mr.mimeType}),q,'real')};mr.start();S.rec=true;S.msg='';render()}catch(e){S.msg=t().noMic;render()}};
addFile=function(){const f=$('f').files[0];if(!f)return;if(!$('c').checked){S.msg=t().needc;render();return}save(f,f.name,$('s').checked?'demo':'real')};
async function init(s){S.user=s?s.user:null;if(S.user)await load();S.ready=true;S.msg='';render()}
sb.auth.onAuthStateChange((ev,s)=>{if(ev==='INITIAL_SESSION'||ev==='SIGNED_IN'||ev==='SIGNED_OUT')init(s)});
})();
