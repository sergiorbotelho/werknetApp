# Werk OS App

Sistema web para gestão de **ordens de serviço (OS)** e **clientes** da Werk, empresa de manutenção preventiva e corretiva em equipamentos de informática. Permite cadastrar clientes, abrir e acompanhar ordens de serviço e gerar o PDF da OS para visualizar, imprimir, baixar ou compartilhar.

Este repositório contém apenas o **frontend**. Os dados vêm de uma API REST externa, configurada pela variável `NEXT_PUBLIC_API`.

## Funcionalidades

- **Ordens de serviço:** cadastro, edição e exclusão, com busca por número, cliente, equipamento, defeito ou contato.
- **Clientes:** cadastro com máscaras de telefone, CPF/CNPJ e CEP, e endereço preenchido automaticamente pelo [ViaCEP](https://viacep.com.br). A página de cada cliente mostra o histórico de OS dele.
- **PDF da OS:**
  - O modal mostra o documento em qualquer dispositivo.
  - No desktop, tem **Download** e **Imprimir**.
  - No celular, tem **Compartilhar** (folha nativa de compartilhamento) e **Imprimir**.
- **Sessão segura:**
  - A sessão dura no máximo 12 horas.
  - O usuário é desconectado ao fechar o navegador ou todas as abas do sistema.
- **Aba única:** ao abrir o sistema em outra aba, a anterior fica inativa, com um aviso e o favicon de alerta, no estilo do WhatsApp Web.
- **Tema claro e escuro.**

## Stack

| Camada       | Tecnologia                                               |
| ------------ | -------------------------------------------------------- |
| Framework    | Next.js 14 (App Router) · React 18 · TypeScript          |
| Autenticação | NextAuth.js v4 (credenciais + JWT)                       |
| UI           | Tailwind CSS 3 · shadcn/ui (Radix UI) · lucide-react     |
| Formulários  | React Hook Form · Zod                                    |
| HTTP         | Axios                                                    |
| PDF          | pdfmake (geração) · react-pdf / pdf.js (visualização)    |

## Pré-requisitos

- Node.js 18.17 ou superior (recomendado 20+)
- npm
- Acesso à API do backend

## Como rodar

1. **Instale as dependências:**

   ```bash
   npm install
   ```

   O `postinstall` copia o worker do pdf.js para `public/pdf.worker.min.mjs`. O arquivo é gerado automaticamente e não é versionado.

2. **Configure as variáveis de ambiente.** Copie `.env.example` para `.env` e preencha:

   | Variável          | Descrição                                                                 |
   | ----------------- | ------------------------------------------------------------------------- |
   | `NEXTAUTH_URL`    | URL pública da aplicação (ex.: `http://localhost:3000` em desenvolvimento) |
   | `NEXTAUTH_SECRET` | Segredo usado para assinar a sessão. Gere com `openssl rand -base64 32`    |
   | `NEXT_PUBLIC_API` | URL base da API do backend                                                |

3. **Suba o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

   Acesse [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando         | Descrição                                       |
| --------------- | ----------------------------------------------- |
| `npm run dev`   | Servidor de desenvolvimento                     |
| `npm run build` | Build de produção (inclui checagem de tipos)    |
| `npm run start` | Sobe o build de produção                        |
| `npm run lint`  | ESLint via `next lint`                          |

O projeto ainda não tem testes automatizados nem configuração de ESLint versionada. Na primeira execução, o `npm run lint` pede para criar essa configuração.

## Estrutura

```
src/
├── app/
│   ├── (auth-routes)/        # Rotas protegidas: OS (/) e clientes (/customers)
│   ├── api/auth/             # Handler do NextAuth
│   ├── login/                # Tela de login
│   └── components/
│       ├── customers/        # Lista, card e modal de clientes
│       ├── serviceOrder/     # Lista, card, modal de OS e visualizador de PDF
│       ├── ui/               # Componentes shadcn/ui
│       └── tab-guard.tsx     # Aba única + logout ao fechar
├── lib/                      # Configuração do NextAuth e sessão por aba
├── report/pdfOrder.tsx       # Montagem do PDF da OS (pdfmake)
├── services/api/             # Clientes Axios (navegador e servidor)
└── types/                    # Tipos de domínio
```

## Arquitetura

- **Autenticação:**
  - O login envia e-mail e senha para `POST /session` da API.
  - O token devolvido fica na sessão JWT do NextAuth.
  - As rotas em `(auth-routes)` verificam a sessão no servidor e redirecionam para `/login` se não houver uma.
- **Chamadas à API:**
  - Componentes de cliente usam `services/api/api.ts`, que injeta o token e faz logout automático em caso de `401`.
  - Componentes de servidor usam `getServerApi()`.
- **PDF:**
  - O documento é montado no navegador com pdfmake e desenhado em canvas pelo pdf.js. Iframes não são usados, porque o Safari do iOS e o Chrome do Android não exibem PDF dentro deles.
  - O pdfmake só é carregado quando o modal abre.
  - Há uma migração planejada para gerar o PDF no backend. Nesse caso, o modal apenas exibirá o arquivo recebido.

Detalhes e decisões técnicas estão documentados em [`CLAUDE.md`](CLAUDE.md).

## Deploy

- **Sirva em HTTPS:** o botão **Compartilhar** usa a Web Share API, que só existe em páginas seguras. Em HTTP ele é substituído por **Download**.
- **Defina `NEXTAUTH_URL`** com a URL pública de produção.
- **O build precisa rodar `npm install`** (ou `npm ci`) para que o `postinstall` gere o worker do pdf.js.

## Testando no celular

O compartilhamento exige HTTPS, então acessar `http://<ip-local>:3000` pelo celular não basta. Com o servidor de desenvolvimento rodando, abra um túnel HTTPS temporário:

```bash
npx cloudflared tunnel --url http://localhost:3000
```

Abra no celular a URL `https://<...>.trycloudflare.com` exibida no terminal. O túnel deixa o sistema acessível publicamente enquanto estiver aberto, então encerre-o com `Ctrl+C` ao terminar.
