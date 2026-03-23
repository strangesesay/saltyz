// SALTYZ AI Chat Assistant
(function () {
  // ── Knowledge base ──────────────────────────────────────────────────────────
  const KB = [
    {
      patterns: [/\bhours?\b|\bopen\b|\bclose\b|\bschedule\b|\btiming/i],
      reply: "We're open Monday–Saturday 9 AM – 7 PM and Sunday 10 AM – 5 PM. Walk-ins welcome, but booking ahead is recommended."
    },
    {
      patterns: [/\bbook\b|\bappointment\b|\breserv/i],
      reply: 'You can book an appointment on our <a href="booking.html">Booking page</a>. Just pick your service, date, and time — easy!'
    },
    {
      patterns: [/\bservice\b|\boffer\b|\btreatment\b|\bdo you\b/i],
      reply: 'We offer Hair Styling, Hair Cutting, Hair Coloring, Makeup, Manicure & Pedicure, and Facial Treatments. See the full list on our <a href="services.html">Services page</a>.'
    },
    {
      patterns: [/\bhair\b/i],
      reply: 'Our hair services include Styling, Cutting, and Coloring — all done by expert stylists. <a href="booking.html">Book a session</a> today.'
    },
    {
      patterns: [/\bmakeup\b|\bface\b|\bfacial\b/i],
      reply: 'We offer professional Makeup application and Facial Treatments to keep your skin glowing. <a href="booking.html">Book now</a>.'
    },
    {
      patterns: [/\bmanicure\b|\bpedicure\b|\bnail\b/i],
      reply: 'Yes, we do Manicure & Pedicure services. Treat yourself — <a href="booking.html">book an appointment</a>.'
    },
    {
      patterns: [/\bprice\b|\bcost\b|\bhow much\b|\brate\b|\bfee\b/i],
      reply: 'Pricing varies by service. Please <a href="contact.html">contact us</a> or call +232 76 123 456 for a quote.'
    },
    {
      patterns: [/\blocation\b|\baddress\b|\bwhere\b|\bdirection\b|\bfind you\b/i],
      reply: 'We\'re at 24 Lumley Beach Road, Freetown, Sierra Leone. Find us on the <a href="contact.html">Contact page</a>.'
    },
    {
      patterns: [/\bphone\b|\bcall\b|\bnumber\b|\bcontact\b/i],
      reply: 'You can reach us at <strong>+232 76 123 456</strong> or email <strong>hello@saltyzsalon.com</strong>. We\'re happy to help!'
    },
    {
      patterns: [/\binstagram\b|\bfacebook\b|\btiktok\b|\bsocial\b/i],
      reply: 'Follow us on Instagram, Facebook, and TikTok for the latest looks and promotions. Links are in the footer.'
    },
    {
      patterns: [/\bteam\b|\bstylist\b|\bstaff\b|\bwho\b/i],
      reply: 'Our team of expert stylists are passionate about precision and personalized service. Learn more on our <a href="about.html">About page</a>.'
    },
    {
      patterns: [/\bgallery\b|\bwork\b|\bportfolio\b|\bphoto\b/i],
      reply: 'Check out our latest work on the <a href="gallery.html">Gallery page</a>.'
    },
    {
      patterns: [/\breview\b|\btestimonial\b|\bfeedback\b|\brating\b/i],
      reply: 'Read what our clients say on the <a href="testimonials.html">Testimonials page</a>.'
    },
    {
      patterns: [/\bhello\b|\bhi\b|\bhey\b|\bgreet\b|\bgood (morning|afternoon|evening)\b/i],
      reply: 'Hey there! Welcome to SALTYZ. How can I help you today? You can ask about our services, booking, location, or anything else.'
    },
    {
      patterns: [/\bthank\b|\bthanks\b/i],
      reply: "You're welcome! Is there anything else I can help you with?"
    },
    {
      patterns: [/\bbye\b|\bgoodbye\b|\bsee you\b/i],
      reply: 'See you soon at SALTYZ! Have a great day.'
    }
  ];

  const FALLBACK = "I'm not sure about that one. Try asking about our services, booking, location, or contact info — or call us at +232 76 123 456.";

  function getReply(input) {
    const text = input.trim();
    for (const entry of KB) {
      if (entry.patterns.some((p) => p.test(text))) return entry.reply;
    }
    return FALLBACK;
  }

  // ── Build UI ─────────────────────────────────────────────────────────────────
  const styles = `
    #saltyz-chat-btn {
      position: fixed;
      bottom: 1.6rem;
      right: 1.6rem;
      z-index: 9000;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f0730c, #ff9f43);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 24px rgba(240,115,12,0.45);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    #saltyz-chat-btn:hover { transform: scale(1.08); box-shadow: 0 8px 28px rgba(240,115,12,0.6); }
    #saltyz-chat-btn svg { width: 26px; height: 26px; fill: #111; }
    #saltyz-chat-btn .chat-badge {
      position: absolute;
      top: -3px; right: -3px;
      width: 14px; height: 14px;
      background: #fff;
      border-radius: 50%;
      border: 2px solid #f0730c;
      animation: pulse-badge 2s infinite;
    }
    @keyframes pulse-badge {
      0%,100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.7; }
    }
    #saltyz-chat-window {
      position: fixed;
      bottom: 5.2rem;
      right: 1.6rem;
      z-index: 9001;
      width: min(360px, calc(100vw - 2rem));
      max-height: 520px;
      display: flex;
      flex-direction: column;
      background: #171717;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 18px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.55);
      overflow: hidden;
      transform: scale(0.92) translateY(12px);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.25s ease, opacity 0.25s ease;
      font-family: "Manrope", sans-serif;
    }
    #saltyz-chat-window.open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: auto;
    }
    .sc-header {
      background: linear-gradient(120deg, #f0730c, #ff9f43);
      padding: 0.85rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.65rem;
      flex-shrink: 0;
    }
    .sc-avatar {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: rgba(0,0,0,0.25);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .sc-avatar svg { width: 20px; height: 20px; fill: #fff; }
    .sc-header-text { flex: 1; }
    .sc-header-text strong { display: block; color: #111; font-size: 0.95rem; }
    .sc-header-text span { color: rgba(0,0,0,0.65); font-size: 0.75rem; }
    .sc-close {
      background: none; border: none; cursor: pointer;
      color: rgba(0,0,0,0.6); font-size: 1.3rem; line-height: 1;
      padding: 0.2rem;
      transition: color 0.2s;
    }
    .sc-close:hover { color: #111; }
    .sc-messages {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.1) transparent;
    }
    .sc-msg {
      max-width: 82%;
      padding: 0.6rem 0.85rem;
      border-radius: 14px;
      font-size: 0.88rem;
      line-height: 1.5;
      word-break: break-word;
    }
    .sc-msg a { color: #ff9f43; }
    .sc-msg.bot {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.1);
      color: #f3f3f3;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .sc-msg.user {
      background: linear-gradient(120deg, #f0730c, #ff9f43);
      color: #111;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
      font-weight: 500;
    }
    .sc-typing {
      display: flex; gap: 4px; align-items: center;
      padding: 0.6rem 0.85rem;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 14px; border-bottom-left-radius: 4px;
      align-self: flex-start;
    }
    .sc-typing span {
      width: 7px; height: 7px; border-radius: 50%;
      background: #ff9f43; display: block;
      animation: sc-bounce 1.2s infinite;
    }
    .sc-typing span:nth-child(2) { animation-delay: 0.2s; }
    .sc-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes sc-bounce {
      0%,60%,100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }
    .sc-suggestions {
      padding: 0 1rem 0.5rem;
      display: flex; flex-wrap: wrap; gap: 0.4rem;
      flex-shrink: 0;
    }
    .sc-chip {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,159,67,0.4);
      color: #ff9f43;
      border-radius: 999px;
      padding: 0.3rem 0.75rem;
      font-size: 0.78rem;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
      font-family: "Manrope", sans-serif;
    }
    .sc-chip:hover { background: rgba(255,159,67,0.15); border-color: #ff9f43; }
    .sc-input-row {
      display: flex;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border-top: 1px solid rgba(255,255,255,0.08);
      flex-shrink: 0;
    }
    .sc-input {
      flex: 1;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 999px;
      padding: 0.55rem 1rem;
      color: #fff;
      font-size: 0.88rem;
      font-family: "Manrope", sans-serif;
      outline: none;
      transition: border-color 0.2s;
    }
    .sc-input:focus { border-color: rgba(255,159,67,0.6); }
    .sc-input::placeholder { color: rgba(255,255,255,0.35); }
    .sc-send {
      width: 38px; height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f0730c, #ff9f43);
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .sc-send:hover { transform: scale(1.08); box-shadow: 0 4px 12px rgba(240,115,12,0.4); }
    .sc-send svg { width: 16px; height: 16px; fill: #111; }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // Toggle button
  const btn = document.createElement('button');
  btn.id = 'saltyz-chat-btn';
  btn.setAttribute('aria-label', 'Open chat assistant');
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-2 10H6v-2h12v2zm0-3H6V7h12v2z"/>
    </svg>
    <span class="chat-badge" aria-hidden="true"></span>
  `;

  // Chat window
  const win = document.createElement('div');
  win.id = 'saltyz-chat-window';
  win.setAttribute('role', 'dialog');
  win.setAttribute('aria-label', 'SALTYZ Chat Assistant');
  win.innerHTML = `
    <div class="sc-header">
      <div class="sc-avatar" aria-hidden="true">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
        </svg>
      </div>
      <div class="sc-header-text">
        <strong>SALTYZ Assistant</strong>
        <span>Ask me anything</span>
      </div>
      <button class="sc-close" aria-label="Close chat">&times;</button>
    </div>
    <div class="sc-messages" id="sc-messages" aria-live="polite" aria-atomic="false"></div>
    <div class="sc-suggestions" id="sc-suggestions"></div>
    <div class="sc-input-row">
      <input class="sc-input" id="sc-input" type="text" placeholder="Type a message..." autocomplete="off" maxlength="200" />
      <button class="sc-send" id="sc-send" aria-label="Send message">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(win);

  // ── State & helpers ──────────────────────────────────────────────────────────
  const messagesEl = document.getElementById('sc-messages');
  const inputEl = document.getElementById('sc-input');
  const sendBtn = document.getElementById('sc-send');
  const suggestionsEl = document.getElementById('sc-suggestions');
  let isOpen = false;
  let greeted = false;

  const SUGGESTIONS = ['Services', 'Book appointment', 'Location', 'Opening hours', 'Contact'];

  function renderSuggestions() {
    suggestionsEl.innerHTML = '';
    SUGGESTIONS.forEach((s) => {
      const chip = document.createElement('button');
      chip.className = 'sc-chip';
      chip.textContent = s;
      chip.addEventListener('click', () => sendMessage(s));
      suggestionsEl.appendChild(chip);
    });
  }

  function addMessage(text, role) {
    const msg = document.createElement('div');
    msg.className = `sc-msg ${role}`;
    msg.innerHTML = text;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return msg;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'sc-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return el;
  }

  function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    inputEl.value = '';
    addMessage(trimmed, 'user');
    suggestionsEl.innerHTML = '';

    const typing = showTyping();
    setTimeout(() => {
      typing.remove();
      addMessage(getReply(trimmed), 'bot');
      renderSuggestions();
    }, 650);
  }

  function toggleChat() {
    isOpen = !isOpen;
    win.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    // Remove badge on first open
    const badge = btn.querySelector('.chat-badge');
    if (badge) badge.remove();

    if (isOpen) {
      if (!greeted) {
        greeted = true;
        setTimeout(() => {
          addMessage("Hi! I'm the SALTYZ assistant. How can I help you today?", 'bot');
          renderSuggestions();
        }, 200);
      }
      setTimeout(() => inputEl.focus(), 300);
    }
  }

  // ── Events ───────────────────────────────────────────────────────────────────
  btn.addEventListener('click', toggleChat);
  win.querySelector('.sc-close').addEventListener('click', toggleChat);

  sendBtn.addEventListener('click', () => sendMessage(inputEl.value));
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage(inputEl.value);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (isOpen && !win.contains(e.target) && e.target !== btn) toggleChat();
  });
})();
