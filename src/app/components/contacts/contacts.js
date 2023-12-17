document.addEventListener('submit', async function (event) {
    // Verificar se o evento ocorreu no formulário correto
    if (event.target.id === 'addContactForm') {
        event.preventDefault();
        console.log("EVENTO");
        const nome = document.getElementById('nome').value;
        const idade = document.getElementById('idade').value;
        const numero = document.getElementById('numero').value;

        await addContact(nome, idade, numero);
    }
});


export function ContactsComponent() {
    return `
        <h1>Agenda de Contatos</h1>
        <form id="addContactForm">
            <label for="nome">Nome:</label>
            <input type="text" id="nome" required>

            <label for="numero">Número:</label>
            <input type="text" id="numero" required>

            <label for="idade">Idade:</label>
            <input type="number" id="idade" required>

            <button type="submit">Adicionar Contato</button>
        </form>

    `;
}

async function addContact(nome, idade, numero) {
    try {
        const response = await fetch(`http://localhost:3000/contato`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, idade, numero }),
        });

        if (!response.ok) {
            throw new Error('Erro ao criar contato');
        }
    } catch (error) {
        console.error('Erro ao criar contato:', error);
        throw error;
    }
}
