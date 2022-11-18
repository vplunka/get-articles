const axios = require('axios');
const url = `https://jsonmock.hackerrank.com/api/articles`;

async function getArticles(author, limit) {
  let page = 1;
  
  const rv = [];
  
  // we don't need to check if provided limit is <= 0
  // because loop doesn't start if so
  while (rv.length < limit) {
    const { data } = await axios.get(url, { params: { page, author } });
    const { data: articles, total_pages } = data;

    // we return empty array if API returns empty array for provided author
    if (total_pages === 0) {
      return [];
    }

    for (const article of articles) {
      if (article.title !== null || article.story_title !== null) {
        article.num_comments = article.num_comments
          ? article.num_comments
          : 0;
        
        rv.push(article);

        // STOP if we picked articles up to limit
        if (rv.length === limit) {
          break;
        }
      }
    }

    // STOP if we reached last or we picked articles up to limit
    if (page === total_pages || rv.length === limit) {
      break;
    }

    page++;
  }

  return rv
    .sort((a, b) => {
      // sort articles by title or story_title
      // it sorts it in ascending order
      // because as for me we should put '' empty string in to the end
      if (b.num_comments === a.num_comments) {
        const bValue = b.title ?? b.story_title;
        const aValue = a.title ?? a.story_title;

        return bValue.localeCompare(aValue);
      }

      // descending order by num_comments
      return b.num_comments - a.num_comments;
    })
    .map(({ title, story_title }) => title ?? story_title);
}

(async () => {
  const allArticles = await getArticles(undefined, 21);
  const epagaArticles = await getArticles('epaga', 31);

  console.log(allArticles)
  console.log(epagaArticles);
})();
