/**
 * Recebe os cadastros do site e grava na planilha.
 * Instalação: abra a planilha > Extensões > Apps Script > cole este código > Implantar > Nova implantação
 * > tipo "App da Web" > Executar como: Eu > Quem pode acessar: Qualquer pessoa > Implantar > copiar a URL (/exec).
 */
const NOME_DA_ABA = ''; // vazio = primeira aba da planilha

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (!d || !d.id) return resposta({ ok: false, error: 'cadastro sem id' });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = NOME_DA_ABA ? ss.getSheetByName(NOME_DA_ABA) : ss.getSheets()[0];
    const COL_ID = 9; // coluna I
    const ultima = sh.getLastRow();

    // evita duplicar se o aparelho reenviar o mesmo cadastro
    const ids = ultima > 1 ? sh.getRange(2, COL_ID, ultima - 1, 1).getValues().flat() : [];
    if (ids.indexOf(d.id) === -1) {
      sh.appendRow([
        txt(d.hora), txt(d.nome), txt(d.tel), txt(d.email),
        txt(d.emp), txt(d.cat), txt(d.vend), txt(d.prod), d.id
      ]);
    }
    return resposta({ ok: true });
  } catch (err) {
    return resposta({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return resposta({ ok: true, status: 'online' }); }

// impede que o Sheets interprete texto digitado como fórmula
function txt(v) {
  v = String(v == null ? '' : v);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}
function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
