import { search, getTranslation } from "wiki-translator";
import enquirer from "enquirer";

const response = await enquirer.prompt([
  {
    type: "input",
    name: "lang",
    message: "Language: "
  },
  {
    type: "input",
    name: "term",
    message: "Search for a term: ",
  }
])

const pages = await search(response.term, response.lang);
console.log(pages)
