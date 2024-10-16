import enquirer from "enquirer";
import { search, getTranslation } from "wiki-translator";
import { languages } from "wiki-translator/languages.js";

const langKeys = [...languages.keys()];
const response = await enquirer.prompt([
  {
    type: "autocomplete",
    name: "sourceLang",
    message: "Source Language: ",
    choices: langKeys,
    limit: 5,
  },
  {
    type: "autocomplete",
    name: "targetLang",
    message: "Target Language: ",
    choices: langKeys,
    limit: 5,
  },
  {
    type: "input",
    name: "term",
    message: "Search for a term: ",
  }
]);
const pages = await search(response.term, languages.get(response.sourceLang));

let translation = null;
let confirmation = true
do {
  const select = new enquirer.Select({
    name: "id",
    message: "Choose one!",
    choices: pages.map(p => ({
      name: p.pageid,
      message: p.title
    }))
  });
  const id = await select.run();

  translation = await getTranslation(
    id,
    languages.get(response.sourceLang),
    languages.get(response.targetLang)
  );

  if (!translation) {
    const confirm = new enquirer.Confirm({
      name: "confirmation",
      message: "Could not find translation. Try again?"
    })
    confirmation = await confirm.run();
  } else {
    console.log(translation.title);
  }
} while (!translation && confirmation);
