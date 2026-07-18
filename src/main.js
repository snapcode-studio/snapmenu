// Usunięto import CSS stąd
import { logIn, signUp, listenAuthState, logOut } from './auth';

let isLoginMode = true;

const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const toggleAuthModeBtn = document.getElementById('toggleAuthMode');
const authTitle = document.getElementById('authTitle');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authError = document.getElementById('authError');
const navLogoutBtn = document.getElementById('navLogoutBtn');

listenAuthState((user) => {
  if (user) {
    if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
      window.location.href = '/dashboard.html';
    }
    navLogoutBtn.classList.remove('hidden');
  } else {
    navLogoutBtn.classList.add('hidden');
  }
});

navLogoutBtn?.addEventListener('click', async () => await logOut());

toggleAuthModeBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  isLoginMode = !isLoginMode;
  if (isLoginMode) {
    authTitle.innerText = "Zaloguj się";
    authSubmitBtn.innerText = "Zaloguj";
    toggleAuthModeBtn.innerText = "Nie masz konta? Zarejestruj się";
  } else {
    authTitle.innerText = "Załóż konto";
    authSubmitBtn.innerText = "Zarejestruj";
    toggleAuthModeBtn.innerText = "Masz już konto? Zaloguj się";
  }
  authError.innerText = "";
});

authForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  authError.innerText = "";
  authSubmitBtn.disabled = true;
  authSubmitBtn.innerText = "Wczytywanie...";

  try {
    if (isLoginMode) {
      await logIn(emailInput.value, passwordInput.value);
    } else {
      await signUp(emailInput.value, passwordInput.value);
    }
  } catch (error) {
    authError.innerText = "Błąd: Sprawdź dane i spróbuj ponownie.";
    authSubmitBtn.disabled = false;
    authSubmitBtn.innerText = isLoginMode ? "Zaloguj" : "Zarejestruj";
  }
});
