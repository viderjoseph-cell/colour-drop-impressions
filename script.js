document.getElementById('year').textContent = new Date().getFullYear();


  function formatLocalPhone(raw){
    const d = (raw || '').replace(/\D/g, '');
    if(d.length !== 10) return raw;
    return `${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6)}`;
  }
  function toIntl(raw){
    const d = (raw || '').replace(/\D/g, '');
    return '233' + d.replace(/^0/, '');
  }
  const phone1 = document.body.dataset.phone1 || '0594953352';
  const phone2 = document.body.dataset.phone2 || '0249495835';
  const emailAddr = document.body.dataset.email || 'colordropimpressions100@gmail.com';

  document.querySelectorAll('[data-contact="phone1"]').forEach(el => {
    el.textContent = formatLocalPhone(phone1);
    if(el.tagName === 'A') el.href = 'tel:+' + toIntl(phone1);
  });
  document.querySelectorAll('[data-contact="phone2"]').forEach(el => {
    el.textContent = formatLocalPhone(phone2);
    if(el.tagName === 'A') el.href = 'tel:+' + toIntl(phone2);
  });
  document.querySelectorAll('[data-contact="email"]').forEach(el => {
    el.textContent = emailAddr;
    if(el.tagName === 'A') el.href = 'mailto:' + emailAddr;
  });
  const heroWa = document.getElementById('heroWaLink');
  if(heroWa){
    heroWa.href = `https://wa.me/${toIntl(phone1)}?text=${encodeURIComponent("Hi Colour Drop Impression, I'd like to ask about a print job.")}`;
  }

  
  const burger = document.getElementById('burgerBtn');
  const panel = document.getElementById('mobilePanel');
  burger.addEventListener('click', () => {
    const open = panel.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    panel.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  
  const scroller = document.getElementById('pfScroller');
  document.getElementById('scrollLeft').addEventListener('click', () => scroller.scrollBy({left:-300, behavior:'smooth'}));
  document.getElementById('scrollRight').addEventListener('click', () => scroller.scrollBy({left:300, behavior:'smooth'}));

 
  const WA_NUMBER = toIntl(phone1);
  function buildMessage(){
    const name = document.getElementById('qName').value.trim();
    const phone = document.getElementById('qPhone').value.trim();
    const service = document.getElementById('qService').value;
    const qty = document.getElementById('qQty').value.trim();
    const fulfil = document.querySelector('input[name="fulfil"]:checked').value;
    const details = document.getElementById('qDetails').value.trim();
    let msg = `Hi Colour Drop Impression, I'd like a quote.\n\n`;
    msg += `Name: ${name}\nPhone: ${phone}\nService: ${service}\n`;
    if(qty) msg += `Quantity: ${qty}\n`;
    msg += `Fulfilment: ${fulfil}\n`;
    if(details) msg += `Details: ${details}\n`;
    return msg;
  }
  const form = document.getElementById('quoteForm');
  const status = document.getElementById('quoteStatus');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }
    const msg = buildMessage();
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener');
    status.style.display = 'block';
    status.style.color = 'var(--teal)';
    status.textContent = "Opening WhatsApp with your request — just hit send there.";
  });
  document.getElementById('emailFallback').addEventListener('click', function(e){
    e.preventDefault();
    const msg = buildMessage();
    const url = `mailto:${emailAddr}?subject=${encodeURIComponent('Quote request')}&body=${encodeURIComponent(msg)}`;
    window.location.href = url;
  });
