const fs = require('fs');

const query = `
SELECT ?person ?personLabel ?description ?occupationLabel ?image WHERE {
  ?person wdt:P27 wd:Q902. 
  { ?person wdt:P106 wd:Q33999 } UNION 
  { ?person wdt:P106 wd:Q177220 } UNION 
  { ?person wdt:P106 wd:Q36834 } UNION 
  { ?person wdt:P106 wd:Q2526255 } UNION 
  { ?person wdt:P106 wd:Q639669 } UNION 
  { ?person wdt:P106 wd:Q205298 } . 

  ?person wdt:P18 ?image. 

  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  OPTIONAL {
    ?person schema:description ?description.
    FILTER(LANG(?description) = "en")
  }
}
LIMIT 500
`;

const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`;

async function fetchWikidata() {
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'BotTracker/1.0 (test@example.com)' } });
    const data = await response.json();
    console.log(`Fetched ${data.results.bindings.length} results`);
    // print first 2
    console.log(JSON.stringify(data.results.bindings.slice(0, 2), null, 2));
    
  } catch (err) {
    console.error(err);
  }
}

fetchWikidata();
