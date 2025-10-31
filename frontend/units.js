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
                throw new Error(`Erro do servidor: ${response.status}`);
            }
            const units = await response.json();
            
            unitsTbody.innerHTML = '';
            
            if (Array.isArray(units)) {
                units.forEach(unit => {
                    const tr = document.createElement('tr');
                    
                    // --- ATENÇÃO: MUDANÇA AQUI ---
                    tr.innerHTML = `
                        <td>${unit.name ?? ''}</td>
                        <td>${unit.cidade ?? ''}</td>
                        <td>${unit.estado ?? ''}</td>
                        <td>${unit.pais ?? ''}</td>
                        <td>${unit.numero_colaboradores ?? ''}</td>
                        <td>
                            <button class="action-btn edit-btn" onclick="editUnit(${unit.id}, '${unit.name ?? ''}', '${unit.cidade ?? ''}', '${unit.estado ?? ''}', '${unit.pais ?? ''}', '${unit.numero_colaboradores ?? ''}')">Editar</button>
                            <button class="action-btn delete-btn" onclick="deleteUnit(${unit.id})">Deletar</button>
                        </td>
                    `;
                    // --- FIM DA MUDANÇA ---

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
        
        // --- ATENÇÃO: MUDANÇA AQUI ---
        const unitData = {
            name: document.getElementById('name').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value,
            pais: document.getElementById('pais').value,
            numero_colaboradores: document.getElementById('numero-colaboradores').value,
        };
        // --- FIM DA MUDANÇA ---

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
    
    // --- ATENÇÃO: MUDANÇA AQUI ---
    window.editUnit = (id, name, cidade, estado, pais, numero_colaboradores) => {
        unitIdInput.value = id;
        document.getElementById('name').value = name;
        document.getElementById('cidade').value = cidade;
        document.getElementById('estado').value = estado;
        document.getElementById('pais').value = pais;
        document.getElementById('numero-colaboradores').value = numero_colaboradores;
        cancelBtn.style.display = 'inline-block';
    };
    // --- FIM DA MUDANÇA ---

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