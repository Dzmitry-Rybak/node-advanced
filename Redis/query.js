query
  .find()
  .where("name.last")
  .equals("Ghost")
  .where("age")
  .gt(17)
  .limit(10)
  .sort("-occupation");

// CHECK TO SEE IF THIS QUERY HAS ALREADY BEEN FETCHED IN REDIS

query.exec = function () {
  // to check to see if this query has already been executed
  // and if it has return the result right away

  const result = client.get("query key");
  if (result) {
    return result;
  }

  // otherwise issue the query *as normal*
  const originalResult = runTheOriginalExecFunction();

  // then save that value in redis
  client.set("query key", originalResult);
  return originalResult;
};

query.exec();
