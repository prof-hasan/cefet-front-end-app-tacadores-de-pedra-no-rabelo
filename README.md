Trabalho Prático 2 - Aplicação Web
Cansado de todo dia criar um novo sitezinho para seu pai, tio, prima, cachorro e até para o professor de Web, você e mais um ou dois amig@s decidem inovar. Em vez de criar um site estático, simplesmente informacional, vocês querem agora criar uma aplicação web interativa, gastando todo o JavaScript do universo.

O grupo deve ser de no máximo 3 pessoas da mesma subturma.

A diferença de um site estático para uma aplicação está em seu uso:

Um site estático simplesmente expõe informações e não possui muita interatividade. Por exemplo, as páginas do Coral 55, dos Tesouros do Barba Ruiva, da Exploração Espacial. Normalmente não precisa de JavaScript, ou usa muito pouco.
Uma aplicação web envolve muita interação com o usuário, salva algum tipo de informação e geralmente permite o usuário se identificar (e.g., fazendo login)¹. A ideia é criar algo que permita que o usuário crie algum conteúdo, e não apenas o programador. Na atividade "Lista de Tarefas" (ainda vamos fazer), a aplicação web permite o usuário cadastrar suas próprias atividades.
Nesta tarefa, você irão fazer uma dentre as seguintes aplicações:

(a) um sistema que gerencia uma lista de jogos/livros/músicas/filmes que você quer ou já jogou/leu/ouviu/assistiu. Nesse sistema, o usuario poderá, inclusive categorizar os itens, filtrar por categoria. Cada categoria deverá ser definida junto com sua cor. Pelo menos a lista e as categorias devem ser salvos usando WebStorage;

(b) um jogo de cartas (alguém disse truco?), de navinha, de perguntas e respostas, tamagotchi (dentre outros). Nesses jogos, deverá obrigatoriamente haver um ranking dos jogadores, alguma forma do usuario personalisar o jogo (por exemplo, seu avatar). Pelo menos o ranking e o avatar devem ser salvos usando WebStorage;

(c) um sistema de enquetes que permite o usuário criar enquetes, enviá-las para outras pessoas e visualizar os resultados em um gráfico². As enquetes devem ser categorizadas ao serem listadas e o usuario poderá filtrar por categoria. A categoria deverá ter pelo menos um nome e uma cor. As enquetes devem ser salvas, pelo menos, usando webStorage.;

Nota: neste trabalho, você vai precisar buscar por bem mais informações do que aquelas que foram abordadas em sala de aula durante o ano! O trabalho será avaliado pela capacidade do grupo de extrapolar o que vimos em sala de aula

¹ Login: permitir que usuários se cadastrem na aplicação requer o uso de um banco de dados e um back-end, que são assuntos que não foram cobertos nesta matéria. Nesse caso, podemos usar web storage para salvar informações localmente no navegador.

² O envio de enquetes para outra pessoa também requer um back-end.

O aluno será pontuado individulamente de acordo com suas contibuições enviadas no GitHUB. Ou seja, o aluno deverá enviar a sua parte no repossitório para sabermos o que foi feito por cada integrante.

Análise da participação e pontuação individual
Cada integrante do grupo deverá usar o GitHub e a participação (e nota) do aluno será avaliado individualmente pelo GitHub por meio da tela de contribuições - veja aqui um exemplo. Por exemplo, caso o grupo tenha 3 alunos e for verificado que apenas 2 alunos participaram ativamente do projeto, o aluno que participou menos terá a nota mais reduzida em relação aos demais.

Funcionalidade da Aplicação
Valendo 80% da nota deste trabalho, sua aplicação web deve conter os seguintes itens:

Permitir que o usuário crie conteúdo (e.g., tarefas, playlists, avatares, enquetes etc.) durante sua interação com a aplicação
A criação de conteúdo deve envolver a criação/atualização/remoção de elementos HTML da página (manipulação do DOM)
Armazenamento de dados usando web storage (veja aula). Por exemplo:
O nome de usuário/senha que a pessoa criou
As playlists/músicas que a pessoa criou e curtiu
A pontuação, nome e em qual fase a pessoa está em um joguinho
Uso de (pelo menos) uma biblioteca JavaScript (veja video aula)
Layout e design agradáveis - não pode ter carinha de site da década de 90, nem dos anos 2000. E deve ser consistente entre as páginas
Carinha dos anos 90???
Uma janela modal contendo informações sobre a aplicação, informando quem são os autores do site (o grupo)
Como você é um aluno qualidade super premium, você pode atingir 100% da nota, ou até mais, limitado a 150%, implementando em sua aplicação web um subconjunto dos seguintes itens opcionais:

