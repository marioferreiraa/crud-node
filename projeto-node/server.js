const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://euosb:Root1234@cluster0-kejyr.mongodb.net/test?retryWrites=true&w=majority";

MongoClient.connect(uri, (err, client) => {
    if(err) return console.log(err)
    db = client.db('Teste')

    app.listen(3000, function(){
        console.log('server running on port 3000')
    })
})

app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/show', (req,res) => {
    db.collection('colTestes').find().toArray((err, results) => {
        if(err) return console.log(err)
        res.render('show.ejs', { data: results })
    })
})

app.post('/show', (req, res) => {
    db.collection('colTestes').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('salvo no banco de dados')
        res.redirect('/show')
    })
})

app.route('/edit/:id')
    .get((req, res) =>{
        var id = req.params.id
        db.collection('colTestes').find(ObjectId(id)).toArray((err, result) => {
            if(err) return console.log(err)
            res.render('edit.ejs', { data: result })    
        })
    })
    .post((req, res) => {
        var id = req.params.id
        var name = req.body.name
        var surname = req.body.surname
        db.collection('colTestes').updateOne({_id: ObjectId(id)}, {
            $set: {
                name: name,
                surname: surname
            }
        }, (err, result) => {
            if (err) return res.send(err)
            res.redirect('/show')
            console.log('Atualizado no Banco de dados')
        })
    })

app.route('/delete/:id')
    .get((req, res) => {
        var id = req.params.id

        db.collection('colTestes').deleteOne({_id: ObjectId(id)}, (err, result) => {
            if (err) return res.send(500, err)
            console.log('Deletando do Banco de Dados!')
            res.redirect('/show')
        })
    })

