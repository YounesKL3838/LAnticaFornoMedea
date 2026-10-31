const $=id=>document.getElementById(id),E=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const FR=localStorage.getItem("drv_lang")==="fr",L=(a,b)=>FR?b:a,KEY="antica_driver",fmt=n=>new Intl.NumberFormat("fr-DZ").format(n)+(FR?" DA":" دج");
let me=null,tab="new",orders=[],seen=null,timer=null,lim=1,act=0,duty=true,recv=true,owed=0,owedN=0,offline=false;
try{me=JSON.parse(localStorage.getItem(KEY)||"null")}catch(e){}
document.documentElement.lang=FR?"fr":"ar";document.documentElement.dir=FR?"ltr":"rtl";document.title=L("عمال التوصيل","Livreurs");
$("h_t").textContent="🛵 "+L("عامل التوصيل","Livreur");$("l_n").textContent=L("الاسم (عربي أو فرنسي)","Nom (arabe ou français)");$("l_k").textContent=L("الرقم السري","Code secret");$("lg").textContent=L("دخول","Se connecter");
$("lo").textContent=L("خروج","Sortir");$("tn").textContent="🆕 "+L("جديدة","Nouvelles");$("tm").textContent="📦 "+L("طلباتي","Mes commandes");$("sb").textContent=L("التوصيل","Livraison");
document.querySelectorAll(".lang").forEach(b=>{b.textContent=FR?"العربية":"Français";b.onclick=()=>{localStorage.setItem("drv_lang",FR?"ar":"fr");location.reload()}});
const nm=(o,k)=>FR&&o[k+"_fr"]?o[k+"_fr"]:o[k];
async function call(fn,args){const r=await sb.rpc(fn,{p_name:me.n,p_pin:me.k,...(args||{})});if(r.error)throw r.error;return r.data}
function beep(){try{const c=new AudioContext(),o=c.createOscillator();o.connect(c.destination);o.frequency.value=880;o.start();setTimeout(()=>{o.stop();c.close()},400)}catch(e){}try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}}
function notify(m){$("toast").textContent=m;$("toast").hidden=false;beep();setTimeout(()=>$("toast").hidden=true,8000)}
$("lf").onsubmit=async ev=>{ev.preventDefault();$("lm").textContent="";const t={n:$("dn").value.trim(),k:$("dk").value};me=t;
 try{const r=await call("driver_login");if(!r||!r.ok){me=null;$("lm").textContent=L("الاسم أو الرقم السري غير صحيح (أو تم إيقاف المحاولات مؤقتًا)","Nom ou code secret incorrect (ou tentatives suspendues)");return}
  me={n:t.n,k:t.k,d:FR&&r.name_fr?r.name_fr:r.name};localStorage.setItem(KEY,JSON.stringify(me));enter()}
 catch(x){me=null;$("lm").textContent=L("تعذّر الاتصال. أعد المحاولة.","Connexion impossible. Réessayez.")}};
$("lo").onclick=()=>{localStorage.removeItem(KEY);clearInterval(timer);location.reload()};
function enter(){$("login").hidden=true;$("app").hidden=false;render();refresh();clearInterval(timer);timer=setInterval(refresh,3000)}
document.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{tab=b.dataset.t;document.querySelectorAll("[data-t]").forEach(x=>x.classList.toggle("on",x===b));render()});
async function refresh(){let d;try{d=await call("driver_orders");offline=false}catch(e){offline=true;render();return}
 if(!d||!d.ok){localStorage.removeItem(KEY);clearInterval(timer);alert(L("انتهت الجلسة أو تغيّر الرقم السري. سجّل الدخول من جديد.","Session expirée ou code secret modifié. Reconnectez-vous."));location.reload();return}
 orders=d.orders||[];lim=d.max||1;act=d.active||0;duty=d.on_duty!==false;recv=d.receive!==false;owed=d.owed||0;owedN=d.owed_n||0;
 const fresh=orders.filter(o=>!o.mine&&seen&&!seen.has(o.id));
 if(fresh.length)notify(L("🔔 طلب توصيل جديد: ","🔔 Nouvelle livraison : ")+fresh.map(o=>o.order_number).join(", "));
 seen=new Set(orders.map(o=>o.id));render()}
