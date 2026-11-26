// ===== ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ =====
(function initTheme() {
  const STORAGE_KEY = 'ftly-theme';
  const root = document.documentElement;

  // Определяем стартовую тему: сохранённая > системная
  const saved = localStorage.getItem(STORAGE_KEY);
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (systemDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);

  // Создаём кнопку переключения
  const toggle = document.createElement('button');
  toggle.className = 'theme-toggle';
  toggle.setAttribute('aria-label', 'Переключить тему');
  toggle.innerHTML = `
    <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
    <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  `;
  document.body.appendChild(toggle);

  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  // Реагируем на смену системной темы, если пользователь не выбрал вручную
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
})();

// ===== ДЕМО-НАВИГАЦИЯ =====
const navButtons = document.querySelectorAll('.demo-nav__btn');
const screens = document.querySelectorAll('.screen');

function showScreen(name) {
  screens.forEach(s => s.classList.remove('active'));
  const target = document.getElementById('screen-' + name);
  if (target) target.classList.add('active');

  navButtons.forEach(b => {
    b.classList.toggle('active', b.dataset.screen === name);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navButtons.forEach(btn => {
  btn.addEventListener('click', () => showScreen(btn.dataset.screen));
});

document.querySelectorAll('[data-next]').forEach(btn => {
  btn.addEventListener('click', () => showScreen(btn.dataset.next));
});

// ===== 4. СПИСОК ДНЕЙ (28 дней) =====
const daysList = document.getElementById('days-list');
if (daysList) {
  const TOTAL_DAYS = 28;
  const CURRENT_DAY = 3;
  const DONE_DAYS = 2;

  for (let i = 1; i <= TOTAL_DAYS; i++) {
    const item = document.createElement('div');
    item.className = 'day-item';

    let statusText = '';
    if (i <= DONE_DAYS) {
      item.classList.add('day-item--done');
      statusText = 'Выполнено';
    } else if (i === CURRENT_DAY) {
      item.classList.add('day-item--current');
      statusText = 'Сегодня';
    } else {
      statusText = 'Не начато';
    }

    item.innerHTML = `
      <span class="day-item__num">${i}</span>
      <span class="day-item__label">День ${i}</span>
      <span class="day-item__status">${statusText}</span>
    `;
    daysList.appendChild(item);
  }
}

// ===== 3. КНОПКА "ВЫПОЛНЕНО" =====
const doneBtn = document.getElementById('done-btn');
if (doneBtn) {
  doneBtn.addEventListener('click', () => {
    doneBtn.textContent = 'Отлично! День выполнен ✓';
    doneBtn.disabled = true;
    doneBtn.style.background = 'var(--success-grad)';
    doneBtn.style.boxShadow = '0 3px 12px rgba(168, 184, 165, 0.3)';

    const fill = document.querySelector('.today__progress-block .progress-bar__fill');
    if (fill) fill.style.width = '100%';

    const label = document.querySelector('.today__progress-label');
    if (label) label.textContent = 'Прогресс дня: 5 из 5 упражнений';

    setTimeout(() => {
      doneBtn.textContent = 'Смотреть прогресс →';
      doneBtn.disabled = false;
      doneBtn.onclick = () => showScreen('progress');
    }, 1400);
  });
}

// ===== 5. ЗАГРУЗКА ВИДЕО =====
const uploadBtn = document.getElementById('upload-btn');
const uploadProgress = document.getElementById('upload-progress');
const uploadFill = document.getElementById('upload-fill');
const trainerStatus = document.getElementById('trainer-status');

if (uploadBtn) {
  uploadBtn.addEventListener('click', () => {
    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Загрузка...';
    uploadProgress.classList.remove('hidden');
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 18 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        uploadFill.style.width = '100%';
        setTimeout(() => {
          uploadProgress.classList.add('hidden');
          uploadBtn.textContent = 'Видео отправлено ✓';
          uploadBtn.style.background = 'var(--success-grad)';
          uploadBtn.style.boxShadow = '0 3px 12px rgba(168, 184, 165, 0.3)';
          uploadBtn.style.color = '#fff';
          uploadBtn.disabled = true;

          if (trainerStatus) {
            trainerStatus.innerHTML = `
              <div class="status-row">
                <span class="status-dot status-dot--done"></span>
                <span>Тренер ответил: «Отличная работа, Анна!»</span>
              </div>
            `;
          }
        }, 500);
      } else {
        uploadFill.style.width = progress + '%';
      }
    }, 320);
  });
}

// ===== БОТ: демо-кнопки =====
document.querySelectorAll('.bot-message .btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.textContent = '✓ Отправлено';
    btn.disabled = true;
    btn.style.background = 'var(--success-grad)';
    btn.style.color = '#fff';
  });
});

// ===== ПЛАВНОЕ ПОЯВЛЕНИЕ КАРТОЧЕК =====
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .day-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(el);
  });
}