(3 a 6%) Usar flexbox e grid para o layout
(3 a 10%) Deixar o site 100% acessível para cegos
(6%) Usar media queries (CSS) para tornar as páginas "responsivas" (adaptáveis a diferentes telas - todas as páginas têm que ficar boas em telas grandes, médias e pequenas - pelo menos 320px de largura)
(3 a 6%) Usar transformações, transições e animações (com parcimônia, sem exageros) para tornar a interação visualmente mais atrativa
Usar uma API do HTML5 diretamente para fazer coisas interessantes, como
(5%) Geolocation API, para pegar latitude/longitude do usuário
(+5%) Usar a biblioteca do Google Maps para mostrar no mapa
(+10%) Consultar a previsão do tempo no local onde o usuário está (usando por ex., a API do OpenWeatherMap via Ajax bomb)
(2 a 12%)Canvas API, para desenhar na página usando JavaScript
(9%) Speech Synthesis API, para fazer o navegador falar (ler em voz alta uma string que você passa pra ele - string -> voz)
(12%) Speech Recognition API, pra fazer o navegador entender o queo usuário está falando no microfone (voz -> string)
(5%) Vibration API, para fazer o telefone/tablet vibrar
(20%) Deixar o site 100% acessível para cegos
(15%) Uso do Framework VUE para o jogo
(10%) Usar um framework CSS para agilizar o desenvolvimento, como o Bootstrap, Materialize, JQueryUI, Foundation
Usar alguma biblioteca JavaScript para auxiliar no desenvolvimento. Por exemplo:
(0 a 3%) cheet.js pra fazer Easter Eggs (mas tem que ser bem mais legal que um window.alert hein!!)
(até 8%) jQuery
(até 10%) Google Charts, ou NVD3.js, ou HighCharts (para exibir gráficos)
💣 (até 15%) Angular, React (para criar SPAs - single page applications)
💣 (até 18%) Phaser (para jogos que usam o <canvas></canvas>)
💣 (7%) Usar AJAX para buscar algum tipo de dados
💣💣 (até 25%) Criar um back-end com um banco de dados para persistir os dados no servidor, em vez de apenas localmente com o web storage
💣 (+10%) Possibilitar usuário se cadastrar e logar na aplicação
(8%) Usar o Git com o Github (ou outro serviço de hospedagem de repositórios) fazendo vários commits (por todos alunos pelo menos 1 por semana)
Legenda:

💣 assuntos que não são cobertos na nossa disciplina e são considerados complicados para serem usados neste trabalho
O que faz perder nota
Alguns descuidos podem fazer com que sua nota fique muito abaixo do esperado:

Plágio do trabalho de outrem
Penalidade individual, caso o aluno não tenha feito contribuições no repositório
Ausência de itens obrigatórios
Falta de originalidade: utilização de códigos prontos (de práticas anteriores, por exemplo)
Falta de dominio do tema durante a apresentção
Uso de elementos antigos dentro do HTML (e.g., tags <center>, <b>, <font>)
Ignorar boas práticas de programação:
Código pouco legível
Muita repetição de código
Criação de variáveis desnecessárias
Código CSS ou JavaScript inline etc.
O que deve ser entregue
Você deve publicar esse site usando GitHub pages. Ou seja, vá em configurações, "Pages" e defina a branch principal como a branch do github pages. Além disso, você deve criar uma página itens_opcionais.html para demonstrar os itens opcionais.

Título da página

Conteúdo do tópico URL do site: https://usuario.github.io/meugrupo/ Integrantes:

Arzimar da Silva Costa
Frederico Aleixo Alencar
Genézio Oliveira Pontes
Custódio Armando Gato
Itens opcionais implementados (conforme enunciado):

(até +7%)Canvas API, para desenhar na página usando JavaScript
(até +5%) jQuery
(+7%) Usar AJAX para buscar algum tipo de dados
(colocar evidências que comprovem os itens opcionais implementados, se necessário - ex: repositório no github...)

O que deve ser apresentado
Na última aula do bimestre, o trabalho deve ser apresentado em sala de aula. Não é necessário fazer uma apresentação, mas apenas mostrar o site e falar sobre como foi seu desenvolvimento. Os alunos devem demonstrar dominio técnico do que fizeram. Todos integrantes do grupo devem participar.