const ST=()=>({confirmed:L("مؤكد","Confirmée"),ready:L("جاهز","Prête"),out_for_delivery:L("في الطريق","En route"),completed:L("تم التسليم","Livrée"),new:L("جديد","Nouvelle")});
function ago(ts){const m=Math.max(0,Math.round((Date.now()-new Date(ts))/6e4));return m<1?L("الآن","à l’instant"):m<60?L("منذ "+m+" د","il y a "+m+" min"):L("منذ "+Math.floor(m/60)+" س","il y a "+Math.floor(m/60)+" h")}
const itemsHtml=o=>(o.items||[]).length?`<ul class="il">${o.items.map(l=>{const sub=[...(l.choices||[]).map(c=>E(nm(c,"name"))),(l.extras||[]).length?"➕ "+l.extras.map(e=>E(nm(e,"name"))).join(", "):"",(l.removed||[]).length?"🚫 "+l.removed.map(e=>E(nm(e,"name"))).join(", "):"",l.note?"📝 "+E(l.note):""].filter(Boolean).join(" • ");
 return `<li><span class="q">${l.qty}×</span><div><b>${E(nm(l,"name"))}${l.size?` <em>${E(nm(l,"size"))}</em>`:""}</b>${sub?`<small>${sub}</small>`:""}</div></li>`}).join("")}</ul>`:"";
function card(o){const S=ST(),flow=["confirmed","out_for_delivery","completed"],i=o.status==="ready"?0:flow.indexOf(o.status),full=act>=lim;
 const steps=o.mine?`<div class="steps">${[L("مؤكد","Confirmée"),L("في الطريق","En route"),L("تم التسليم","Livrée")].map((t,k)=>`<span class="s ${o.status==="completed"||k<i?"done":k===i?"now":""}">${t}</span>`).join("")}</div>`:"";
 const place=(FR&&o.zone_fr?o.zone_fr:o.zone||"")+(o.address?" — "+o.address:"");
 const info=[place.trim()?`<div>📍 ${E(place)}</div>`:"",o.phone?`<div><a class="tel" href="tel:${E(o.phone)}" dir="ltr">📞 ${E(o.phone)}</a></div>`:o.mine&&o.status!=="completed"?`<div class="lock">🔒 ${L("يظهر رقم الزبون بعد الضغط على «خرجت للتوصيل»","Le numéro du client s’affiche après « Je pars livrer »")}</div>`:"",o.notes?`<div>📝 ${E(o.notes)}</div>`:""].join("");
 const act2=!o.mine?`<button class="act" data-a="take" data-i="${o.id}" ${full?"disabled":""}>✅ ${L("قبول وتأكيد الطلب","Accepter et confirmer")}</button>`:o.status==="out_for_delivery"?`<button class="act" data-a="done" data-i="${o.id}">✔️ ${L("تم التسليم","Livrée")}</button>`:o.status==="completed"?"":`<button class="act out" data-a="out" data-i="${o.id}">🛵 ${L("خرجت للتوصيل","Je pars livrer")}</button>`;
 const badges=`${o.targeted&&!o.mine?`<span class="pl2 o">${L("موجّه إليك","Pour vous")}</span>`:""}${o.source==="manual"?`<span class="pl2 g">${L("طلب خارجي","Externe")}</span>`:""}`;
 return `<div class="oc2 st-${o.status} ${o.mine?"":"avail"}"><div class="oc2-h"><div><b dir="ltr">${E(o.order_number)}</b><small>${ago(o.created_at)}</small></div><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end">${badges}<span class="tag t-${o.status}">${S[o.status]||o.status}</span></div></div>
 ${steps}<div class="oc2-i">${info}</div>${itemsHtml(o)}
 <div class="mny"><div><b>${fmt(o.total)}${o.delivery_fee_pending?"+":""}</b><span>${L("يدفع الزبون","Le client paie")}</span></div><div class="hl"><b>${fmt(o.subtotal||0)}</b><span>${L("للمطعم","Au restaurant")}</span></div><div><b>${o.delivery_fee?fmt(o.delivery_fee):"—"}</b><span>${L("أجرتك","Votre frais")}</span></div></div>
 ${act2?act2:""}</div>`}
