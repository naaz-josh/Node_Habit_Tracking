
import process from 'process'
import app from './server.js'


let port = process.argv[2]
let env = process.argv[3]


app.listen(port , env,()=>{
    console.log(
        `Server is listening on port ${port}`
    )
    console.log(`Server is listening on  ${env} env` )
})