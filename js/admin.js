const $=id=>document.getElementById(id),E=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const LG=localStorage.getItem("adm_lang")==="fr"?"fr":"ar";
const N=(a,f)=>LG==="fr"&&f?f:a;let ZM={};
const D={"مخفي":"Masqué","لم يُحفظ التغيير. تأكد من صلاحياتك وأعد المحاولة.":"La modification n’a pas été enregistrée. Vérifiez vos droits et réessayez.","توصيل":"Livraison","إعدادات المالك":"Paramètres du propriétaire","عنوان نافذة المتصفح (عربي)":"Titre de l’onglet (arabe)","عنوان نافذة المتصفح (Français)":"Titre de l’onglet (français)","اسم المطعم (عربي)":"Nom du restaurant (arabe)","اسم المطعم (Français)":"Nom du restaurant (français)","حقوق النشر (عربي)":"Copyright (arabe)","حقوق النشر (Français)":"Copyright (français)","اسم المطوّر":"Nom du développeur","رابط المطوّر":"Lien du développeur","الألوان":"Couleurs","اللون الأساسي":"Couleur principale","الخلفية":"Arrière-plan","البطاقات":"Cartes","النص":"Texte","الخط (اسم خط من Google Fonts)":"Police (nom Google Fonts)","حفظ إعدادات المالك":"Enregistrer les paramètres du propriétaire","غير مسموح لك بتعديل هذه الإعدادات":"Vous n’êtes pas autorisé à modifier ces paramètres","اسم الخط غير صالح":"Nom de police invalide","⚙️ تعديل الفئة":"⚙️ Modifier la catégorie","حذف الفئة":"Supprimer la catégorie","+ تصنيف جديد":"+ Nouvelle catégorie","مؤكد":"Confirmée","✅ تأكيد الطلب":"✅ Confirmer la commande","كل الأطباق لديها صور":"Tous les plats ont déjà une image","تم تعيين الصورة":"Image appliquée","🖼️ صورة للأطباق بلا صور":"🖼️ Image pour les plats sans image","حجز":"Réservation","+ إضافة وجبة":"+ Ajouter un plat","لا توجد وجبات":"Aucun plat","طلبات اليوم":"Commandes du jour","إيرادات اليوم":"Recettes du jour","تسجيل الدخول": "Connexion", "البريد الإلكتروني": "E-mail", "كلمة المرور": "Mot de passe", "دخول": "Se connecter", "بيانات الدخول غير صحيحة": "Identifiants incorrects", "هذا الحساب غير مصرّح له بالدخول": "Ce compte n’est pas autorisé", "الطلبات": "Commandes", "المنتجات": "Produits", "التصنيفات": "Catégories", "التوصيل": "Livraison", "الإعدادات": "Paramètres", "خروج": "Déconnexion", "كل الحالات": "Tous les statuts", "تحديث": "Actualiser", "جديد": "Nouveau", "قيد التحضير": "En préparation", "جاهز": "Prêt", "خرج للتوصيل": "En livraison", "مكتمل": "Terminée", "ملغى": "Annulée", "استلام": "À emporter", "داخل المطعم": "Sur place", "لا توجد طلبات.": "Aucune commande.", "طلب جديد": "Nouvelle commande", "+ منتج جديد": "+ Nouveau produit", "تعديل": "Modifier", "إخفاء": "Masquer", "إظهار": "Afficher", "غير متوفر": "Indisponible", "متوفر": "Disponible", "نفد اليوم": "Épuisé aujourd’hui", "إلغاء نفد اليوم": "Annuler « épuisé »", "حذف": "Supprimer", "تعديل منتج": "Modifier le produit", "منتج جديد": "Nouveau produit", "التصنيف": "Catégorie", "الاسم بالعربية *": "Nom en arabe *", "الاسم بالفرنسية": "Nom en français", "الوصف بالعربية": "Description en arabe", "الوصف بالفرنسية": "Description en français", "إيموجي": "Emoji", "السعر دج (إن لم تكن هناك أحجام)": "Prix DA (si pas de tailles)", "صورة (من الجهاز)": "Image (depuis l’appareil)", "علامة «جديد»": "Badge « Nouveau »", "حفظ": "Enregistrer", "إلغاء": "Annuler", "الأحجام (اتركها فارغة إن لم يكن للمنتج أحجام)": "Tailles (laisser vide s’il n’y en a pas)", "الإضافات": "Suppléments", "مكونات يمكن حذفها": "Ingrédients retirables", "خيار إلزامي: النوع (اختياري)": "Choix obligatoire : Type (facultatif)", "خيار إلزامي: الصلصة (اختياري)": "Choix obligatoire : Sauce (facultatif)", "+ حجم": "+ Taille", "+ إضافة": "+ Ajouter", "+ مكوّن": "+ Ingrédient", "+ خيار": "+ Option", "بالعربية": "En arabe", "الحجم بالعربية": "Taille en arabe", "السعر دج": "Prix DA", "دج": "DA", "عنوان الخيار بالعربية": "Titre en arabe", "سعر لكل حجم": "Prix par taille", "عربي": "Arabe", "الترتيب": "Ordre", "ظاهر": "Visible", "فعّال": "Actif", "الرسوم دج (فارغ = يؤكدها المطعم)": "Frais DA (vide = confirmés par le restaurant)", "تم ✓": "OK ✓", "التواصل": "Contact", "الهاتف": "Téléphone", "رابط الخريطة": "Lien de la carte", "رفض الطلبات خارج أوقات العمل": "Refuser les commandes hors horaires", "تفعيل الأكل داخل المطعم": "Activer la consommation sur place", "أرقام الطاولات (مثل 1-17 أو 1-10, 15)": "Numéros de tables (ex. 1-17 ou 1-10, 15)", "الأوقات الأسبوعية": "Horaires hebdomadaires", "مغلق": "Fermé", "الأحد": "Dimanche", "الإثنين": "Lundi", "الثلاثاء": "Mardi", "الأربعاء": "Mercredi", "الخميس": "Jeudi", "الجمعة": "Vendredi", "السبت": "Samedi", "النصوص": "Textes", "العبارة (عربي)": "Slogan (arabe)", "الترحيب (عربي)": "Accueil (arabe)", "أوقات العمل (نص)": "Horaires (texte)", "العنوان (عربي)": "Adresse (arabe)", "نبذة (عربي)": "À propos (arabe)", "الصور": "Images", "الشعار": "Logo", "الغلاف": "Couverture", "خلفية البداية": "Image d’accueil", "حفظ الإعدادات": "Enregistrer les paramètres", "تم الحفظ ✓": "Enregistré ✓", "أدخل أوقات فتح وإغلاق صحيحة لكل يوم غير مغلق": "Saisissez des horaires valides pour chaque jour ouvert", "أدخل أرقام الطاولات": "Saisissez les numéros de tables", "أدخل اسم المنتج": "Saisissez le nom du produit", "كل حجم يحتاج اسمًا بالعربية وسعرًا": "Chaque taille nécessite un nom arabe et un prix", "الصورة أكبر من 5MB": "Image supérieure à 5 Mo", "ملف الصورة غير صالح": "Fichier image invalide", "تعذّر ضغط الصورة": "Compression de l’image impossible", "حذف هذا العنصر؟": "Supprimer cet élément ?", "الاسم العربي مطلوب": "Le nom arabe est obligatoire", "لا يمكن الحذف: توجد منتجات في هذا التصنيف. انقلها أو احذفها أولًا.": "Suppression impossible : des produits existent dans cette catégorie. Déplacez-les ou supprimez-les d’abord.", "الإدارة": "Administration"},SUB=[["تعيين هذه الصورة لـ","Appliquer cette image à"],["طبق بلا صورة؟","plat(s) sans image ?"],["المجموع الفرعي:", "Sous-total :"], ["• التوصيل:", "• Livraison :"], ["يُحدد لاحقًا", "À déterminer"], ["+ توصيل", "+ livraison"], ["🔔 طلب جديد:", "🔔 Nouvelle commande :"], ["🍽️ طاولة", "🍽️ Table"], ["إضافات:", "Suppléments :"], ["بدون:", "Sans :"], ["ملاحظة:", "Note :"], ["غير مضبوط", "non configuré"], ["تعذّر حفظ الحالة:", "Impossible d’enregistrer le statut :"], ["سعر غير صحيح:", "Prix invalide :"], ["الإضافات:", "Suppléments :"], ["الخيار الإلزامي:", "Choix obligatoire :"], ["المكونات:", "Ingrédients :"], [": الاسم بالعربية مطلوب", ": le nom arabe est obligatoire"], [": أدخل سعرًا لكل حجم", ": saisissez un prix par taille"], ["أدخل العنوان وخيارًا واحدًا على الأقل", "saisissez le titre et au moins une option"], ["لوحة تحكم", "Administration"]].sort((a,b)=>b[0].length-a[0].length);
function T(s){if(LG!=="fr"||!s)return s;const t=s.trim();if(!t)return s;if(D[t])return s.replace(t,D[t]);let r=s;for(const[a,b]of SUB)if(r.includes(a))r=r.split(a).join(b);return r.replace(/(\d)\s*دج/g,"$1 DA").replace(/^الحجم (\d+)$/,"Taille $1").replace(/^حذف «(.+)» نهائيًا؟$/,"Supprimer « $1 » définitivement ?")}
function TA(n){if(n.nodeType===3){const v=T(n.nodeValue);if(v!==n.nodeValue)n.nodeValue=v;return}if(n.nodeType!==1)return;
 for(const a of["placeholder","title"])if(n.hasAttribute&&n.hasAttribute(a)){const v=T(n.getAttribute(a));if(v!==n.getAttribute(a))n.setAttribute(a,v)}
 n.querySelectorAll&&n.querySelectorAll("[placeholder],[title]").forEach(e=>TA(e));const w=document.createTreeWalker(n,4);let x;while(x=w.nextNode())TA(x)}
