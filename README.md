# Wiki Translate CLI

Simple CLI app to translate terms using Wikipedia articles.

Go to [wiki-translate](https://github.com/anteloalejandro/wiki-translate)
for more info.

## Install

Only tested on Linux, probably works on MacOS, won't work on Windows without WSL

### From npm

```bash
sudo npm install -g wiki-translate-cli
```

### From source

```bash
git clone https://github.com/anteloalejandro/wiki-translate-cli
cd wiki-translate-cli
npm install
sudo npm link
```

## Use

This app is interactive by default. 3 options are available:
- `--from <sourceLang>`: Language to translate from
- `--to <targetLang>`: Language to translate to.
- `--prompt-lang <promptLang>`: Language of the prompts. If unset, will be set to `<targetLang>` if available.

Any other arguments will be interpreted as the term to search for.
The script will ask for any missing data interactively.

If more than 1 article matches the search term, it will also ask you to pick one.

```bash
# interactive
wiki-translate-cli

# interactive (will ask for sourceLang and targetLang only)
wiki-translate-cli python programming language --from en

# non-interactive (if only one match is found)
wiki-translate-cli python programming language --from en --to es
```
