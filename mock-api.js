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
    if (p.action === 'adminLogin') {
      return p.usuario === 'admin' && p.senha === 'admin'
        ? { ok: true, token: 'demo-admin', perfis: ['discente', 'docente', 'colaborador'], minGrupo: 5 }
        : { ok: false, erro: 'Usuário ou senha inválidos.' };
    }
    if (p.action === 'adminDados') {
      const nomes = ['Ana Lima', 'Bruno Reis', 'Carla Dias', 'Diego Melo', 'Elisa Prado', 'Fábio Nunes', 'Gisele Rocha'];
      const lista = nomes.map(function (n, i) {
        return ['Faculdade SENAI da Construção', i < 5 ? 'Design de Interiores' : 'Engenharia Civil', 'GRA.015.PRE.00' + (i % 3), String(100000 + i), n, i % 3 ? 'Respondeu' : 'Pendente', i % 3 ? '11/11/2026' : ''];
      });
      const dist = [1, 2, 4, 8, 6];
      return { ok: true, perfil: p.perfil, atualizadoEm: '11/11/2026 15:40', minGrupo: 5,
        participacao: { total: 7, respondeu: 5, porCurso: [{ curso: 'Design de Interiores', total: 5, respondeu: 3 }, { curso: 'Engenharia Civil', total: 2, respondeu: 2 }] },
        lista: lista,
        resultados: { totalRespostas: 21, perguntas: [
          { id: 'd01', texto: 'O projeto pedagógico é coerente.', tipo: 'likert', secao: 'Seu curso', geral: { n: 21, media: 3.9, fav: 0.67 }, dist: dist, distIni: 1, porCurso: { 'Design de Interiores': { n: 8, media: 4.1, fav: 0.75 } } },
          { id: 'd11', texto: 'Recomendaria a instituição?', tipo: 'nps', secao: 'Visão geral', geral: { n: 21, media: 8.1, fav: 0.6, nps: 38 }, dist: [0, 0, 0, 1, 1, 1, 1, 2, 4, 5, 6], distIni: 0, porCurso: {} }
        ], comentarios: [{ id: 'd12', texto: 'Sugestões', itens: ['Mais tomadas na sala 3.'] }] } };
    }
    return { ok: false, erro: 'Ação inválida.' };
  };
})();
