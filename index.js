const app = require('./src/config/app')
const dotenv = require('dotenv')
dotenv.config()

app.listen(process.env.PORT,()=>{
    console.log('escuchando en puerto', process.env.PORT)
})