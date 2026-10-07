// O pdf.mjs do pdfjs-dist (4.x/5.x) já vem empacotado por webpack e declara `var __webpack_exports__`.
// O webpack do Next 14 não renomeia essa variável; no dev (eval em modo estrito) ela esconde o
// parâmetro do módulo e quebra com "Object.defineProperty called on non-object".
// Renomear evita a colisão. Pode ser removido ao migrar para o Next 15.
module.exports = function pdfjsExportsLoader(source) {
  return source.replace(/__webpack_exports__/g, "__pdfjs_exports__");
};
