var dados = [];
var results = []
var CoordAtualizados =[]
const pontos = document.getElementById('pontos');
var DiaAtual = new Date();

fetch('/dados')
.then(response => response.json())
.then(data => {
  dados = data;
  for(var i=0; i<dados.length;i++){
    results.push(dados[i].results)
        
    }
})
.catch(error => console.error('Erro:', error));

//evento para adicionar uma nova pessoa ao sistema, fazendo uma requisiçao add-dados//
$('.add-user').on('click', function () {
  fetch('/add-dados')
    .then(data => {
      $("#message-add").fadeIn();
      setTimeout(function () {
        $("#message-add").fadeOut();
      },
       2000);
       setTimeout(function () {
       location.reload();
       },2000);
    })
    .catch(error => console.error('Erro:', error));
})

$('body').on('click','#btnsearch', function () {
    var valor = $('.pesquisar').val();
    var tipo = $('#tipo').val()
  $.ajax({
    type: 'post',
    url: '/search',
    contentType: 'application/json',
    data: JSON.stringify({ value: valor, type: tipo }),
      success: function (data) {
        $('.table').html(data);
    
      },
      error: function (xhr, status, error) {
       console.error('Falha na solicitação:', error);
      }
  });
});

$(document).ready(function () {
  $(".pesquisar").keyup(function (e) {    
    if (e.keyCode === 13) {
    $("#btnsearch").click();
    }
  });
});


$(document).ready(function () {
  var opcaoSelecionada = $("#searchselect").find("option:first").val();
  $('#tipo').val(opcaoSelecionada);
})

$("#searchselect").on("change", function () {
  var opcaoSelecionada = $(this).find("option:selected").val();
  $('#tipo').val(opcaoSelecionada);
})