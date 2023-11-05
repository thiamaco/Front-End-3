const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');
//app
const app = express();
//body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//template
app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set("views", "./views");
app.use(express.json());
var DiaAtual = new Date();

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
  fetch('http://localhost:3000/results')
    .then(response => response.json())
    .then(data => {
      res.render('contatos', { dados: data });
    })
    .catch(error => {
      console.error('Erro ao buscar os dados:', error);
    })
});

app.get('/map', (req, res) => {
  fetch('http://localhost:3000/results')
  .then(response => response.json())
  .then(data => {
    res.render('map', { dados: data });
  })
  .catch(error => {
    console.error('Erro ao buscar os dados:', error);
  })
  
})

app.get('/dados', async (req, res) => {
  fetch('http://localhost:3000/results')
    .then(response => response.json())
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      console.error('Erro ao buscar os dados:', error);
    })
});

app.get('/aniversarios', async (req, res) => {
  fetch('http://localhost:3000/results')
  .then(response => response.json())
  .then(data => {
  
  
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
  for (var i = 0; i < data.length; i++) {
    data[i].results[0].dob.date = new Date(data[i].results[0].dob.date);
    const aniv = {};
    aniv.dia = data[i].results[0].dob.date.getDate()
    aniv.mes = nomesDosMeses[data[i].results[0].dob.date.getMonth()];
    aniv.ano = data[i].results[0].dob.date.getFullYear();
    aniv.nome = data[i].results[0].name.first + " " + data[i].results[0].name.last;
    var dias = Math.floor((new Date(2023, data[i].results[0].dob.date.getMonth(), aniv.dia) - DiaAtual) / (1000 * 60 * 60 * 24))
      if (dias >= 0) {
        aniv.aniversario = dias = dias + 1;
      } else {
        aniv.aniversario = dias = (dias + 365) + 1;
      }
    aniversarios.push(aniv);
    }
  aniversarios.sort(compareNames);
  res.render('aniversarios', { dados: aniversarios });

})
.catch(error => {
  console.error('Erro ao buscar os dados:', error);
})
});

function compareNames(a, b) {
  if (a.aniversario < b.aniversario) return -1;
  if (a.aniversario > b.aniversario) return 1;
  return 0;
}



//server//
const port = 2000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


