const express = require('express');
const path = require('path');
const database = require('./database');
const bodyParser = require('body-parser');
const fs = require('fs');



const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.put('/contatos/:id', async (req, res) => {
    const contatoId = req.params.id;
    const { nome, idade, numero } = req.body;

    try {
        await database.query('START TRANSACTION');

        const updateContatoSql = 'UPDATE contato SET nome = ?, idade = ? WHERE id = ?';
        await database.query(updateContatoSql, [nome, idade, contatoId]);

        const updateTelefoneSql = 'UPDATE telefone SET numero = ? WHERE idcontato = ?';
        await database.query(updateTelefoneSql, [numero, contatoId]);

        await database.query('COMMIT');

        res.status(200).send('Contato atualizado com sucesso');
    } catch (error) {
        await database.query('ROLLBACK');

        console.error('Erro ao atualizar contato:', error);
        res.status(500).send('Erro interno do servidor');
    }
});


app.use(bodyParser.json());
app.post('/contato', async (req, res) => {
    const { nome, idade, numero } = req.body;

    try {
        const [contatoResult] = await database.query('INSERT INTO contato (nome, idade) VALUES (?, ?)', [nome, idade]);


        if (!contatoResult || contatoResult.affectedRows !== 1) {
            throw new Error('Erro ao inserir contato');
        }

        const contatoId = contatoResult.insertId;

        await database.query('INSERT INTO telefone (numero, idcontato) VALUES (?, ?)', [numero, contatoId]);

        res.status(201).send('Contato e telefone inseridos com sucesso');
    } catch (error) {
        console.error('Erro ao inserir contato e telefone:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

app.get('/contatos', async (req, res) => {
    try {
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

        const results = await database.query(sql, []);

        if (results && results.length > 0) {
            const extractedResults = results[0];

            res.json(extractedResults);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Erro na consulta:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

app.get('/contatos/:id', async (req, res) => {
    const contatoId = req.params.id;
    try {
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

        const results = await database.query(sql, [contatoId]);

        if (results && results[0].length > 0) {
            const extractedResults = results[0];

            res.json(extractedResults);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Erro na consulta:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

app.delete('/contato/:id', async (req, res) => {
    const contatoId = req.params.id;

    try {
        await database.query('START TRANSACTION');

        await database.query('DELETE FROM telefone WHERE idcontato = ?', [contatoId]);

        const deleteContatoSql = 'DELETE FROM contato WHERE id = ?';
        const deleteContatoResult = await database.query(deleteContatoSql, [contatoId]);

        await database.query('COMMIT');

        const logMessage = `Contato excluído - ID: ${contatoId}, Data: ${new Date().toLocaleString()}\n`;
        const logFilePath = path.join(__dirname, 'logs', 'exclusoes.txt');

        // Adicione o log ao arquivo
        fs.appendFile(logFilePath, logMessage, (err) => {
            if (err) {
                console.error('Erro ao gravar log:', err);
            }
        });

        res.json(deleteContatoResult);
    } catch (error) {
        // Se houver algum erro, faça rollback da transação
        await database.query('ROLLBACK');

        console.error('Erro na exclusão:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

app.get('/contato/filter/:termo', async (req, res) => {
    const termo = req.params.termo; 

    try {
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
                contato.nome LIKE ? OR
                telefone.numero LIKE ?;`;

        const searchTerm = `%${termo}%`;

        const results = await database.query(sql, [searchTerm, searchTerm]);

        if (results && results.length > 0) {
            const extractedResults = results[0];
            res.json(extractedResults);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Erro na consulta:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

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