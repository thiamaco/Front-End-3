const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');

//app
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//template
app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set("views", "./views");
app.use(express.json());

var dados2 = [];

// rotas dos arquivos//
app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + '/style.css');
})
app.get('/script.js', (req, res) => {
  res.sendFile(__dirname + '/script.js');
})

app.get('/', async (req, res) => {
  fetch('http://localhost:3000/results')
    .then(response => response.json())
    .then(data => {
      res.render('table_home', { dados: data });
      dados2 = data;
    })
    .catch(error => {
      console.error('Erro ao buscar os dados:', error);
    })
})

app.get('/add-dados', async (req, res) => {
  try {
    const response = await axios.get('https://randomuser.me/api/?results=1&nat=BR');
    const data = response.data;
    fetch('http://localhost:3000/results', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res.redirect('/'))
      .catch(error => {
        console.error('Erro ao buscar os dados:', error);
      });
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro na requisição.' });
  }
})

app.get('/contatos', async (req, res) => {
  const lista = [];
  fetch('http://localhost:3000/results')
    .then(response => response.json())
    .then(data => {
      res.render('contatos', { dados: data });
    })
    .catch(error => {
      console.error('Erro ao buscar os dados:', error);
    })
});

app.get('/map', (req,res)=>{
  res.render('map',{dados: dados2});
})

app.get('/dados', async (req, res) => {
  res.json(dados2);
  console.log(dados2)
});
/*

app.get('/home',(req,res)=>{

  res.redirect('/')
})

app.get('/map', (req,res)=>{
  res.render('map', dados);
})



app.get('/add-dados', async (req, res) => {
  try {
    const response = await axios.get('https://randomuser.me/api/?nat=BR');
    const data = response.data;
    dados.push(data.results);
    res.json(data.results[0]);
    //res.render('table_home', data);
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro na requisição.' });
  }
});
//requisocoes post//
app.post('/search', async (req, res) => {
  const data = req.body;
  console.log(data)
  const results = [];
  for (const obj of data.objeto) {
    if (obj.gender.includes(data.valor) || obj.location.city.includes(data.valor) || obj.id.value.includes(data.valor)) {
      results.push(obj);
    } else if (data.valor == '') {
      results.push(obj);
    }
  }
  if (data != null) {
    res.render('table_home', data);
  } else {
    res.status(500).json({ error: 'Ocorreu um erro na requisição.' });
  }
})



app.get('/aniversarios', async (req, res) => {
  const aniversarios = [];
  const nomesDosMeses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];
  for (const obj of dados) {
    const aniv = {};
    obj.dob.date = new Date(obj.dob.date);
    aniv.dia = obj.dob.date.getDate()
    aniv.mes = nomesDosMeses[obj.dob.date.getMonth()];
    aniv.ano = obj.dob.date.getFullYear();
    aniv.nome = obj.name.first + " " + obj.name.last;
    aniv.aniversario = obj.dob.aniversario;
    aniv.faltantes = obj.dob.faltantes;
    
    aniversarios.push(aniv);
    console.log(obj.dob.date.dia)
  }
  if (aniversarios != null) {
    res.render('aniversarios', {aniversarios});
  } else {
    res.status(500).json({ error: 'Ocorreu um erro na requisição.' });
  }
});

app.post('/atualizar', async (req, res) => {
  const data = req.body;
  if (data != null) {
    dados = data;
  } else {
    res.status(500).json({ error: 'Erro ao atualizar.' });
  }
});
*/
//server//
const port = 2000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


