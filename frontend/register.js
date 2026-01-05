// arquivo: frontend/register.js

const form = document.getElementById('register-form');
const messageP = document.getElementById('message');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    

    const data = await response.json();

    if (response.ok) {
      messageP.textContent = data.message + " Você já pode fazer o login.";
      messageP.style.color = 'green';
      form.reset(); 
    } else {
      messageP.textContent = data.message;
      messageP.style.color = 'red';
    }
  } catch (error) {
    messageP.textContent = 'Erro de conexão com o servidor.';
    messageP.style.color = 'red';
  }
});