// arquivo: frontend/main.js

document.addEventListener('DOMContentLoaded', () => {
    // Encontra o placeholder da navegação
    const navPlaceholder = document.getElementById('nav-placeholder');
    
    if (navPlaceholder) {
        // Busca o conteúdo do nav.html
        fetch('nav.html')
            .then(response => response.text())
            .then(data => {
                // Insere o HTML da navegação no placeholder
                navPlaceholder.innerHTML = data;
            })
            .catch(error => {
                console.error('Erro ao carregar a barra de navegação:', error);
                navPlaceholder.innerHTML = '<p>Erro ao carregar menu.</p>';
            });
    }
});