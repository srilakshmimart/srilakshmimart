/* ============================================================
   FLOATING WIDGETS — back to top + shopping assistant
   Stacked above the WhatsApp button, never overlapping it.
   ============================================================ */
window.Widgets = (function () {
  const $ = s => document.querySelector(s);
  let open = false;

  /* ---------------- back to top ---------------- */
  function mountTop() {
    const btn = $('#toTop');
    if (!btn) return;
    const check = () => btn.classList.toggle('show', window.scrollY > 420);
    addEventListener('scroll', check, { passive: true });
    check();
    btn.addEventListener('click', () => {
      const smooth = !matchMedia('(prefers-reduced-motion:reduce)').matches;
      window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
    });
  }

  /* ---------------- assistant ---------------- */
  const esc = s => App.esc(s);

  function bubble(role, html) {
    return `<div class="ab-msg ${role}"><div class="ab-bubble">${html}</div></div>`;
  }

  function answerHTML(a) {
    const body = esc(a.text).replace(/\n/g, '<br>');
    const acts = (a.actions || []).map(x => x.href
      ? `<a class="ab-act" href="${x.href}" target="_blank" rel="noopener">${esc(x.label)}</a>`
      : `<button class="ab-act" data-ab-go="${x.route}">${esc(x.label)}</button>`).join('');
    return body + (acts ? `<div class="ab-acts">${acts}</div>` : '');
  }

  function push(role, html) {
    const log = $('#abLog');
    log.insertAdjacentHTML('beforeend', bubble(role, html));
    log.scrollTop = log.scrollHeight;
  }

  function ask(q) {
    if (!q.trim()) return;
    push('me', esc(q));
    $('#abInput').value = '';
    const typing = document.createElement('div');
    typing.className = 'ab-msg bot';
    typing.innerHTML = '<div class="ab-bubble ab-typing"><span></span><span></span><span></span></div>';
    $('#abLog').appendChild(typing);
    $('#abLog').scrollTop = $('#abLog').scrollHeight;
    // a short pause reads as a reply rather than an instant lookup
    setTimeout(() => {
      typing.remove();
      push('bot', answerHTML(AssistantData.respond(q)));
    }, 320);
  }

  function toggle(next) {
    open = next === undefined ? !open : next;
    $('#abPanel').classList.toggle('open', open);
    $('#abBtn').setAttribute('aria-expanded', String(open));
    if (open) {
      if (!$('#abLog').children.length) {
        push('bot', answerHTML({
          text: 'Hello! I can help you find products, check prices, or explain how to order.'
        }));
      }
      setTimeout(() => $('#abInput').focus(), 180);
    } else $('#abBtn').focus();
  }

  function mountAssistant() {
    const btn = $('#abBtn');
    if (!btn) return;

    $('#abChips').innerHTML = AssistantData.SUGGESTIONS
      .map(q => `<button class="ab-chip" data-ab-ask="${esc(q)}">${esc(q)}</button>`).join('');

    btn.addEventListener('click', () => toggle());
    $('#abClose').addEventListener('click', () => toggle(false));
    $('#abSend').addEventListener('click', () => ask($('#abInput').value));
    $('#abInput').addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask($('#abInput').value); }
    });

    $('#abPanel').addEventListener('click', e => {
      const chip = e.target.closest('[data-ab-ask]');
      if (chip) { ask(chip.getAttribute('data-ab-ask')); return; }
      const go = e.target.closest('[data-ab-go]');
      if (go) { toggle(false); location.hash = go.getAttribute('data-ab-go'); }
    });

    addEventListener('keydown', e => { if (e.key === 'Escape' && open) toggle(false); });
  }

  function mount() { mountTop(); mountAssistant(); }
  return { mount, ask, toggle };
})();
