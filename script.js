const form = document.getElementById('formCurso');
const lista = document.getElementById('listaCursos');

let cursos = JSON.parse(localStorage.getItem('cursos')) || [];

function salvar() {
  localStorage.setItem('cursos', JSON.stringify(cursos));
}

function renderizarCursos() {
  lista.innerHTML = '';
  cursos.forEach((curso, index) => {
    const div = document.createElement('div');
    div.className = 'curso';
    div.setAttribute('draggable', 'true');
    div.setAttribute('data-index', index);
    div.innerHTML = `
      <div class="curso-header">
        <strong>${curso.nome}</strong>
        <button class="btn-excluir" title="Remover">&times;</button>
      </div>
      <a class="link" href="${curso.link}" target="_blank">${curso.link}</a>
      <div class="progresso">
        <input type="range" min="0" max="100" value="${curso.progresso}" data-index="${index}">
        <span>${curso.progresso}%</span>
      </div>
    `;
    lista.appendChild(div);

    const range = div.querySelector('input[type="range"]');
    const span = div.querySelector('span');
    range.addEventListener('input', (e) => {
      cursos[index].progresso = parseInt(e.target.value);
      span.textContent = `${e.target.value}%`;
      salvar();
    });

    div.querySelector('.btn-excluir').addEventListener('click', () => {
      if (confirm(`Deseja remover o curso "${curso.nome}"?`)) {
        cursos.splice(index, 1);
        salvar();
        renderizarCursos();
      }
    });

    div.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', index);
      div.classList.add('arrastando');
    });

    div.addEventListener('dragend', () => {
      div.classList.remove('arrastando');
    });

    div.addEventListener('dragover', (e) => {
      e.preventDefault();
      div.classList.add('sobre');
    });

    div.addEventListener('dragleave', () => {
      div.classList.remove('sobre');
    });

    div.addEventListener('drop', (e) => {
      e.preventDefault();
      const origem = parseInt(e.dataTransfer.getData('text/plain'));
      const destino = index;
      const cursoMovido = cursos.splice(origem, 1)[0];
      cursos.splice(destino, 0, cursoMovido);
      salvar();
      renderizarCursos();
    });
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const link = document.getElementById('link').value;

  cursos.push({ nome, link, progresso: 0 });
  salvar();
  form.reset();
  renderizarCursos();
});

renderizarCursos();
