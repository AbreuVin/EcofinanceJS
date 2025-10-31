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
    const sourcesCheckboxContainer = document.getElementById('sources-checkbox-container'); // Nova referência
    
    const API_URL = '/api/contacts';

    // --- 2. FUNÇÕES PRINCIPAIS ---

    // Função que roda na inicialização
    const initializePage = () => {
        // Carrega a navbar
        if (navPlaceholder) {
            fetch('nav.html').then(response => response.text()).then(data => {
                navPlaceholder.innerHTML = data;
            }).catch(error => console.error('Erro ao carregar navbar:', error));
        }

        // Gera os checkboxes das fontes de emissão
        sourcesCheckboxContainer.innerHTML = ''; // Limpa o container
        for (const key in validationSchemas) {
            const schema = validationSchemas[key];
            const itemDiv = document.createElement('div');
            itemDiv.className = 'checkbox-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `source-${key}`;
            checkbox.value = key;
            checkbox.dataset.sourceName = schema.displayName;

            const label = document.createElement('label');
            label.htmlFor = `source-${key}`;
            label.textContent = schema.displayName;

            itemDiv.appendChild(checkbox);
            itemDiv.appendChild(label);
            sourcesCheckboxContainer.appendChild(itemDiv);
        }
        
        // Carrega os contatos existentes
        fetchContacts();
    };

    // READ: Carrega e exibe todos os contatos
    const fetchContacts = async () => {
        try {
            const response = await fetch(API_URL);
            const contacts = await response.json();
            contactsTbody.innerHTML = '';
            contacts.forEach(contact => {
                const tr = document.createElement('tr');
                
                // Mapeia os source_types para seus displayNames
                const sourceNames = (contact.sources || [])
                    .map(key => validationSchemas[key]?.displayName || key)
                    .join(', ');

                tr.innerHTML = `
                    <td>${contact.name || ''}</td>
                    <td>${contact.area || ''}</td>
                    <td>${contact.email || ''}</td>
                    <td>${contact.phone || ''}</td>
                    <td>${sourceNames}</td>
                    <td>
                        <button class="action-btn edit-btn">Editar</button>
                        <button class="action-btn delete-btn">Deletar</button>
                    </td>
                `;

                // Adiciona os event listeners diretamente aos botões
                tr.querySelector('.edit-btn').addEventListener('click', () => editContact(contact));
                tr.querySelector('.delete-btn').addEventListener('click', () => deleteContact(contact.id));
                
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
        
        // Coleta os checkboxes marcados
        const selectedSources = [];
        sourcesCheckboxContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            selectedSources.push(checkbox.value);
        });

        const contactData = {
            name: document.getElementById('name').value,
            area: document.getElementById('area').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            sources: selectedSources // Envia o array de fontes
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
    
    // Botão de cancelar edição
    cancelBtn.addEventListener('click', () => resetForm());

    // --- 3. FUNÇÕES GLOBAIS E AUXILIARES ---

    window.editContact = (contact) => {
        contactIdInput.value = contact.id;
        document.getElementById('name').value = contact.name;
        document.getElementById('area').value = contact.area;
        document.getElementById('email').value = contact.email;
        document.getElementById('phone').value = contact.phone;
        
        // Desmarca todos os checkboxes primeiro
        sourcesCheckboxContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Marca os checkboxes correspondentes às fontes do contato
        if (contact.sources && contact.sources.length > 0) {
            contact.sources.forEach(sourceKey => {
                const checkbox = document.getElementById(`source-${sourceKey}`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }

        cancelBtn.style.display = 'inline-block';
        window.scrollTo(0, 0); // Rola a página para o topo para ver o formulário
    };

    window.deleteContact = async (id) => {
        if (confirm('Tem certeza que deseja deletar este contato?')) {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            fetchContacts();
        }
    };

    // Limpa o formulário e o ID oculto
    window.resetForm = () => {
        form.reset();
        contactIdInput.value = '';
        // Garante que todos os checkboxes sejam desmarcados ao resetar
        sourcesCheckboxContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        cancelBtn.style.display = 'none';
    };

    // --- 4. INICIALIZAÇÃO ---
    initializePage();
});