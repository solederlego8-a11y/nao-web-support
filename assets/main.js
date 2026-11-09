// nao — site v2 shared script
(function () {
  // mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('nav.main');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // reveal on scroll
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && els.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('on'); });
  }

  // diagnosis form (FormSubmit ajax, mailto fallback) — same route as v1
  var form = document.getElementById('diag-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var email = ['naoren.38', 'gmail.com'].join('@');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(form);
    var payload = { _subject: '無料診断の申し込み（新サイト）' };
    var lines = [];
    fd.forEach(function (v, k) {
      if (v) { payload[k] = v; lines.push(k + '：' + v); }
    });
    status.textContent = '送信中です…';
    status.style.color = '#16324a';
    fetch('https://formsubmit.co/ajax/' + email, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) {
      if (r.ok) {
        status.textContent = '送信しました。48時間以内に診断レポートをお送りします。';
        status.style.color = '#0b5a54';
        form.reset();
      } else { throw new Error('send failed'); }
    }).catch(function () {
      status.innerHTML = '自動送信できませんでした。メールで直接お送りください：<a href="mailto:' + email +
        '?subject=' + encodeURIComponent('無料診断の申し込み') +
        '&body=' + encodeURIComponent(lines.join('\n')) + '">申込メールを作成する</a>';
      status.style.color = '#9a6a00';
    });
  });
})();
