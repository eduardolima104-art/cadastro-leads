# Cadastro de Visitantes – Tudo do Mar | Feira Super Mix

Site de cadastro (Nome, Telefone, E-mail opcional, Empresa, Categoria, Vendedor que atendeu, Produtos de interesse) para tablet/totem.
**Funciona sem internet**: cada cadastro é guardado no aparelho e enviado para o Google Sheets assim que a conexão volta.

## Como funciona
- `index.html` – o site (visual igual ao Jogo da Memória).
- `sw.js` + `manifest.webmanifest` – deixam o site abrir sem internet e instalável na tela inicial.
- `config.js` – onde fica a URL do Apps Script (`SYNC_URL`).
- `apps-script/Code.gs` – recebe os cadastros e grava na planilha (ignora duplicados pelo ID).

Todo cadastro é salvo primeiro no aparelho. O envio é refeito automaticamente (ao voltar a internet e a cada 30 s) até dar certo.
O botão "Baixar backup (.csv)" no fim da página exporta tudo o que está no aparelho.

## Instalação (uma vez)
1. **Planilha:** abra a planilha "Cadastro Feira Super Mix – Tudo do Mar". Ela precisa ter na linha 1: `Data/Hora, Nome, Telefone, E-mail, Empresa, Categoria, Vendedor que atendeu, Produtos de interesse, ID (controle)`.
2. **Apps Script:** na planilha, menu *Extensões > Apps Script*. Apague o conteúdo, cole o de `apps-script/Code.gs` e salve.
3. *Implantar > Nova implantação > App da Web* — Executar como: **Eu**; Quem pode acessar: **Qualquer pessoa**. Autorize e copie a URL que termina em `/exec`.
4. **config.js:** cole essa URL em `SYNC_URL` e faça commit.
5. **Publicar o site:** no GitHub, *Settings > Pages > Deploy from a branch > main / (root)*. O endereço será `https://<usuario>.github.io/cadastro-leads/`.
6. **No tablet/totem:** abra o endereço **uma vez com internet** (isso baixa o site para uso offline) e use *Adicionar à tela inicial* / *Instalar app*.

## Atualizando o site
Depois de alterar `index.html` ou `config.js`, aumente o número de versão em `sw.js` (`const CACHE = 'cadastro-v2'`) para os aparelhos pegarem a versão nova. Abra uma vez com internet.

## Observações
- A URL do Apps Script fica visível no repositório público; qualquer pessoa com ela consegue enviar linhas para a planilha. Se isso for um problema, torne o repositório privado (o GitHub Pages em repositório privado exige plano pago) ou hospede o site em outro lugar.
- Os dados ficam no navegador do aparelho. Não limpe os dados do site/navegador enquanto houver cadastros pendentes.
