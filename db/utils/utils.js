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
    outputObj[item.article_id] = item.title;
  });
  return outputObj;
};

exports.formatComments = (comments, articleRef) => {};
