
//1) Qual o nome dos atores que atuaram nos filmes que contém a palavra Matrix no título do filme?
MATCH (people:Person)-[:ACTED_IN]-(m:Movie) where m.title =~ ".*Matrix.*" RETURN distinct people.name

//2) Qual o nome e idade em anos dos atores que nasceram depois de 1960? Apresente a listagem com idade descendente (maior para menor) e nomes de forma ascendente.
match (atores:Person) where atores.born > 1960 return atores.name as nome order by nome asc
match (atores:Person) where atores.born > 1960 return 2017 - atores.born as idade order by idade desc

//3) Apresente o título dos filmes que Keanu Reeves atuou. 
MATCH (actor:Person)-[:ACTED_IN]-(m:Movie) where actor.name = "Keanu Reeves" RETURN distinct m.title

//4) Quais os filmes que tem ao menos um ator atuou?
match (filmes:Movie)-[:ACTED_IN*1..1]-(:Person) return filmes

//5) Que filmes o ator Tom Hanks atuou?
MATCH (actor:Person)-[:ACTED_IN]-(m:Movie) where actor.name = "Tom Hanks" RETURN distinct m

//6) Liste os amigos do ator Tom Hanks. Retorne o nome dos atores. Entenda como amigos todos aqueles que atuaram com Tom Hanks, seguidores, produtores e diretores.
MATCH (tom:Person {name:"Tom Hanks"})-[:ACTED_IN]->(m)<-[:ACTED_IN]-(coActors) 
match	(tom)-[:ACTED_IN]->(n)<-[:DIRECTED]-(diretor:Person) 
match   (tom)-[:ACTED_IN]->(o)<-[:PRODUCED]-(produtor:Person)
RETURN coActors.name AS atores, diretor, produtor, seguidor

//7) Listar todos os filmes e seus atores, incluindo os filmes sem atores. 
match (filmes:Movie)<-[:ACTED_IN*]-(atores:Person) return filmes, atores

//8) Quais os nomes atores em ordem ascendente que atuaram em filmes que possuem quantidade de atores acima da média?
MATCH (m:Movie)<-[:ACTED_IN]-(p:Person)
WITH m, count(p) as total
WITH avg(total) as media_atores_por_filme
MATCH (m1:Movie)<-[:ACTED_IN]-(p1:Person)
WITH m1, media_atores_por_filme, count(p1) as total_atores
WHERE total_atores > media_atores_por_filme
MATCH (m1)<-[:ACTED_IN]-(p2:Person)
RETURN DISTINCT p2.name
ORDER BY p2.name
