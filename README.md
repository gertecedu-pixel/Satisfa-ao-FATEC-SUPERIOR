# PAI 2026 – Pesquisa CPA (FATEC / FACON)

Landing + login + questionário, com sigilo das respostas. Mesma arquitetura do repositório de referência (site estático + Google Apps Script + Google Sheets).

## Arquivos
- `index.html` – landing page e login (`?perfil=discente|docente|colaborador`)
- `pesquisa.html` – termo LGPD + questionário em etapas
- `config.js` – URL do Apps Script (vazia = modo demonstração)
- `apps-script/Code.gs` – backend, **questionários** e relatórios
- `admin.html` – painel administrativo (login próprio; participação, lista de respondentes, resultados agregados)
- `mock-api.js` – simulação para testes (login `100001` / senha `12345678909`)

## Como funciona o acesso
- Login = **RA** (aluno) ou **Matrícula**; senha = **CPF** (somente números) — validados contra a planilha de respondentes (aba `Alunos`; só `StatusMatricula = Matriculado`).
- Banner no portal do aluno → `https://SEU-SITE/index.html?perfil=discente`
- Banner no portal docente → `...?perfil=docente`
- Link por e-mail aos colaboradores → `...?perfil=colaborador`
- Bloqueio de 15 min após 5 senhas erradas; sessão expira em 90 min; 1 resposta por pessoa.

## Sigilo
A planilha de resultados tem duas abas independentes por perfil:
- `Controle_*` → **quem** respondeu (login, nome, curso, data). Usada para % de participação e cobrança.
- `Respostas_*` → **o que** foi respondido: só unidade/curso/modalidade + respostas, **sem login, sem horário**, inseridas em linha aleatória (não há ordem que permita cruzar com o Controle).
- Relatórios suprimem grupos com menos de 5 respostas.

## Implantação
1. Em script.google.com crie um projeto, cole `apps-script/Code.gs`.
2. Execute `setup()` (autorize). Ele cria a planilha **"CPA 2026 – Respostas (CONFIDENCIAL)"** — não compartilhe com quem não for CPA.
3. Implantar → Aplicativo da Web → executar como **você**, acesso **qualquer pessoa**. Copie a URL `/exec` para `config.js` (`API_URL`).
4. Hospede os arquivos (GitHub Pages ou servidor da instituição, preferível em domínio institucional com HTTPS).
5. Depois do período: execute `gerarRelatorio()` → abas `Participacao_*` e `Resultados_*`.

## Pendências / decisões
- **Perguntas:** as atuais são rascunho (a CPA está atualizando). Edite `QUESTIONARIOS` em `Code.gs`.
- **Senha = CPF:** não há coluna de senha na planilha. Se preferir data de nascimento ou senha própria, ajuste `senha` em `CFG.PERFIS`.
- **Listas de docentes e colaboradores:** criar abas `Docentes` e `Colaboradores` (colunas em `CFG.PERFIS`).
- **LGPD:** a planilha de alunos contém CPF, nome e nascimento. Restrinja o acesso, e avalie com o DPO/jurídico o Apps Script como operador (Google) e o texto do termo.
- **Segurança:** o Apps Script é adequado para o piloto; para a Visita MEC/INEP considere backend institucional (SSO do portal, auditoria).

## Painel administrativo (`admin.html`)
1. No Apps Script: Configurações do projeto → Propriedades do script → adicione `ADMIN_USUARIO` e `ADMIN_SENHA`.
2. Publique **nova versão** da implantação.
3. Acesse `.../admin.html` (não há link público para ele).
Mostra, ao vivo: participação por curso, lista Respondeu/Pendente (com filtro e CSV), resultados agregados e comentários anônimos. Nunca mostra resposta por pessoa; resultados por curso só com 5+ respostas.
