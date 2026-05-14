
# Desafio Front-end Angular - Attus

Aplicação desenvolvida para o desafio técnico de Desenvolvedor Front-end Angular.

O projeto reproduz uma tela de listagem de usuários com busca, cadastro e edição em modal, utilizando Angular, Angular Material, RxJS, Signals, Reactive Forms e testes com Vitest.

---

## Tecnologias utilizadas

- Angular 21, atendendo ao requisito Angular 17+
- Angular Material
- TypeScript
- RxJS
- Angular Signals
- Reactive Forms
- SCSS
- Vitest
- API mockada com service Angular

---

## Funcionalidades

- Listagem de usuários em cards/linhas
- Exibição de nome, e-mail e botão de edição
- Filtro por nome com debounce de 300ms
- Estado de loading durante o carregamento
- Mensagem de erro em caso de falha
- Cadastro de novo usuário em modal
- Edição de usuário em modal
- Formulário reativo com validações
- Botão salvar desabilitado enquanto o formulário está inválido
- Preenchimento automático dos dados no modo edição
- Validação de formato para e-mail, CPF e telefone
- Layout responsivo

---

## Campos do formulário

O formulário de criação e edição de usuários possui os seguintes campos:

- E-mail obrigatório
- Nome obrigatório
- CPF obrigatório
- Telefone obrigatório
- Tipo de telefone obrigatório

Formatos esperados:

```txt
CPF: 000.000.000-00
Telefone: (11) 99999-9999
```

* * * * *

Requisitos técnicos atendidos
-----------------------------

-   Angular 17+
-   Angular Material
-   Componentes standalone
-   Gerenciamento de estado com Angular Signals
-   RxJS com operadores em uso real:
    -   debounceTime
    -   distinctUntilChanged
    -   catchError
    -   finalize
    -   switchMap
    -   filter
-   Subscriptions gerenciadas com takeUntilDestroyed
-   Testes unitários com Vitest
-   Cobertura de testes acima de 60%

* * * * *

Como instalar
-------------

Clone o repositório:

```
git clone <https://github.com/MathzRod/attus_teste_pratico.git>
```

Entre na pasta do projeto:

```
cd attus-test
```

Instale as dependências:

```
npm install
```

* * * * *

Como executar localmente
------------------------

Rode o projeto:

```
npm start
```

Ou:

```
ng serve
```

Acesse no navegador:

```
http://localhost:4200
```

* * * * *

Como gerar build
----------------

```
npm run build
```

* * * * *

Como rodar os testes
--------------------

```
npm test
```

* * * * *

Como gerar relatório de cobertura
---------------------------------

```
npm run test:coverage
```

Cobertura obtida no projeto:

```
Statements: 83.56%Branches:   98.93%Functions:  90.90%Lines:      91.66%
```

* * * * *

Estrutura do projeto
--------------------

```
src/app
├── core
│   └── models
│       └── user.model.ts
│
├── features
│   └── users
│       ├── components
│       │   └── user-form-dialog
│       │
│       ├── pages
│       │   └── users-list
│       │
│       ├── services
│       │   └── users.service.ts
│       │
│       └── store
│           └── users.store.ts
│
├── app.config.ts
├── app.routes.ts
├── app.html
└── app.ts
```

* * * * *

Decisões técnicas
-----------------

A aplicação utiliza Angular Signals para gerenciamento de estado local, por ser uma solução nativa do Angular, simples e adequada para o escopo do desafio.

O RxJS foi utilizado para controlar fluxos assíncronos, como carregamento de dados, tratamento de erro, abertura de modal e filtro com debounce.

Os dados são fornecidos por uma API mockada em um service Angular, simulando operações de listagem, criação e edição de usuários.

O formulário de cadastro e edição foi implementado com Reactive Forms, permitindo validações por campo, controle de estado do formulário e desabilitação do botão de salvar enquanto os dados estão inválidos.


Os componentes foram desenvolvidos como standalone components, seguindo o padrão moderno do Angular.

* * * * *

Testes
------

Foram criados testes unitários para:

-   AppComponent
-   UsersStore
-   UsersService
-   UserFormDialogComponent
-   UsersListComponent

A cobertura final ficou acima do mínimo solicitado no desafio.