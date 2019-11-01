exports.formatDates = list => {
  const newArr = [];
  list.forEach(item => {
    let { created_at, ...rest } = item;
    created_at = new Date(created_at);
    newArr.push({ ...rest, created_at });
  });
  return newArr;
};

exports.makeRefObj = list => {
  if (!list.length) return {};
  const outputObj = {};
  list.forEach(item => {
    outputObj[item.title] = item.article_id;
  });
  return outputObj;
};

exports.formatComments = (comments, articleRef) => {
  if (!comments.length) return [];
  const outputArr = [];
  let tempObj;

  comments.forEach(comment => {
    tempObj = {};
    tempObj.author = comment.created_by;
    tempObj.article_id = articleRef[comment.belongs_to];
    tempObj.votes = comment.votes;
    tempObj.created_at = new Date(comment.created_at);
    tempObj.body = comment.body;
    outputArr.push(tempObj);
  });
  // console.log(outputArr);
  return outputArr;
};

exports.checkArticleExists = article_id => {
  return connection("articles")
    .select("*")
    .where({ article_id })
    .then(([article]) => {
      if (article) {
        return true;
      } else {
        return false;
      }
    });
};
