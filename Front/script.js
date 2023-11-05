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


