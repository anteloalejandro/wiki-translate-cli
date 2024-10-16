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

This app is interactive by default. The first 3 arguments will be interpreted as
`<term>`, `<sourceLang>` and `<targetLang>` respectively.

If any of those is missing, it will ask you to input it interactively.

If more than 1 article matches term, it will ask you to pick one.

```bash
# interactive
wiki-translate-cli

# interactive (will ask for sourceLang and targetLang only)
wiki-translate-cli "python programming language"

# non-interactive (if only one match if found)
wiki-translate-cli "python programming language" en es
```
