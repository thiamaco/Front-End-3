const express = require('express');
const axios = require('axios');
const app = express();
const {engine} = require('express-handlebars');

app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set("views", "./views");
app.use(express.json()); 

var dados = [];

app.get('/home', async(req, res) => {
  try {
    const response = await axios.get('https://randomuser.me/api/?results=30&nat=BR');
    const data = response.data;
    dados = data.results;
    res.render('table_home', data);
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro na requisição.' });
  }
});
app.get('/dados', async (req, res) => {
  res.json(dados);
});

app.get('/map', (req,res)=>{
  res.render('map', dados);
})

// rotas dos arquivos e do .json da pagina//
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + '/style.css');
})

app.get('/script.js', (req, res) => {
  res.sendFile(__dirname + '/script.js');
})

app.get('/contexto', (req, res) => {
  res.send(dados);
});
// requisicoes get //



app.get('/add-dados', async (req, res) => {
  try {
    const response = await axios.get('https://randomuser.me/api/?nat=BR');
    const data = response.data;
    dados.push(data.results);
    res.json(data.results[0]);
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro na requisição.' });
  }
});
//requisocoes post//
app.post('/search', async (req, res) => {
  const data = req.body;
  const result = [];
  for (const obj of data.objeto) {
    if (obj.gender.includes(data.valor) || obj.location.city.includes(data.valor) || obj.id.value.includes(data.valor)) {
      result.push(obj);
    } else if (data.valor == '') {
      result.push(obj);
    }
  }
  if (data != null) {
    res.json({ result });
  } else {
    res.status(500).json({ error: 'Ocorreu um erro na requisição.' });
  }
})

app.get('/contatos', async (req, res) => {
  //const data = req.body;
  const lista = [];
  for (const obj of dados) {
    const contatos = {};
    
    contatos.foto = obj.picture.large;
    contatos.nome = obj.name.first + " " + obj.name.last;
    contatos.phone = 'Phone: ' + obj.phone;
    contatos.city = 'Cidade: ' + obj.location.city +', '+obj.location.state;
    lista.push(contatos);
  }
  if (lista != null) {
    res.render('contatos', {lista});
  } else {
    res.status(500).json({ error: 'Ocorreu um erro na requisição.' });
  }
});

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


//server//
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
