import { Router } from './router.js';
import { HomeComponent } from './components/home/home.js';
import { ContactsComponent } from './components/contacts/contacts.js';


document.addEventListener('DOMContentLoaded', function () {
    initApp();
});

function initApp() {
    const routes = [
        { path: '/', component: HomeComponent },
        { path: '/contacts', component: ContactsComponent },
 
    ];

    const router = new Router(routes, 'app');

    document.addEventListener('click', function (event) {
        const target = event.target;
        
        if (target.tagName === 'A' && target.getAttribute('href')) {
            event.preventDefault();            
            router.navigateTo(target.getAttribute('href'));
        }
    });

    router.navigateTo('/');
}
