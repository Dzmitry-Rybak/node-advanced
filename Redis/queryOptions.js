query
  .find()
  .where("name.last")
  .equals("Ghost")
  .where("age")
  .gt(17)
  .limit(10)
  .sort("-occupation");

const queryKeys = query.getOptions(); // {find: {occupation: 'host}, where: [{'name.last': 'Ghost'}]}

client.set(JSON.stringify(queryKeys), JSON.stringify(query.exec()));
