/* L’Antica Forno Médéa — واجهة الزبون. القائمة والأسعار تُحمَّل من Supabase، والطلبات تُحفظ عبر الدالة place_order. */
const CONFIG={logo:"",cover:"",heroBg:"",cats:[],zones:[],items:[],social:{},schedule:null,dine:true,tablesList:"1-20",menuBg:"",tagImg:"",theme:{red:"#a4161a",bg:"#0d0d0d",card:"#1a1a1a",txt:"#f5f5f5",font:"Montserrat"}};
let CT=null,SUBMITTING=false;
async function loadConfig(){
 if(!window.sb)throw new Error("supabase-config.js غير مضبوط");
 const T=(t,f)=>{const r=sb.from(t).select("*");return f?f(r):r};
 const R=await Promise.all([T("categories",r=>r.eq("is_active",true).order("sort_order")),T("products",r=>r.order("sort_order")),T("product_sizes",r=>r.order("sort_order")),T("product_extras",r=>r.order("sort_order")),T("option_groups"),T("group_options",r=>r.order("sort_order")),T("product_removables",r=>r.order("sort_order")),T("delivery_zones",r=>r.eq("is_active",true).order("sort_order")),sb.from("restaurant_settings").select("*").eq("id",1).maybeSingle(),sb.from("branding").select("*").eq("id",1).maybeSingle()]);
 const bad=R.slice(0,9).find(x=>x.error);if(bad)throw bad.error;
 const [cats,prods,sizes,extras,groups,opts,rms,zones,st,br0]=R.map(x=>x.data);const br=br0||{};
 if(!st||!cats.length)throw new Error("بيانات المطعم غير موجودة (شغّل seed.sql)");
 const by=(a,k)=>(a||[]).reduce((m,x)=>((m[x[k]]=m[x[k]]||[]).push(x),m),{});
 const S=by(sizes,"product_id"),E=by(extras,"product_id"),M=by(rms,"product_id"),G=by(groups,"product_id"),O=by(opts,"group_id");
 const pr=(row,sz)=>{const sp=row.size_prices;if(sp&&Object.keys(sp).length){const m={};sz.forEach(s=>m[s.n]=sp[s.id]||0);return m}return row.price||0};
 Object.assign(CONFIG,st.content||{},br.content||{});
 Object.assign(CONFIG,{tracking:!!st.tracking_enabled,phone:st.phone,map:st.map_url,social:st.social||{},schedule:st.schedule,dine:st.dine_enabled,tablesList:st.tables_list,logo:br.logo_url||st.logo_url||"",cover:br.cover_url||st.cover_url||"",heroBg:br.hero_url||st.hero_url||""});
 CONFIG.cats=cats.map(c=>({id:c.id,n:c.name_ar,f:c.name_fr||"",e:c.emoji||"🍽️"}));
 CONFIG.zones=zones.map(z=>({id:z.id,n:z.name_ar,f:z.name_fr||"",p:z.fee}));
 CONFIG.items=prods.map(p=>{
  const sz=(S[p.id]||[]).map(s=>({id:s.id,n:s.name_ar,f:s.name_fr||"",p:s.price}));
  const it={id:p.id,c:p.category_id,n:p.name_ar,f:p.name_fr||"",d:p.desc_ar||"",df:p.desc_fr||"",e:p.emoji||"🍽️",
   extras:(E[p.id]||[]).map(e=>({id:e.id,n:e.name_ar,f:e.name_fr||"",p:pr(e,sz)})),rm:(M[p.id]||[]).map(r=>({id:r.id,n:r.name_ar,f:r.name_fr||""}))};
  if(sz.length)it.sizes=sz;else it.p=p.base_price||0;
  if(p.image_url)it.img=p.image_url;if(p.is_new)it.isNew=1;if(!p.is_available)it.off=1;if(p.sold_out_date)it.sold=p.sold_out_date;
  (G[p.id]||[]).forEach(g=>{const o=O[g.id]||[];if(o.length)it[g.slot]={t:g.title_ar,f:g.title_fr||"",o:o.map(x=>({id:x.id,n:x.name_ar,f:x.name_fr||"",p:pr(x,sz)}))}});
  return it});
}
async function boot(){
 let cached=false,before="";
 try{const c=JSON.parse(localStorage.getItem("antica_cfg")||"null");if(c&&c.v===1&&Date.now()-c.t<2592e5&&c.d.cats&&c.d.cats.length){Object.assign(CONFIG,c.d);cat=CONFIG.cats[0].id;applyTheme();applyLang();cached=true;before=JSON.stringify(CONFIG)}}catch(e){}
 try{await loadConfig();try{localStorage.setItem("antica_cfg",JSON.stringify({v:1,t:Date.now(),d:CONFIG}))}catch(e){}
  if(JSON.stringify(CONFIG)!==before){if(!CONFIG.cats.some(c=>c.id===cat))cat=CONFIG.cats[0].id;applyTheme();applyLang()}tkInit()}
 catch(x){console.error(x);if(!cached)document.body.insertAdjacentHTML("afterbegin",'<div style="position:fixed;inset:0;z-index:100;background:#0d0d0d;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:24px;text-align:center"><b>تعذّر تحميل قائمة الطعام</b><span>تحقق من اتصالك بالإنترنت ثم أعد المحاولة · Impossible de charger le menu.</span><button class="btn" onclick="location.reload()">إعادة المحاولة · Réessayer</button></div>')}
}
const TYPE_DB={delivery:"delivery",pickup:"pickup",dine:"dine_in",reserve:"reservation"};
function payloadItems(){return cart.map(l=>{const it=item(l.id),sz=it.sizes&&it.sizes.find(z=>z.n===l.size),ids=[];
 [["ch",l.ch],["ch2",l.ch2]].forEach(([k,n])=>{const o=it[k]&&it[k].o.find(x=>x.n===n);if(o)ids.push(o.id)});
 return{product_id:l.id,size_id:sz?sz.id:null,option_ids:ids,extra_ids:l.ex.map(n=>(it.extras.find(x=>x.n===n)||{}).id).filter(Boolean),removed_ids:l.rm.map(n=>(RM(it).find(x=>x.n===n)||{}).id).filter(Boolean),note:l.note||"",qty:l.qty}})}
