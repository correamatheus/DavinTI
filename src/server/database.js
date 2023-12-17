const mysql = require('mysql2');

// Configuração da conexão com o MySQL
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'vintiti',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Exportar o pool para uso em outros módulos
module.exports = pool.promise();
