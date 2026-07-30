# Demo de atendimento automático (podologia)

## Antes de subir
Abre o `index.html` e edita o bloco `CONFIG` (começo da tag `<script>`):
nome da clínica, atendente, cidade, endereço, serviços com preço e duração, horários.

## Deploy na Vercel
1. vercel.com/new e arrasta a pasta inteira
2. Settings > Environment Variables
3. Nome: `GROQ_API_KEY` · Valor: a chave que está no `.env.local` · marca Production
4. Deployments > Redeploy no último

Sem o redeploy a variável não entra e o chat responde erro de conexão.

## Rodar local
```
npm i -g vercel
vercel dev
```
Ele lê o `.env.local` sozinho.

## Erros
Log em Deployments > aba Functions.
- `chave não configurada` = variável de ambiente faltando
- `falha na geração` = chave inválida, sem crédito, ou modelo desativado

## Trocar de modelo
Em `api/chat.js`, campo `model`. Hoje: `llama-3.3-70b-versatile`.
