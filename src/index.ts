//Importaciones de ambiente
import dotenv from 'dotenv';

//Importacion de server y base de datos
import Server from './server/server';
import DBConn from './database/dbconfig';


//Variables de configuracion
dotenv.config();
const port: number = parseInt(process.env.PORT || '3000');
const connectionString: string = process.env.DB_CNN || '';

//DB
if (connectionString === '') {
    console.log('No existe connection string definida en archivo de env.');
} else {
    const dbConn = new DBConn(connectionString);
    dbConn.connect();
}

//App
const server = Server.init(port);

//Escuchar peticiones
server.start(() => {
    console.log(`Servidor corriendo en el puerto: ${port}`);
})