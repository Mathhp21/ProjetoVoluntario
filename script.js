function mostrarSecao(id) {
  document.querySelectorAll('.secao').forEach(secao => secao.style.display = 'none');
  document.getElementById(id).style.display = 'block';
  if (id === 'visualizar') carregarNecessidades();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('cep').addEventListener('blur', async () => {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    if (cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        document.getElementById('rua').value = data.logradouro;
        document.getElementById('bairro').value = data.bairro;
        document.getElementById('cidade').value = data.localidade;
        document.getElementById('estado').value = data.uf;
      } else {
        alert("CEP não encontrado.");
      }
    } catch (err) {
      console.error("Erro:", err);
    }
  });

  document.getElementById('formNecessidade').addEventListener('submit', e => {
    e.preventDefault();
    const nova = {
      instituicao: document.getElementById('instituicao').value,
      tipo: document.getElementById('tipoAjuda').value,
      titulo: document.getElementById('titulo').value,
      descricao: document.getElementById('descricao').value,
      cep: document.getElementById('cep').value,
      rua: document.getElementById('rua').value,
      bairro: document.getElementById('bairro').value,
      cidade: document.getElementById('cidade').value,
      estado: document.getElementById('estado').value,
      contato: document.getElementById('contato').value,
    };
    const necessidades = JSON.parse(localStorage.getItem("necessidades")) || [];
    necessidades.push(nova);
    localStorage.setItem("necessidades", JSON.stringify(necessidades));
    alert("Necessidade cadastrada com sucesso!");
    document.getElementById('formNecessidade').reset();
  });

  document.getElementById("campoPesquisa").addEventListener("input", carregarNecessidades);
  document.getElementById("filtroTipoAjuda").addEventListener("change", carregarNecessidades);
});

function carregarNecessidades() {
  const lista = JSON.parse(localStorage.getItem("necessidades")) || [];
  const pesquisa = document.getElementById("campoPesquisa").value.toLowerCase();
  const tipoFiltro = document.getElementById("filtroTipoAjuda").value;
  const container = document.getElementById("listaNecessidades");
  container.innerHTML = "";
  const filtradas = lista.filter(n => {
    return (n.titulo.toLowerCase().includes(pesquisa) || n.descricao.toLowerCase().includes(pesquisa)) &&
           (tipoFiltro === "" || n.tipo === tipoFiltro);
  });
  if (filtradas.length === 0) {
    container.innerHTML = "<p>Nenhuma necessidade encontrada.</p>";
    return;
  }
  filtradas.forEach(n => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${n.titulo}</h3>
      <p><strong>Instituição:</strong> ${n.instituicao}</p>
      <p><strong>Tipo de Ajuda:</strong> ${n.tipo}</p>
      <p><strong>Descrição:</strong> ${n.descricao}</p>
      <p><strong>Endereço:</strong> ${n.rua}, ${n.bairro}, ${n.cidade} - ${n.estado}</p>
      <p><strong>Contato:</strong> ${n.contato}</p>
    `;
    container.appendChild(div);
  });
}