async function submitOrder(){
 if(SUBMITTING)return;syncF();const f=form,di=f.type==="dine",rs=f.type==="reserve",del=f.type==="delivery",e=[],fr=lang==="fr";
 if(!rs&&shopOpen()===false)e.push(fr?"⚠️ Nous sommes désolés, notre restaurant est actuellement fermé !":"⚠️ نعتذر منكم، مطعمنا مغلق حاليًا!");
 if(!cart.length&&!rs)e.push("السلة فارغة");
 if(!di&&!/^(0|\+?213)[5-7]\d{8}$/.test((f.phone||"").replace(/[\s.-]/g,"")))e.push("رقم هاتف جزائري غير صحيح");
 if(rs&&(f.name||"").trim().length<2)e.push("أدخل الاسم واللقب");
 if(rs){const t=new Date(f.rtime||"");if(!f.rtime||isNaN(t)||t.getTime()<Date.now()+6e5)e.push(fr?"Choisissez une heure valide (au moins 10 minutes à l’avance)":"اختر وقتًا صحيحًا (بعد 10 دقائق على الأقل)")}
 if(del&&!f.zone)e.push("اختر منطقة التوصيل");
 if(di&&!f.table)e.push(fr?"Choisissez le numéro de table":"اختر رقم الطاولة");
 if(e.length){$("er").innerHTML=e.join("<br>");tr($("er"));return}
 CT=CT||crypto.randomUUID();
 const z=zone(),b=$("sb"),pay={client_token:CT,order_type:TYPE_DB[f.type]||"delivery",customer_name:rs?f.name:"",reservation_time:rs?new Date(f.rtime).toISOString():null,phone:di?"":f.phone,zone_id:del&&z?z.id:null,address:del?(f.addr||""):"",table_number:di?f.table:"",notes:f.other||"",items:payloadItems()};
 SUBMITTING=true;if(b){b.disabled=true;b.style.opacity=.6}$("er").textContent=fr?"Envoi en cours…":"جارٍ إرسال الطلب…";
 try{
  const {data,error}=await sb.rpc("place_order",{payload:pay});
  if(error)throw error;if(!data||!data.order_number)throw new Error("empty response");
  const lines=cart.map(l=>`<div class="ci"><b>${esc(nm(item(l.id)))} × ${l.qty}</b> <small>${esc(desc(l))}</small></div>`).join("");
  if(CONFIG.tracking)tkSet({t:CT,n:data.order_number});cart=[];CT=null;save();showSuccess(data,lines,{n:f.name||"",rt:f.rtime||"",t:f.type,z:z?(lang==="fr"&&z.f?z.f:z.n):"",a:f.addr||"",tb:f.table||"",ph:f.phone||""});
 }catch(x){
  console.error(x);const m=String((x&&x.message)||""),L=(a,c)=>fr?c:a;
  $("er").textContent=m.includes("shop_closed")?L("مطعمنا مغلق حاليًا.","Le restaurant est fermé."):/invalid_(size|option|extra|removed)|product_unavailable|invalid_zone|invalid_table/.test(m)?L("تغيّرت القائمة أو لم يعد أحد العناصر متوفرًا. أعد تحميل الصفحة وراجع سلتك.","Le menu a changé. Rechargez la page et vérifiez votre panier."):m.includes("rate_limited")?L("عدد كبير من الطلبات. حاول بعد قليل.","Trop de commandes. Réessayez dans un instant."):/invalid_(name|phone|time)/.test(m)?L("تحقق من الاسم والهاتف ووقت الحجز.","Vérifiez le nom, le téléphone et l’heure."):L("تعذّر إرسال الطلب. سلتك وبياناتك محفوظة، أعد المحاولة.","L’envoi a échoué. Votre panier est conservé, réessayez.");
  tr($("er"));
 }finally{SUBMITTING=false;if(b&&b.isConnected){b.disabled=false;b.style.opacity=""}}
}
const ph10=s=>{let d=String(s||"").replace(/\D/g,"");if(d.startsWith("213"))d="0"+d.slice(3);return d},phFmt=s=>{const d=ph10(s);return d.length===10?d.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})$/,"$1 $2 $3 $4"):d};
function showSuccess(d,lines,x){const fr=lang==="fr",L=(a,b)=>fr?b:a,k=n=>`style="--k:${n}"`;x=x||{};
 const T={delivery:["🛵 "+L("توصيل","Livraison"),L("سيتصل بك عامل التوصيل فور تجهيز طلبك، يُرجى إبقاء هاتفك بالقرب منك للرد على المكالمة وتأكيد التوصيل.","Le livreur vous appellera dès que votre commande sera prête. Merci de garder votre téléphone à portée de main pour répondre à l’appel et confirmer la livraison.")],
  pickup:["🏪 "+L("استلام من المطعم","À emporter"),L("مرحبًا بك في المحل! سيكون طلبك جاهزًا قريبًا، يمكنك استلامه عند وصولك.","Bienvenue au restaurant ! Votre commande sera bientôt prête, vous pouvez la récupérer à votre arrivée.")],
  dine:["🍽️ "+L("داخل المطعم","Sur place")+(x.tb?" · "+L("طاولة","Table")+" "+esc(x.tb):""),L("مرحبًا بك! سيُقدَّم طلبك إلى طاولتك قريبًا.","Bienvenue ! Votre commande sera servie à votre table très bientôt.")],
  reserve:["📅 "+L("حجز طاولة","Réservation"),L("تم تسجيل حجزك. يسعدنا استقبالك في الموعد المحدد.","Votre réservation est enregistrée. Nous serons ravis de vous accueillir à l’heure indiquée.")]}[x.t]||["",""];
 const cf=Array.from({length:22},(_,n)=>`<i style="left:${Math.round(Math.random()*100)}%;--x:${Math.round(Math.random()*120-60)}px;--r:${Math.round(Math.random()*720-360)}deg;--dl:${(Math.random()*.5+.55).toFixed(2)}s;background:${["#34c38f","#ffb703","#ff5d5d","#4c8dff","#c4a0ff"][n%5]}"></i>`).join("");
 const when=x.rt?new Date(x.rt).toLocaleString(fr?"fr-DZ":"ar-DZ",{dateStyle:"medium",timeStyle:"short"}):"";
 const info=[`<b>${T[0]}</b>`,x.t==="reserve"&&x.n?"👤 "+esc(x.n):"",x.t==="reserve"&&when?"🕒 "+esc(when):"",x.t==="delivery"&&x.z?"📍 "+esc(x.z)+(x.a?" — "+esc(x.a):""):"",x.ph&&x.t!=="dine"?"📞 "+esc(x.t==="reserve"?phFmt(x.ph):ph10(x.ph)):""].filter(Boolean).map(s=>`<div>${s}</div>`).join("");
 const money=lines?`<div class="tot sx-u" ${k(4)}><div><span>${L("المجموع الفرعي","Sous-total")}</span><b>${fmt(d.subtotal)}</b></div>${d.delivery_fee!=null?`<div><span>${L("التوصيل","Livraison")}</span><b>${fmt(d.delivery_fee)}</b></div>`:d.delivery_fee_pending?`<div><span>${L("التوصيل","Livraison")}</span><span>${L("يتم تأكيد تكلفة التوصيل من طرف المطعم","Frais de livraison à confirmer par le restaurant")}</span></div>`:""}<div class="g"><span>${L("الإجمالي","Total")}</span><span>${fmt(d.total)}${d.delivery_fee_pending?L(" + التوصيل"," + livraison"):""}</span></div></div>`:"";
 openS(`<div class="sx"><div class="sx-cf">${cf}</div>
 <svg class="sx-ic" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46"/><path d="M30 52 L44 66 L71 36"/></svg>
 <h3 class="sx-u" ${k(0)}>${x.t==="reserve"?L("تم تسجيل حجزك بنجاح","Votre réservation est confirmée"):L("تم استلام طلبك بنجاح","Votre commande a bien été reçue")}</h3>
 <div class="sx-u" ${k(1)}><span class="sx-no">${L("الرقم المرجعي","N° de référence")} <b dir="ltr">${esc(d.order_number)}</b></span></div>
 <p class="sx-u sx-msg" ${k(2)}>${T[1]}</p>
 <div class="sx-box sx-u" ${k(3)}>${info}${lines?`<div class="sx-items">${lines}</div>`:""}</div>
 ${money}
 ${CONFIG.tracking?`<button class="btn sec sx-u" ${k(5)} style="width:100%;margin-top:12px" onclick="openTrack()">📍 ${L("تتبّع طلبي","Suivre ma commande")}</button>`:""}
 <button class="btn sx-u" ${k(5)} style="width:100%;margin-top:10px" onclick="closeS()">${L("العودة إلى القائمة","Retour au menu")}</button></div>`);
 try{navigator.vibrate&&navigator.vibrate([40,30,40])}catch(e){}}
