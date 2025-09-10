import * as readline from 'readline';
import * as path from 'path';
import { promises as fs } from 'fs';

interface Carro {
  placa: string;
  modelo: string;
  marca: string;
  cor: string;
  status: 'Não iniciado' | 'Lavando' | 'Pronto';
}

const arquivoCSV = path.join(__dirname, 'carros.csv');
let carros: Carro[] = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para salvar os carros no arquivo CSV
async function salvarCSV() {
  const header = 'placa,modelo,marca,cor,status\n';
  const linhas = carros.map(c =>
    [c.placa, c.modelo, c.marca, c.cor, c.status].join(',')
  ).join('\n');
  await fs.writeFile(arquivoCSV, header + linhas, 'utf8');
}

// Função para carregar os carros do arquivo CSV
async function carregarCSV() {
  try {
    const dados = await fs.readFile(arquivoCSV, 'utf8');
    const linhas = dados.trim().split('\n');
    // Ignorar cabeçalho
    carros = linhas.slice(1).map(linha => {
      const [placa, modelo, marca, cor, status] = linha.split(',');
      return {
        placa,
        modelo,
        marca,
        cor,
        status: status as Carro['status']
      };
    });
  } catch (err) {
    // Se não existir arquivo, inicializa array vazio
    carros = [];
  }
}

function menu() {
  console.log('\n=== Sistema Lavajato ===');
  console.log('1 - Cadastrar carro');
  console.log('2 - Listar carros cadastrados');
  console.log('3 - Buscar carro pela placa');
  console.log('4 - Remover carro pela placa');
  console.log('5 - Iniciar lavagem');
  console.log('6 - Finalizar lavagem');
  console.log('7 - Sair');
  rl.question('Escolha uma opção: ', (opcao) => {
    switch(opcao.trim()) {
      case '1':
        cadastrarCarro();
        break;
      case '2':
        listarCarros();
        break;
      case '3':
        buscarCarro();
        break;
      case '4':
        removerCarro();
        break;
      case '5':
        iniciarLavagem();
        break;
      case '6':
        finalizarLavagem();
        break;
      case '7':
        console.log('Até mais! Obrigado por usar o lavajato!');
        rl.close();
        break;
      default:
        console.log('Opção inválida!');
        menu();
    }
  });
}

function cadastrarCarro() {
  rl.question('Digite a placa do carro: ', async (placa) => {
    if (carros.some(c => c.placa.toUpperCase() === placa.toUpperCase())) {
      console.log('Carro já cadastrado com essa placa!');
      return menu();
    }
    rl.question('Digite o modelo do carro: ', (modelo) => {
      rl.question('Digite a marca do carro: ', (marca) => {   // MARCA primeiro agora
        rl.question('Digite a cor do carro: ', async (cor) => {  // COR depois
          carros.push({ placa: placa.toUpperCase(), modelo, marca, cor, status: 'Não iniciado' });
          await salvarCSV();
          console.log('Carro cadastrado com sucesso!');
          menu();
        });
      });
    });
  });
}

function listarCarros() {
  if (carros.length === 0) {
    console.log('Nenhum carro cadastrado ainda.');
  } else {
    console.log('\nCarros cadastrados:');
    carros.forEach((carro, i) => {
      console.log(`${i + 1} - Placa: ${carro.placa} | Modelo: ${carro.modelo} | Marca: ${carro.marca} | Cor: ${carro.cor} | Status: ${carro.status}`);
    });
  }
  menu();
}

function buscarCarro() {
  rl.question('Digite a placa para buscar: ', (placa) => {
    const carro = carros.find(c => c.placa.toUpperCase() === placa.toUpperCase());
    if (carro) {
      console.log(`Carro encontrado: Placa: ${carro.placa} | Modelo: ${carro.modelo} | Marca: ${carro.marca} | Cor: ${carro.cor} | Status: ${carro.status}`);
    } else {
      console.log('Carro não encontrado.');
    }
    menu();
  });
}

function removerCarro() {
  rl.question('Digite a placa do carro para remover: ', async (placa) => {
    const index = carros.findIndex(c => c.placa.toUpperCase() === placa.toUpperCase());
    if (index >= 0) {
      carros.splice(index, 1);
      await salvarCSV();
      console.log('Carro removido com sucesso!');
    } else {
      console.log('Carro não encontrado.');
    }
    menu();
  });
}

function iniciarLavagem() {
  rl.question('Digite a placa do carro para iniciar a lavagem: ', async (placa) => {
    const carro = carros.find(c => c.placa.toUpperCase() === placa.toUpperCase());
    if (!carro) {
      console.log('Carro não encontrado.');
      return menu();
    }
    if (carro.status === 'Lavando') {
      console.log('Este carro já está em lavagem.');
      return menu();
    }
    carro.status = 'Lavando';
    await salvarCSV();
    console.log(`Lavagem iniciada para o carro com placa ${carro.placa}.`);
    menu();
  });
}

function finalizarLavagem() {
  rl.question('Digite a placa do carro para finalizar a lavagem: ', async (placa) => {
    const carro = carros.find(c => c.placa.toUpperCase() === placa.toUpperCase());
    if (!carro) {
      console.log('Carro não encontrado.');
      return menu();
    }
    if (carro.status !== 'Lavando') {
      console.log('Este carro não está em lavagem.');
      return menu();
    }
    carro.status = 'Pronto';
    await salvarCSV();
    console.log(`Lavagem finalizada para o carro com placa ${carro.placa}.`);
    menu();
  });
}

// Carrega os dados do CSV e inicia o menu
(async () => {
  await carregarCSV();
  menu();
})();
