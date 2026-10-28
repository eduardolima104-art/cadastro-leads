/**
 * Recebe os cadastros do site e grava na planilha.
 * Instalação: abra a planilha > Extensões > Apps Script > cole este código > Implantar > Nova implantação
 * > tipo "App da Web" > Executar como: Eu > Quem pode acessar: Qualquer pessoa > Implantar > copiar a URL (/exec).
 * Depois de alterar este código: Implantar > Gerenciar implantações > editar > Nova versão (a URL continua a mesma).
 *
 * Colunas: A Data/Hora cadastro | B Nome | C Telefone | D E-mail | E Empresa | F Categoria |
 *          G Vendedor que atendeu | H Produtos de interesse | I ID (controle) | J Data/Hora sincronização
 */
const NOME_DA_ABA = ''; // vazio = primeira aba da planilha
const FUSO = 'America/Sao_Paulo';
const COL_ID = 9;       // coluna I
const TOTAL_COLUNAS = 10;

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (!d || !d.id) return resposta({ ok: false, error: 'cadastro sem id' });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = NOME_DA_ABA ? ss.getSheetByName(NOME_DA_ABA) : ss.getSheets()[0];
    const ultima = sh.getLastRow();

    // evita duplicar se o aparelho reenviar o mesmo cadastro
    const ids = ultima > 1 ? sh.getRange(2, COL_ID, ultima - 1, 1).getValues().flat() : [];
    if (ids.indexOf(d.id) === -1) {
      const sincronizado = Utilities.formatDate(new Date(), FUSO, 'dd/MM/yyyy HH:mm:ss');
      const linha = ultima + 1;
      const faixa = sh.getRange(linha, 1, 1, TOTAL_COLUNAS);
      faixa.setNumberFormat('@'); // tudo como texto: datas e telefones ficam exatamente como enviados
      faixa.setValues([[
        txt(d.hora), txt(d.nome), txt(d.tel), txt(d.email),
        txt(d.emp), txt(d.cat), txt(d.vend), txt(d.prod), d.id, sincronizado
      ]]);
    }
    return resposta({ ok: true });
  } catch (err) {
    return resposta({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return resposta({ ok: true, status: 'online' }); }

function txt(v) { return String(v == null ? '' : v); }
function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