if(LG==="fr"){document.documentElement.lang="fr";document.documentElement.dir="ltr";document.title=T(document.title);
 const _al=window.alert.bind(window),_co=window.confirm.bind(window);window.alert=m=>_al(T(String(m)));window.confirm=m=>_co(T(String(m)));
 new MutationObserver(ms=>ms.forEach(m=>{if(m.type==="characterData")TA(m.target);else m.addedNodes.forEach(TA)})).observe(document.body,{childList:true,subtree:true,characterData:true});TA(document.body)}
document.querySelectorAll(".lang").forEach(b=>{b.textContent=LG==="fr"?"العربية":"Français";b.onclick=()=>{localStorage.setItem("adm_lang",LG==="fr"?"ar":"fr");location.reload()}});
const ST={new:"جديد",confirmed:"مؤكد",ready:"جاهز",out_for_delivery:"خرج للتوصيل",completed:"مكتمل",cancelled:"ملغى"},TY={delivery:"توصيل",pickup:"استلام",dine_in:"داخل المطعم",reservation:"حجز"};
const fmt=n=>new Intl.NumberFormat("fr-DZ").format(n)+" دج",ok=r=>{if(r.error)throw r.error;return r.data};
let orders=[],seen=null,open=new Set(),cats=[],prods=[],ch=null;
$("fs").innerHTML+=Object.entries(ST).map(([k,v])=>`<option value="${k}">${v}</option>`).join("");
async function isAdmin(){const r=await sb.from("admins").select("user_id").maybeSingle();return !r.error&&!!r.data}
async function start(){if(!window.sb){$("lm").textContent="js/supabase-config.js غير مضبوط";return}
 const {data}=await sb.auth.getSession();if(data.session&&await isAdmin())enter();}
$("tp").onclick=()=>{$("pw").type=$("pw").type==="password"?"text":"password"};
$("lf").onsubmit=async ev=>{ev.preventDefault();$("lm").textContent="";const r=await sb.auth.signInWithPassword({email:$("em").value.trim(),password:$("pw").value});
 if(r.error){$("lm").textContent="بيانات الدخول غير صحيحة";return}
 if(!await isAdmin()){await sb.auth.signOut();$("lm").textContent="هذا الحساب غير مصرّح له بالدخول";return}enter()};
