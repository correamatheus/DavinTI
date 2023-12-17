async function getContatos() {
  try {
    const response = await fetch('http://localhost:3000/contatos');
    return await response.json();
  } catch (error) {
    console.error('Erro ao obter contatos:', error);
    throw error;
  }
}

async function getContactById(id) {
  try {
    const response = await fetch(`http://localhost:3000/contatos/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao obter contato por ID:', error);
    throw error;
  }
}


document.addEventListener('DOMContentLoaded', async function () {
  try {
    await HomeComponent();

  } catch (e) {
    console.error(e);
  }
});

document.addEventListener('submit', async function (event) {
  event.preventDefault();

  const editName = document.getElementById('editName').value;
  const editAge = document.getElementById('editAge').value;
  const editNumber = document.getElementById('editNumber').value;
  const contactId = document.getElementById('editId').value;;

  await updateContact(contactId, editName, editAge, editNumber);
  
  await HomeComponent();
  
});


export async function HomeComponent() {
  try {
   
    const contatosResponse  = await getContatos();
    const contatos = contatosResponse.flat();
    console.log('Contatos recebidos:', contatos);
    const tableRows = contatos.map(contato => `
      <tr>
        <th scope="row">${contato.contato_id}</th>
        <td>${contato.contato_nome}</td>
        <td>${contato.contato_idade}</td>
        <td>${contato.telefone_numero}</td>
        <td>          
          <button class="btn btn-danger deleteButton" data-contact-id="${contato.contato_id}">
            <span class="material-icons">delete</span>
          </button>
          <button class="btn btn-primary" data-contact-id="${contato.contato_id}">
            <a style="text-decoration: none; color: white;">
              <span class="material-icons">edit</span>
            </a>
          </button>
        </td>      
      </tr>
    `).join('');
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = `
      <div class="row">
        <div class="col-md-6">
        <button class="btn btn-success">
          <a href="/contacts">Adicionar +</a>
        </button>
        <div class="d-flex">
          <input type="text" class="form-control inputPesquisa">
          <button id="btnFiltrar" class="btn btn-warning">Filtrar</button>
        </div>
       
          <table class="table container">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nome</th>
                <th scope="col">Idade</th>
                <th scope="col">Número</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
        <div class="col-md-6">
          <form id="editContactForm">
          </form>
        </div>
        
      </div>
    `;

    const editButtons = appContainer.querySelectorAll('.btn-primary');
    editButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const contactId = button.getAttribute('data-contact-id');
        await loadContactDetails(contactId);
        
      });

    const deleteButtons = appContainer.querySelectorAll('.deleteButton');
    deleteButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const contactId = button.getAttribute('data-contact-id');
        console.log(button);
        console.log(contactId);
        await deleteContact(contactId);
      })    
    });

    });


    const btnFiltrar = document.getElementById('btnFiltrar');
    btnFiltrar.addEventListener('click', async () => {
      const termoPesquisa = document.querySelector('.inputPesquisa').value;
      if(termoPesquisa){
        await filterContacts(termoPesquisa);
      }else {
        await HomeComponent();
      }
    });
  } catch (error) {
    console.error('Erro ao criar componente Home:', error);
  }



}

async function loadContactDetails(contactId) {
  try {
    const contact = await getContactById(contactId);
    console.log('Contact:', contact[0]);
    const editContactForm = document.getElementById('editContactForm');

    // Atualize o formulário de edição com os detalhes do contato
    editContactForm.innerHTML = `
      <input type="text" id="editId" hidden value="${contact[0].contato_id}" required>

      <label for="editName">Nome:</label>
      <input type="text" id="editName" value="${contact[0].contato_nome}" required>

      <label for="editAge">Idade:</label>
      <input type="text" id="editAge" value="${contact[0].contato_idade}" required>

      <label for="editNumber">Número:</label>
      <input type="text" id="editNumber" value="${contact[0].telefone_numero}" required>

      <button type="submit">Salvar Edições</button>
    `;
  } catch (error) {
    console.error('Erro ao carregar detalhes do contato:', error);
  }
}

async function updateContact(id, nome, idade, numero) {
  try {
   
    const response = await fetch(`http://localhost:3000/contatos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, idade, numero })
    });
    console.log(response);
    if (!response.ok) {
          throw new Error('Erro ao atualizar contato');
      }

  } catch (error) {
      console.error('Erro ao atualizar contato:', error);
      throw error;
  }
}

async function deleteContact(id) {
  try {
    const response = await fetch(`http://localhost:3000/contato/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Erro ao excluir contato');
    }

    const result = await response.json();
    console.log('Contato excluído com sucesso:', result);
} catch (error) {
    console.error('Erro ao excluir contato:', error);
    throw error;
}
}

// document.addEventListener('DOMContentLoaded', async function () {
//   try {
//     await HomeComponent();

//     const btnFiltrar = document.getElementById('btnFiltrar');
//     btnFiltrar.addEventListener('click', async () => {
//       const termoPesquisa = document.querySelector('.inputPesquisa').value;
//       await filterContacts(termoPesquisa);
//     });
//   } catch (e) {
//     console.error(e);
//   }
// });


async function filterContacts(termo) {
  try {
    const contatosResponse = await fetch(`http://localhost:3000/contato/filter/${termo}`);
    const contatos = await contatosResponse.json();
    console.log("AQUI ESTOU")
    const tableRows = contatos.map(contato => `
      <tr>
        <th scope="row">${contato.contato_id}</th>
        <td>${contato.contato_nome}</td>
        <td>${contato.contato_idade}</td>
        <td>${contato.telefone_numero}</td>
        <td>          
          <button class="btn btn-danger deleteButton" data-contact-id="${contato.contato_id}">
            <span class="material-icons">delete</span>
          </button>
          <button class="btn btn-primary" data-contact-id="${contato.contato_id}">
            <a style="text-decoration: none; color: white;">
              <span class="material-icons">edit</span>
            </a>
          </button>
        </td>      
      </tr>
    `).join('');

    const tbody = document.querySelector('tbody');
    tbody.innerHTML = tableRows;
  } catch (error) {
    console.error('Erro ao filtrar contatos:', error);
  }
}




