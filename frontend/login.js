// arquivo: frontend/login.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const messageP = document.getElementById('message');
  
  if (!form) {
    console.error('ERRO CRÍTICO: Não foi possível encontrar o elemento com id="login-form".');
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      // --- MUDANÇA AQUI ---
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      // --- FIM DA MUDANÇA ---

      const data = await response.json();

      if (response.ok) {
        messageP.textContent = data.message;
        messageP.style.color = 'green';
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1000);
      } else {
        messageP.textContent = data.message;
        messageP.style.color = 'red';
      }
    } catch (error) {
      console.error('Erro no fetch:', error);
      messageP.textContent = 'Erro de conexão com o servidor.';
      messageP.style.color = 'red';
    }
  });
});