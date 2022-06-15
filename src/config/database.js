const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URI || 'mongodb+srv://root:Hola123@memokemon.xn9u4wd.mongodb.net/?retryWrites=true&w=majority'

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
   if(err){
       console.log('Hubo un error en la conexion', err)
   }else{
       console.log('Database connected successfully')
   }
});

module.exports = async () => {
    return client.db("memokemon");
};