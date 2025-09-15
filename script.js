
// Theme toggle (persist)
(function(){
  const root = document.documentElement;
  const saved = localStorage.getItem("mv-theme");
  if (saved === "light") root.setAttribute("data-theme", "light");
  document.getElementById("themeToggle")?.addEventListener("click", ()=>{
    const isLight = root.getAttribute("data-theme") === "light";
    if (isLight){ root.removeAttribute("data-theme"); localStorage.setItem("mv-theme","dark"); }
    else { root.setAttribute("data-theme","light"); localStorage.setItem("mv-theme","light"); }
  });
})();

// Numerology calculators
function reduceNumber(n, keepMasters=true){
  const masterSet = new Set([11,22,33]);
  while (n > 9){
    if (keepMasters && masterSet.has(n)) return n;
    n = String(n).split('').reduce((a,d)=>a + (+d), 0);
  }
  return n;
}
function digitsFromDateStr(s){
  if (!s) return null;
  const onlyDigits = s.replace(/\D/g,'');
  if (!onlyDigits) return null;
  return onlyDigits.split('').map(d=>+d);
}
function calcLifePath(){
  const keep = document.getElementById('keepMasters')?.checked ?? true;
  const s = document.getElementById('dob')?.value;
  const digs = digitsFromDateStr(s);
  if (!digs){ document.getElementById('lifePathOut').innerText = "Please enter a valid date."; return; }
  const sum = digs.reduce((a,b)=>a+b,0);
  const reduced = reduceNumber(sum, keep);
  document.getElementById('lifePathOut').innerHTML = `<strong>Life Path: ${reduced}</strong><br><span class="small">Sum=${sum} (keep masters: ${keep ? 'on' : 'off'})</span>`;
}
function letterVal(ch){
  const code = ch.toUpperCase().normalize("NFD").replace(/\p{Diacritic}/gu,'').charCodeAt(0);
  if (code < 65 || code > 90) return 0;
  return (code - 65) % 9 + 1;
}
function isVowel(ch){
  const c = ch.toUpperCase();
  if ("AEIOU".includes(c)) return true;
  if (c === "Y") return true;
  return false;
}
function calcNameNumbers(){
  const keep = document.getElementById('keepMasters2')?.checked ?? true;
  const name = (document.getElementById('fullname')?.value || "").trim();
  if (!name){ document.getElementById('nameOut').innerText = "Please enter a name."; return; }
  let vowels = 0, consonants = 0, total = 0;
  for (const ch of name){
    const v = letterVal(ch);
    if (!v) continue;
    total += v;
    if (isVowel(ch)) vowels += v; else consonants += v;
  }
  const expr = reduceNumber(total, keep);
  const soul = reduceNumber(vowels, keep);
  const pers = reduceNumber(consonants, keep);
  document.getElementById('nameOut').innerHTML = `
    <strong>Expression:</strong> ${expr} &nbsp; | &nbsp;
    <strong>Soul Urge:</strong> ${soul} &nbsp; | &nbsp;
    <strong>Personality:</strong> ${pers}
    <div class="small" style="margin-top:6px">Totals → All: ${total}, Vowels: ${vowels}, Consonants: ${consonants}</div>
  `;
}
function lifePathFromDateStr(s, keep=true){
  const digs = digitsFromDateStr(s);
  if (!digs) return null;
  const sum = digs.reduce((a,b)=>a+b,0);
  return reduceNumber(sum, keep);
}
function calcPair(){
  const keep = document.getElementById('keepMasters3')?.checked ?? true;
  const a = document.getElementById('dobA')?.value;
  const b = document.getElementById('dobB')?.value;
  const A = lifePathFromDateStr(a, keep);
  const B = lifePathFromDateStr(b, keep);
  if (A==null || B==null){ document.getElementById('pairOut').innerText = "Enter both dates."; return; }
  const friendly = new Set(["1-3","2-6","4-8","5-7","3-5","2-9","3-1","6-2","8-4","7-5","5-3","9-2"]);
  const key = `${A}-${B}`;
  const good = friendly.has(key);
  const msg = good ? "likely easy flow" : "potential friction but growth possible";
  document.getElementById('pairOut').innerHTML = `<strong>Life Paths:</strong> ${A} & ${B} — <em>${msg}</em>`;
}
