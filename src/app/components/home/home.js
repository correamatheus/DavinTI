export function HomeComponent() {
    return `
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
      <tr>
        <th scope="row">1</th>
        <td>Matheus</td>
        <td>21</td>
        <td>(21)98298-3173</td>
        <td>
           <button class="btn btn-success"><span class="material-icons">
            perm_identity
            </span></button>

           <button class="btn btn-danger"><span class="material-icons">
            delete
            </span></button>

           <button class="btn btn-primary"><span class="material-icons">
            edit
            </span></button>
        </td>      
      </tr>
    </tbody>
  </table>
    `;
}