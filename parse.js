const fs = require('fs');

try {
  const html = fs.readFileSync('C:/Users/seker/.gemini/antigravity-ide/brain/e038502b-a806-466c-ae80-0be8f65a5c26/.system_generated/steps/396/content.md', 'utf8');
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  
  if (match) {
    const data = JSON.parse(match[1]);
    
    // Attempt to traverse to articles
    let articles = [];
    try {
       // Look around the __NEXT_DATA__ structure
       // It could be data.props.pageProps.page.articles or data.props.pageProps.initialState.content.news.articles etc.
       const traverse = (obj) => {
         if (!obj || typeof obj !== 'object') return;
         if (Array.isArray(obj)) {
           if (obj.length > 0 && obj[0].title && obj[0].date && obj[0].banner) {
              articles = obj;
              return;
           }
           obj.forEach(traverse);
         } else {
           if (obj.articles && Array.isArray(obj.articles)) {
             articles = obj.articles;
             return;
           }
           Object.values(obj).forEach(traverse);
         }
       };
       traverse(data.props);
    } catch(e) {}

    if (articles.length === 0) {
        console.log("Articles not found automatically. Check JSON structure manually.");
        fs.writeFileSync('C:/Users/seker/.gemini/antigravity-ide/brain/e038502b-a806-466c-ae80-0be8f65a5c26/scratch/next_data.json', JSON.stringify(data, null, 2));
    } else {
        const result = articles.map(a => ({
          title: a.title,
          date: a.date,
          description: a.description,
          banner: a.banner?.url
        })).slice(0, 6);
        console.log(JSON.stringify(result, null, 2));
    }

  } else {
    console.log('NEXT_DATA not found');
  }
} catch(e) {
  console.error(e);
}
