// Importa as classes e funções necessárias de outros arquivos
import { Router } from './router.js';
import { HomeComponent } from './components/home/home.js';
import { ContactsComponent } from './components/contacts/contacts.js';

// Espera o DOM estar completamente carregado para iniciar a aplicação
document.addEventListener('DOMContentLoaded', function () {
    // Inicializa a aplicação
    initApp();
});

// Função principal para inicializar a aplicação
function initApp() {
    // Configura as rotas e componentes da aplicação
    const routes = [
        { path: '/', component: HomeComponent },
        { path: '/contacts', component: ContactsComponent },
    ];

    // Inicializa o roteador com as rotas e o ID do elemento onde o conteúdo será renderizado
    const router = new Router(routes, 'app');

    // Adiciona manipuladores de eventos para links
    document.addEventListener('click', function (event) {
        const target = event.target;
        
        // Verifica se o clique foi em um link
        if (target.tagName === 'A' && target.getAttribute('href')) {
            // Evita o comportamento padrão de um link (recarregar a página)
            event.preventDefault();
            
            // Navega para a URL do link usando o roteador
            router.navigateTo(target.getAttribute('href'));
        }
    });

    // Inicia a aplicação com a rota padrão (por exemplo, '/')
    router.navigateTo('/');
}
