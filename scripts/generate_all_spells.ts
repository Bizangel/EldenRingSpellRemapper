import {Element, load} from "cheerio"
import axios from "axios"
import fs from "fs"

async function downloadHTML(url): Promise<string>{
    const response = await axios.get(url);
    return response.data;
}

function pathSafeNormalize(str: string) {
    return str.toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
}

async function downloadImage(imageUrl: string, localTargetLocation: string, override = false) {
    try {
      if (!override && fs.existsSync(localTargetLocation))
        return;

      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

      const imageData = Buffer.from(response.data, 'binary');

      fs.writeFileSync(localTargetLocation, imageData);
    } catch (error: any) {
      console.warn(`Error downloading the image from ${imageUrl}:`, error.message);
    }
  }

let htmlstring = await downloadHTML("https://game8.co/games/Elden-Ring/archives/353974")

const $ = load(htmlstring);
const tables: Element[]= [];

$('table.a-table').each((index, element) => {
  if (index < 4) {
    tables.push(element);
  }
});

const allTds = tables.map(table => $(table).find("td a.a-link").toArray()).flat()
const spells = allTds.map(e => {
    const text = $(e).text()
    const wikiLink = $(e).attr("href")
    const imgDataSource = $(e).find("a img").attr("data-src")

    return {spellName: text, imageUrl: imgDataSource, wikiLink: wikiLink, id: pathSafeNormalize(text)}
})

// fetch those missing ones

await Promise.all(spells.filter(e => e.imageUrl === undefined).map(async (e) => {
    const html = await axios.get(e.wikiLink ?? "")
    const loadedhtml = load(html.data)
    const fallbackedImg = loadedhtml("table.a-table td img").first().attr("data-src")
    if (fallbackedImg?.startsWith("data:image"))
        throw new Error("Unable to fallback to fetch latest image")

    console.log("fallbacked: " , fallbackedImg)
    spells[spells.findIndex(sp => sp.spellName === e.spellName)].imageUrl = fallbackedImg
}));

spells.forEach(sp => {
    if (sp.imageUrl === undefined || sp.imageUrl?.startsWith("data:image"))
        throw new Error(`Found broken spell: ${JSON.stringify(sp)}`)
})

// // now download all of them
// console.log("Indexed spells successfully. Downloading...")

fs.mkdirSync("./public/spellsicons", {recursive: true})

await Promise.all(spells.map(async sp => {
    const response = await downloadImage(sp.imageUrl ?? "", "./public/spellsicons/" + sp.id + ".png")
    console.log("Successfully downloaded icon for: ", sp.spellName, sp.imageUrl)
}))

console.log("Download successful!")

const indentSpaces = 2;
const targetGenPath = "./src/common/Spells.generated.ts"
const fileStart = `

/* =====================================================
* This file was automatically generated using
* "npm run spellgen"
* See ./scripts/generate_all_spells.ts and README for more info.
* =====================================================
*/

export type SpellType = {id: string, spellName: string, imageUrl: string, wikiLink: string }
const Spells : SpellType[] =
`

const fileEnd = `\n\nexport default Spells;`

const fullSpells = JSON.stringify(spells.map(e => ({...e, imageUrl: `/spellsicons/${e.id}.png`}) ), null, 2)

const fullFileContents = fileStart + fullSpells + fileEnd;
fs.writeFileSync(targetGenPath, fullFileContents, {encoding: "utf8"})