function render(){if(!me)return;const av=orders.filter(o=>!o.mine),mi=orders.filter(o=>o.mine),Ls=tab==="new"?av:mi,name=me.d||me.n,prog=mi.filter(o=>o.status!=="completed").length,done=mi.filter(o=>o.status==="completed").length;
 const nb=$("nb"),nb2=$("nb2");nb.textContent=av.length;nb.hidden=!av.length;nb2.textContent=prog;nb2.hidden=!prog;
 $("hero").innerHTML=`<div class="hero-t"><span class="dav">${E([...name][0]||"?")}</span><div><small>${L("مرحبًا","Bonjour")} 👋</small><b>${E(name)}</b></div><button id="dt" class="dsw ${duty?"on":""}"><span class="knob"></span>${duty?L("في الخدمة","En service"):L("متوقف","En pause")}</button></div>
  <div class="hs"><div><b>${prog}</b><span>${L("جارية","En cours")}</span></div><div><b>${done}</b><span>${L("سلّمتها","Livrées")}</span></div><div class="${owed>0?"neg":""}"><b>${fmt(owed)}</b><span>${L("المطلوب منك","À remettre")}${owed>0?" ("+owedN+")":""}</span></div></div>`;
 let h="";if(offline)h+=`<div class="bn off">📡 ${L("لا يوجد اتصال بالإنترنت. سنعيد المحاولة تلقائيًا.","Pas de connexion. Nouvelle tentative automatique.")}</div>`;
 if(!duty)h+=`<div class="bn w">⚪ ${L("أنت متوقف عن العمل: لن تصلك طلبات جديدة حتى تعود إلى الخدمة.","Vous êtes hors service : aucune nouvelle commande tant que vous ne reprenez pas.")}</div>`;
 if(tab==="new"&&act>=lim&&av.length)h+=`<div class="bn o">${L("أنهِ طلبك الحالي أولًا للحصول على طلب جديد (الحد المسموح: "+lim+")","Terminez d’abord votre commande en cours (limite : "+lim+")")}</div>`;
 $("list").innerHTML=h+(Ls.map(card).join("")||`<div class="empty"><span class="big">${tab==="new"?"🛵":"📦"}</span>${tab==="new"?L("لا توجد طلبات جديدة الآن","Aucune nouvelle commande"):L("لا توجد طلبات لديك","Aucune commande")}</div>`)}
$("hero").onclick=async e=>{if(!e.target.closest("#dt"))return;const on=!duty;duty=on;render();try{const r=await call("driver_set_duty",{p_on:on});if(!r||!r.ok)throw new Error("x")}catch(x){duty=!on;alert(L("تعذّر تغيير الحالة. أعد المحاولة.","Impossible de changer le statut. Réessayez."))}refresh()};
$("list").onclick=async e=>{const b=e.target.closest("[data-a]");if(!b)return;if(b.dataset.a==="out"&&!confirm(L("هل أنت متأكد أن الطلبية جاهزة؟","Êtes-vous sûr que la commande est prête ?")))return;b.disabled=true;const id=b.dataset.i;
 try{const r=b.dataset.a==="take"?await call("driver_confirm",{p_order:id}):await call("driver_set_status",{p_order:id,p_status:b.dataset.a==="out"?"out_for_delivery":"completed"});
  if(!r||!r.ok){alert(r&&r.reason==="taken"?L("سبقك عامل آخر إلى هذا الطلب.","Un autre livreur a pris cette commande."):r&&r.reason==="blocked"?L("هذا الطلب لم يعد متاحًا.","Cette commande n’est plus disponible."):r&&r.reason==="off_duty"?L("أنت متوقف عن العمل. فعّل زر «في الخدمة» أولًا.","Vous êtes hors service. Activez « En service » d’abord."):r&&r.reason==="busy"?L("أنهِ طلبك الحالي أولًا. لا يُسمح لك بأكثر من هذا العدد من الطلبات معًا.","Terminez d’abord votre commande en cours."):L("تعذّر تنفيذ العملية. أعد المحاولة.","Opération impossible. Réessayez."))}
  else if(b.dataset.a==="take"){tab="mine";document.querySelectorAll("[data-t]").forEach(x=>x.classList.toggle("on",x.dataset.t==="mine"))}}
 catch(x){alert(L("تعذّر الاتصال. أعد المحاولة.","Connexion impossible. Réessayez."))}refresh()};
if(window.sb&&me&&me.n&&me.k)enter();
