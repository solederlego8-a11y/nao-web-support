// nao — site v3 shared script
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('nav.main');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  // dropdown: click support (touch devices)
  document.querySelectorAll('.has-drop > button').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      if (window.matchMedia('(max-width: 900px)').matches) return; // mobile menu shows drop inline
      var li = btn.parentElement;
      var was = li.classList.contains('open');
      document.querySelectorAll('.has-drop.open').forEach(function (x) { x.classList.remove('open'); });
      if (!was) li.classList.add('open');
      e.stopPropagation();
    });
  });
  document.addEventListener('click', function () {
    document.querySelectorAll('.has-drop.open').forEach(function (x) { x.classList.remove('open'); });
  });
  // reveal on scroll
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && els.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('on'); }); }
  // diagnosis form (FormSubmit ajax, mailto fallback)
  var form = document.getElementById('diag-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var email = ['naoren.38', 'gmail.com'].join('@');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(form);
    var payload = { _subject: '無料診断の申し込み（サイトv3）' };
    var lines = [];
    fd.forEach(function (v, k) { if (v) { payload[k] = v; lines.push(k + '：' + v); } });
    status.textContent = '送信中です…'; status.style.color = '#ffd489';
    fetch('https://formsubmit.co/ajax/' + email, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) {
      if (r.ok) { status.textContent = '送信しました。48時間以内に診断レポートをお送りします。'; status.style.color = '#7dd3c8'; form.reset(); }
      else { throw new Error('send failed'); }
    }).catch(function () {
      status.innerHTML = '自動送信できませんでした。メールで直接お送りください：<a style="color:#ffd489" href="mailto:' + email + '?subject=' + encodeURIComponent('無料診断の申し込み') + '&body=' + encodeURIComponent(lines.join('\n')) + '">申込メールを作成する</a>';
      status.style.color = '#ffd489';
    });
  });
})();