$("lo").onclick=async()=>{await sb.auth.signOut();location.reload()};
function enter(){$("login").hidden=true;$("app").hidden=false;sb.from("delivery_zones").select("name_ar,name_fr").then(z=>{(z.data||[]).forEach(x=>ZM[x.name_ar]=x.name_fr);renderOrders()});loadOrders();
 ch=sb.channel("orders").on("postgres_changes",{event:"*",schema:"public",table:"orders"},()=>loadOrders()).subscribe();setInterval(loadOrders,30000)}
const TABS=["orders","prods","zones","sets","owner"];
document.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{TABS.forEach(t=>$(t).hidden=t!==b.dataset.t);document.querySelectorAll("[data-t]").forEach(x=>x.classList.toggle("on",x===b));const f={prods:loadProds,zones:()=>loadRows("zones"),sets:loadSets}[b.dataset.t];if(f)f()});
function beep(){try{const c=new AudioContext(),o=c.createOscillator();o.connect(c.destination);o.frequency.value=880;o.start();setTimeout(()=>{o.stop();c.close()},350)}catch(e){}}
async function loadOrders(){try{orders=ok(await sb.from("orders").select("*").order("created_at",{ascending:false}).limit(300))}catch(x){console.error(x);return}
 const fresh=orders.filter(o=>o.status==="new"&&seen&&!seen.has(o.id));
 if(fresh.length){$("toast").textContent="🔔 طلب جديد: "+fresh.map(o=>o.order_number).join("، ");$("toast").hidden=false;beep();setTimeout(()=>$("toast").hidden=true,8000)}
 seen=new Set(orders.map(o=>o.id));renderOrders()}
const lineTxt=l=>`${l.qty}× ${E(N(l.name,l.name_fr))}${l.size?" ("+E(N(l.size,l.size_fr))+")":""} — ${fmt(l.line_total)}<small>${[...(l.choices||[]).map(c=>E(N(c.group,c.group_fr))+": "+E(N(c.name,c.name_fr))),(l.extras||[]).length?"إضافات: "+l.extras.map(e=>E(N(e.name,e.name_fr))).join("، "):"",(l.removed||[]).length?"بدون: "+l.removed.map(e=>E(N(e.name,e.name_fr))).join("، "):"",l.note?"ملاحظة: "+E(l.note):""].filter(Boolean).join(" • ")}</small>`;
function renderOrders(){stats();const s=$("fs").value,d=$("fd").value;
 const L=orders.filter(o=>(!s||o.status===s)&&(!d||new Date(o.created_at).toLocaleDateString("sv")===d));
 $("ol").innerHTML=L.map((o,ix)=>`<div class="o st-${o.status} ${o.status==="new"?"new":""} ${shown.has(o.id)?"":"in"}" style="--i:${Math.min(ix,12)}"><div class="row" data-id="${o.id}" style="cursor:pointer"><b dir="ltr">${E(o.order_number)}</b><span class="tag t-${o.status}">${ST[o.status]}</span><span>${TY[o.order_type]}</span><b>${fmt(o.total)}${o.delivery_fee_pending?" + توصيل":""}</b><small>${new Date(o.created_at).toLocaleString("fr-DZ")}</small></div>
 ${open.has(o.id)?`<div class="det"><div>${E(o.customer_name||"—")} ${o.phone?`<a href="tel:${E(o.phone)}" style="color:#ff8087">${E(o.phone)}</a>`:""}</div>${o.zone_name?`<div>📍 ${E(N(o.zone_name,ZM[o.zone_name]))} ${E(o.address||"")}</div>`:""}${o.table_number?`<div>🍽️ طاولة ${E(o.table_number)}</div>`:""}${o.reservation_time?`<div>📅 ${new Date(o.reservation_time).toLocaleString("fr-DZ")}</div>`:""}${o.notes?`<div>📝 ${E(o.notes)}</div>`:""}
 ${o.items.map(l=>`<div style="margin:6px 0">${lineTxt(l)}</div>`).join("")}<div>المجموع الفرعي: ${fmt(o.subtotal)} • التوصيل: ${o.delivery_fee==null?(o.delivery_fee_pending?"يُحدد لاحقًا":"—"):fmt(o.delivery_fee)}</div>
 <div class="row" style="margin-top:8px;justify-content:flex-start">${o.status==="new"?`<button class="b s okb" data-ok="${o.id}">✅ تأكيد الطلب</button>`:""}<select data-st="${o.id}" style="width:auto;margin:0">${Object.entries(ST).map(([k,v])=>`<option value="${k}" ${k===o.status?"selected":""}>${v}</option>`).join("")}</select></div></div>`:""}</div>`).join("")||"<p>لا توجد طلبات.</p>";L.forEach(o=>shown.add(o.id))}
