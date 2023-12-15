// src/server/database.js
const mysql = require('mysql');

// Configuração da conexão com o MySQL
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'vintiti',
    port: 3306,
});

// Conectar ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
    } else {
        console.log('Conexão bem-sucedida ao MySQL');
    }
});

// Função para executar consultas no banco de dados
function query(sql, params, callback) {
    connection.query(sql, params, (err, results) => {
        if (err) {
            console.error('Erro na consulta:', err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

// Exportar a função de consulta para uso em outros módulos
module.exports = {
    query,
};