let ANIM=1,QS="";
const $=id=>document.getElementById(id),esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=n=>new Intl.NumberFormat("fr-DZ").format(n)+" دج";
const LS={g(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},s(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let cart=(()=>{try{return JSON.parse(sessionStorage.getItem("antica_cart")||"[]")}catch(e){return[]}})(),form=LS.g("antica_form",{type:"delivery"}),cat=null,sel=null;
const item=id=>CONFIG.items.find(i=>i.id===id);
const base=(it,size)=>it.sizes?(it.sizes.find(s=>s.n===size)||it.sizes[0]).p:it.p;
function unit(l){const it=item(l.id);if(!it)return 0;let p=base(it,l.size);(l.ex||[]).forEach(n=>{const e=(it.extras||[]).find(x=>x.n===n);if(e)p+=chp(e,l.size)});[["ch",it.ch,l.ch],["ch2",it.ch2,l.ch2]].forEach(([k,g,n])=>{const o=g&&g.o&&g.o.find(x=>x.n===n);if(o)p+=chp(o,l.size)});return p}
const sub=()=>cart.reduce((a,l)=>a+unit(l)*l.qty,0),count=()=>cart.reduce((a,l)=>a+l.qty,0);
const zone=()=>CONFIG.zones.find(z=>z.n===form.zone);
function delivery(){if(form.type==="reserve")return{v:0,t:"0 دج"};if(form.type==="pickup")return{v:0,t:"0 دج (استلام)"};if(form.type==="dine")return{v:0,t:"0 دج"};const z=zone();if(!z)return{v:null,t:"يُحدد عند اختيار المنطقة"};if(z.p==null)return{v:null,t:"يتم تأكيد تكلفة التوصيل من طرف المطعم"};return{v:z.p,t:fmt(z.p)}}
function save(){try{sessionStorage.setItem("antica_cart",JSON.stringify(cart))}catch(e){}LS.s("antica_form",form);paint()}
function go(id){$(id).scrollIntoView({behavior:"smooth"})}
function card(it){const from=it.sizes?(lang==="fr"?"À partir de ":"من "):"";return `<div class="card ${isOff(it)?"off":""}"><div class="ph"${it.img?` onclick="zoomImg(event,'${it.id}')" style="cursor:zoom-in"`:""}>${it.img?`<img loading="lazy" decoding="async" alt="" src="${esc(it.img)}">`:it.e}</div><div class="cb"><h3>${esc(nm(it))}${it.isNew?`<span class="nw">${lang==="fr"?"Nouveau":"جديد"}</span>`:""}</h3><p data-nt>${esc(dd(it))}</p><div class="pr"><b>${from}${fmt(base(it))}</b><button class="btn ${isOff(it)?(it.sold===td()?"so":"na"):""}" onclick="openItem('${it.id}')">${isOff(it)?(it.sold===td()?"نفد اليوم":"غير متوفر"):"أضف إلى السلة"}</button></div></div></div>`}
function paint(){
 $("logo").innerHTML=CONFIG.logo?`<img src="${esc(CONFIG.logo)}" alt="" height="36">`:`L’Antica <b>Forno</b>`;
 $("sub").textContent="مطعم إيطالي — "+(lang==="fr"&&CONFIG.cityF?CONFIG.cityF:CONFIG.city);$("hrs").textContent=lang==="fr"&&CONFIG.hoursF?CONFIG.hoursF:CONFIG.hours;$("cty").textContent=lang==="fr"&&CONFIG.cityF?CONFIG.cityF:CONFIG.city;renderContact();
 
 $("cats").innerHTML=CONFIG.cats.map(c=>`<button class="chip ${c.id===cat?"on":""}" onclick="cat='${c.id}';ANIM=1;paint()">${c.e} ${lang==="fr"&&c.f?c.f:c.n}</button>`).join("");
 $("list").className="grid"+(ANIM?" an":"");ANIM=0;$("list").innerHTML=(()=>{const L=CONFIG.items.filter(i=>QS?mt(i):i.c===cat);$("cats").style.display=QS?"none":"";return L.length?L.map(card).join(""):`<p data-nt style="text-align:center;color:var(--mut);padding:24px 0">${lang==="fr"?"Aucun résultat":"لا توجد نتائج"}</p>`})();reveal();
 const q=count();$("fq").textContent=q||"";$("fl2").textContent=lang==="fr"?"Voir le panier · "+fmt(sub()).replace("دج","DA"):"عرض السلة · "+fmt(sub());$("fab").classList.toggle("big",q>0);$("ft").textContent=fmt(sub());tr(document.body)}
function openS(h){const was=$("ov").classList.contains("on"),st=was?$("sh").scrollTop:0;$("sh").innerHTML=h;{const x=$("sh").querySelector(".sh .x");if(x){x.classList.add("pin");$("sh").insertBefore(x,$("sh").firstChild)}}$("ov").classList.add("on");tr($("sh"));lockScroll();$("sh").scrollTop=st}function closeS(){$("ov").classList.remove("on");unlockScroll();clearInterval(tkTimer);tkPill()}
let _sy=0,_lk=false;
function lockScroll(){if(_lk)return;_lk=true;_sy=window.scrollY;const b=document.body.style;b.position="fixed";b.top=-_sy+"px";b.left="0";b.right="0";b.width="100%"}
function unlockScroll(){if(!_lk)return;_lk=false;const b=document.body.style;b.position=b.top=b.left=b.right=b.width="";window.scrollTo({top:_sy,left:0,behavior:"instant"})}
/* نافذة الوجبة */
function openItem(id,key){const it=item(id);if(!it||isOff(it))return;const old=key?cart.find(l=>l.k===key):null;
 sel=old?{...old,ex:[...old.ex],rm:[...old.rm],edit:key}:{id,size:it.sizes?it.sizes[0].n:null,ch:(it.ch&&it.ch.o&&it.ch.o[0]||{}).n||null,ch2:(it.ch2&&it.ch2.o&&it.ch2.o[0]||{}).n||null,ex:[],rm:[],note:"",qty:1};renderItem()}
function renderItem(){const it=item(sel.id);let h=`<div class="sh"><h3>${esc(nm(it))}</h3><button class="x" onclick="closeS()">✕</button></div><p data-nt style="color:#bbb;margin:0">${esc(dd(it))}</p>`;
 if(it.sizes)h+=`<h4>الحجم</h4>`+it.sizes.map(s=>`<label class="opt"><span><input type="radio" name="sz" ${sel.size===s.n?"checked":""} onchange="sel.size='${esc(s.n)}';renderItem()">${esc(ol(s))}</span><b>${fmt(s.p)}</b></label>`).join("");
 [["ch2",it.ch2],["ch",it.ch]].forEach(([k,g])=>{if(g&&g.o&&g.o.length)h+=`<h4>${esc(lang==="fr"&&g.f?g.f:g.t)}</h4>`+g.o.map(o=>{const pr=chp(o,sel.size);return `<label class="opt"><span><input type="radio" name="${k}" ${sel[k]===o.n?"checked":""} onchange="sel.${k}='${esc(o.n)}';renderItem()">${esc(ol(o))}</span>${pr?`<b>+${fmt(pr)}</b>`:""}</label>`}).join("")});
 if(it.extras?.length)h+=`<h4>الإضافات</h4>`+it.extras.map(e=>`<label class="opt"><span><input type="checkbox" ${sel.ex.includes(e.n)?"checked":""} onchange="tg('ex','${esc(e.n)}')">${esc(ol(e))}</span><b>${(()=>{const q=chp(e,sel.size);return q?"+"+fmt(q):(lang==="fr"?"Gratuit":"مجاني")})()}</b></label>`).join("");
 if(RM(it).length)h+=`<h4>حذف مكونات</h4>`+RM(it).map(o=>o.n).map(r=>`<label class="opt"><span><input type="checkbox" ${sel.rm.includes(r)?"checked":""} onchange="tg('rm','${esc(r)}')">بدون ${esc(rl(it,r))}</span></label>`).join("");
 const u=unit(sel);h+=`<label>ملاحظات الوجبة</label><textarea rows="2" maxlength="200" oninput="sel.note=this.value">${esc(sel.note)}</textarea><div class="stk"><div class="qty"><button onclick="sel.qty=Math.max(1,sel.qty-1);renderItem()">−</button><b>${sel.qty}</b><button onclick="sel.qty=Math.min(50,sel.qty+1);renderItem()">+</button></div><button class="btn" onclick="addCart()">${sel.edit?"حفظ التعديل":"أضف"} — ${fmt(u*sel.qty)}</button></div>`;openS(h)}
function tg(k,v){const a=sel[k],i=a.indexOf(v);i<0?a.push(v):a.splice(i,1);renderItem()}
function addCart(){const l={id:sel.id,size:sel.size,ch:sel.ch||null,ch2:sel.ch2||null,ex:[...sel.ex].sort(),rm:[...sel.rm].sort(),note:sel.note.trim(),qty:sel.qty};l.k=[l.id,l.size,l.ch,l.ch2,l.ex,l.rm,l.note].join("|");
 if(sel.edit)cart=cart.filter(x=>x.k!==sel.edit);const m=cart.find(x=>x.k===l.k);m?m.qty=Math.min(50,m.qty+l.qty):cart.push(l);save();closeS()}
/* السلة */
function chg(k,d){const l=cart.find(x=>x.k===k);if(!l)return;l.qty+=d;if(l.qty<1)cart=cart.filter(x=>x.k!==k);save();openCart()}
function del(k){cart=cart.filter(x=>x.k!==k);save();openCart()}
function desc(l){const it=item(l.id),sz=it.sizes&&it.sizes.find(z=>z.n===l.size),xs=l.ex.map(n=>{const o=(it.extras||[]).find(x=>x.n===n);return o?ol(o):n});return [l.ch2&&((lang==="fr"&&it.ch2&&it.ch2.f?it.ch2.f:(it.ch2&&it.ch2.t)||"النوع")+": "+chl(it,l.ch2,"ch2")),l.ch&&((lang==="fr"&&it.ch&&it.ch.f?it.ch.f:(it.ch&&it.ch.t)||"الخيار")+": "+chl(it,l.ch)),l.size&&"الحجم: "+(sz?ol(sz):l.size),l.ex.length&&"الإضافات: "+xs.join("، "),l.rm.length&&"بدون: "+l.rm.map(n=>rl(it,n)).join("، "),l.note&&"ملاحظة: "+l.note].filter(Boolean).join(" • ")}
function totals(c){const d=delivery(),s=sub();return `<div class="tot">${c?"":`<div><span>المجموع الفرعي</span><b>${fmt(s)}</b></div>`}${form.type==="dine"||form.type==="reserve"||c?"":`<div><span>التوصيل</span><span>${d.t}</span></div>`}<div class="g"><span>الإجمالي</span><span>${c?fmt(s):d.v==null?fmt(s)+" + التوصيل":fmt(s+d.v)}</span></div></div>`}
function openCart(){cart=cart.filter(l=>item(l.id)&&!isOff(item(l.id)));let h=`<div class="sh"><h3>🛒 سلتك</h3><button class="x" onclick="closeS()">✕</button></div>`;
 if(!cart.length)h+=`<p style="text-align:center;color:var(--mut);padding:30px 0">السلة فارغة. تصفح القائمة وأضف وجباتك المفضلة.</p><button class="btn" style="width:100%" onclick="closeS()">تصفح القائمة</button><button class="btn sec" style="width:100%;margin-top:8px" onclick="form={...form,type:'reserve'};save();openCheckout()">📅 حجز طاولة</button>`;
 else{h+=cart.map(l=>{const it=item(l.id);return `<div class="ci"><b>${esc(nm(it))}</b> <small>${esc(desc(l))}</small><small>سعر الوحدة: ${fmt(unit(l))}</small><div class="r"><div class="qty"><button onclick="chg('${esc(l.k)}',-1)">−</button><b>${l.qty}</b><button onclick="chg('${esc(l.k)}',1)">+</button><button class="lnk" onclick="openItem('${l.id}','${esc(l.k)}')">تعديل</button><button class="lnk" onclick="del('${esc(l.k)}')">حذف</button></div><b>${fmt(unit(l)*l.qty)}</b></div></div>`}).join("")+`<div style="text-align:end"><button class="lnk" onclick="clearCart(this)">حذف الكل</button></div>`+totals(1)+`<button class="btn" style="width:100%;margin-top:10px" onclick="openCheckout()">إتمام الطلب</button>`}
 openS(h)}
/* إتمام الطلب */
const nowLocal=()=>{const d=new Date(Date.now()-new Date().getTimezoneOffset()*6e4);return d.toISOString().slice(0,16)};
function openCheckout(){if(!cart.length&&form.type!=="reserve")return openCart();const f=form,di=f.type==="dine",rs=f.type==="reserve",del=f.type!=="pickup"&&!di&&!rs;
 openS(`<div class="sh"><h3>إتمام الطلب</h3><button class="x" onclick="openCart()">‹</button></div>
 
 ${rs?"":closedBanner()}<label>نوع الطلب</label><select id="ft2" onchange="syncF();openCheckout()"><option value="delivery" ${del?"selected":""}>توصيل</option><option value="pickup" ${f.type==="pickup"?"selected":""}>استلام من المطعم</option>${CONFIG.dine===false?"":`<option value="dine" ${di?"selected":""}>أكل في المطعم</option>`}<option value="reserve" ${rs?"selected":""}>حجز طاولة</option></select>${di?`<label>رقم الطاولة *</label><select id="ftb" onchange="syncF()"><option value="">اختر الطاولة</option>${tblList().map(t=>`<option ${String(f.table)===t?"selected":""}>${esc(t)}</option>`).join("")}</select>`:""}
 ${rs?`<label>الاسم واللقب *</label><input type="text" id="fn" value="${esc(f.name||"")}" maxlength="80" autocomplete="name">`:""}${!di?`<label>رقم الهاتف *</label><input type="tel" id="fp" value="${esc(f.phone||"")}" placeholder="05XX XX XX XX" inputmode="tel" maxlength="14" oninput="fmtPh(this)" autocomplete="tel">`:""}
 ${rs?`<label>وقت المجيء *</label><input type="datetime-local" id="frt" value="${esc(f.rtime||"")}" min="${nowLocal()}" onchange="syncF()">`:""}
 ${del?`<label>منطقة التوصيل *</label><select id="fz" onchange="syncF();openCheckout()"><option value="">اختر المنطقة</option>${zsorted().map(z=>`<option value="${esc(z.n)}" ${f.zone===z.n?"selected":""}>${esc(zl(z))}</option>`).join("")}</select><label>العنوان بالتفصيل (اختياري)</label><textarea rows="1" id="fa">${esc(f.addr||"")}</textarea>`:""}
 <label>ملاحظات إضافية</label><textarea rows="1" id="fo">${esc(f.other||"")}</textarea>
 ${cart.length?`<h4>ملخص الطلبية</h4>${cart.map(l=>`<div class="ci"><b>${esc(nm(item(l.id)))} × ${l.qty}</b> <small>${esc(desc(l))}</small></div>`).join("")}${totals()}`:""}
 <div class="err" id="er"></div><div class="stk"><button class="btn wa" ${shopOpen()===false&&!rs?'disabled style="opacity:.45;filter:grayscale(.7)"':""} id="sb" onclick="submitOrder()">${rs?"تأكيد الحجز":"تأكيد الطلب"}</button></div>`)}
function tblList(){const sp=CONFIG.tablesList||("1-"+(CONFIG.tables||20)),o=[];sp.split(/[,،\n]/).map(x=>x.trim()).filter(Boolean).forEach(x=>{const m=x.match(/^(\d+)\s*-\s*(\d+)$/);if(m){for(let i=+m[1];i<=Math.min(+m[2],+m[1]+300);i++)o.push(String(i))}else o.push(x)});return [...new Set(o)].slice(0,300)}
function clearCart(b){if(b.dataset.c){cart=[];save();openCart();return}b.dataset.c=1;b.textContent=lang==="fr"?"Confirmer ?":"تأكيد الحذف؟";setTimeout(()=>{if(b.isConnected){delete b.dataset.c;b.textContent=lang==="fr"?"Vider le panier":"حذف الكل"}},3000)}
const DN={ar:["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],fr:["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"]},DEFS=()=>Array.from({length:7},()=>({open:"11:00",close:"23:00",closed:false}));
function shopOpen(){const sc=CONFIG.schedule;if(!sc||sc.length!==7)return null;const n=new Date(),d0=sc[n.getDay()]||{},m=n.getHours()*60+n.getMinutes(),tm=x=>{const a=String(x||"0:0").split(":");return(+a[0]||0)*60+(+a[1]||0)},o=tm(d0.open),c=tm(d0.close);return !d0.closed&&(c>o?m>=o&&m<c:m>=o||m<c)}
function untilOpen(){const sc=CONFIG.schedule;if(!sc||sc.length!==7)return null;const n=new Date(),tm=x=>{const a=String(x||"0:0").split(":");return(+a[0]||0)*60+(+a[1]||0)},m=n.getHours()*60+n.getMinutes();for(let k=0;k<=7;k++){const d=sc[(n.getDay()+k)%7]||{};if(d.closed)continue;const o=tm(d.open)+k*1440-m;if(o>0)return o}return null}
function fmtRem(u,fr){const dd=Math.floor(u/1440),h=Math.floor(u%1440/60),m=u%60,p=[];if(fr){if(dd)p.push(dd+" j");if(h)p.push(h+" h");if(m||!p.length)p.push(m+" min");return p.join(" ")}const a=(k,one,two,pl,many)=>k==1?one:k==2?two:k+" "+(k<11?pl:many);if(dd)p.push(a(dd,"يوم","يومان","أيام","يومًا"));if(h)p.push(a(h,"ساعة","ساعتان","ساعات","ساعة"));if(m||!p.length)p.push(a(m,"دقيقة","دقيقتان","دقائق","دقيقة"));return p.join(" و")}
function nextOpen(){const sc=CONFIG.schedule;if(!sc||sc.length!==7)return null;const n=new Date(),tm=x=>{const a=String(x||"0:0").split(":");return(+a[0]||0)*60+(+a[1]||0)},m=n.getHours()*60+n.getMinutes();for(let k=0;k<=7;k++){const di=(n.getDay()+k)%7,d=sc[di]||{};if(d.closed)continue;const o=tm(d.open)+k*1440-m;if(o>0)return{u:o,t:d.open,k,di}}return null}
function closedBanner(){if(shopOpen()!==false)return"";const fr=lang==="fr",x=nextOpen();let r=`<b>${fr?"⚠️ Nous sommes désolés, notre restaurant est actuellement fermé !":"⚠️ نعتذر منكم، مطعمنا مغلق حاليًا!"}</b>`;if(x){const dn=x.k===1?(fr?" demain":" غدًا"):x.k>1?(fr?" ("+DN.fr[x.di]+")":" يوم "+DN.ar[x.di]):"";r+=`<br>${fr?"Nous reprenons les commandes à partir de ":"نعود لاستقبال طلبياتكم ابتداءً من الساعة "}${esc(x.t)}${dn}<br>${fr?"⏳ Ouverture dans ":"⏳ يفتح المحل بعد "}${fmtRem(x.u,fr)}`}return `<div class="note" data-nt style="background:#3a2a00;color:#ffd166">${r}</div>`}
function schedHTML(fr){const sc=CONFIG.schedule;if(!sc||sc.length!==7)return"";const n=new Date(),t=n.getDay(),nm2=n.getHours()*60+n.getMinutes(),tm=x=>{const a=String(x||"0:0").split(":");return(+a[0]||0)*60+(+a[1]||0)},d0=sc[t]||{},o=tm(d0.open),c=tm(d0.close),isOpen=!d0.closed&&(c>o?nm2>=o&&nm2<c:nm2>=o||nm2<c);
return `<div class="st ${isOpen?"on":"off"}">${isOpen?(fr?"● Ouvert maintenant":"● مفتوح الآن"):(fr?"● Fermé maintenant":"● مغلق الآن")}</div><div class="sch">`+[6,0,1,2,3,4,5].map(i=>{const d=sc[i]||{},on=i===t;return `<div class="sr${on?" today":""}"><span>${DN[fr?"fr":"ar"][i]}</span><span>${d.closed?(fr?"Fermé":"مغلق"):esc(d.open)+" – "+esc(d.close)}</span></div>`}).join("")+`</div>`}
const norm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[\u064B-\u065F\u0670\u0300-\u036F]/g,"").replace(/[أإآ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه");
function mt(i){const q=norm(QS),c=CONFIG.cats.find(x=>x.id===i.c)||{};return [i.n,i.f,i.d,i.df,DF[i.id],c.n,c.f].some(x=>norm(x).includes(q))}
const zsorted=()=>[...(CONFIG.zones||[])].sort((a,b)=>zl(a).localeCompare(zl(b),lang==="fr"?"fr":"ar"));
function showZones(){const LT=(a,b)=>lang==="fr"?b:a;openS(`<div class="sh"><h3>${LT("أسعار التوصيل في ولاية المدية","Tarifs de livraison – Wilaya de Médéa")}</h3><button class="x" onclick="closeS()">✕</button></div>`+zsorted().map(z=>`<div class="ci"><div class="r"><span>${esc(zl(z))}</span><b>${z.p==null?LT("يؤكدها المطعم","À confirmer"):fmt(z.p)}</b></div></div>`).join("")+`<p data-nt style="color:var(--mut);font-size:13px">${LT("تُحدّد تكلفة التوصيل النهائية عند إتمام الطلب.","Les frais de livraison finaux sont indiqués lors de la commande.")}</p>`)}
function fmtPh(i){const v=i.value;if(/^\s*\+/.test(v))return;const d=v.replace(/\D/g,"").slice(0,10),m=d.match(/^(\d{0,4})(\d{0,2})(\d{0,2})(\d{0,2})$/);i.value=m.slice(1).filter(Boolean).join(" ")}
function syncF(){const g=i=>$(i)?$(i).value.trim():undefined;form={...form,name:g("fn")??form.name,phone:g("fp")??form.phone,type:g("ft2")??form.type,rtime:g("frt")??form.rtime,zone:g("fz")??form.zone,table:g("ftb")??form.table,addr:g("fa")??form.addr,other:g("fo")??form.other};save()}
const td=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")},isOff=it=>!!it.off||it.sold===td();
/* ===== اللغة والمظهر والواجهة الأولى ===== */
const DF={p1:"Sauce tomate, mozzarella, basilic",p2:"Quatre fromages",p3:"Mozzarella et pepperoni",s1:"Poulet grillé, salade, tomate, sauce",s2:"Thon, olives, salade",n1:"Pâte cuite farcie au fromage",n2:"Farci au poulet et au fromage",t1:"Poulet, fromage, sauce",t2:"Viande hachée, fromage, sauce",b1:"Bœuf, salade, tomate, fromage",b2:"Poulet croustillant, sauce",l1:"Pâtes en couches, viande et béchamel",l2:"Pâtes, sauce crème et poulet"};
let lang=LS.g("antica_lang","ar");
const nm=it=>lang==="fr"&&it.f?it.f:it.n,dd=it=>lang==="fr"?(it.df||DF[it.id]||it.d):it.d;
const TRD=Object.fromEntries(`⚠️ بيانات وأسعار تجريبية قابلة للتعديل — ليست قائمة المطعم الفعلية|⚠️ Données et prix de démonstration — ce n’est pas le menu réel
جميع أطباقك المفضلة في مكان واحد|Tous vos plats préférés au même endroit
اكتشف قائمتنا|Découvrir notre menu
🛒 السلة|🛒 Panier
⚙️ إدارة|⚙️ Admin
الأكثر طلبًا|Les plus commandés
قائمة الطعام|Menu
مطعم إيطالي — |Restaurant italien —~
الموقع على الخريطة|Voir sur la carte
عرض السلة|Voir le panier
أضف إلى السلة|Ajouter au panier
غير متوفر|Indisponible
نفد اليوم|Épuisé aujourd’hui
الحجم: |Taille :~
الحجم|Taille
الإضافات: |Suppléments :~
الإضافات|Suppléments
حذف مكونات|Retirer des ingrédients
بدون: |Sans :~
بدون |Sans~
ملاحظات الوجبة|Remarques sur le plat
ملاحظة: |Remarque :~
حفظ التعديل|Enregistrer
أضف — |Ajouter —~
سلتك|Votre panier
السلة فارغة. تصفح القائمة وأضف وجباتك المفضلة.|Le panier est vide. Parcourez le menu et ajoutez vos plats préférés.
السلة فارغة|Panier vide
تصفح القائمة|Voir le menu
سعر الوحدة: |Prix unitaire :~
تعديل|Modifier
حذف|Supprimer
حذف الكل|Vider le panier
أسعار التوصيل في ولاية المدية|Tarifs de livraison – Wilaya de Médéa
المجموع الفرعي|Sous-total
التوصيل|Livraison
الإجمالي|Total
إتمام الطلب|Passer la commande
تأكيد الطلب|Confirmer la commande
تأكيد الحجز|Confirmer la réservation
حجز طاولة|Réserver une table
📅 حجز طاولة|📅 Réserver une table
وقت المجيء *|Heure d’arrivée *
الاسم واللقب *|Nom et prénom *
0 دج (استلام)|0 DA (retrait)
يُحدد عند اختيار المنطقة|Défini selon la zone
يتم تأكيد تكلفة التوصيل من طرف المطعم|Frais de livraison à confirmer par le restaurant
~دج|~DA
الاسم واللقب *|Nom et prénom *
رقم الهاتف *|Téléphone *
نوع الطلب|Type de commande
استلام من المطعم|Retrait au restaurant
أكل في المطعم|Sur place
رقم الطاولة *|Numéro de table *
اختر الطاولة|Choisir la table
توصيل|Livraison
منطقة التوصيل *|Zone de livraison *
اختر المنطقة|Choisir la zone
العنوان بالتفصيل (اختياري)|Adresse détaillée (facultatif)
ملاحظات إضافية|Remarques supplémentaires
ملخص الطلبية|Récapitulatif
تأكيد الطلبية عبر WhatsApp|Confirmer la commande via WhatsApp
أدخل الاسم واللقب|Entrez votre nom et prénom
رقم هاتف جزائري غير صحيح|Numéro de téléphone invalide
اختر منطقة التوصيل|Choisissez la zone de livraison
أدخل العنوان بالتفصيل|Entrez l’adresse détaillée
رقم WhatsApp للمطعم غير مضبوط|Numéro WhatsApp du restaurant non configuré
المدية – وسط المدينة|Médéa – centre-ville
المدية – أطراف المدينة|Médéa – périphérie
البرواقية|Berrouaghia
بلدية أخرى|Autre commune
تم فتح WhatsApp|WhatsApp est ouvert
⚠️ لم يُرسل طلبك بعد! تأكد من الضغط على زر «إرسال» داخل WhatsApp حتى يصل الطلب إلى المطعم.|⚠️ Votre commande n’est pas encore envoyée ! Appuyez sur « Envoyer » dans WhatsApp pour qu’elle parvienne au restaurant.
رقم الطلبية: |N° de commande :~
إعادة فتح WhatsApp|Rouvrir WhatsApp
تم الإرسال – تفريغ السلة|Envoyé – vider le panier
رجوع (الاحتفاظ بالسلة)|Retour (garder le panier)
صغيرة|Petite
وسط|Moyenne
كبيرة|Grande
جبن إضافي|Fromage en plus
جبن|Fromage
زيتون|Olives
بطاطا|Frites
البطاطا|Frites
بيض|Œuf
الريحان|Basilic
الطماطم|Tomate
السلطة|Salade
الفطر|Champignons
البصل|Oignon
، |,~`.split("\n").map(l=>l.split("|").map(x=>x.replace(/~/g," "))));
const TK=Object.keys(TRD).sort((a,b)=>b.length-a.length),trs=x=>{for(const k of TK)if(x.includes(k))x=x.split(k).join(TRD[k]);return x};
function tr(root){const sk=!!$("sh").querySelector("#aw,#iN"),w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const p=n.parentElement;if(!p||p.closest("[data-nt],script,style,textarea")||(sk&&p.closest("#sh")))continue;if(n._o===undefined)n._o=n.nodeValue;const v=lang==="fr"?trs(n._o):n._o;if(n.nodeValue!==v)n.nodeValue=v}}
function renderContact(){const u=x=>/^https?:/i.test(x)?x:"https://"+x,a=(h,t)=>`<a class="chip" style="text-decoration:none;color:inherit" ${h.startsWith("tel:")?"":'target="_blank" rel="noopener" '}href="${esc(h)}">${t}</a>`,so=CONFIG.social||{},p=CONFIG.phone||"";let h=a("tel:"+p.replace(/[^\d+]/g,""),"📞 "+esc(p));

if(CONFIG.map)h+=a(u(CONFIG.map),"📍 "+esc((lang==="fr"&&CONFIG.addrF?CONFIG.addrF:CONFIG.addr)||"الموقع على الخريطة"));else if(CONFIG.addr)h+=`<span class="chip">📍 ${esc(lang==="fr"&&CONFIG.addrF?CONFIG.addrF:CONFIG.addr)}</span>`;
{const ic=(l,k,sv)=>l?`<a class="ico" aria-label="${k}" target="_blank" rel="noopener" href="${esc(u(l))}"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">${sv}</svg></a>`:"",x=ic(so.fb,"Facebook",'<path d="M24 12.07C24 5.44 18.63.07 12 .07S0 5.44 0 12.07c0 5.99 4.39 10.95 10.13 11.85v-8.39H7.08v-3.47h3.05V9.43c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.23 2.69.23v2.95h-1.52c-1.49 0-1.96.93-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.39C19.61 23.03 24 18.06 24 12.07z"/>')+ic(so.ig,"Instagram",'<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.2" cy="6.8" r="1.2"/>')+ic(so.tt,"TikTok",'<path d="M19.6 6.8a5 5 0 0 1-3.1-1.1 5 5 0 0 1-1.8-3.2h-3.4v13.4a2.9 2.9 0 1 1-2-2.8V9.6a6.3 6.3 0 1 0 5.4 6.2V9.3a8.3 8.3 0 0 0 4.9 1.6z"/>');if(x)h+=`<span class="soc">${x}</span>`}$("contact").innerHTML=h;$("sc").innerHTML=(h.match(/<span class="soc">[\s\S]*<\/span>/)||[""])[0];{const fr=lang==="fr",ad=fr&&CONFIG.addrF?CONFIG.addrF:CONFIG.addr,hr=fr&&CONFIG.hoursF?CONFIG.hoursF:CONFIG.hours,cy=fr&&CONFIG.cityF?CONFIG.cityF:CONFIG.city;$("fi").innerHTML=`${schedHTML(fr)||`<div>🕒 ${esc(hr)}</div>`}`;$("fnm").textContent=fr&&CONFIG.nameF?CONFIG.nameF:CONFIG.name;$("fab2").textContent=(fr?CONFIG.aboutF:CONFIG.about)||"";{const dv=CONFIG.dev;$("dev").innerHTML=dv?(fr?"Développé par ":"تطوير: ")+(CONFIG.devUrl?`<a href="${esc(/^https?:/i.test(CONFIG.devUrl)?CONFIG.devUrl:"https://"+CONFIG.devUrl)}" target="_blank" rel="noopener" style="color:inherit">${esc(dv)}</a>`:esc(dv)):""}$("cpy").textContent=(fr?CONFIG.copyF:CONFIG.copy)||"© "+(fr&&CONFIG.nameF?CONFIG.nameF:CONFIG.name)}}
function applyTheme(){const t=Object.assign({red:"#a4161a",bg:"#0d0d0d",card:"#1a1a1a",txt:"#f5f5f5",font:"Cairo"},CONFIG.theme),r=document.documentElement.style;r.setProperty("--red",t.red);r.setProperty("--red2","color-mix(in srgb,"+t.red+" 80%,#fff)");r.setProperty("--bg",t.bg);r.setProperty("--card",t.card);r.setProperty("--txt",t.txt);let l=$("fl");if(!l){l=document.createElement("link");l.id="fl";l.rel="stylesheet";document.head.appendChild(l)}l.href="https://fonts.googleapis.com/css2?family="+t.font.replace(/ /g,"+")+":wght@400;600;800&family=Cairo:wght@400;600;800&display=swap";document.body.style.fontFamily=`"${t.font}",Cairo,Tahoma,sans-serif`}
function applyLang(){const f=lang==="fr",d=document.documentElement;d.lang=f?"fr":"ar";d.dir=f?"ltr":"rtl";$("lb").textContent=f?"عربي":"FR";$("sl").innerHTML=CONFIG.logo?`<img src="${esc(CONFIG.logo)}" alt="" style="max-height:230px;max-width:88%">`:esc(lang==="fr"&&CONFIG.nameF?CONFIG.nameF:CONFIG.name);$("hl").innerHTML=CONFIG.logo?`<img src="${esc(CONFIG.logo)}" alt="">`:`<div class="logo" style="font-size:34px">${esc(lang==="fr"&&CONFIG.nameF?CONFIG.nameF:CONFIG.name)}</div>`;$("q").placeholder=lang==="fr"?"Rechercher un plat…":"ابحث عن وجبة…";document.title=(lang==="fr"&&CONFIG.tabTitleF?CONFIG.tabTitleF:CONFIG.tabTitle)||CONFIG.name;{const cs=esc(CONFIG.copyF||"© "+(CONFIG.nameF||CONFIG.name)),dv=CONFIG.dev?(CONFIG.devUrl?`<a href="${esc(/^https?:/i.test(CONFIG.devUrl)?CONFIG.devUrl:"https://"+CONFIG.devUrl)}" target="_blank" rel="noopener" style="color:inherit">${esc(CONFIG.dev)}</a>`:esc(CONFIG.dev)):"";$("scp").innerHTML=cs+(dv?`<br>Développé par ${dv}`:"")}$("hbg").style.backgroundImage=CONFIG.heroBg?`linear-gradient(180deg,#000a 0%,#000c 55%,var(--bg) 100%),url("${CONFIG.heroBg}")`:"none";$("ti").innerHTML=CONFIG.tagImg?`<img src="${esc(CONFIG.tagImg)}" alt="">`:"";$("bgimg").style.backgroundImage=CONFIG.menuBg?`url("${CONFIG.menuBg}")`:"";{const nn=CONFIG.name.replace(" – "," "),nf=CONFIG.nameF||nn;$("tg").textContent=lang==="fr"?(CONFIG.taglineF||"Tous vos plats préférés au même endroit"):(CONFIG.tagline||"جميع أطباقك المفضلة في مكان واحد");$("sw1").textContent=CONFIG.welcome||"مرحبًا بكم في "+nn;$("sw2").textContent=CONFIG.welcomeF||"Bienvenue chez "+nf;$("sbg").style.backgroundImage=CONFIG.cover?`url("${CONFIG.cover}")`:""}ANIM=1;closeS();paint()}
function setLang(){lang=lang==="fr"?"ar":"fr";LS.s("antica_lang",lang);applyLang()}
function pick(l){lang=l;LS.s("antica_lang",l);try{sessionStorage.setItem("antica_s","1")}catch(e){}$("splash").classList.add("out");document.body.classList.add("enter");setTimeout(()=>{$("splash").style.display="none";document.body.classList.remove("enter")},900);applyLang()}
try{if(sessionStorage.getItem("antica_s"))$("splash").style.display="none"}catch(e){}
const ol=o=>lang==="fr"&&o.f?o.f:o.n,RM=it=>(it.rm||[]).map(r=>typeof r==="string"?{n:r}:r),rl=(it,n)=>{const o=RM(it).find(x=>x.n===n);return o?ol(o):n};
const zl=z=>lang==="fr"&&z.f?z.f:z.n;
function zoomImg(e,id){e.stopPropagation();const it=item(id);if(!it||!it.img)return;const d=document.createElement("div");d.className="zoom";d.innerHTML=`<img src="${esc(it.img)}" alt=""><b>${esc(nm(it))}</b><p>${esc(dd(it))}</p><button class="x zx">✕</button>`;d.onclick=()=>d.remove();document.body.appendChild(d)}
const chl=(it,n,k)=>{const o=(((it[k||"ch"])||{}).o||[]).find(x=>x.n===n);return o?ol(o):n},chp=(o,sz)=>o.p&&typeof o.p==="object"?(o.p[sz]||0):(o.p||0);
let _y=scrollY;addEventListener("scroll",()=>{const hb=document.getElementById("hbg");if(hb)hb.style.opacity=Math.max(0,1-scrollY/360);const y=scrollY,h=document.getElementById("hl");document.body.style.setProperty("--dy",(y>_y?28:-28)+"px");_y=y;if(h){h.style.transform=`translateY(${Math.min(y,300)*.25}px)`;h.style.opacity=Math.max(0,1-y/380)}},{passive:true});
const IO=typeof IntersectionObserver!=="undefined"?new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle("in",e.isIntersecting)),{threshold:.06}):null;
function reveal(){document.querySelectorAll("#list .card").forEach(c=>{c.classList.add("rv");const r=c.getBoundingClientRect();if(!IO||(r.top<innerHeight&&r.bottom>0))c.classList.add("in");IO&&IO.observe(c)})}
/* ===== تتبّع الطلب (خدمة اختيارية) ===== */
const TKEY="antica_track";let tkTimer=null;
const tkGet=()=>{try{const o=JSON.parse(localStorage.getItem(TKEY)||"null");return o&&o.t&&Date.now()-o.ts<864e5?o:null}catch(e){return null}};
const tkSet=o=>{try{localStorage.setItem(TKEY,JSON.stringify({...o,ts:o.ts||Date.now()}))}catch(e){}};
const TSTEPS={delivery:["new","confirmed","ready","out_for_delivery","completed"],pickup:["new","confirmed","ready","completed"],dine_in:["new","confirmed","ready","completed"],reservation:["new","confirmed","completed"]};
function tkLbl(s,fr){return({new:["تم استلام طلبك","Commande reçue"],confirmed:["تم تأكيد طلبك","Commande confirmée"],ready:["طلبك جاهز","Commande prête"],out_for_delivery:["طلبك في الطريق إليك","En route vers vous"],completed:["تم إنجاز الطلب","Terminée"],cancelled:["تم إلغاء الطلب","Commande annulée"]}[s]||["",""])[fr?1:0]}
function tkMsg(s,t,fr){const m={new:["نراجع طلبك الآن.","Nous examinons votre commande."],confirmed:["بدأنا في تجهيز طلبك.","Nous préparons votre commande."],ready:[t==="delivery"?"طلبك جاهز وبانتظار عامل التوصيل.":"طلبك جاهز.",t==="delivery"?"Prête, en attente du livreur.":"Votre commande est prête."],out_for_delivery:["احتفظ بهاتفك قريبًا منك للرد على المكالمة.","Gardez votre téléphone près de vous pour répondre à l’appel."],completed:["شكرًا لثقتك بنا!","Merci de votre confiance !"]}[s];return m?m[fr?1:0]:""}
function tkHtml(d){const fr=lang==="fr",L=(x,y)=>fr?y:x,steps=TSTEPS[d.order_type]||TSTEPS.pickup,cx=d.status==="cancelled",i=steps.indexOf(d.status);
 return `<div class="tk"><div class="sh"><h3>📍 ${L("تتبّع طلبك","Suivi de commande")}</h3><button class="x" onclick="closeS()">✕</button></div>
 <div class="tk-no">${L("الرقم المرجعي","N° de référence")} <b dir="ltr">${esc(d.order_number)}</b></div>
 ${cx?`<div class="tk-cx">❌ ${tkLbl("cancelled",fr)}</div>`:`<ol class="tk-l">${steps.map((s,k)=>`<li class="${k<i?"done":k===i?"now":""}"><span class="dot">${k<i?"✓":""}</span><div><b>${tkLbl(s,fr)}</b>${k===i?`<small>${tkMsg(s,d.order_type,fr)}</small>`:""}</div></li>`).join("")}</ol>`}
 ${d.total>0?`<div class="tot"><div class="g"><span>${L("الإجمالي","Total")}</span><span>${fmt(d.total)}${d.delivery_fee_pending?L(" + التوصيل"," + livraison"):""}</span></div></div>`:""}
 <button class="btn sec" style="width:100%;margin-top:12px" onclick="tkCopy(this)">🔗 ${L("نسخ رابط التتبع","Copier le lien de suivi")}</button></div>`}
async function openTrack(){const o=tkGet();if(!o||!CONFIG.tracking)return;
 const draw=async()=>{let r;try{r=await sb.rpc("track_order",{token:o.t})}catch(e){return}
  const d=r&&r.data;if(!d||d.enabled===false||d.found===false){if(d&&d.found===false){try{localStorage.removeItem(TKEY)}catch(e){}}openS(`<div class="sh"><h3>📍 ${lang==="fr"?"Suivi de commande":"تتبّع طلبك"}</h3><button class="x" onclick="closeS()">✕</button></div><p style="text-align:center">${lang==="fr"?"Commande introuvable ou service désactivé.":"لم يتم العثور على الطلب أو أن الخدمة متوقفة."}</p>`);clearInterval(tkTimer);return}
  openS(tkHtml(d));if(d.status==="completed"||d.status==="cancelled"){clearInterval(tkTimer);tkSet({...o,done:1})}};
 await draw();clearInterval(tkTimer);tkTimer=setInterval(()=>{if($("ov").classList.contains("on")&&$("sh").querySelector(".tk"))draw();else clearInterval(tkTimer)},8000)}
async function tkCopy(b){const o=tkGet();if(!o)return;const u=location.origin+location.pathname+"?track="+o.t;try{await navigator.clipboard.writeText(u);b.textContent="✓ "+(lang==="fr"?"Lien copié":"تم النسخ")}catch(e){prompt(lang==="fr"?"Copiez ce lien":"انسخ الرابط",u)}}
function tkPill(){let p=$("tkpill");const o=tkGet(),on=CONFIG.tracking&&o&&!o.done;if(!on){p&&p.remove();return}if(!p){p=document.createElement("button");p.id="tkpill";p.className="tkpill";p.onclick=openTrack;document.body.appendChild(p)}p.textContent="📍 "+(lang==="fr"?"Suivre ma commande":"تتبّع طلبك")}
function tkInit(){if(!CONFIG.tracking){tkPill();return}const q=new URLSearchParams(location.search).get("track");
 if(q&&/^[0-9a-f-]{36}$/i.test(q)){tkSet({t:q,n:"",ts:Date.now()});history.replaceState(null,"",location.pathname);tkPill();setTimeout(openTrack,400);return}tkPill()}
/* السحب يمينًا/يسارًا لتغيير الفئة مع حركة انزلاق */
(function(){const el=$("list"),rmq=matchMedia("(prefers-reduced-motion:reduce)");let x0=0,y0=0,on=false,hz=false,busy=false;
 const reset=()=>{el.style.transition="transform .3s cubic-bezier(.2,1.2,.4,1),opacity .2s";el.style.transform="";el.style.opacity=""};
 const can=dx=>{const i=CONFIG.cats.findIndex(c=>c.id===cat),rtl=document.documentElement.dir==="rtl",n=i+((dx>0)===rtl?1:-1);return i>=0&&n>=0&&n<CONFIG.cats.length?n:-1};
 el.addEventListener("touchstart",e=>{if(busy||e.touches.length!==1||QS){on=false;return}x0=e.touches[0].clientX;y0=e.touches[0].clientY;on=true;hz=false;el.style.transition="none"},{passive:true});
 el.addEventListener("touchmove",e=>{if(!on||rmq.matches)return;const dx=e.touches[0].clientX-x0,dy=e.touches[0].clientY-y0;
  if(!hz){if(Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)*1.4)hz=true;else return}
  el.style.transform=`translateX(${dx*(can(dx)<0?.25:.6)}px)`;el.style.opacity=String(1-Math.min(Math.abs(dx)/500,.35))},{passive:true});
 el.addEventListener("touchcancel",()=>{on=false;if(hz)reset()},{passive:true});
 el.addEventListener("touchend",e=>{if(!on)return;on=false;const t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0,n=can(dx);
  if(QS||Math.abs(dx)<70||Math.abs(dx)<Math.abs(dy)*1.6||n<0){if(hz)reset();return}
  const go=()=>{cat=CONFIG.cats[n].id;ANIM=0;paint();setTimeout(()=>{const c=document.querySelector("#cats .chip.on");c&&c.scrollIntoView({inline:"center",block:"nearest",behavior:"smooth"})},30)};
  if(rmq.matches){go();return}
  busy=true;const s=dx>0?1:-1;el.style.transition="transform .16s ease-in,opacity .16s";el.style.transform=`translateX(${s*45}%)`;el.style.opacity="0";
  setTimeout(()=>{go();el.style.transition="none";el.style.transform=`translateX(${-s*45}%)`;el.style.opacity="0";void el.offsetWidth;
   el.style.transition="transform .3s cubic-bezier(.2,.9,.3,1),opacity .25s";el.style.transform="";el.style.opacity="";setTimeout(()=>{busy=false;el.style.transition=""},320)},170)},{passive:true})})();
boot();
