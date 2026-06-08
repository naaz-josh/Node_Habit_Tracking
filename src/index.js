import express from 'express'
import process from 'process'
const app =express()

console.log("Hello World")
 

let port = process.argv[2]
let env = process.argv[3]


app.get('/',(req,res)=>{
    res.send("All the Habits are retrived succesfully")
})


app.listen(port , name,()=>{
    console.log(
        `Server is listening on port ${port}`
    )
    console.log(`Server is listening on  ${name} env` )
})