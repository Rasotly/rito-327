async function run() {
  try {
    const res = await fetch('https://vlr-guessr.pages.dev/assets/index-CEYvNv4T.js');
    const text = await res.text();
    const index = text.indexOf('JSON.parse(`[');
    if (index !== -1) {
      const startIndex = index + 'JSON.parse(`'.length;
      const endIndex = text.indexOf(']`)', startIndex) + 1;
      const jsonString = text.substring(startIndex, endIndex);
      
      // We can use eval to properly unescape the template literal string if necessary, 
      // but let's just replace escaped characters manually or use new Function
      const unescapedString = new Function('return `' + jsonString + '`')();
      const agents = JSON.parse(unescapedString);
      console.log(JSON.stringify(agents[0].abilities, null, 2));
    } else {
      console.log("No JSON.parse found.");
    }
  } catch(e) {
    console.error(e);
  }
}
run();
