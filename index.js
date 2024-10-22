import { search, confirm, select } from "@inquirer/prompts";
import { search as wikiSearch, getTranslation } from "wiki-translator";
import { languages } from "wiki-translator/languages.js";
import fuzzysearch from 'fuzzysearch';
import colors from 'yoctocolors-cjs';
import { getText, setTextLang } from "./translations.js";

const langObj = Array.from(languages).map(([a, b]) => ({ name: a, value: b }));
function fuzzyLang(input) {
  return langObj.filter(o => fuzzysearch(input.toLowerCase(), o.name.toLowerCase()));
}

/** @param {string} snippet  */
function cleanSnippet(snippet) {
  snippet = snippet
    .trim()
    .replaceAll(/<(\/)?span(\s+.*?)?>/g, '')
    .replaceAll('&quot;', '')
    .replaceAll(/\[\d+\]/g, '')
    
  if (snippet.charAt(snippet.length-1) != '.') {
    snippet = snippet.slice(0, snippet.length-3) + '...'
  }

  return snippet;
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

export async function run({term, sourceLang, targetLang, promptLang}) {
  if (!promptLang) setTextLang(promptLang);

  if (!targetLang) {
    targetLang = await searchLanguage(`${getText("target-language")}: `);
    if (!targetLang) return;
  }

  if (!promptLang) setTextLang(targetLang);

  if (!sourceLang) {
    sourceLang = await searchLanguage(`${getText("source-language")}: `);
    if (!sourceLang) return;
  }

  let translation = null;
  let confirmation = true
  do {
    let id;
    if (term) {
      const pages = await wikiSearch(term, sourceLang);
      if (pages && pages.length) {
        id = pages.length == 1
          ? pages[0].pageid
          : await select({
            message: `${getText("matches")}: `,
            choices: pages.map(o => ({
              value: o.pageid,
              name: o.title,
              description: cleanSnippet(o.snippet)
            }))
          }).catch(onerror);
      }
    } else {
      id = await search({
        message: getText("type-a-term"),
        source: async (input, { signal }) => {
          await sleep(300);
          if (signal.aborted || !input || input.length < 3) return [];

          const pages = await wikiSearch(input, sourceLang);
          return pages.map(o => ({
            value: o.pageid,
            name: o.title,
            description: cleanSnippet(o.snippet)
          }));
        }
      }).catch(onerror);
    }
    term = undefined;

    translation = await getTranslation(id, sourceLang, targetLang);
    if (!translation) {
      confirmation = await confirm({
        message: colors.red(getText("could-not-find-term"))
      })
    }
  } while (!translation && confirmation);

  if (translation)
    console.log(
      colors.bold(`${getText("translation")}: `) + colors.greenBright(translation.title) + '\n'
      + colors.bold("URL: ") + colors.blueBright(colors.underline(translation.url))
    );
}
