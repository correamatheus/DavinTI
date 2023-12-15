const express = require('express');
const path = require('path');
const database = require('./database');


const app = express();
const port = process.env.PORT || 3000;

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