$("ol").onclick=e=>{const ob=e.target.closest("[data-ok]");if(ob){confirmOrder(ob);return}const r=e.target.closest("[data-id]");if(r){open.has(r.dataset.id)?open.delete(r.dataset.id):open.add(r.dataset.id);renderOrders()}};
$("ol").onchange=async e=>{const id=e.target.dataset.st;if(!id)return;const r=await sb.from("orders").update({status:e.target.value}).eq("id",id);if(r.error)alert("تعذّر حفظ الحالة: "+r.error.message);loadOrders()};
$("fs").onchange=$("fd").onchange=renderOrders;$("rf").onclick=loadOrders;
/* ===== المنتجات ===== */
async function loadProds(){try{cats=ok(await sb.from("categories").select("*").order("sort_order"));
 prods=ok(await sb.from("products").select("*,product_sizes(*),product_extras(*),product_removables(*),option_groups(*,group_options(*))").order("sort_order"))}catch(x){alert(x.message);return}
 const td=ymd();
 const rowHtml=p=>`<div class="pr ${p.is_hidden||!p.is_available?"off":""} ${p.sold_out_date===td?"so":""}"><span class="row">${p.image_url?`<img src="${E(p.image_url)}" alt="">`:""}<b>${E(N(p.name_ar,p.name_fr))}</b>${p.sold_out_date===td?'<span class="bd bd-o">نفد اليوم</span>':""}${!p.is_available?'<span class="bd bd-r">غير متوفر</span>':""}${p.is_hidden?'<span class="bd bd-g">مخفي</span>':""}</span>
 <span class="row"><button class="b s" data-a="e" data-i="${p.id}">تعديل</button><button class="b s" data-a="h" data-i="${p.id}">${p.is_hidden?"إظهار":"إخفاء"}</button><button class="b s dis ${!p.is_available?"on":""}" data-a="v" data-i="${p.id}">${p.is_available?"غير متوفر":"متوفر"}</button><button class="b s warn ${p.sold_out_date===td?"on":""}" data-a="s" data-i="${p.id}">${p.sold_out_date===td?"إلغاء نفد اليوم":"نفد اليوم"}</button><button class="b s d" data-a="x" data-i="${p.id}">حذف</button></span></div>`;
 $("pl").innerHTML=cats.map(c=>{const L=prods.filter(p=>p.category_id===c.id);return `<details class="catbox ${c.is_active?"":"off"}" data-c="${c.id}" ${OPEN.has(c.id)?"open":""}><summary><span>${E(c.emoji)} ${E(N(c.name_ar,c.name_fr))}</span><em>${L.length}</em></summary>${catEdit(c)}${L.map(rowHtml).join("")||'<p class="mut">لا توجد وجبات</p>'}<button class="b s" data-a="n" data-c="${c.id}">+ إضافة وجبة</button></details>`}).join("")}
$("pl").onclick=async e=>{const b=e.target.closest("[data-a]");if(!b)return;if(b.dataset.a==="n")return form({category_id:b.dataset.c});const p=prods.find(x=>x.id===b.dataset.i),a=b.dataset.a,td=ymd();let u=null;
 if(a==="e")return form(p);if(a==="h")u={is_hidden:!p.is_hidden};if(a==="v")u={is_available:!p.is_available};if(a==="s")u={sold_out_date:p.sold_out_date===td?null:td};
 if(a==="x"){if(!confirm("حذف «"+p.name_ar+"» نهائيًا؟"))return;const r=await sb.from("products").delete().eq("id",p.id);if(r.error)alert(r.error.message);return loadProds()}
 const r=await sb.from("products").update(u).eq("id",p.id).select("id");if(r.error)alert(r.error.message);else if(!r.data||!r.data.length)alert("لم يُحفظ التغيير. تأكد من صلاحياتك وأعد المحاولة.");loadProds()};
$("np").onclick=()=>form(null);
const srt=a=>[...(a||[])].sort((x,y)=>x.sort_order-y.sort_order);
let FS=null;
const I=(c,v,ph,num)=>`<input class="${c}" placeholder="${ph}" value="${E(v)}"${num?' type="number" min="0"':""}>`;
function prow(cls,r,i){const S=FS.sizes;return `<div class="rw ${cls}">${I("n",r.n,"بالعربية")}${I("f",r.f,"Français")}${I("p",r.p,"السعر دج",1)}${S.length>1?`<label><input type="checkbox" class="per" style="width:auto" ${r.per?"checked":""}> سعر لكل حجم</label>`:""}<button class="b s d" data-del="${cls}:${i}">✕</button>${r.per&&S.length>1?`<div class="pvs">${S.map((s,k)=>`<label>${E(s.n||"الحجم "+(k+1))}${I("pv",r.v[k]??"","دج",1)}</label>`).join("")}</div>`:""}</div>`}
function renderDyn(){const S=FS.sizes;$("dyn").innerHTML=`<h4>الأحجام (اتركها فارغة إن لم يكن للمنتج أحجام)</h4>${S.map((s,i)=>`<div class="rw sz">${I("n",s.n,"الحجم بالعربية")}${I("f",s.f,"Taille en français")}${I("p",s.p,"السعر دج",1)}<button class="b s d" data-del="sz:${i}">✕</button></div>`).join("")}<button class="b s" data-add="sz">+ حجم</button>
<h4>الإضافات</h4>${FS.extras.map((r,i)=>prow("ex",r,i)).join("")}<button class="b s" data-add="ex">+ إضافة</button>
<h4>مكونات يمكن حذفها</h4>${FS.rm.map((r,i)=>`<div class="rw rm">${I("n",r.n,"بالعربية")}${I("f",r.f,"Français")}<button class="b s d" data-del="rm:${i}">✕</button></div>`).join("")}<button class="b s" data-add="rm">+ مكوّن</button>
${[["2","خيار إلزامي: النوع"],["1","خيار إلزامي: الصلصة"]].map(([k,l])=>{const g=FS["g"+k];return `<h4>${l} (اختياري)</h4><div class="rw">${I("gt"+k,g.t,"عنوان الخيار بالعربية")}${I("gf"+k,g.f,"Titre en français")}</div>${g.o.map((r,i)=>prow("go"+k,r,i)).join("")}<button class="b s" data-add="go${k}">+ خيار</button>`}).join("")}`}
function collect(){const D=$("dyn"),q=s=>[...D.querySelectorAll(s)],g=(r,c)=>{const e=r.querySelector("."+c);return e?e.value.trim():""},
 pr=r=>({n:g(r,"n"),f:g(r,"f"),p:g(r,"p"),per:!!(r.querySelector(".per")&&r.querySelector(".per").checked),v:[...r.querySelectorAll(".pv")].map(i=>i.value.trim())});
 FS.sizes=q(".sz").map(r=>({n:g(r,"n"),f:g(r,"f"),p:g(r,"p")}));FS.extras=q(".ex").map(pr);FS.rm=q(".rm").map(r=>({n:g(r,"n"),f:g(r,"f")}));
 for(const k of["1","2"]){const t=D.querySelector(".gt"+k),f=D.querySelector(".gf"+k);FS["g"+k]={t:t?t.value.trim():"",f:f?f.value.trim():"",o:q(".go"+k).map(pr)}}}
