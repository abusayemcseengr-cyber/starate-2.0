const fs = require('fs');
const path = require('path');

const query = `
SELECT DISTINCT ?person ?personLabel ?description ?image WHERE {
  ?person wdt:P27 wd:Q902. 
  { ?person wdt:P106 wd:Q33999 } UNION # Actor
  { ?person wdt:P106 wd:Q177220 } UNION # Singer
  { ?person wdt:P106 wd:Q36834 } UNION # Composer
  { ?person wdt:P106 wd:Q2526255 } UNION # Film director
  { ?person wdt:P106 wd:Q639669 } UNION # Musician
  { ?person wdt:P106 wd:Q205298 } UNION # TV actor
  { ?person wdt:P106 wd:Q12299841 } UNION # Cricketer
  { ?person wdt:P106 wd:Q10873124 } UNION # model
  { ?person wdt:P106 wd:Q4610556 } UNION # model
  { ?person wdt:P106 wd:Q82955 } # Politician

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
    console.log("Fetching up to 500 celebrities from Wikidata...");
    const response = await fetch(url, { headers: { 'User-Agent': 'BotTracker/1.0 (test@example.com)' } });
    const data = await response.json();
    const results = data.results.bindings;
    console.log(`Fetched ${results.length} results`);

    let tsContent = `export interface CelebrityData {
  name: string;
  category: string;
  bio: string;
  nationality: string;
  photo: string;
}

export const bangladeshiCelebrities: CelebrityData[] = [
`;

    for (const row of results) {
       const rawName = row.personLabel ? row.personLabel.value : "Unknown";
       // skip q-ids if label is missing
       if (rawName.startsWith("Q") && /[0-9]+/.test(rawName)) continue;
       
       const name = rawName.replace(/"/g, '\\"');
       const bio = row.description ? row.description.value.replace(/"/g, '\\"') : "Bangladeshi celebrity";
       let category = "Celebrity";
       if (bio.toLowerCase().includes("actor") || bio.toLowerCase().includes("actress")) category = "Actor";
       else if (bio.toLowerCase().includes("singer") || bio.toLowerCase().includes("music")) category = "Musician";
       else if (bio.toLowerCase().includes("cricket") || bio.toLowerCase().includes("sport") || bio.toLowerCase().includes("football")) category = "Athlete";
       else if (bio.toLowerCase().includes("politician") || bio.toLowerCase().includes("minister")) category = "Politician";

       const photo = row.image ? row.image.value : "";
       
       tsContent += `  {
    name: "${name}",
    category: "${category}",
    bio: "${bio}",
    nationality: "Bangladeshi",
    photo: "${photo}",
  },\n`;
    }

    tsContent += `];\n`;

    const filePath = path.join(__dirname, 'bangladeshi-celebrities.ts');
    fs.writeFileSync(filePath, tsContent);
    console.log("Successfully wrote to", filePath);
    
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

fetchWikidata();
