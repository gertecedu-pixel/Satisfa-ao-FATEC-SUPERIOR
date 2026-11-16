// MODO DEMONSTRAÇÃO – simula o backend com dados fictícios. Só é usado se API_URL estiver vazio.
// Login de teste: RA 100001 / senha 12345678909
(function () {
  const Q = {
    titulo: 'Autoavaliação Institucional – Corpo Discente (DEMO)',
    abertura: ['PAI – Programa de Autoavaliação Institucional 2026 (modo demonstração).'],
    escala: ['Não sei responder', 'Insuficiente', 'Suficiente', 'Muito boa', 'Excelente'],
    secoes: [
      { titulo: 'Instituição', perguntas: [
        { id: 'd_nps_ies', tipo: 'nps', texto: 'De 0 a 10, qual a probabilidade de você recomendar a Faculdade SENAI?' },
        { id: 'd_motivos', tipo: 'multipla', max: 2, texto: 'Principais motivos da nota?', ajuda: 'Você pode assinalar até duas opções.',
          opcoes: [{ v: 'Infraestrutura', t: 'Infraestrutura' }, { v: 'Acadêmico', t: 'Acadêmico' }, { v: 'Atendimento', t: 'Atendimento' }] }
      ]},
      { titulo: 'Seu curso', intro: 'Considere a escala: (1) não sei responder · (2) insuficiente · (3) suficiente · (4) muito boa · (5) excelente', perguntas: [
        { id: 'd01', tipo: 'escala', texto: 'Os conteúdos apresentados contribuem para os estudos.' }
      ]},
      { titulo: 'Atuação dos professores', professores: true, lista: ['Professor(a) A', 'Professor(a) B'], perguntas: [
        { id: 'dp34', tipo: 'escala', texto: 'O(a) professor(a) demonstra domínio dos conteúdos.' }
      ]},
      { titulo: 'Perfil', perguntas: [
        { id: 'd_pf_genero', tipo: 'unica', perfil: true, texto: 'Gênero', opcoes: ['Feminino', 'Masculino', 'Outro', 'Prefiro não informar'] },
        { id: 'd_melhoria', tipo: 'texto', maxlen: 150, obrigatoria: false, texto: 'O que poderia melhorar? (opcional)' }
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
        resultados: { totalRespostas: 21, escala: ['Não sei responder', 'Insuficiente', 'Suficiente', 'Muito boa', 'Excelente'], secoes: [
          { titulo: 'Instituição', perguntas: [
            { id: 'd_nps_ies', texto: 'Recomendaria a instituição? (0–10)', tipo: 'nps', geral: { n: 21, media: 8.1, fav: 0.6, nps: 38 }, dist: [0, 0, 0, 1, 1, 1, 1, 2, 4, 5, 6], distIni: 0, porCurso: {} },
            { id: 'd_motivos', texto: 'Principais motivos da nota', tipo: 'multipla', n: 21, suprimido: false, opcoes: [{ v: 'Infraestrutura', n: 9 }, { v: 'Acadêmico', n: 14 }, { v: 'Atendimento', n: null }] }
          ]},
          { titulo: 'Seu curso', perguntas: [
            { id: 'd01', texto: 'O projeto pedagógico é coerente.', tipo: 'escala', geral: { n: 19, media: 3.9, fav: 0.67 }, dist: dist, distIni: 1, porCurso: { 'Design de Interiores': { n: 8, media: 4.1, fav: 0.75 } } }
          ]},
          { titulo: 'Perfil', perguntas: [
            { id: 'd_pf_genero', texto: 'Gênero', tipo: 'unica', perfil: true, n: 21, suprimido: false, opcoes: [{ v: 'Feminino', n: 12 }, { v: 'Masculino', n: 7 }, { v: 'Outro', n: null }] }
          ]}
        ], professores: [
          { professor: 'Professor(a) A', avaliacoes: 12, suprimido: false, mediaGeral: 4.2, perguntas: [{ id: 'dp34', texto: 'Domínio dos conteúdos', n: 12, media: 4.4 }] },
          { professor: 'Professor(a) B', avaliacoes: 3, suprimido: true, mediaGeral: null, perguntas: [] }
        ], comentarios: [{ id: 'd_melhoria', texto: 'Sugestões', itens: ['Mais tomadas na sala 3.'] }] } };
    }
    return { ok: false, erro: 'Ação inválida.' };
  };
})();
