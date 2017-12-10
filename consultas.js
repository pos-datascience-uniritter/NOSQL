// 1) Qual é a população de FISHERS ISLAND?
db.zips.find({"city" : "FISHERS ISLAND"}, {_id : 0, pop : 1})

// 2) Listar todas as cidades do estado "MA".
db.zips.find({"state" : "MA"}, {_id : 0, city : 1})

/* 3) Listar todas as cidades com uma população entre 1 e 10 inclusive em sua */
população.
db.zips.find({"pop" : {$gt : 0, $lt : 11 }}, {_id : 0, city : 1})

/* 4) Listar todas as cidades do estado "MA" com uma população menor que 100. */
db.zips.find({"pop" : {$lt : 100 }, "state" : "MA"}, {_id : 0, city : 1})

/* 5) Listar todos os estados de forma distinta, ou seja, sem repetição. */
db.zips.distinct("state")

/* 6) Listar todos os estados distintos que contém uma cidade com uma população
acima de 100000 . */
db.zips.distinct("state", {"pop" : {$gt : 100000}})

/* 7) Qual é o tamanho da menor cidade (em população) de cada um dos estados? */
db.zips.aggregate( [
   { $group:
      {
        _id: { state: "$state", city: "$city" },
        pop: { $sum: "$pop" }
      }
   },
   { $sort: { pop: 1 } },
   { $group:
      {
        _id : "$_id.state",
        smallestPop:  { $first: "$pop" }
      }
   }
])

/* 8) Qual é o nome da menor cidade (em população) de cada um dos estados?
Utilize a função de redução do mapreduce do comando de agrupamento/agregação
para encontrar a menor população. */

db.zips.aggregate( [
   { $group:
      {
        _id: { state: "$state", city: "$city" },
        pop: { $sum: "$pop" }
      }
   },
   { $sort: { pop: 1 } },
   { $group:
      {
        _id : "$_id.state",
        smallestPop:  { $first: "$pop" }
      }
   }
])

/* 9) Listar o tamanho médio da população para cada um dos estados. */
db.zips.aggregate( [
   { $group: { _id: { state: "$state"}, pop: { $sum: "$pop" } } },
   { $group: { _id: "$_id.state", avgPop: { $avg: "$pop" } } }
])


/* 10) Quantas cidades tem estado "WA"? */
db.zips.aggregate(
   [
      {$match: {"state":"NY"}},
      {
          $group: {
            _id: {city:"$city"}, 
            totalCities: {$sum: 1} 
          } 
      },
      {$count: "totalCities"}
      
   ]
)


/* 11) Listar todos os estados e o número de cidades que eles contêm. Utilize um
pipeline de agregação para desenvolver esta atividade. Aqui encontra-se uma
dica: não existe um operador de $count, mas pode-se utilizar um $sum:1 para
fazer a mesma operação de contagem.
*/
db.zips.aggregate(
   [
      { $group: {_id: {state : "$state"}, count: {$sum: 1} } }
   ]
)


/* 12) Listar todos os estados com menos de 100 cidades - estenda o pipeline da
questão anterior.
*/
db.zips.aggregate(
   [
      { $group: {_id: {state : "$state"}, count: {$sum: 1} } },
      { $match: { count: { $lt: 100 } } }
   ]
)



/*13) Muitas cidades são listadas mais de uma vez, mesmo que estejam no
mesmo estado. Quais são as cidades que aparecem mais de 50 vezes no
mesmo estado?
*/
db.zips.aggregate(
 [
  { 
   $group : {
     _id : { state: "$state", city: "$city"},
     count: { $sum: 1 }
   }
  },
 { $match: { count: { $gt: 50 } } },
 { $project:    { _id: 0, 
		state: "$_id.state",                 
		city: "$_id.city", 
		count: 1}}
])



/* 14) Listar todos os nomes das cidades que aparecem em mais de vinte estados
diferentes, juntamente com seus estados.
*/
db.zips.aggregate([
    {$group: { 
             _id: {city:"$city"},
             count: {$sum: 1}, 
             state : {$push: {state:"$state"}}
      }
        
    },
    {$match: {
        count:{$gt:20}}
        
    },
    {$project: {city:"$city", state:"$state"}}
])


/* 15) Qual é a população total de todos os códigos postais agrupados individualmente
de NY?
*/

db.zips.aggregate([
    {$match: {state : "NY"}},
    {$group: { 
             _id: {city: "$city"},
             count: {$sum: "$pop"}}}
])
      
    


/* 16) Quantos códigos postais diferentes existem no estado de NY? */
db.zips.distinct("_id", {state:"NY"}).length



/* 17) Encontre todos os estados com uma população total acima de 10 milhões
(isso requer uma soma e uma seleção) - não basta pesquisar entradas
(lookup) únicas com uma população de mais de 10 milhões. */

db.zips.aggregate([
    {$group: { 
             _id: {state:"$state"},
             count: {$sum: "$pop"}}},
    {$match: {count:{$gt:10000000}}}
   
])