$("box").addEventListener("click",e=>{const a=e.target.closest("[data-add]"),d=e.target.closest("[data-del]");if(!FS||(!a&&!d))return;collect();
 const L=k=>k==="sz"?FS.sizes:k==="ex"?FS.extras:k==="rm"?FS.rm:FS["g"+k.slice(2)].o;
 if(a){const k=a.dataset.add;L(k).push(k==="sz"?{n:"",f:"",p:""}:k==="rm"?{n:"",f:""}:{n:"",f:"",p:"",per:false,v:[]})}else{const[k,i]=d.dataset.del.split(":");L(k).splice(+i,1)}renderDyn()});
$("box").addEventListener("change",e=>{if(FS&&e.target.classList&&e.target.classList.contains("per")){collect();renderDyn()}});
function form(p){p=p||{};const sz=srt(p.product_sizes),ids=sz.map(s=>s.id);
 const pv=o=>{const sp=o.size_prices&&Object.keys(o.size_prices).length;return{n:o.name_ar,f:o.name_fr||"",p:sp?"":o.price,per:!!sp,v:sp?ids.map(i=>o.size_prices[i]??0):[]}};
 const gp=slot=>{const g=(p.option_groups||[]).find(x=>x.slot===slot);return g?{t:g.title_ar,f:g.title_fr||"",o:srt(g.group_options).map(pv)}:{t:"",f:"",o:[]}};
 FS={sizes:sz.map(s=>({n:s.name_ar,f:s.name_fr||"",p:s.price})),extras:srt(p.product_extras).map(pv),rm:srt(p.product_removables).map(r=>({n:r.name_ar,f:r.name_fr||""})),g2:gp("ch2"),g1:gp("ch")};
 $("box").innerHTML=`<h3>${p.id?"تعديل منتج":"منتج جديد"}</h3><label>التصنيف</label><select id="fC">${cats.map(c=>`<option value="${c.id}" ${c.id===p.category_id?"selected":""}>${E(N(c.name_ar,c.name_fr))}</option>`).join("")}</select>
 <label>الاسم بالعربية *</label><input id="fN" value="${E(p.name_ar)}"><label>الاسم بالفرنسية</label><input id="fF" value="${E(p.name_fr)}"><label>الوصف بالعربية</label><input id="fD" value="${E(p.desc_ar)}"><label>الوصف بالفرنسية</label><input id="fDF" value="${E(p.desc_fr)}">
 <label>إيموجي</label><input id="fE" value="${E(p.emoji||"🍽️")}"><label>السعر دج (إن لم تكن هناك أحجام)</label><input id="fP" type="number" min="0" value="${p.base_price??""}">
 <div id="dyn"></div><label>صورة (من الجهاز)</label><input id="fI" type="file" accept="image/jpeg,image/png,image/webp"><label><input id="fNew" type="checkbox" style="width:auto" ${p.is_new?"checked":""}> علامة «جديد»</label>
 <p class="err" id="fm"></p><div class="row"><button class="b" id="fs2">حفظ</button><button class="b s" id="fc">إلغاء</button></div>`;
 $("modal").hidden=false;renderDyn();$("fc").onclick=()=>{FS=null;$("modal").hidden=true};$("fs2").onclick=()=>save(p)}
const lines=id=>$(id).value.split("\n").map(l=>l.trim()).filter(Boolean).map(l=>l.split("|").map(x=>x.trim()));
const num=v=>{const n=Number(v);if(!Number.isInteger(n)||n<0)throw new Error("سعر غير صحيح: "+v);return n};
async function save(p){const b=$("fs2");b.disabled=true;$("fm").textContent="";
 try{const name=$("fN").value.trim();if(!name)throw new Error("أدخل اسم المنتج");
  collect();const S=FS.sizes.filter(s=>s.n||s.f||s.p!=="").map(s=>{if(!s.n||s.p==="")throw new Error("كل حجم يحتاج اسمًا بالعربية وسعرًا");return{n:s.n,f:s.f||null,p:num(s.p)}});
  const PX=(r,w)=>{if(!r.n)throw new Error(w+": الاسم بالعربية مطلوب");if(r.per&&S.length>1){if(r.v.length!==S.length||r.v.some(x=>x===""))throw new Error(w+": أدخل سعرًا لكل حجم");return{n:r.n,f:r.f||null,v:r.v.map(num)}}return{n:r.n,f:r.f||null,v:[num(r.p||"0")]}};
  const X=FS.extras.filter(r=>r.n||r.f||r.p!=="").map(r=>PX(r,"الإضافات"));
  const R=FS.rm.filter(r=>r.n||r.f);if(R.some(r=>!r.n))throw new Error("المكونات: الاسم بالعربية مطلوب");
  const G=[["ch2","g2",0],["ch","g1",1]].map(([slot,key,ord])=>{const g=FS[key],O=g.o.filter(r=>r.n||r.f||r.p!=="");if(!g.t&&!O.length)return{slot,del:true};if(!g.t||!O.length)throw new Error("الخيار الإلزامي: أدخل العنوان وخيارًا واحدًا على الأقل");return{slot,ord,t:[g.t,g.f],O:O.map(r=>PX(r,"الخيار الإلزامي"))}});
  let img=p.image_url||null;const f=$("fI").files[0];
  if(f){if(f.size>5e6)throw new Error("الصورة أكبر من 5MB");const path="products/"+Date.now()+"-"+Math.random().toString(36).slice(2,8)+"";const bl=await shrink(f,900),pp=path+(bl.type==="image/png"?".png":".jpg");
   ok(await sb.storage.from("product-images").upload(pp,bl,{contentType:bl.type,cacheControl:"31536000"}));img=sb.storage.from("product-images").getPublicUrl(pp).data.publicUrl}
  const row={category_id:$("fC").value,name_ar:name,name_fr:$("fF").value.trim()||null,desc_ar:$("fD").value.trim()||null,desc_fr:$("fDF").value.trim()||null,emoji:$("fE").value.trim()||"🍽️",is_new:$("fNew").checked,image_url:img,base_price:S.length?null:num($("fP").value||"x")};
  let id=p.id;if(id)ok(await sb.from("products").update(row).eq("id",id));else id=ok(await sb.from("products").insert(row).select("id").single()).id;
  const old=srt(p.product_sizes),sid=[];
  for(let i=0;i<S.length;i++){const r={product_id:id,name_ar:S[i].n,name_fr:S[i].f,price:S[i].p,sort_order:i};
   if(old[i]){ok(await sb.from("product_sizes").update(r).eq("id",old[i].id));sid.push(old[i].id)}else sid.push(ok(await sb.from("product_sizes").insert(r).select("id").single()).id)}
  if(old.length>S.length)ok(await sb.from("product_sizes").delete().in("id",old.slice(S.length).map(s=>s.id)));
  ok(await sb.from("product_extras").delete().eq("product_id",id));
  if(X.length)ok(await sb.from("product_extras").insert(X.map((x,i)=>({product_id:id,name_ar:x.n,name_fr:x.f,price:x.v.length>1?0:x.v[0],size_prices:x.v.length>1?Object.fromEntries(x.v.map((v,j)=>[sid[j],v])):null,sort_order:i}))));
  ok(await sb.from("product_removables").delete().eq("product_id",id));
  if(R.length)ok(await sb.from("product_removables").insert(R.map((a,i)=>({product_id:id,name_ar:a.n,name_fr:a.f||null,sort_order:i}))));
  for(const g of G){const old=(p.option_groups||[]).find(x=>x.slot===g.slot);
   if(g.del){if(old)ok(await sb.from("option_groups").delete().eq("id",old.id));continue}
   const gr={product_id:id,slot:g.slot,title_ar:g.t[0],title_fr:g.t[1]||null,sort_order:g.ord};let gid=old?old.id:null;
   if(gid)ok(await sb.from("option_groups").update(gr).eq("id",gid));else gid=ok(await sb.from("option_groups").insert(gr).select("id").single()).id;
   ok(await sb.from("group_options").delete().eq("group_id",gid));
   ok(await sb.from("group_options").insert(g.O.map((x,i)=>({group_id:gid,name_ar:x.n,name_fr:x.f,price:x.v.length>1?0:x.v[0],size_prices:x.v.length>1?Object.fromEntries(x.v.map((v,k)=>[sid[k],v])):null,sort_order:i}))))}
  $("modal").hidden=true;loadProds()}
 catch(x){$("fm").textContent=x.message||String(x)}finally{b.disabled=false}}

