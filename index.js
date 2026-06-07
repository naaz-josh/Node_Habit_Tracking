import express from 'express'

const app =express()

app.get('/',(req,res)=>{
    res.send("All the Habits are retrived succesfully")
})


app.listen(3002,()=>{
    console.log(
        "Server is listening on port 3002"
    )
})