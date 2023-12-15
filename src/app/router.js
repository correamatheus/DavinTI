// No arquivo router.js

export class Router {
    constructor(routes, outletId) {
        this.routes = routes;
        this.outlet = document.getElementById(outletId);

        window.addEventListener('popstate', () => {
            this.navigate(window.location.pathname);
        });
    }

    navigateTo(path) {
        this.navigate(path);
        history.pushState({}, '', path);
    }

    navigate(path) {
        const route = this.routes.find(route => route.path === path);
        if (route) {
            this.outlet.innerHTML = route.component();
        } else {
            this.outlet.innerHTML = 'Página não encontrada';
        }
    }
}