const gTxt=(p,slot,ids)=>{const g=(p.option_groups||[]).find(x=>x.slot===slot);return g?E([g.title_ar+"|"+(g.title_fr||""),...srt(g.group_options).map(o=>[o.name_ar,o.name_fr||"",o.size_prices&&Object.keys(o.size_prices).length?ids.map(i=>o.size_prices[i]||0).join("/"):o.price].join("|"))].join("\n")):""};
/* ===== التصنيفات والمناطق ===== */
const ROW={cats:{t:"categories",f:[["emoji","إيموجي","t"],["name_ar","عربي","t"],["name_fr","Français","t"],["sort_order","الترتيب","n"],["is_active","ظاهر","c"]],blank:{name_ar:"تصنيف جديد",name_fr:"Nouvelle catégorie",emoji:"🍽️"}},
 zones:{t:"delivery_zones",f:[["name_ar","عربي","t"],["name_fr","Français","t"],["fee","الرسوم دج (فارغ = يؤكدها المطعم)","n"],["sort_order","الترتيب","n"],["is_active","فعّال","c"]],blank:{name_ar:"منطقة جديدة",name_fr:"Nouvelle zone",fee:100}}};
async function loadRows(k){const c=ROW[k];let d;try{d=ok(await sb.from(c.t).select("*").order("sort_order"))}catch(x){return alert(x.message)}
 $(k).innerHTML=`<button class="b s" data-add="${k}">+ إضافة</button>`+d.map(r=>`<div class="p zr" data-k="${k}" data-id="${r.id}">${c.f.map(([n,l,t])=>t==="c"?`<label class="chk"><input type="checkbox" data-f="${n}" ${r[n]?"checked":""} style="width:auto"> ${l}</label>`:`<input class="z-${n}" data-f="${n}" ${t==="n"?'type="number" min="0"':""} placeholder="${n==="fee"?"السعر دج":l}" title="${l}" value="${E(r[n])}">`).join("")}<button class="b s" data-sv>حفظ</button><button class="b s d" data-del>✕</button></div>`).join("")}
document.addEventListener("click",async e=>{const a=e.target.closest("[data-add]"),s=e.target.closest("[data-sv]"),d=e.target.closest("[data-del]");
 try{if(a){const k=a.dataset.add;ok(await sb.from(ROW[k].t).insert({...ROW[k].blank,sort_order:999}));return reload(k)}
 const r=(s||d)&&(s||d).closest("[data-k]");if(!r)return;const k=r.dataset.k,c=ROW[k];
 if(d){if(!confirm("حذف هذا العنصر؟"))return;ok(await sb.from(c.t).delete().eq("id",r.dataset.id));return reload(k)}
 const u={};r.querySelectorAll("[data-f]").forEach(i=>{const n=i.dataset.f;u[n]=i.type==="checkbox"?i.checked:i.type==="number"?(i.value===""?null:num(i.value)):i.value.trim()});
 if(!u.name_ar)throw new Error("الاسم العربي مطلوب");if(u.sort_order==null)u.sort_order=0;
 ok(await sb.from(c.t).update(u).eq("id",r.dataset.id));if(k==="cats")return reload(k);s.textContent="تم ✓";setTimeout(()=>s.textContent="حفظ",1500)}
 catch(x){alert(k_err(x))}});
