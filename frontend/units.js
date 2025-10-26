// arquivo: frontend/units.js

document.addEventListener('DOMContentLoaded', () => {
    // Carrega o Navbar
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        fetch('nav.html').then(response => response.text()).then(data => {
            navPlaceholder.innerHTML = data;
        }).catch(error => console.error('Erro ao carregar navbar:', error));
    }

    const form = document.getElementById('unit-form');
    const unitIdInput = document.getElementById('unit-id');
    const unitsTbody = document.getElementById('units-tbody');
    const cancelBtn = document.getElementById('cancel-btn');

    const API_URL = '/api/units';

    const fetchUnits = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                // Se a resposta não for OK, lança um erro para ser pego pelo catch
                throw new Error(`Erro do servidor: ${response.status}`);
            }
            const units = await response.json();
            
            unitsTbody.innerHTML = '';
            
            // Verifica se a resposta é de fato um array antes de iterar
            if (Array.isArray(units)) {
                units.forEach(unit => {
                    const tr = document.createElement('tr');
                    // Usando '??' (nullish coalescing operator) para garantir que strings vazias sejam exibidas
                    tr.innerHTML = `
                        <td>${unit.name ?? ''}</td>
                        <td>${unit.address ?? ''}</td>
                        <td>
                            <button class="action-btn edit-btn" onclick="editUnit(${unit.id}, '${unit.name ?? ''}', '${unit.address ?? ''}')">Editar</button>
                            <button class="action-btn delete-btn" onclick="deleteUnit(${unit.id})">Deletar</button>
                        </td>
                    `;
                    unitsTbody.appendChild(tr);
                });
            } else {
                 console.error("A resposta da API não é um array:", units);
            }
        } catch (err) {
            console.error("Falha ao buscar unidades", err);
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = unitIdInput.value;
        const unitData = {
            name: document.getElementById('name').value,
            address: document.getElementById('address').value,
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/${id}` : API_URL;

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(unitData),
        });

        resetForm();
        fetchUnits();
    });
    
    cancelBtn.addEventListener('click', () => resetForm());

    window.editUnit = (id, name, address) => {
        unitIdInput.value = id;
        document.getElementById('name').value = name;
        document.getElementById('address').value = address;
        cancelBtn.style.display = 'inline-block';
    };

    window.deleteUnit = async (id) => {
        if (confirm('Tem certeza que deseja deletar esta unidade?')) {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchUnits();
        }
    };

    window.resetForm = () => {
        form.reset();
        unitIdInput.value = '';
        cancelBtn.style.display = 'none';
    };

    fetchUnits();
});