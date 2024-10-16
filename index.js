import { search, confirm } from "@inquirer/prompts";
import { search as wikiSearch, getTranslation } from "wiki-translator";
import { languages } from "wiki-translator/languages.js";
import fuzzysearch from 'fuzzysearch';
import colors from 'yoctocolors-cjs';

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

async function run() {
  const langObj = Array.from(languages).map(([a, b]) => ({ name: a, value: b }));
  function fuzzyLang(input) {
    return langObj.filter(o => fuzzysearch(input.toLowerCase(), o.name.toLowerCase()));
  }

  const sourceLang = await search(
    {
      message: "Source Language: ",
      source: (input) => {
        if (!input) return langObj;
        return fuzzyLang(input);
      }
    },
  ).catch(onerror);
  if (!sourceLang) {
    return;
  }

  const targetLang = await search({
    message: "Target Language: ",
    source: (input) => {
      if (!input) return langObj;
      return fuzzyLang(input);
    }
  }).catch(onerror);
  if (!targetLang) {
    return;
  }


  let translation = null;
  let confirmation = true
  do {
    const id = await search({
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

    translation = await getTranslation(id, sourceLang, targetLang);
    if (!translation) {
      confirmation = await confirm({
        message: colors.red("Could not find term. Try again?")
      })
    }
  } while (!translation && confirmation);

  console.log(
    colors.green(colors.bold("Translation: ")) + colors.green(translation.title) + '\n'
      + colors.green(colors.bold("URL: ")) + colors.blue(colors.underline(translation.url))
  );
}

run();
