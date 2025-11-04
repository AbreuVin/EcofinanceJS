// arquivo: frontend/dashboard.js

// Importa os schemas para sabermos quais fontes existem
import { validationSchemas } from '../shared/validators.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. REFERÊNCIAS DO DOM ---
    const navPlaceholder = document.getElementById('nav-placeholder');
    const form = document.getElementById('contact-form');
    const contactIdInput = document.getElementById('contact-id');
    const contactsTbody = document.getElementById('contacts-tbody');
    const cancelBtn = document.getElementById('cancel-btn');
    const sourcesCheckboxContainer = document.getElementById('sources-checkbox-container');
    const phoneInput = document.getElementById('phone');
    
    const phoneMask = IMask(phoneInput, {
        mask: [
            { mask: '(00) 0000-0000' },
            { mask: '(00) 00000-0000' }
        ]
    });
    
    const API_URL = '/api/contacts';

    // --- 2. FUNÇÕES PRINCIPAIS ---

    const initializePage = () => {
        if (navPlaceholder) {
            fetch('nav.html').then(response => response.text()).then(data => {
                navPlaceholder.innerHTML = data;
            }).catch(error => console.error('Erro ao carregar navbar:', error));
        }

        sourcesCheckboxContainer.innerHTML = '';
        for (const key in validationSchemas) {
            const schema = validationSchemas[key];
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'checkbox-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `source-${key}`;
            checkbox.value = key;
            
            const label = document.createElement('label');
            label.htmlFor = `source-${key}`;
            label.textContent = schema.displayName;

            itemDiv.appendChild(checkbox);
            itemDiv.appendChild(label);
            sourcesCheckboxContainer.appendChild(itemDiv);
        }
        
        fetchContacts();
    };

    const fetchContacts = async () => {
        try {
            const response = await fetch(API_URL);
            const contacts = await response.json();
            contactsTbody.innerHTML = '';
            contacts.forEach(contact => {
                const tr = document.createElement('tr');
                
                const sourceNames = (contact.sources || [])
                    .map(key => validationSchemas[key]?.displayName || key)
                    .join(', ');

                // --- ATENÇÃO: CORREÇÃO AQUI ---
                // Usamos phoneMask diretamente, que contém as opções corretas.
                const formattedPhone = contact.phone ? IMask.pipe(contact.phone, phoneMask) : '';
                // --- FIM DA CORREÇÃO ---

                tr.innerHTML = `
                    <td>${contact.name || ''}</td>
                    <td>${contact.area || ''}</td>
                    <td>${contact.email || ''}</td>
                    <td>${formattedPhone}</td>
                    <td>${sourceNames}</td>
                    <td>
                        <button class="action-btn edit-btn">Editar</button>
                        <button class="action-btn delete-btn">Deletar</button>
                    </td>
                `;

                tr.querySelector('.edit-btn').addEventListener('click', () => editContact(contact));
                tr.querySelector('.delete-btn').addEventListener('click', () => deleteContact(contact.id));
                
                contactsTbody.appendChild(tr);
            });
        } catch(err) {
            console.error("Falha ao buscar contatos", err);
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = contactIdInput.value;
        
        const selectedSources = [];
        sourcesCheckboxContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            selectedSources.push(checkbox.value);
        });

        const contactData = {
            name: document.getElementById('name').value,
            area: document.getElementById('area').value,
            email: document.getElementById('email').value,
            phone: phoneMask.unmaskedValue,
            sources: selectedSources
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/${id}` : API_URL;

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData),
        });

        resetForm();
        fetchContacts();
    });
    
    cancelBtn.addEventListener('click', () => resetForm());

    // --- 3. FUNÇÕES GLOBAIS E AUXILIARES ---

    window.editContact = (contact) => {
        contactIdInput.value = contact.id;
        document.getElementById('name').value = contact.name;
        document.getElementById('area').value = contact.area;
        document.getElementById('email').value = contact.email;
        phoneMask.value = contact.phone || '';
        
        sourcesCheckboxContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        if (contact.sources && contact.sources.length > 0) {
            contact.sources.forEach(sourceKey => {
                const checkbox = document.getElementById(`source-${sourceKey}`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }

        cancelBtn.style.display = 'inline-block';
        window.scrollTo(0, 0);
    };

    window.deleteContact = async (id) => {
        if (confirm('Tem certeza que deseja deletar este contato?')) {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            fetchContacts();
        }
    };

    window.resetForm = () => {
        form.reset();
        contactIdInput.value = '';
        phoneMask.value = '';
        sourcesCheckboxContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        cancelBtn.style.display = 'none';
    };

    // --- 4. INICIALIZAÇÃO ---
    initializePage();
});