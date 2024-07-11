// Query on embedded documents

const cursor = db.collection('orders').aggregate([{

"$vectorSearch": {
"index" :"default",
"path" :"name_embedding",
"queryVector" : query_embedding,
"numCandidates" :150,
"limit" :10
}
}]);
// Process multiple documents and return
// computed results with aggregation operations
db.customers.aggregate([
//Stage 1: Vector Search for Jack Beanstalk
{
"$vectorSearch": {
"index": "default",
"path": "name_embedding",
"queryVector": query_embedding,
"numCandidates": 150,
"limit": 10,
"customer.name": "Jack Beanstalk"
},
//Stage 2: Unwind items array
{
'$unwind': '$items'
},
//Stage 3: Group remaining documents by item name and sum
{
'$group': {
'_id':'$items.name',
'totalOrders': {
'$sum': '$items.quantity'
}
}
}
])
