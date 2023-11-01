var dados = [];
var CoordAtualizados =[]

const contatos = document.getElementById('contatos');
const tableBody = document.getElementById('table-body');
const pontos = document.getElementById('pontos');
var bodyAniver = document.getElementById("body-aniver");
var DiaAtual = new Date();
// requsiçao para iniciar a pagina com os dados, se for utilizado um banco de dados aqui puxaria os dados do banco//
fetch('/inicializacao')
.then(response => response.json())
.then(data => {
  dados = data;
    for(var i=0; i<dados.length;i++){
      //converte o Timestamp para um objeto date
      dados[i].dob.date = new Date(dados[i].dob.date);
      var aniv =  new Date(2023,dados[i].dob.date.getMonth(),dados[i].dob.date.getDate())
      var dias = Math.floor((aniv-DiaAtual) / (1000 * 60 * 60 * 24))
        if(dias>=0){
          dados[i].dob.aniversario=dias+1;
        }else{
        dados[i].dob.aniversario=(dias+365)+1;
        }
      render(dados[i])
    }
})
.catch(error => console.error('Erro:', error));

//renderiza uma pessoa na tela home//
function render(pessoa) {
  const row = document.createElement('tr');
  const age = document.createElement('td');
  const gender = document.createElement('td');
  const namefirst = document.createElement('td');
  const namelast = document.createElement('td');
  const phone = document.createElement('td');
  const city = document.createElement('td');
  const state = document.createElement('td');
  const email = document.createElement('td');
  const cpf = document.createElement('td');
  age.textContent = pessoa.dob.age;
  gender.textContent = pessoa.gender;
  namefirst.textContent = pessoa.name.first + " " + pessoa.name.last;
  phone.textContent = pessoa.phone;
  city.textContent = pessoa.location.city
  state.textContent = pessoa.location.state;
  email.textContent = pessoa.email;
  cpf.textContent = pessoa.id.value;
  row.appendChild(namefirst);
  row.appendChild(age);
  row.appendChild(gender);
  row.appendChild(city);
  row.appendChild(state);
  row.appendChild(email);
  row.appendChild(cpf);
  row.appendChild(phone);
  tableBody.appendChild(row);
}
//evento para adicionar uma nova pessoa ao sistema, fazendo uma requisiçao add-dados//
$('.add-user').on('click', function () {
  fetch('/add-dados')
    .then(response => response.json())
    .then(data => {
      data.dob.date = new Date(data.dob.date);
      var aniv =  new Date(2023,dados[i].dob.date.getMonth(),dados[i].dob.date.getDate())
      var dias = Math.floor((aniv-DiaAtual) / (1000 * 60 * 60 * 24))
        if(dias>=0){
          dados[i].dob.aniversario=dias+1;
        }else{
        dados[i].dob.aniversario=(dias+365)+1;
        }
      dados.push(data)
      render(data)
      $("#message-add").fadeIn();
      setTimeout(function () {
        $("#message-add").fadeOut();
      }, 2000);
    })
    .catch(error => console.error('Erro:', error));
})
//evento para filtrar a tabela home, variando por idade, city, ou cpf da pessoa//
$("#btnsearch").on('click', function () {
  tableBody.innerHTML = '';
  var value = $('.pesquisar').val();
    $.ajax({
      type: 'POST',
      url: '/search',
      contentType: 'application/json',
      data: JSON.stringify({ objeto: dados, valor: value }),
      success: function (data) {
        for (var i = 0; i < data.result.length; i++) {
          render(data.result[i]);
        }
      },
      error: function (xhr, status, error) {
        console.error('Falha na solicitação:', error);
      }
    })
});
//evento enter do input de pesquisa//
$(document).ready(function () {
  $(".pesquisar").keyup(function (e) {    
    if (e.keyCode === 13) {
    $("#btnsearch").click();
    }
  });
});
//exibe a tabela do home e oculta qualque outra tabela que era visto antes
$('.tabela-home').on("click", function () {
  $('#contatos').hide();
  $('.icon').hide();
  $('.search').show();
  $('.table').show();
  $('#map').hide();
  $('#procurar').hide();
  $('.table-aniver').hide();
});
//evento a pagina de contatos, fazendo uma requisiçao
$('.lista-contatos, .icon').on('click', function () {
  contatos.innerHTML = '';
  $.ajax({
    type: 'POST',
    url: '/lista-contatos',
    contentType: 'application/json',
    data: JSON.stringify({ objeto: dados }),
    success: function (data) {
      console.log(data);
      for (var i = 0; i < data.lista.length; i++) {
        renderLista(data.lista[i]);
      }
      $('.icon').show();
      $('#contatos').show();
      $('.search').hide();
      $('.table').hide();
      $('#map').hide();
      $("#procurar").hide();
      $('.table-aniver').hide();
    },
    error: function (xhr, status, error) {
      console.error('Falha na solicitação:', error);
    }
  });
});
//renderiza os contato da lista de contato
function renderLista(lista) {
  const user = document.createElement('div');
  const divimg = document.createElement('div');
  const contato = document.createElement('div');
  contato.classList.add('cont');
  user.classList.add('dados');
  const div = document.createElement('div');
  const img = document.createElement('img');
  const nome = document.createElement('h3');
  const phone = document.createElement('h6');
  const pais = document.createElement('h6');
  img.src = lista.foto;
  phone.textContent = lista.phone;
  pais.textContent = lista.pais;
  nome.textContent = lista.nome;
  div.appendChild(nome)
  div.appendChild(phone)
  div.appendChild(pais)
  contato.appendChild(div)
  divimg.appendChild(img);
  user.appendChild(divimg)
  user.appendChild(contato)
  contatos.append(user)
}
// renderiza um mapa com foco incial em porto alegre
let map;
async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const myLatLng = { lat: -30.0277, lng: -51.2287 };
  map = new Map(document.getElementById("map"), {
    center: myLatLng,
    zoom: 8,
  });
}
initMap();
//evento para abrir um mapa na tela, exibindo a localizaçao de todos do sistema
$('.street').on('click', function () {
  ajustarcoord(dados)
    $('#map').show();
    $('#procurar').show();
    $('.table').hide()
    $('.search').hide();
    $('#contatos').hide();
    $('.icon').hide();
    $('.table-aniver').hide();
});
//funcao para ajustar as coordenadas de acordo o nome da rua e a cidade da pessoa//
function ajustarcoord(dados){
  for(var i=0;i<dados.length;i++){
    var loc = dados[i].location.street.name+', '+dados[i].location.city  
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': loc }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        var locations ={}
        locations.lat=results[0].geometry.location.lat();
        locations.lng=results[0].geometry.location.lng();  
          CoordAtualizados.push(locations);
      } else {
          console.log( "erro pos:"+i);
          CoordAtualizados.push('erro');
      }
    });
  }
  setTimeout(()=>{
    for(var i=0;i<dados.length;i++){
    if(CoordAtualizados[i]!='erro')
      dados[i].location.coordinates = CoordAtualizados[i];
    }
    if(i==dados.length){
      rendermarcadores(dados);
      options(dados);
      atualizar();
    }
  },2000)
}
//renderiza os marcadores no mapa
function rendermarcadores(objeto) {
  for (var i = 0; i < objeto.length; i++) { 
    new google.maps.Marker({
      position: objeto[i].location.coordinates,
      map: map,
      title: objeto[i].name.first + ' ' + objeto[i].name.last,
    });
  }
}
//funcao para dar o foco da pessoa selecionado no select#pontos
function focusOnPoint(objeto, i) {
  const newLatLng = new google.maps.LatLng(objeto[i].location.coordinates.lat, objeto[i].location.coordinates.lng);
  map.panTo(newLatLng);
  map.setZoom(12);
}
//renderiza as opcoes a ser selecionada para o usuario//
function options(objeto) {
  for (var i = 0; i < objeto.length; i++) {
    const option = document.createElement('option');
    option.innerText = objeto[i].name.first + ' ' + objeto[i].name.last
    option.value = i;
    pontos.appendChild(option);
  }
}
//evento quando há alguma alteraçao no select para alterar o foco no mapa
$("#procurar").on("change", function () {
  var opcaoSelecionada = $(this).find("option:selected").val();
  focusOnPoint(dados, opcaoSelecionada);
});
//funcao para atualizar os dados com as novas coordenadas no backend//
function atualizar(){
  $.ajax({
    type: 'POST',
    url: '/atualizar',
    contentType: 'application/json',
    data: JSON.stringify(dados),
    error: function (xhr, status, error) {
      console.error('Falha na solicitação:', error);
    }
  })
}
//exibe os aniversarios das pessoas
$('.lista-aniver').on('click',function(){
  bodyAniver.innerHTML="";
  $('#map').hide();
    $('#procurar').hide();
    $('.table').hide()
    $('.search').hide();
    $('#contatos').hide();
    $('.icon').hide();
    
  $('.table-aniver').show();
  for(var i=0;i<dados.length;i++){
    aniver(dados[i]);
    if(i==dados.length-1){
      ordenarTabelaPorDia();
    }
  }
  
})

