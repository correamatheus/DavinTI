const express = require('express');
const path = require('path');
const database = require('./database');
const bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.put('/contatos/:id', (req, res) => {
    const contatoId = req.params.id;
    const { nome, idade, numero } = req.body; // Certifique-se de ter o middleware body-parser configurado para poder acessar req.body

    const sql = `
        UPDATE contato
        SET nome = ?, idade = ?
        WHERE id = ?;
    `;

    database.query(sql, [nome, idade, contatoId], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar contato:', err);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.status(200).send('Contato atualizado com sucesso');
        }
    });
});

app.get('/contatos', (req, res) => {
    const sql = `
    SELECT 
        contato.id AS contato_id,
        contato.nome AS contato_nome,
        contato.idade AS contato_idade,
        telefone.numero AS telefone_numero
    FROM 
        contato
    JOIN 
        telefone ON contato.id = telefone.idcontato;`;

    database.query(sql, [], (err, results) => {
        if (err) {
            console.error('Erro na consulta:', err);
            res.status(500).send('Erro interno do servidor');
        } else {
            res.json(results);
        }
    });
});

app.get('/contatos/:id', (req, res) => {
    const contatoId = req.params.id;

    const sql = `
    SELECT 
        contato.id AS contato_id,
        contato.nome AS contato_nome,
        contato.idade AS contato_idade,
        telefone.numero AS telefone_numero
    FROM 
        contato
    JOIN 
        telefone ON contato.id = telefone.idcontato
    WHERE 
        contato.id = ?;`;

    database.query(sql, [contatoId], (err, results) => {
        if (err) {
            console.error('Erro na consulta:', err);
            res.status(500).send('Erro interno do servidor');
        } else if (results.length === 0) {
            res.status(404).send('Contato não encontrado');
        } else {
            res.json(results[0]);
        }
    });
});





// Middleware para servir todos os arquivos estáticos com o tipo de conteúdo apropriado
app.use(express.static(path.join(__dirname, '../app'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        } else if (path.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
        }
    },
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../app', 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
