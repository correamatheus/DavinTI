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

app.use(bodyParser.json());
app.post('/contato', async (req, res) => {
    const { nome, idade, numero } = req.body;

    try {
        // Execute a inserção do novo contato na tabela 'contatos'
        const [contatoResult] = await database.query('INSERT INTO contato (nome, idade) VALUES (?, ?)', [nome, idade]);

        // Log do resultado da consulta
        console.log('Resultado da inserção de contato:', contatoResult);

        // Verifica se a inserção foi bem-sucedida
        if (!contatoResult || contatoResult.affectedRows !== 1) {
            throw new Error('Erro ao inserir contato');
        }

        const contatoId = contatoResult.insertId;

        // Execute a inserção do telefone associado ao novo contato na tabela 'telefones'
        await database.query('INSERT INTO telefone (numero, idcontato) VALUES (?, ?)', [numero, contatoId]);

        res.status(201).send('Contato e telefone inseridos com sucesso');
    } catch (error) {
        console.error('Erro ao inserir contato e telefone:', error);
        res.status(500).send('Erro interno do servidor');
    }
});









// app.post('/contato', async (req, res) => {
//     const { nome, idade, numero } = req.body;

//     // Inicie uma transação
//     database.beginTransaction(async (err) => {
//         if (err) {
//             console.error('Erro ao iniciar transação:', err);
//             res.status(500).send('Erro interno do servidor');
//             return;
//         }

//         try {
//             // Execute as operações da transação
//             await insertContatoAndTelefone(nome, idade, numero);

//             // Comite a transação se ambas as inserções foram bem-sucedidas
//             database.commit((err) => {
//                 if (err) {
//                     handleTransactionError(err, res);
//                     return;
//                 }

//                 res.status(201).send('Contato e telefone inseridos com sucesso');
//             });
//         } catch (error) {
//             handleTransactionError(error, res);
//         }
//     });
// });

// async function insertContatoAndTelefone(nome, idade, numero) {
//     return new Promise((resolve, reject) => {
//         // Insira o novo contato na tabela 'contatos'
//         const insertContatoSql = 'INSERT INTO contato (nome, idade) VALUES (?, ?)';
//         database.query(insertContatoSql, [nome, idade], (err, results) => {
//             if (err) {
//                 database.rollback(() => reject(err));
//                 return;
//             }

//             const contatoId = results.insertId;

//             // Insira o telefone associado ao novo contato na tabela 'telefones'
//             const insertTelefoneSql = 'INSERT INTO telefone (numero, idcontato) VALUES (?, ?)';
//             database.query(insertTelefoneSql, [numero, contatoId], (err, results) => {
//                 if (err) {
//                     database.rollback(() => reject(err));
//                     return;
//                 }

//                 // Ambas as operações foram bem-sucedidas
//                 resolve();
//             });
//         });
//     });
// }

// function handleTransactionError(err, res) {
//     console.error('Erro na transação:', err);
//     res.status(500).send('Erro interno do servidor');
// }



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
