import { logIn, signUp, listenAuthState, logOut } from './auth';

let isLoginMode = localStorage.getItem('hasLoggedBefore') === 'true';

const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const toggleAuthModeBtn = document.getElementById('toggleAuthMode');
const authTitle = document.getElementById('authTitle');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authError = document.getElementById('authError');
const navLogoutBtn = document.getElementById('navLogoutBtn');

function updateAuthUI() {
  if (isLoginMode) {
    if (authTitle) authTitle.innerText = "Zaloguj się";
    if (authSubmitBtn) authSubmitBtn.innerText = "Zaloguj";
    if (toggleAuthModeBtn) toggleAuthModeBtn.innerText = "Nie masz konta? Zarejestruj się";
  } else {
    if (authTitle) authTitle.innerText = "Załóż konto";
    if (authSubmitBtn) authSubmitBtn.innerText = "Zarejestruj";
    if (toggleAuthModeBtn) toggleAuthModeBtn.innerText = "Masz już konto? Zaloguj się";
  }
  if (authError) authError.innerText = "";
  if (emailInput) emailInput.style.borderColor = '';
  if (passwordInput) passwordInput.style.borderColor = '';
}

if (authForm) updateAuthUI();

emailInput?.addEventListener('input', () => {
  emailInput.style.borderColor = '';
  authError.innerText = '';
});

passwordInput?.addEventListener('input', () => {
  passwordInput.style.borderColor = '';
  authError.innerText = '';
});

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
  updateAuthUI();
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
    localStorage.setItem('hasLoggedBefore', 'true');
  } catch (error) {
    let errMsg = "Błąd: Sprawdź dane i spróbuj ponownie.";
    if (error.code === 'auth/email-already-in-use') errMsg = "Konto z tym e-mailem już istnieje.";
    else if (error.code === 'auth/wrong-password') errMsg = "Nieprawidłowe hasło.";
    else if (error.code === 'auth/user-not-found') errMsg = "Nie znaleziono użytkownika.";
    else if (error.code === 'auth/weak-password') errMsg = "Hasło jest zbyt słabe (min. 6 znaków).";
    else if (error.code === 'auth/invalid-email') errMsg = "Nieprawidłowy adres e-mail.";
    
    authError.innerText = errMsg;
    emailInput.style.borderColor = '#ff453a';
    passwordInput.style.borderColor = '#ff453a';
    authSubmitBtn.disabled = false;
    authSubmitBtn.innerText = isLoginMode ? "Zaloguj" : "Zarejestruj";
  }
});
