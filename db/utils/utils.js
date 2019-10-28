exports.formatDates = list => {
  const newArr = [];
  list.forEach(item => {
    let { created_at, ...rest } = item;
    created_at = new Date(created_at);
    newArr.push({ ...rest, created_at });
  });
  return newArr;
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
