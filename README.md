<div align="center">
  <img src="docs/ofs-256.png" width="112" height="112" alt="RPG Sistema Criador de Fichas icon">

  # RPG Sistema Criador de Fichas

  **Criador de fichas responsivo para D&D e sistemas semelhantes.**

  [![Release](https://img.shields.io/github/v/release/Samwns/RPG-Sistema-Criador-de-fichas?display_name=tag&sort=semver)](https://github.com/Samwns/RPG-Sistema-Criador-de-fichas/releases/latest)
  [![Demo](https://img.shields.io/badge/demo-local-blue)](index.html)
  [![License](https://img.shields.io/github/license/Samwns/RPG-Sistema-Criador-de-fichas)](LICENSE)

  [**Demo Local**](index.html)
  · [**Documentação**](README.md)
</div>

## Sobre

Este projeto fornece um criador de fichas para RPG com foco em D&D, usando uma interface web responsiva e abas separadas para:

- Ficha do personagem
- Livro 1: Raças e Origens
- Livro 2: Classes
- Livro 3: Perícias
- Referência do sistema

O design é pensado para dispositivos móveis e desktop.

## Adicionar outro sistema

A estrutura foi preparada para que você possa adicionar outro sistema facilmente:

1. Crie uma nova aba em `index.html` com `button` e `section.tab-panel`.
2. Adicione o conteúdo do novo sistema no painel da aba.
3. Atualize `script.js` se precisar de lógica específica de sistema.
4. Use o ícone em `docs/ofs-256.svg` e `docs/ofs-256.png` como marca do projeto.

## Executar localmente

Abra `index.html` no navegador para usar o criador de fichas.

## Arquivos importantes

- `index.html` — interface principal do site
- `styles.css` — estilos e responsividade
- `script.js` — lógica de ficha, atributos e rolagens
- `docs/ofs-256.svg` — ícone em vetor
- `docs/ofs-256.png` — ícone em PNG 256x256