const k_err=x=>/foreign key|violates/i.test(x.message||"")?"لا يمكن الحذف: توجد منتجات في هذا التصنيف. انقلها أو احذفها أولًا.":(x.message||String(x));
/* ===== الإعدادات ===== */
const DAYS=["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],TX=[["tagline","العبارة (عربي)"],["taglineF","Slogan (FR)"],["welcome","الترحيب (عربي)"],["welcomeF","Bienvenue (FR)"],["hours","أوقات العمل (نص)"],["hoursF","Horaires (FR)"],["addr","العنوان (عربي)"],["addrF","Adresse (FR)"],["about","نبذة (عربي)"],["aboutF","À propos (FR)"]];
let SET=null;
async function loadSets(){try{SET=ok(await sb.from("restaurant_settings").select("*").eq("id",1).single())}catch(x){return alert(x.message)}
 const s=SET,c=s.content||{},so=s.social||{},sc=s.schedule||DAYS.map(()=>({open:"11:30",close:"23:30",closed:false}));
 $("sets").innerHTML=`<div class="p"><h3>التواصل</h3><label>الهاتف</label><input id="sP" value="${E(s.phone)}"><label>رابط الخريطة</label><input id="sM" value="${E(s.map_url)}"><label>Facebook</label><input id="sFb" value="${E(so.fb)}"><label>Instagram</label><input id="sIg" value="${E(so.ig)}"><label>TikTok</label><input id="sTt" value="${E(so.tt)}"></div>
 <div class="p"><h3>الطلبات</h3><label><input type="checkbox" id="sEn" style="width:auto" ${s.enforce_hours?"checked":""}> رفض الطلبات خارج أوقات العمل</label><label><input type="checkbox" id="sDn" style="width:auto" ${s.dine_enabled?"checked":""}> تفعيل الأكل داخل المطعم</label><label>أرقام الطاولات (مثل 1-17 أو 1-10, 15)</label><input id="sTb" value="${E(s.tables_list)}"></div>
 <div class="p"><h3>الأوقات الأسبوعية</h3>${DAYS.map((d,i)=>`<div class="row"><span>${d}</span><input type="time" id="sO${i}" value="${E(sc[i].open)}" style="width:auto"><input type="time" id="sC${i}" value="${E(sc[i].close)}" style="width:auto"><label><input type="checkbox" id="sX${i}" style="width:auto" ${sc[i].closed?"checked":""}> مغلق</label></div>`).join("")}</div>
 <div class="p"><h3>النصوص</h3>${TX.map(([k,l])=>`<label>${l}</label>${k.startsWith("about")?`<textarea id="t_${k}">${E(c[k])}</textarea>`:`<input id="t_${k}" value="${E(c[k])}">`}`).join("")}</div>
 
 <p class="err" id="sm"></p><button class="b" id="ss">حفظ الإعدادات</button>`;$("ss").onclick=saveSets}
async function saveSets(){const b=$("ss");b.disabled=true;$("sm").textContent="";
 try{const tm=/^([01]\d|2[0-3]):[0-5]\d$/,sch=DAYS.map((_,i)=>({open:$("sO"+i).value,close:$("sC"+i).value,closed:$("sX"+i).checked}));
  if(sch.some(d=>!d.closed&&(!tm.test(d.open)||!tm.test(d.close))))throw new Error("أدخل أوقات فتح وإغلاق صحيحة لكل يوم غير مغلق");
  const tb=$("sTb").value.trim();if(!tb)throw new Error("أدخل أرقام الطاولات");
  const content={...(SET.content||{})};TX.forEach(([k])=>content[k]=$("t_"+k).value.trim());
  const row={phone:$("sP").value.trim()||null,map_url:$("sM").value.trim()||null,social:{fb:$("sFb").value.trim(),ig:$("sIg").value.trim(),tt:$("sTt").value.trim()},enforce_hours:$("sEn").checked,dine_enabled:$("sDn").checked,tables_list:tb,schedule:sch,content};
  
  ok(await sb.from("restaurant_settings").update(row).eq("id",1));$("sm").style.color="#4cc38a";$("sm").textContent="تم الحفظ ✓";SET=null;setTimeout(loadSets,900)}
 catch(x){$("sm").style.color="";$("sm").textContent=x.message||String(x)}finally{b.disabled=false}}
start();

async function shrink(f,max){const u=URL.createObjectURL(f);try{const im=await new Promise((r,x)=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>x(new Error("ملف الصورة غير صالح"));i.src=u});
 const s=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext("2d").drawImage(im,0,0,c.width,c.height);
 const t=f.type==="image/png"?"image/png":"image/jpeg";return await new Promise((r,x)=>c.toBlob(b=>b?r(b):x(new Error("تعذّر ضغط الصورة")),t,.78))}finally{URL.revokeObjectURL(u)}}
const shown=new Set();
function stats(){const td=new Date().toLocaleDateString("sv"),T=orders.filter(o=>new Date(o.created_at).toLocaleDateString("sv")===td),n=orders.filter(o=>o.status==="new").length,pc=orders.filter(o=>o.status==="confirmed").length,rev=T.filter(o=>o.status!=="cancelled").reduce((s,o)=>s+o.total,0);
 $("stats").innerHTML=[["🔔",n,"جديد"],["✅",pc,"مؤكد"],["📦",T.length,"طلبات اليوم"],["💰",fmt(rev),"إيرادات اليوم"]].map(([i,v,l])=>`<div class="stat"><small>${i}</small><b>${v}</b><span>${l}</span></div>`).join("");
 const nb=$("nb");nb.textContent=n;nb.hidden=!n}
const OPEN=new Set();
document.addEventListener("toggle",e=>{const d=e.target;if(d.classList&&d.classList.contains("catbox"))d.open?OPEN.add(d.dataset.c):OPEN.delete(d.dataset.c)},true);
async function confirmOrder(b){b.disabled=true;const r=await sb.from("orders").update({status:"confirmed"}).eq("id",b.dataset.ok);if(r.error){alert("تعذّر حفظ الحالة: "+r.error.message);b.disabled=false;return}loadOrders()}
$("dimg").onclick=()=>{if(!prods.some(p=>!p.image_url))return alert("كل الأطباق لديها صور");$("dimgf").click()};
$("dimgf").onchange=async e=>{const f=e.target.files[0];e.target.value="";if(!f)return;const n=prods.filter(p=>!p.image_url).length;if(!confirm("تعيين هذه الصورة لـ "+n+" طبق بلا صورة؟"))return;
 try{const bl=await shrink(f,700),path="products/default-"+Date.now()+(bl.type==="image/png"?".png":".jpg");ok(await sb.storage.from("product-images").upload(path,bl,{contentType:bl.type,cacheControl:"31536000"}));
  const url=sb.storage.from("product-images").getPublicUrl(path).data.publicUrl;ok(await sb.from("products").update({image_url:url}).or("image_url.is.null,image_url.eq."));await loadProds();alert("تم تعيين الصورة")}catch(x){alert(x.message||String(x))}};
