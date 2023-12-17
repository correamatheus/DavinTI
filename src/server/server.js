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
    const { nome, idade, numero } = req.body; // Certifique-se de ter o middleware body-parser configurado para poder acessar req.body

    try {
        // Inicie uma transação
        await database.query('START TRANSACTION');

        // Atualize o contato na tabela 'contatos'
        const updateContatoSql = 'UPDATE contato SET nome = ?, idade = ? WHERE id = ?';
        await database.query(updateContatoSql, [nome, idade, contatoId]);

        // Atualize o telefone associado ao contato na tabela 'telefones'
        const updateTelefoneSql = 'UPDATE telefone SET numero = ? WHERE idcontato = ?';
        await database.query(updateTelefoneSql, [numero, contatoId]);

        // Commit da transação
        await database.query('COMMIT');

        res.status(200).send('Contato atualizado com sucesso');
    } catch (error) {
        // Se houver um erro, faça o rollback da transação
        await database.query('ROLLBACK');

        console.error('Erro ao atualizar contato:', error);
        res.status(500).send('Erro interno do servidor');
    }
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
            // Extrai diretamente o primeiro array de resultados
            const extractedResults = results[0];

            // Agora você pode enviar os resultados extraídos como JSON
            res.json(extractedResults);
        } else {
            res.json([]); // ou res.json([]) se preferir enviar um array vazio em caso de nenhum resultado
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
            // Extrai diretamente o primeiro array de resultados
            const extractedResults = results[0];

            // Agora você pode enviar os resultados extraídos como JSON
            res.json(extractedResults);
        } else {
            res.json([]); // ou res.json([]) se preferir enviar um array vazio em caso de nenhum resultado
        }
    } catch (error) {
        console.error('Erro na consulta:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

app.delete('/contato/:id', async (req, res) => {
    const contatoId = req.params.id;

    try {
        // Inicie uma transação
        await database.query('START TRANSACTION');

        // Exclua os registros relacionados na tabela telefone
        await database.query('DELETE FROM telefone WHERE idcontato = ?', [contatoId]);

        // Agora, exclua o contato
        const deleteContatoSql = 'DELETE FROM contato WHERE id = ?';
        const deleteContatoResult = await database.query(deleteContatoSql, [contatoId]);

        // Confirme a transação
        await database.query('COMMIT');

        // Gere o log
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
    const termo = req.params.termo; // Corrigi para pegar o parâmetro correto

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

        // Utilize '%' para corresponder a qualquer parte do nome ou número
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


// app.delete('/contato/:id', async (req, res) => {
//     const contatoId = req.params.id;

//     try {
//         // Consulta para obter os detalhes do contato antes da exclusão
//         const consultaContato = `
//             SELECT 
//                 contato.id AS contato_id,
//                 contato.nome AS contato_nome,
//                 contato.idade AS contato_idade,
//                 telefone.numero AS telefone_numero
//             FROM 
//                 contato
//             JOIN 
//                 telefone ON contato.id = telefone.idcontato
//             WHERE 
//                 contato.id = ?;`;

//         const results = await database.query(consultaContato, [contatoId]);

//         if (results && results[0].length > 0) {
//             const contato = results[0][0];

//             // Consulta para excluir o contato
//             const deleteContato = 'DELETE FROM contato WHERE id = ?;';
//             await database.query(deleteContato, [contatoId]);

//             // Geração do log em arquivo TXT
//             const logFilePath = path.join(__dirname, 'exclusoes.log');
//             const logEntry = `${contato.contato_id},${contato.contato_nome},${contato.contato_idade},${contato.telefone_numero},${new Date().toISOString()}\n`;

//             fs.appendFile(logFilePath, logEntry, (err) => {
//                 if (err) {
//                     console.error('Erro ao escrever no arquivo de log:', err);
//                 } else {
//                     console.log('Log atualizado com sucesso.');
//                 }
//             });

//             res.json({ message: 'Contato excluído com sucesso.' });
//         } else {
//             res.status(404).json({ error: 'Contato não encontrado.' });
//         }
//     } catch (error) {
//         console.error('Erro na exclusão:', error);
//         res.status(500).send('Erro interno do servidor');
//     }
// });
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