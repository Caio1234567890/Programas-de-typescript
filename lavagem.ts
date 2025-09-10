import * as readline from 'readline'; // pra ler entrada do usuário no terminal
import * as path from 'path'; // pra lidar com caminhos de arquivo
import { promises as fs } from 'fs'; // pra mexer com arquivos usando promessas

interface Carro { 
  placa: string;
  modelo: string;
  marca: string;
  cor: string;
  status: 'Não iniciado' | 'Lavando' | 'Pronto'; // status da lavagem do carro
}

const arquivoCSV = path.join(__dirname, 'carros.csv'); // arquivo que guarda os dados dos carros
let carros: Carro[] = []; // array pra guardar os carros

const rl = readline.createInterface({
  input: process.stdin,  // entrada do terminal
  output: process.stdout // saída pro terminal
});

// salva os carros no arquivo CSV, pra não perder quando fechar o programa
async function salvarCSV() {
  const header = 'placa,modelo,marca,cor,status\n'; // cabeçalho do csv
  const linhas = carros.map(c =>
    [c.placa, c.modelo, c.marca, c.cor, c.status].join(',') // junta as infos separadas por vírgula
  ).join('\n'); // junta tudo em várias linhas
  await fs.writeFile(arquivoCSV, header + linhas, 'utf8'); // escreve no arquivo
}

// carrega os carros do arquivo CSV, se existir
async function carregarCSV() {
  try {
    const dados = await fs.readFile(arquivoCSV, 'utf8'); // lê o arquivo
    const linhas = dados.trim().split('\n'); // separa linha por linha
    // ignora a primeira linha porque é o cabeçalho e pega só os dados
    carros = linhas.slice(1).map(linha => {
      const [placa, modelo, marca, cor, status] = linha.split(','); // separa as infos da linha
      return {
        placa,
        modelo,
        marca,
        cor,
        status: status as Carro['status'] // fala pro TS que o status é um dos tipos permitidos
      };
    });
  } catch (err) {
    // se não achar arquivo, começa com array vazio
    carros = [];
  }
}

function menu() {
  console.log('\n=== Sistema Lavajato ==='); // mostra as opções
  console.log('1 - Cadastrar carro');
  console.log('2 - Listar carros cadastrados');
  console.log('3 - Buscar carro pela placa');
  console.log('4 - Remover carro pela placa');
  console.log('5 - Iniciar lavagem');
  console.log('6 - Finalizar lavagem');
  console.log('7 - Sair');
  rl.question('Escolha uma opção: ', (opcao) => { // espera o usuário escolher
    switch(opcao.trim()) { // tira espaços só pra garantir
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
        rl.close(); // fecha o programa
        break;
      default:
        console.log('Opção inválida!'); // se não escolher certo, avisa
        menu(); // volta pro menu
    }
  });
}

function cadastrarCarro() {
  rl.question('Digite a placa do carro: ', async (placa) => { // pergunta a placa
    if (carros.some(c => c.placa.toUpperCase() === placa.toUpperCase())) { 
      // verifica se já existe carro com essa placa
      console.log('Carro já cadastrado com essa placa!');
      return menu(); // volta pro menu se já tiver
    }
    rl.question('Digite o modelo do carro: ', (modelo) => { // pergunta modelo
      rl.question('Digite a marca do carro: ', (marca) => { // pergunta marca
        rl.question('Digite a cor do carro: ', async (cor) => { // pergunta cor
          // adiciona o carro no array
          carros.push({ placa: placa.toUpperCase(), modelo, marca, cor, status: 'Não iniciado' });
          await salvarCSV(); // salva no arquivo pra não perder
          console.log('Carro cadastrado com sucesso!');
          menu(); // volta pro menu
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
      // mostra cada carro com as infos
      console.log(`${i + 1} - Placa: ${carro.placa} | Modelo: ${carro.modelo} | Marca: ${carro.marca} | Cor: ${carro.cor} | Status: ${carro.status}`);
    });
  }
  menu(); // volta pro menu
}

function buscarCarro() {
  rl.question('Digite a placa para buscar: ', (placa) => {
    const carro = carros.find(c => c.placa.toUpperCase() === placa.toUpperCase());
    if (carro) {
      // mostra os dados do carro se achou
      console.log(`Carro encontrado: Placa: ${carro.placa} | Modelo: ${carro.modelo} | Marca: ${carro.marca} | Cor: ${carro.cor} | Status: ${carro.status}`);
    } else {
      console.log('Carro não encontrado.');
    }
    menu(); // volta pro menu
  });
}

function removerCarro() {
  rl.question('Digite a placa do carro para remover: ', async (placa) => {
    const index = carros.findIndex(c => c.placa.toUpperCase() === placa.toUpperCase());
    if (index >= 0) {
      carros.splice(index, 1); // tira o carro do array
      await salvarCSV(); // salva o arquivo atualizado
      console.log('Carro removido com sucesso!');
    } else {
      console.log('Carro não encontrado.');
    }
    menu(); // volta pro menu
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
    carro.status = 'Lavando'; // muda o status
    await salvarCSV(); // salva arquivo
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
    carro.status = 'Pronto'; // muda status pra pronto
    await salvarCSV(); // salva arquivo
    console.log(`Lavagem finalizada para o carro com placa ${carro.placa}.`);
    menu();
  });
}

// quando iniciar o programa, carrega os carros e mostra o menu
(async () => {
  await carregarCSV();
  menu();
})();
