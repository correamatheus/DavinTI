// No arquivo components/contacts.js

export function ContactsComponent() {
    return `
        <h1>Agenda de Contatos</h1>
        <form id="addContactForm">
            <label for="name">Nome:</label>
            <input type="text" id="name" required>

            <label for="number">Número:</label>
            <input type="text" id="number" required>

            <button type="submit">Adicionar Contato</button>
        </form>

        <ul id="contactsList">
            <!-- A lista de contatos será exibida aqui -->
        </ul>
    `;
}
