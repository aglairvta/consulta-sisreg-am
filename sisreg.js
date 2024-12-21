#!/usr/bin/env node

import fs from 'fs';
import dotenv from 'dotenv';
import chalk from 'chalk';
import notifier from 'node-notifier';
import { firefox } from 'playwright';
import player from 'play-sound';

dotenv.config();

const audioPlayer = player();

const codes = process.env.CODES?.split(',') || [];
const attendingUnit = process.env.ATTENDING_UNIT;
const consultationSite = "https://is.gd/2oy8FJ";
const soundFilesPath = process.env.SOUND_FILES_PATH;

if (!codes.length || !attendingUnit || !consultationSite || !soundFilesPath) {
  console.error(chalk.red('Erro: Algumas variáveis de ambiente não estão configuradas corretamente.'));
  process.exit(1);
}

function playSound(soundFile) {
  audioPlayer.play(soundFile, (err) => {
    if (err) {
      console.error(chalk.red("Erro ao tocar o som:", err));
    }
  });
}

async function consultarCodigo(codigo) {
  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(consultationSite);
    await page.fill('#codigo_aut', codigo);
    await page.selectOption('.browser-default', { label: attendingUnit });
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);

    const isPendente = await page.$('.toast.toast-pendente');
    const isAgendado = await page.$('.card-panel.indigo.lighten-5.hoverable');

    let notificationMessage = '';
    let soundFile = `${soundFilesPath}/0.wav`;

    if (isAgendado) {
      const paragraphs = await page.$$eval(
        '.card-panel.indigo.lighten-5.hoverable h5 + p, .card-panel.indigo.lighten-5.hoverable h5 + p + p',
        (elements) => elements.map((el) => el.textContent.trim())
      );
      notificationMessage = `Código ${codigo} - Agendado! Detalhes: ${paragraphs.join(', ')}`;
      soundFile = `${soundFilesPath}/1.wav`;
    } else if (isPendente) {
      notificationMessage = `Código ${codigo} - Pendente`;
    } else {
      notificationMessage = `Código: ${codigo} - Pendente`;
    }

    if (fs.existsSync(soundFile)) {
      playSound(soundFile);
    } else {
      console.error(chalk.red(`Arquivo de som não encontrado: ${soundFile}`));
    }

    await browser.close();

    notifier.notify({
      title: 'Resultado da consulta',
      message: notificationMessage,
      wait: true,
      sound: true,
      timeout: 5000,
    });

    return { codigo, notificationMessage };
  } catch (err) {
    console.error(chalk.red(`Erro ao processar consulta para o código ${codigo}:`, err));
    await browser.close();
    return null;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  for (const codigo of codes) {
    try {
      const resultado = await consultarCodigo(codigo);

      if (resultado && resultado.notificationMessage) {
        if (resultado.notificationMessage.includes('Agendado')) {
          console.log(chalk.green(resultado.notificationMessage));
        } else if (resultado.notificationMessage.includes('Pendente')) {
          console.log(chalk.yellow(resultado.notificationMessage));
        }
      } else {
        console.error(chalk.red(`Erro ao consultar código ${codigo}`));
      }

      await delay(3000);
    } catch (err) {
      console.error(chalk.red('Erro ao processar consulta:', err));
    }
  }
})();