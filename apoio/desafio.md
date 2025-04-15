# Desafio de Back End
## O tribunal do tempo
### História: Você é o juiz de um tribunal do tempo, uma divisão de autoridade cronológica que registra os viajantes temporais e monitora as interferências deles em eventos históricos, correções autorizadas e também prisões por alteração indevida da linha do tempo. Pra facilitar sua vida, você resolveu criar uma API com as seguintes coisas:

- O sistema pode registrar viajantes temporais que podem ter uma reputação inicial de 100 por exemplo e um status de ativo ou inativo

- Registrar um evento histórico, com ano, descrição e era (Primitiva, Média, Tecnológica, Pós-Humana). Além de conseguir listar todos os eventos também e ter um sistema de filtro por era

- Registrar uma interferência temporal (correção ou modificação) de um viajante em um evento.

- Negar automaticamente interferências de viajantes com reputação inferior a 30.

- Aprovar automaticamente correções se o viajante tiver reputação maior que 90.

- Deixar em "análise" qualquer outra interferência fora dessas regras.

- Tem que ter como listar todas as viagens, mostrar os status delas e etc. E também ter como filtrar elas por viajantes e também listar todas as viagens de um viajante

- Reduzir reputação em -10 em caso de interferência negada.

- Aumentar reputação em +5 para cada interferência aprovada.

- Além disso, pra finalizar, tem que ter como prender um viajante por 30 dias após as 3 interferências seguidas serem negadas. 
> Cada prisão deve ter um motivo e liberar ele automaticamente após a duração da prisão (ex: 30 dias) com cron job

## Em resumo, tem que ser um CRUD com todas as coisas de remover, registrar e etc. básicas e também um sistema de permissões por request, por exemplo, pra fazer uma viagem, só um viajante registrado e que não estiver preso pode fazer a viagem. Já com relação aos status, somente o juiz pode.

>Claro que tem que ter também uma rota pra realizar uma viagem pra um viajante, mas fica à disposição qualquer outra rota ou outra coisa que vocês quiserem adicionar, só precisa seguir as regras básicas desse desafio :