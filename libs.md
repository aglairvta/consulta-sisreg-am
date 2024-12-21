### chalk

> É uma biblioteca para o Node.js que serve para adicionar cores e estilos ao texto exibido no terminal.

**Instalação**
```
npm install chalk
```

**Exemplo de código**

``` JavaScript
const chalk = require('chalk');

// Exemplo de mensagens coloridas
console.log(chalk.green('Sucesso!')); // Texto verde
console.log(chalk.red('Erro!')); // Texto vermelho
console.log(chalk.blue.bold('Mensagem importante')); // Texto azul e em negrito
console.log(chalk.yellow.bgBlack('Aviso!')); // Texto amarelo com fundo preto

```
---

### node-notifier

> É uma biblioteca para o Node.js que permite enviar notificações do sistema (aquelas pop-ups que aparecem no canto da tela, como notificações de aplicativos).

**Instalação**
```
npm install node-notifier
```

**Exemplo de código**

``` JavaScript
const notifier = require('node-notifier');

// Enviar uma notificação simples
notifier.notify({
  title: 'Olá!',
  message: 'Seu processo foi concluído com sucesso.',
});

```
---

### playwright

> É uma biblioteca de automação de navegadores desenvolvida pela Microsoft. Ele permite controlar navegadores (como Chrome, Firefox e Safari) de maneira programática para realizar testes automatizados ou tarefas repetitivas, como web scraping.

**Instalação**

```
npm install playwright

```

```
npx playwright install

```

**Exemplo de código**

```JavaScript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch(); // Inicia o navegador Chromium
  const page = await browser.newPage();    // Cria uma nova página
  await page.goto('https://example.com');  // Acessa o site
  await page.screenshot({ path: 'screenshot.png' }); // Salva um print da tela
  console.log('Screenshot tirado!');
  await browser.close(); // Fecha o navegador
})();
```

### play-sound

> é uma biblioteca simples que serve para reproduzir arquivos de áudio no Node.js.

**Instalação**

```
npm install sound-play
```

**Exemplo de código**

```JavaScript
import player from 'play-sound';
const audio = player();
audio.play('local-do-seu-audio');
```