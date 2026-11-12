// URL do Aplicativo da Web (Apps Script) terminada em /exec.
// Deixe vazio para usar o MODO DEMONSTRAÇÃO (dados fictícios no navegador).
window.CPA_CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbyzp5XDiZ1BD34LlhDGgipoFvp7DjsB-65kJrgiVnn2DrtkGvfeSEgPH97sBAmY1LGM/exec',
  ANO: 2026,
  PERFIS: {
    discente:    { rotulo: 'Corpo Discente',               login: 'RA (Registro Acadêmico)', loginHint: 'Somente números' },
    docente:     { rotulo: 'Corpo Docente',                login: 'Matrícula',               loginHint: 'Ex.: 2994', permiteBarra: true },
    colaborador: { rotulo: 'Corpo Técnico-Administrativo', login: 'Matrícula',               loginHint: 'Ex.: 1/4815 ou 4815', permiteBarra: true }
  }
};
