import express from 'express'

const app = express()
app.use(express.json())

const users = []

let i = 0;
app.post('/users', (req, res) => {

    users.push(req.body)
    res.send('Usuário criado com susexo!')
})

app.get('/users', (req, res) => {
    res.json(users)
});


app.listen(3000);

//jao
//Jao123


