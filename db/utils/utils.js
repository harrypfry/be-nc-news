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
  return outputArr;
};

/*

{

createdby
refObj
votes
created_at
body

}

//{
//   body: 'Corporis magnam placeat quia nulla illum nisi. Provident magni aut et earum illo labore aperiam. Dolorem ipsum dignissimos est ex. Minima voluptatibus nihil commodi veritatis. Magnam aut suscipit dignissimos nostrum ea.',
//   belongs_to: 'A BRIEF HISTORY OF FOOD—NO BIG DEAL',
//   created_by: 'weegembump',
//   votes: 3,
//   created_at: 1504946266488
// },




*/
