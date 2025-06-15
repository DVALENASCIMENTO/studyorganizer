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
    div.innerHTML = `
      <strong>${curso.nome}</strong>
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
      span.textContent = `${e.target.value}%`; // ← Aqui estava o erro
      salvar();
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
