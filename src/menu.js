import { listenToMenu, listenToTheme } from './db';

const menuBody = document.getElementById('menuBody');
const publicMenuList = document.getElementById('publicMenuList');
const loadingIndicator = document.getElementById('loadingIndicator');
const menuHeader = document.getElementById('menuHeader');

const urlParams = new URLSearchParams(window.location.search);
const restaurantId = urlParams.get('id');

if (!restaurantId) {
  loadingIndicator.innerText = "Błąd: Brak ID restauracji w adresie URL.";
} else {
  // Pobieranie Wyglądu
  listenToTheme(restaurantId, (theme) => {
    menuBody.style.backgroundColor = theme.bgColor || '#000000';
    menuBody.style.color = theme.textColor || '#ffffff';
    menuBody.style.fontFamily = theme.fontFamily || "'Inter', sans-serif";
    
    // Tytuł i nagłówek
    const name = theme.restaurantName || "Nasze Menu";
    menuHeader.innerText = name;
    document.title = `${name} - Cyfrowe Menu`;
  });

  // Pobieranie Dań
  listenToMenu(restaurantId, (items) => {
    loadingIndicator.style.display = 'none';
    renderPublicMenu(items);
  });
}

function renderPublicMenu(items) {
  publicMenuList.innerHTML = '';
  
  if(items.length === 0) {
    publicMenuList.innerHTML = '<p style="text-align:center; opacity:0.5; padding: 2rem;">Menu jest aktualnie puste. Zapraszamy wkrótce.</p>';
    return;
  }

  items.forEach((item, index) => {
    const div = document.createElement('div');
    // Używamy styli in-line do przezroczystości żeby wtopiło się w kolor tła klienta
    div.style.background = 'rgba(255, 255, 255, 0.04)';
    div.style.border = '1px solid rgba(255, 255, 255, 0.08)';
    div.style.borderRadius = '20px';
    div.style.padding = '24px';
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.alignItems = 'center';
    div.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
    div.style.transition = 'transform 0.3s ease, background 0.3s ease';
    
    // Klasa do animacji i hover
    div.className = 'stagger-item';
    div.style.animationDelay = `${0.1 + (index * 0.08)}s`;

    // Interaktywność po najechaniu (sztywny js zeby pominac zaleznosc od bg-color klienta)
    div.addEventListener('mouseenter', () => {
      div.style.transform = 'translateY(-2px)';
      div.style.background = 'rgba(255, 255, 255, 0.07)';
    });
    div.addEventListener('mouseleave', () => {
      div.style.transform = 'translateY(0)';
      div.style.background = 'rgba(255, 255, 255, 0.04)';
    });

    div.innerHTML = `
      <div class="item-info">
        <h3 style="font-size: 1.25rem; font-weight:600; margin-bottom: 6px; letter-spacing:-0.02em;">${item.name}</h3>
        <p style="font-size:0.9rem; opacity:0.65; line-height: 1.4;">${item.desc || ''}</p>
      </div>
      <div class="item-price" style="font-size:1.15rem; font-family:'Geist Mono', monospace; font-weight:500; margin-left: 15px;">
        ${item.price.toFixed(2)} zł
      </div>
    `;
    publicMenuList.appendChild(div);
  });
}