const reload=k=>k==="cats"?loadProds():loadRows(k);
const catEdit=c=>`<details class="ce"><summary>⚙️ تعديل الفئة</summary><div class="catedit" data-k="cats" data-id="${c.id}"><div class="grid"><input data-f="emoji" placeholder="إيموجي" value="${E(c.emoji)}"><input data-f="sort_order" type="number" min="0" placeholder="الترتيب" value="${E(c.sort_order)}"><input data-f="name_ar" placeholder="عربي" value="${E(c.name_ar)}"><input data-f="name_fr" placeholder="Français" value="${E(c.name_fr)}"></div><label><input type="checkbox" data-f="is_active" style="width:auto" ${c.is_active?"checked":""}> ظاهر</label><div class="row"><button class="b s" data-sv>حفظ</button><button class="b s d" data-del>حذف الفئة</button></div></div></details>`;
/* ===== إعدادات المالك (تفتح بالضغط 5 مرات على الشعار) ===== */
let BR=null;
{let n=0,t=0;const lg=document.querySelector(".brand img");lg&&lg.addEventListener("click",()=>{const now=Date.now();if(now-t>3000)n=0;t=now;if(++n>=5){n=0;openOwner()}})}
async function openOwner(){
 const me=await sb.from("admins").select("is_owner").maybeSingle();if(me.error||!me.data||!me.data.is_owner)return;
 const r=await sb.from("branding").select("*").eq("id",1).maybeSingle();if(r.error){alert(r.error.message);return}
 BR=r.data||{id:1,content:{}};const c=BR.content||{},th=Object.assign({red:"#a4161a",bg:"#0d0d0d",card:"#1a1a1a",txt:"#f5f5f5",font:"Cairo"},c.theme);
 const F=(id,l,v)=>`<label>${l}</label><input id="o_${id}" value="${E(v)}">`,C=(id,l)=>`<label>${l}<input type="color" id="o_${id}" value="${E(th[id])}" style="height:44px;padding:3px"></label>`,
 IM=(id,l,u)=>`<label>${l}</label>${u?`<img src="${E(u)}" alt="" style="height:50px;border-radius:8px;display:block;margin:4px 0">`:""}<input type="file" id="o_${id}" accept="image/jpeg,image/png,image/webp">`;
 TABS.forEach(t=>$(t).hidden=t!=="owner");document.querySelectorAll("[data-t]").forEach(x=>x.classList.remove("on"));
 $("owner").innerHTML=`<div class="p"><h3>🔐 إعدادات المالك</h3>${F("tabTitle","عنوان نافذة المتصفح (عربي)",c.tabTitle)}${F("tabTitleF","عنوان نافذة المتصفح (Français)",c.tabTitleF)}${F("name","اسم المطعم (عربي)",c.name)}${F("nameF","اسم المطعم (Français)",c.nameF)}${F("copy","حقوق النشر (عربي)",c.copy)}${F("copyF","حقوق النشر (Français)",c.copyF)}${F("dev","اسم المطوّر",c.dev)}${F("devUrl","رابط المطوّر",c.devUrl)}</div>
 <div class="p"><h3>الألوان</h3><div class="grid">${C("red","اللون الأساسي")}${C("bg","الخلفية")}${C("card","البطاقات")}${C("txt","النص")}</div>${F("font","الخط (اسم خط من Google Fonts)",th.font)}</div>
 <div class="p"><h3>الصور</h3>${IM("logo","الشعار",BR.logo_url)}${IM("cover","الغلاف",BR.cover_url)}${IM("hero","خلفية البداية",BR.hero_url)}</div>
 <p class="err" id="om"></p><button class="b" id="os">حفظ إعدادات المالك</button>`;
 $("owner").hidden=false;$("os").onclick=saveOwner;scrollTo({top:0,behavior:"smooth"})}
async function saveOwner(){const b=$("os");b.disabled=true;$("om").textContent="";$("om").style.color="";
 try{const g=i=>$("o_"+i).value.trim(),font=g("font");if(!/^[\w \-]{2,40}$/.test(font))throw new Error("اسم الخط غير صالح");
  const c={...(BR.content||{})};["tabTitle","tabTitleF","name","nameF","copy","copyF","dev","devUrl"].forEach(k=>c[k]=g(k));
  c.theme={...(c.theme||{}),red:g("red"),bg:g("bg"),card:g("card"),txt:g("txt"),font};
  const row={id:1,content:c};
  for(const [k,col,mx] of [["logo","logo_url",500],["cover","cover_url",1400],["hero","hero_url",1400]]){const f=$("o_"+k).files[0];if(!f)continue;if(f.size>8e6)throw new Error("الصورة أكبر من 5MB");
   const bl=await shrink(f,mx),p="site/"+k+"-"+Date.now()+(bl.type==="image/png"?".png":".jpg");ok(await sb.storage.from("product-images").upload(p,bl,{contentType:bl.type,cacheControl:"31536000"}));row[col]=sb.storage.from("product-images").getPublicUrl(p).data.publicUrl}
  const r=await sb.from("branding").upsert(row).select().single();if(r.error)throw new Error(/row-level|policy|permission/i.test(r.error.message)?"غير مسموح لك بتعديل هذه الإعدادات":r.error.message);
  BR=r.data;$("om").style.color="#34c38f";$("om").textContent="تم الحفظ ✓"}
 catch(x){$("om").textContent=x.message||String(x)}finally{b.disabled=false}}
function ymd(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
