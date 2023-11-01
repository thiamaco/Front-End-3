const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

var dados = [];
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
app.get('/inicializacao', async (req, res) => {
  try {
    const response = await axios.get('https://randomuser.me/api/?results=30&nat=BR');
    const data = response.data;
    dados = data.results;
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro na requisição.' });
  }
});

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

app.post('/lista-contatos', async (req, res) => {
  const data = req.body;
  const lista = [];
  dados = data.objeto;
  for (const obj of data.objeto) {
    const contatos = {};
    contatos.foto = obj.picture.large;
    contatos.nome = obj.name.first + " " + obj.name.last;
    contatos.phone = 'Phone: ' + obj.phone;
    contatos.pais = 'Pais: ' + obj.location.country;
    lista.push(contatos);
  }
  if (data != null) {
    res.json({ lista });
  } else {
    res.status(500).json({ error: 'Ocorreu um erro na requisição.' });
  }
});

app.post('/atualizar', async (req, res) => {
  const data = req.body;
  if (data != null) {
    dados = data;
    res.json({data})
  } else {
    res.status(500).json({ error: 'Erro ao atualizar.' });
  }
});

//server//
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
