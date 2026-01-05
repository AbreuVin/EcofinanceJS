// arquivo: frontend/main.js

document.addEventListener('DOMContentLoaded', () => {
    
    const navPlaceholder = document.getElementById('nav-placeholder');
    
    if (navPlaceholder) {
        
        fetch('nav.html')
            .then(response => response.text())
            .then(data => {
                
                navPlaceholder.innerHTML = data;
            })
            .catch(error => {
                console.error('Erro ao carregar a barra de navegação:', error);
                navPlaceholder.innerHTML = '<p>Erro ao carregar menu.</p>';
            });
    }
});