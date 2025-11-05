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
    // --- ATENÇÃO: NOVA REFERÊNCIA ---
    const unitSelect = document.getElementById('unit');
    
    // Configuração da máscara de telefone
    const phoneMask = IMask(phoneInput, {
        mask: [
            { mask: '(00) 0000-0000' },
            { mask: '(00) 00000-0000' }
        ]
    });
    
    // --- 2. FUNÇÕES PRINCIPAIS ---

    // Função para buscar unidades e popular o select
    const fetchAndPopulateUnits = async () => {
        try {
            const response = await fetch('/api/units');
            if (!response.ok) throw new Error('Falha ao buscar unidades');
            const units = await response.json();
            
            unitSelect.innerHTML = '<option value="">-- Selecione uma unidade --</option>'; // Mensagem padrão
            units.forEach(unit => {
                const option = document.createElement('option');
                option.value = unit.id;
                option.textContent = unit.name;
                unitSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar unidades:', error);
            unitSelect.innerHTML = '<option value="">-- Erro ao carregar unidades --</option>';
        }
    };

    const initializePage = () => {
        if (navPlaceholder) {
            fetch('nav.html').then(response => response.text()).then(data => {
                navPlaceholder.innerHTML = data;
            }).catch(error => console.error('Erro ao carregar navbar:', error));
        }

        // Popula os checkboxes de fontes
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
        
        // --- ATENÇÃO: CHAMANDO AS NOVAS FUNÇÕES ---
        fetchAndPopulateUnits();
        fetchContacts();
    };

    const fetchContacts = async () => {
        try {
            const response = await fetch('/api/contacts');
            const contacts = await response.json();
            contactsTbody.innerHTML = '';
            contacts.forEach(contact => {
                const tr = document.createElement('tr');
                
                const sourceNames = (contact.sources || [])
                    .map(key => validationSchemas[key]?.displayName || key)
                    .join(', ');

                const formattedPhone = contact.phone ? IMask.pipe(contact.phone, phoneMask) : '';

                // --- ATENÇÃO: RENDERIZANDO A NOVA COLUNA ---
                tr.innerHTML = `
                    <td>${contact.name || ''}</td>
                    <td>${contact.unit_name || 'N/A'}</td>
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
        
        const selectedSources = Array.from(sourcesCheckboxContainer.querySelectorAll('input[type="checkbox"]:checked'))
                                     .map(checkbox => checkbox.value);

        // --- ATENÇÃO: COLETANDO O unit_id ---
        const contactData = {
            name: document.getElementById('name').value,
            unit_id: unitSelect.value, // Novo campo
            area: document.getElementById('area').value,
            email: document.getElementById('email').value,
            phone: phoneMask.unmaskedValue,
            sources: selectedSources
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/contacts/${id}` : '/api/contacts';

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

    // --- ATENÇÃO: FUNÇÃO EDITAR MODIFICADA ---
    window.editContact = (contact) => {
        contactIdInput.value = contact.id;
        document.getElementById('name').value = contact.name;
        unitSelect.value = contact.unit_id || ''; // Novo campo
        document.getElementById('area').value = contact.area;
        document.getElementById('email').value = contact.email;
        phoneMask.value = contact.phone || '';
        
        sourcesCheckboxContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = contact.sources && contact.sources.includes(checkbox.value);
        });

        cancelBtn.style.display = 'inline-block';
        window.scrollTo(0, 0);
    };

    window.deleteContact = async (id) => {
        if (confirm('Tem certeza que deseja deletar este contato?')) {
            await fetch(`/api/contacts/${id}`, {
                method: 'DELETE',
            });
            fetchContacts();
        }
    };

    // --- ATENÇÃO: FUNÇÃO RESET MODIFICADA ---
    window.resetForm = () => {
        form.reset();
        contactIdInput.value = '';
        unitSelect.value = ''; // Limpa o select de unidade
        phoneMask.value = '';
        sourcesCheckboxContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        cancelBtn.style.display = 'none';
    };

    // --- 4. INICIALIZAÇÃO ---
    initializePage();
});