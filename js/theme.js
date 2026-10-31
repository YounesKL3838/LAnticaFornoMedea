/* الوضع الليلي / الفاتح (يُحفظ في المتصفح) */
(function(){var K="adm_theme",h=document.documentElement;h.setAttribute("data-theme",localStorage.getItem(K)==="light"?"light":"dark");
 function paint(){var l=h.getAttribute("data-theme")==="light",m=document.querySelector('meta[name=theme-color]');if(m)m.content=l?"#f3f4f7":"#0b0b0d";
  document.querySelectorAll(".thm").forEach(function(b){b.textContent=l?"🌙":"☀️";b.title=l?"الوضع الليلي":"الوضع الفاتح";b.onclick=function(){h.setAttribute("data-theme",l?"dark":"light");localStorage.setItem(K,l?"dark":"light");paint()}})}
 document.addEventListener("DOMContentLoaded",paint)})();
