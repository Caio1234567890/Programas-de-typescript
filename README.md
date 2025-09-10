faz ai dog 



﻿# Programas-de-typescript
Ciências da Computação - 2° Semestre
Caio Zanfollim Cunha - 2509832
João Pedro de Andrade Silva - 2508650


Sistema Lavajato

Aplicativo de linha de comando para gerenciar o fluxo de lavagem de carros em um lavajato. Permite cadastrar veículos, iniciar e finalizar a lavagem, buscar e listar carros, com os dados salvos em arquivo CSV para persistência simples.

Funcionalidades

Cadastro de carros: placa, modelo, marca, cor e status da lavagem.

Controle de status da lavagem: iniciar e finalizar.

Busca por placa para consultar o status atual do veículo.

Listagem de todos os carros cadastrados e seus status.

Remoção de carros do sistema.

Persistência dos dados em arquivo CSV (carros.csv).

Criação automática do arquivo CSV, se não existir.

Estrutura do projeto
LavagemNovo/
├─ node_modules/
├─ carros.csv         # arquivo CSV com os dados dos carros
├─ lavagem.ts         # código fonte TypeScript principal
├─ package.json
├─ package-lock.json
├─ tsconfig.json
└─ README.md          # este arquivo

Requisitos

Node.js 16 ou superior (recomendado 18+)

npm

Instalação

Clone ou baixe o projeto.

Na pasta raiz do projeto, instale as dependências:

npm install
npm i -D typescript ts-node @types/node


Configure no package.json o script para rodar em modo desenvolvimento:

{
  "name": "desktop",
  "version": "1.0.0",
  "main": "js/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node js/index.js",
    "dev": "ts-node ts/index.ts"
  },
  "devDependencies": {
    "@types/node": "^24.3.1",
    "ts-node": "^10.9.2",
    "typescript": "^5.9.2"
  }
}

Certifique-se que o tsconfig.json está configurado assim (ou similar):

{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["node"]
  }
}

Como usar

Execute o comando para iniciar o programa:

npm run dev


O programa exibirá um menu interativo no terminal com as opções:

Cadastrar carro

Listar carros cadastrados

Buscar carro pela placa

Remover carro pela placa

Iniciar lavagem

Finalizar lavagem

Sair

Basta digitar o número da opção desejada e seguir as instruções.

Dados armazenados

Os dados ficam salvos no arquivo carros.csv, no formato CSV com as colunas:

placa (sempre em maiúsculas)

modelo

marca

cor

status (Não iniciado, Lavando ou Pronto)

Reset / Limpeza dos dados

Para apagar todos os registros e começar do zero, delete o arquivo carros.csv. Ele será recriado automaticamente ao iniciar o programa.
