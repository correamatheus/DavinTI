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
          <button class="btn btn-primary btn__editar" data-contact-id="${contato.contato_id}">
            <a style="text-decoration: none; color: white;">
              <span class="material-icons">edit</span>
            </a>
          </button>
        </td>      
      </tr>
    `).join('');
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = `
    <style>
      .card__contatos, .card__editar {
        border-radius: 7px;
        background: #1C1C1C;
        padding: 32px;       
      }

      .contato__th {
        color: #FFF;
        font-family: Sora;
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }

      .contato__tbody {
        color: #BABABA;
        font-family: Sora;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 147%;
      }

      .btn__adicionar {
        width: 330px;       
        flex-shrink: 0;
        border-radius: 7px;
        background: #CFFA61;
        color: #000;
        text-align: center;
        font-family: Sora;
        font-size: 13px;
        font-style: normal;
        font-weight: 400;        
      }

      .btn__filtrar {
        background: #CFFA61;
        color: #000;
        border-radius: 7px;
        text-align: center;
        font-family: Sora;
        font-size: 13px;
        font-style: normal;
        font-weight: 400;
      }

      .inputPesquisa {
        background: #1C1C1C;
        border-radius: 7px;

        color: #888;
        font-family: Sora;
        font-size: 10px;
        font-style: normal;
        font-weight: 400;
        line-height: 130%;
      }

      .deleteButton,.btn__editar {
        background: #CFFA61;
        color:  #000;
        border: none;
      }

      .material-icons {
        color:  #000;
      }

      .label__editar {
        color: #BABABA;
        font-family: Sora;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }

      .input__editar {
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


      .btn__salvar {
          flex-shrink: 0;
          border-radius: 7px;
          background: #CFFA61;
          color: #000;
          text-align: center;
          font-family: Sora;
          font-size: 13px;
          font-style: normal;
          font-weight: 400;
          height: 42px;
          margin-top: 1rem;
        }

      @media (max-width: 768px) {
        .container__filtrar {
          flex-direction: column;
          gap: 8px;
        }

        .btn__adicionar {
          width: 100%;
        }

        .card__contatos {
          padding: 8px;
        }
      }
    </style>
      <div class="row container-fluid" style="gap:8px; height: 100vh;">
        <div class="col-md-6 col-sm-12 card card__contatos">
          <div class="d-flex justify-content-between container__filtrar">         
            <div class="d-flex" style="gap: 8px">
              <input type="text" class="form-control inputPesquisa">
              <button id="btnFiltrar" class="btn btn__filtrar">Filtrar</button>
            </div>
            <a href="/contacts" class="btn btn__adicionar">Adicionar</a>
          </div>      
          <table class="table container mt-3">
            <thead>
              <tr>
                <th scope="col" class="contato__th">#</th>
                <th scope="col" class="contato__th">Nome</th>
                <th scope="col" class="contato__th">Idade</th>
                <th scope="col" class="contato__th">Número</th>
                <th scope="col" class="contato__th">Ações</th>
              </tr>
            </thead>
            <tbody class="contato__tbody">
              ${tableRows}
            </tbody>
          </table>
        </div>
        <div class="col-md-4 col-sm-12 card card__editar">
          <form id="editContactForm" class="d-flex flex-column" style="gap: 8px;">
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

      <label for="editName" class="label__editar">Nome:</label>
      <input type="text" id="editName"  class="input__editar" value="${contact[0].contato_nome}" required>

      <label for="editAge" class="label__editar">Idade:</label>
      <input type="text" id="editAge" class="input__editar" value="${contact[0].contato_idade}" required>

      <label for="editNumber" class="label__editar">Número:</label>
      <input type="text" id="editNumber" class="input__editar" value="${contact[0].telefone_numero}" required>

      <button type="submit" class="btn__salvar">Salvar Edições</button>
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
          <button class="btn btn-primary btn__editar" data-contact-id="${contato.contato_id}">
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




