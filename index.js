import { search, confirm } from "@inquirer/prompts";
import { search as wikiSearch, getTranslation } from "wiki-translator";
import { languages } from "wiki-translator/languages.js";
import fuzzysearch from 'fuzzysearch';
import colors from 'yoctocolors-cjs';

const langObj = Array.from(languages).map(([a, b]) => ({ name: a, value: b }));
function fuzzyLang(input) {
  return langObj.filter(o => fuzzysearch(input.toLowerCase(), o.name.toLowerCase()));
}

async function sleep(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
  return;
}

async function onerror(error) {
  if (['AbortPromptError', 'ExitPromptError'].includes(error.name)) {
    return;
  }

  throw error;
}

async function searchLanguage(message) {
  return await search({
    message: message,
    source: (input) => {
      if (!input) return langObj;
      return fuzzyLang(input);
    }
  }).catch(onerror);
}

export async function run(term, sourceLang, targetLang) {
  if (!sourceLang) {
    sourceLang = await searchLanguage("Source Language: ");
    if (!sourceLang) return;
  }

  if (!targetLang) {
    targetLang = await searchLanguage("Target Language: ");
    if (!targetLang) return;
  }


  let translation = null;
  let confirmation = true
  do {
    const id = term
      ? (await wikiSearch(term, sourceLang))[0].pageid
      : await search({
        message: "Type a term!",
        source: async (input, { signal }) => {
          await sleep(300);
          if (signal.aborted || !input || input.length < 3) return [];

          const pages = await wikiSearch(input, sourceLang);
          return pages.map(o => ({
            value: o.pageid,
            name: o.title,
            description: o.snippet
          }));
        }
      }).catch(onerror);
    term = undefined;

    translation = await getTranslation(id, sourceLang, targetLang);
    if (!translation) {
      confirmation = await confirm({
        message: colors.red("Could not find term. Try again?")
      })
    }
  } while (!translation && confirmation);

  console.log(
    colors.bold("Translation: ") + colors.greenBright(translation.title) + '\n'
    + colors.bold("URL: ") + colors.blueBright(colors.underline(translation.url))
  );
}
