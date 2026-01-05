// arquivo: frontend/dashboard.js


import { validationSchemas } from '../shared/validators.js';

document.addEventListener('DOMContentLoaded', () => {
    
    const navPlaceholder = document.getElementById('nav-placeholder');
    const form = document.getElementById('contact-form');
    const contactIdInput = document.getElementById('contact-id');
    const contactsTbody = document.getElementById('contacts-tbody');
    const cancelBtn = document.getElementById('cancel-btn');
    const sourcesCheckboxContainer = document.getElementById('sources-checkbox-container');
    const phoneInput = document.getElementById('phone');
    const unitSelect = document.getElementById('unit');
    
    const selectAllSourcesCheckbox = document.getElementById('select-all-sources');
    const sourcesFeedback = document.getElementById('sources-feedback');
    
    
    const phoneMask = IMask(phoneInput, {
        mask: [
            { mask: '(00) 0000-0000' },
            { mask: '(00) 00000-0000' }
        ]
    });
    
    

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

        
        sourcesCheckboxContainer.innerHTML = '';
        const sourceKeys = Object.keys(validationSchemas);
        sourceKeys.forEach(key => {
            const schema = validationSchemas[key];
            const itemDiv = document.createElement('div');
            itemDiv.className = 'checkbox-item';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `source-${key}`;
            checkbox.value = key;
            checkbox.classList.add('source-checkbox'); 
            const label = document.createElement('label');
            label.htmlFor = `source-${key}`;
            label.textContent = schema.displayName;
            itemDiv.appendChild(checkbox);
            itemDiv.appendChild(label);
            sourcesCheckboxContainer.appendChild(itemDiv);
        });
        
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

                
                tr.innerHTML = `
                    <td>${contact.name || ''}</td>
                    <td>${contact.unit_name || 'N/A'}</td>
                    <td>${contact.email || ''}</td>
                    <td>${sourceNames}</td>
                    <td>${formattedPhone}</td>
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

        
        const emailInput = document.getElementById('email');
        if (!emailInput.value.includes('@')) {
            alert('Por favor, insira um endereço de e-mail válido.');
            emailInput.focus();
            return;
        }

        const selectedSources = Array.from(sourcesCheckboxContainer.querySelectorAll('input.source-checkbox:checked'))
                                     .map(checkbox => checkbox.value);
        
        
        if (selectedSources.length === 0) {
            sourcesFeedback.style.display = 'block';
            return;
        } else {
            sourcesFeedback.style.display = 'none';
        }
        
        const id = contactIdInput.value;
        const contactData = {
            name: document.getElementById('name').value,
            unit_id: unitSelect.value,
            email: emailInput.value,
            phone: phoneMask.unmaskedValue,
            sources: selectedSources
            
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/contacts/${id}` : '/api/contacts';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao salvar o responsável.');
            }
            
            
            alert(`Responsável ${id ? 'atualizado' : 'salvo'} com sucesso!`);

            resetForm();
            fetchContacts();

        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert(`Ocorreu um erro: ${error.message}`);
        }
    });
    
    cancelBtn.addEventListener('click', () => resetForm());

    
    function updateSelectAllCheckbox() {
        const allSourceCheckboxes = document.querySelectorAll('.source-checkbox');
        const checkedSourceCheckboxes = document.querySelectorAll('.source-checkbox:checked');
        selectAllSourcesCheckbox.checked = allSourceCheckboxes.length > 0 && allSourceCheckboxes.length === checkedSourceCheckboxes.length;
    }

    selectAllSourcesCheckbox.addEventListener('change', () => {
        const allSourceCheckboxes = document.querySelectorAll('.source-checkbox');
        allSourceCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllSourcesCheckbox.checked;
        });
    });

    sourcesCheckboxContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('source-checkbox')) {
            updateSelectAllCheckbox();
        }
    });
    

    

    window.editContact = (contact) => {
        contactIdInput.value = contact.id;
        document.getElementById('name').value = contact.name;
        unitSelect.value = contact.unit_id || '';
        document.getElementById('email').value = contact.email;
        phoneMask.value = contact.phone || '';
        
        
        sourcesCheckboxContainer.querySelectorAll('.source-checkbox').forEach(checkbox => {
            checkbox.checked = contact.sources && contact.sources.includes(checkbox.value);
        });

        updateSelectAllCheckbox(); 
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

    window.resetForm = () => {
        form.reset();
        contactIdInput.value = '';
        unitSelect.value = '';
        phoneMask.value = '';
        sourcesCheckboxContainer.querySelectorAll('.source-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        selectAllSourcesCheckbox.checked = false; 
        sourcesFeedback.style.display = 'none'; 
        cancelBtn.style.display = 'none';
    };

    
    initializePage();
});