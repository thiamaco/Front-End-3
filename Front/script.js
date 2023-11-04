var dados = [];
var CoordAtualizados =[]
const pontos = document.getElementById('pontos');
var DiaAtual = new Date();
fetch('/dados')
.then(response => response.json())
.then(data => {
  dados = data;
    for(var i=0; i<dados.length;i++){
      dados[i].dob.date = new Date(dados[i].dob.date);
      dados[i].dob.date.dia = dados[i].dob.date.getDate();
      dados[i].dob.date.ano = dados[i].dob.date.getFullYear();
      var aniv =  new Date(2023,dados[i].dob.date.getMonth(),dados[i].dob.date.getDate())
      var dias = Math.floor((aniv-DiaAtual) / (1000 * 60 * 60 * 24))
      dados[i].dob.date.faltantes = dias;
        if(dias>=0){
          dados[i].dob.aniversario=dias+1;
        }else{
        dados[i].dob.aniversario=(dias+365)+1;
        }
    }
    atualizar();
})
.catch(error => console.error('Erro:', error));

//evento para adicionar uma nova pessoa ao sistema, fazendo uma requisiçao add-dados//
$('.add-user').on('click', function () {
  fetch('/add-dados')
    .then(data => {
      $("#message-add").fadeIn();
      setTimeout(function () {
        $("#message-add").fadeOut();
      }, 2000);
    })
    .then(data =>{
      location.reload();
    })
    .catch(error => console.error('Erro:', error));
})
//evento para filtrar a tabela home, variando por idade, city, ou cpf da pessoa//
$("#btnsearch").on('click', function () {
  var value = $('.pesquisar').val();
    $.ajax({
      type: 'POST',
      url: '/search',
      contentType: 'application/json',
      data: JSON.stringify({ objeto: dados, valor: value }),
      success: function (datas) {
        console.log(datas);
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