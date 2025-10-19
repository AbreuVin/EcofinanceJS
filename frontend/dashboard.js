// arquivo: frontend/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // Carrega o Navbar
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        fetch('nav.html').then(response => response.text()).then(data => {
            navPlaceholder.innerHTML = data;
        }).catch(error => console.error('Erro ao carregar navbar:', error));
    }

    const form = document.getElementById('contact-form');
    const contactIdInput = document.getElementById('contact-id');
    const contactsTbody = document.getElementById('contacts-tbody');
    const cancelBtn = document.getElementById('cancel-btn');

    // --- MUDANÇA AQUI ---
    const API_URL = '/api/contacts'; // URL relativa

    // READ: Carrega e exibe todos os contatos
    const fetchContacts = async () => {
        try {
            const response = await fetch(API_URL);
            const contacts = await response.json();
            contactsTbody.innerHTML = ''; // Limpa a tabela antes de preencher
            contacts.forEach(contact => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${contact.name || ''}</td>
                    <td>${contact.area || ''}</td>
                    <td>${contact.email || ''}</td>
                    <td>${contact.phone || ''}</td>
                    <td>
                        <button class="action-btn edit-btn" onclick="editContact(${contact.id}, '${contact.name || ''}', '${contact.area || ''}', '${contact.email || ''}', '${contact.phone || ''}')">Editar</button>
                        <button class="action-btn delete-btn" onclick="deleteContact(${contact.id})">Deletar</button>
                    </td>
                `;
                contactsTbody.appendChild(tr);
            });
        } catch(err) {
            console.error("Falha ao buscar contatos", err);
        }
    };

    // CREATE / UPDATE: Salva um contato (novo ou existente)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = contactIdInput.value;
        const contactData = {
            name: document.getElementById('name').value,
            area: document.getElementById('area').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/${id}` : API_URL;

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData),
        });

        resetForm();
        fetchContacts(); // A função global agora será chamada
    });
    
    // Botão de cancelar edição
    cancelBtn.addEventListener('click', () => resetForm());

    // Funções globais para os botões inline
    window.editContact = (id, name, area, email, phone) => {
        document.getElementById('contact-id').value = id;
        document.getElementById('name').value = name;
        document.getElementById('area').value = area;
        document.getElementById('email').value = email;
        document.getElementById('phone').value = phone;
        document.getElementById('cancel-btn').style.display = 'inline-block';
    };

    window.deleteContact = async (id) => {
        if (confirm('Tem certeza que deseja deletar este contato?')) {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            fetchContacts(); // A função global será chamada aqui
        }
    };

    // Limpa o formulário e o ID oculto
    window.resetForm = () => {
        document.getElementById('contact-form').reset();
        document.getElementById('contact-id').value = '';
        document.getElementById('cancel-btn').style.display = 'none';
    };

    fetchContacts(); // Carrega os contatos ao iniciar a página
});