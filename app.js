// Utilitários compartilhados: API, sessão e escape de HTML.
(function () {
  const cfg = window.CPA_CONFIG;

  window.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  window.api = async function (action, payload) {
    const body = Object.assign({ action: action }, payload);
    if (!cfg.API_URL) return window.mockApi(body);          // modo demonstração
    try {
      // text/plain evita pré-voo CORS no Apps Script
      const r = await fetch(cfg.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(body)
      });
      return await r.json();
    } catch (e) {
      return { ok: false, erro: 'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.' };
    }
  };

  // A sessão fica só na aba do navegador (some ao fechar).
  window.sessao = {
    salvar: function (o) { try { sessionStorage.setItem('cpa_sessao', JSON.stringify(o)); } catch (e) {} },
    ler: function () { try { return JSON.parse(sessionStorage.getItem('cpa_sessao')); } catch (e) { return null; } },
    limpar: function () { try { sessionStorage.removeItem('cpa_sessao'); sessionStorage.removeItem('cpa_rascunho'); } catch (e) {} }
  };

  window.perfilDaUrl = function () {
    const p = new URLSearchParams(location.search).get('perfil');
    return cfg.PERFIS[p] ? p : 'discente';
  };
})();
