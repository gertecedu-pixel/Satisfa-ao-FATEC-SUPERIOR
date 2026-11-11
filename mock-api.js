// MODO DEMONSTRAÇÃO – simula o backend com dados fictícios. Só é usado se API_URL estiver vazio.
// Login de teste: RA 100001 / senha 12345678909
(function () {
  const Q = {
    titulo: 'Autoavaliação Institucional – Corpo Discente (DEMO)',
    secoes: [
      { titulo: 'Seu curso', perguntas: [
        { id: 'd01', tipo: 'likert', texto: 'O projeto pedagógico do curso é coerente com a proposta apresentada na matrícula.' },
        { id: 'd02', tipo: 'likert', texto: 'Os docentes demonstram domínio dos conteúdos.' }
      ]},
      { titulo: 'Visão geral', perguntas: [
        { id: 'd03', tipo: 'nps', texto: 'De 0 a 10, qual a chance de você recomendar a instituição?' },
        { id: 'd04', tipo: 'texto', obrigatoria: false, texto: 'Sugestões (opcional – não se identifique).' }
      ]}
    ]
  };
  const usuarios = { '100001': { cpf: '12345678909', nome: 'Maria Souza', curso: 'Tecnologia em Design de Interiores' } };

  window.mockApi = async function (p) {
    await new Promise(function (r) { setTimeout(r, 500); });
    const jaFez = JSON.parse(localStorage.getItem('demo_respondeu') || '[]');
    if (p.action === 'login') {
      const u = usuarios[String(p.login).replace(/\D/g, '')];
      if (!u || u.cpf !== String(p.senha).replace(/\D/g, '').padStart(11, '0')) return { ok: false, erro: 'Login ou senha inválidos.' };
      if (jaFez.indexOf(p.login) >= 0) return { ok: false, jaRespondeu: true, erro: 'Você já respondeu a esta pesquisa. Obrigado pela participação!' };
      return { ok: true, token: 'demo:' + p.login, nome: u.nome.split(' ')[0], curso: u.curso, questionario: Q };
    }
    if (p.action === 'enviar') {
      const l = String(p.token).replace('demo:', '');
      jaFez.push(l);
      localStorage.setItem('demo_respondeu', JSON.stringify(jaFez));
      console.log('[DEMO] respostas anônimas enviadas:', p.respostas);
      return { ok: true };
    }
    return { ok: false, erro: 'Ação inválida.' };
  };
})();