/*setTimeout(()=>{
//function falta(){
  for(var i=0;i<dados.length;i++){
    var aniv =  new Date(2023,dados[i].dob.date.getMonth(),dados[i].dob.date.getDate())
    var dias = Math.floor((aniv-DiaAtual) / (1000 * 60 * 60 * 24))
    if(dias>=0){
      dados[i].dob.aniversario=(dias);
    }else{
    dados[i].dob.aniversario=(dias+365);
    }
  }
//}
},2000)
*/
//funcao para renderizar as datas na tela//
function aniver(objeto) {
  const row = document.createElement('tr');
  const nome = document.createElement('td');
  const dia = document.createElement('td');
  const mes = document.createElement('td');
  const ano = document.createElement('td');
  const aniv = document.createElement('td');
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
  const mesv= objeto.dob.date.getMonth();
  dia.textContent = objeto.dob.date.getDate()
  mes.textContent = nomesDosMeses[mesv];
  ano.textContent = objeto.dob.date.getFullYear()
  nome.textContent = objeto.name.first + " " + objeto.name.last;
  aniv.textContent = objeto.dob.aniversario;
  row.appendChild(nome);
  row.appendChild(dia);
  row.appendChild(mes);
  row.appendChild(ano);
  row.appendChild(aniv);
  bodyAniver.appendChild(row);
}
//ordena a tabela por faltante//
function ordenarTabelaPorDia() {
  var $tabela = $('.table-aniver');
  var linhas = $tabela.find('tr').get();
  var cabecalho = linhas.shift();
  linhas.sort(function(a, b) {
    var diaA = parseInt($(a).find('td:last-child').text());
    var diaB = parseInt($(b).find('td:last-child').text());
    return diaA - diaB;
  });
  bodyAniver.innerHTML="";

  $tabela.append(cabecalho);
  $.each(linhas, function(index, linha) {
    
    $tabela.append(linha);
  });
}