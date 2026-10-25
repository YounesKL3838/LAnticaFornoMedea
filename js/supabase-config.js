// ضع هنا قيم مشروعك من Supabase: Project Settings > API. استخدم anon/publishable key فقط، ولا تضع service_role أبدًا.
window.SUPABASE_URL = "https://yrxlhxrkqufrfjhltnom.supabase.co";
window.SUPABASE_ANON_KEY = "sb_publishable_BQMhp-lvEoz--eYDiiA9Eg_hDSqkxPN";
(function () {
  var ok = /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(window.SUPABASE_URL) && window.SUPABASE_ANON_KEY.length > 40;
  if (ok && window.supabase) window.sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
})();
