# 📁 Mapeador de Estrutura de Pastas

> Visualize e analise a estrutura de pastas do seu projeto de forma intuitiva e moderna.

[![Status](https://img.shields.io/badge/status-ready-brightgreen)](#) [![License](https://img.shields.io/badge/license-MIT-blue)](#)

---

## ✨ Visão geral

Um utilitário front-end leve que permite selecionar uma pasta local e visualizar sua árvore de arquivos em formato navegável. Ideal para inspecionar rapidamente a estrutura de um projeto, copiar a representação em texto e pesquisar por arquivos ou pastas.

O projeto foi construído com **HTML/CSS/JavaScript puro** (sem build step) e usa a API de arquivos via `input[type="file"]` com `webkitdirectory` para ler diretórios.

---

## 🧩 Principais funcionalidades

* Seleção de pasta local (via `Escolher Pasta`) com leitura recursiva dos arquivos.
* Renderização da árvore de pastas com arquivos e pastas ordenados.
* Expandir / Recolher tudo para navegação rápida.
* Barra de busca para filtrar arquivos/pastas por nome.
* Copiar a estrutura em formato de texto (com ícones 📁/📄) para a área de transferência.
* Tema claro/escuro com preferência salva no `localStorage`.
* Feedback por toast para ações como cópia bem-sucedida ou erros.

---

## 🗂️ Estrutura do repositório

```text
├─ index.html        # Página principal (HTML/CSS/JS tudo em um arquivo)
├─ README.md         # (você está vendo)
└─ assets/           # (opcional) screenshots, gifs, exemplos
```

> Observação: o projeto é entregue como um único `index.html`; você pode quebrar em arquivos se preferir.

---

## 🚀 Como usar / Executar

### 1) Abrir localmente

A forma mais direta é abrir o `index.html` no navegador:

* Clique duas vezes em `index.html` ou arraste para a janela do navegador.

> ⚠️ Nota: por segurança do navegador, algumas funcionalidades (como copiar para a área de transferência) funcionam melhor em contexto seguro (HTTPS) ou quando servido por um servidor local.

### 2) Servir com um servidor local (recomendado)

**Com Python 3**:

```bash
# a partir da raiz do projeto
python -m http.server 8080
# Acesse http://localhost:8080
```

**Com npm (http-server)**:

```bash
npm i -g http-server
http-server -p 8080
# Acesse http://localhost:8080
```

---

## 🧪 Suporte a navegadores

* ✅ **Chrome / Edge / Opera** — suporte completo (recomendado)
* ✅ **Safari** — funciona (implementações podem variar)
* ⚠️ **Firefox** — não suporta `webkitdirectory` (logo, a seleção de pasta pode não funcionar)

> O atributo `webkitdirectory` não é padrão — é amplamente suportado em engines baseadas em Chromium e em Safari.

---

## ✅ Exemplos de uso

* Abrir o app no navegador.
* Clicar em **Escolher Pasta** e selecionar a pasta do seu projeto.
* Usar **Buscar arquivos/pastas...** para localizar arquivos com rapidez.
* Clicar em **Copiar Estrutura** para colar a árvore em um chat, ticket ou documento.

Exemplo de saída copiada:

```
📁 src
  📁 components
    📄 Header.js
    📄 Footer.js
  📄 index.js
📁 public
  📄 index.html
📄 package.json
```

---

## 🔧 Configurações & pontos técnicos

* O tema é alternado com a classe `dark-theme` no `body` e a preferência é salva em `localStorage` com a chave `theme`.
* A construção da árvore faz parsing do `webkitRelativePath` dos `File` lidos e gera um objeto em memória para renderização.
* A função de copiar usa a [Clipboard API](https://developer.mozilla.org/) (`navigator.clipboard.writeText`) e pode pedir permissão dependendo do contexto do navegador.
* A renderização prioriza pastas em relação a arquivos e ordena alfabeticamente.

---

## 📸 Screenshots

Adicione na pasta `assets/` imagens como:

* `screenshot-1.png` — tela inicial com botão *Escolher Pasta*
* `screenshot-2.png` — árvore renderizada com pastas expandidas
* `screenshot-3.png` — modo escuro

> Sugestão: gere miniaturas 1280×720 para boa visualização no GitHub.

---

## 🙌 Contribuições

Contribuições são bem-vindas! Sugestões de melhorias:

* Separar CSS/JS em arquivos distintos.
* Permitir download da estrutura como `.txt` ou `.md` diretamente.
* Melhorar acessibilidade (teclado, labels e foco).
* Adicionar testes e exemplo de integração com CI.

1. Fork o repositório
2. Crie uma branch: `git checkout -b feat/minha-melhoria`
3. Faça commits: `git commit -m "feat: descreva a mudança"`
4. Abra um Pull Request

---

## ♿ Acessibilidade

Pontos a considerar para melhorias:

* Tornar os controles acessíveis por teclado (tabindex, role, aria-expanded).
* Fornecer texto alternativo/descrição para ícones importantes.
* Melhor contraste em certas combinações de cores no tema escuro.

---

## 📝 Licença

Distribuído sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.

---

## ✨ Créditos

* Ícones: [Font Awesome](https://fontawesome.com)
* Inspirado em boas práticas de UX para visualização de árvores de arquivos.

---

Se quiser, eu também:

* 📄 gero uma versão curta (one-liner) do README para o GitHub
* 🌎 traduzo para inglês
* 🖼️ crio badges personalizados e um `favicon`

Diz qual dessas você quer que eu faça em seguida!