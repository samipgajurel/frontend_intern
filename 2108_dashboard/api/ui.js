function qs(id) { return document.getElementById(id); }

function setMsg(id, text, isError = false) {
  const el = qs(id);
  if (!el) return;
  el.innerText = text;
  el.style.color = isError ? "#ef4444" : "#16a34a";
}

function fmtTS(ts) {
  if (!ts) return "-";
  return ts.replace("T", " ").slice(0, 19);
}

function shortText(s, n = 80) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n) + "..." : s;
}

function fillUserTopbar() {
  const u = getUser();
  const el = qs("topUser");
  if (el && u) el.innerText = `${u.email} (${u.role})`;
}
