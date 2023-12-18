import { HomeComponent } from "../home/home.js";

document.addEventListener('submit', async function (event) {
    if (event.target.id === 'addContactForm') {
        event.preventDefault();
        const nome = document.getElementById('nome').value;
        const idade = document.getElementById('idade').value;
        const numero = document.getElementById('numero').value;
        await addContact(nome, idade, numero);
        await HomeComponent();
    }
});


export function ContactsComponent() {
    return `
        <style>
            #addContactForm {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            #addContactForm input {
                border-radius: 8px;
                background: rgba(68, 68, 68, 0.25);
                height: 42px;
                border: none;
                color: #888;
                text-align: center;
                font-family: Sora;
                font-size: 10px;
                font-style: normal;
                font-weight: 400;
                line-height: 130%;
            }

            #addContactForm label {
                color: #BABABA;
                font-family: Sora;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
            }

            #addContactForm button {
                flex-shrink: 0;
                border: none;
                height: 42px;
                border-radius: 7px;
                background: #CFFA61;
                color: #000;
                text-align: center;
                font-family: Sora;
                font-size: 13px;
                font-style: normal;
                font-weight: 400;
            }
        </style>
        <h1>Agenda de Contatos</h1>
        <form id="addContactForm" class="container">
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
