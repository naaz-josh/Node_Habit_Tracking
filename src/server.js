import express from 'express'
import process from 'process'
import helmet from 'helmet'
import cors from 'cors'
import morgan from  'morgan'


const app =express()

console.log("hello world!")
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
     extended: true
}))
app.use(morgan('dev'))

app.get('/',(req,res)=>{

    res.statusCode(200)
    .json({
        message: "All the Habits are retrieved successfully",
        data: {
            name: "gym",
            description: "going gym everyday"
        }
    })
   
    res.send("All the Habits are retrived succesfully")

   
})

export default app