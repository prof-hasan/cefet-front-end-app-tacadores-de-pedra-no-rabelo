import express from 'express'

const app = express()

app.get('/users', (req, res) => {
    app.send('ta certo chefe')
});


app.listen(3000);