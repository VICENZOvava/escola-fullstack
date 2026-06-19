const API = "http://localhost:3000";

let professorLogado = null;


document.getElementById("btn-login").addEventListener("click", async () => {
    const email = document.getElementById("auth-email").value;
    const senha = document.getElementById("auth-senha").value;

    const res = await fetch(`${API}/professor/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.erro || "Erro no login");
        return;
    }

    professorLogado = data;

    document.getElementById("auth-screen").classList.add("oculto");
    document.getElementById("app").classList.remove("oculto");

    carregarTurmas();
    carregarAtividades();
});


function mostrarTela(tela) {
    document.getElementById("tela-turmas").classList.add("oculto");
    document.getElementById("tela-atividades").classList.add("oculto");

    document.getElementById(`tela-${tela}`).classList.remove("oculto");
}


function abrirModalTurma() {
    document.getElementById("modal-turma").classList.remove("oculto");
}

function fecharModalTurma() {
    document.getElementById("modal-turma").classList.add("oculto");
}

async function salvarTurma() {
    const numeroTurma = document.getElementById("numeroTurma").value;
    const nomeTurma = document.getElementById("nomeTurma").value;

    const res = await fetch(`${API}/turma/cadastrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            numeroTurma: Number(numeroTurma),
            nomeTurma,
            professorId: professorLogado.id
        })
    });

    if (!res.ok) {
        alert("Erro ao criar turma");
        return;
    }

    fecharModalTurma();
    carregarTurmas();
    carregarTurmasSelect();
}


function abrirModalAtividade() {
    carregarTurmasSelect();
    document.getElementById("modal-atividade").classList.remove("oculto");
}

function fecharModalAtividade() {
    document.getElementById("modal-atividade").classList.add("oculto");
}

async function salvarAtividade() {
    const numeroAtividade = document.getElementById("numeroAtividade").value;
    const descricao = document.getElementById("descricaoAtividade").value;
    const turmaId = document.getElementById("turmaAtividade").value;

    const res = await fetch(`${API}/atividade/cadastrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            numeroAtividade: Number(numeroAtividade),
            descricao,
            turmaId: Number(turmaId),
            professorId: professorLogado.id
        })
    });

    if (!res.ok) {
        alert("Erro ao criar atividade");
        return;
    }

    fecharModalAtividade();
    carregarAtividades();
}


async function carregarTurmas() {
    const container = document.getElementById("lista-turmas");
    container.innerHTML = "";

    const res = await fetch(`${API}/turma/listar`);
    const turmas = await res.json();

    turmas.forEach(t => {
        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <h3>${t.numeroTurma}</h3>
            <p>${t.nomeTurma}</p>
            <button onclick="excluirTurma(${t.id})">Excluir</button>
        `;

        container.appendChild(div);
    });
}


async function carregarAtividades() {
    const container = document.getElementById("lista-atividades");
    container.innerHTML = "";

    const res = await fetch(`${API}/atividade/listar`);
    const atividades = await res.json();

    atividades.forEach(a => {
        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <h3>${a.numeroAtividade}</h3>
            <p>${a.descricao}</p>
            <button onclick="excluirAtividade(${a.id})">Excluir</button>
        `;

        container.appendChild(div);
    });
}


async function carregarTurmasSelect() {
    const select = document.getElementById("turmaAtividade");
    select.innerHTML = `<option value="">Selecione uma turma</option>`;

    const res = await fetch(`${API}/turma/listar`);
    const turmas = await res.json();

    turmas.forEach(t => {
        const option = document.createElement("option");
        option.value = t.id;
        option.textContent = `${t.numeroTurma} - ${t.nomeTurma}`;
        select.appendChild(option);
    });
}

async function excluirTurma(id) {
    if (!confirm("Excluir turma?")) return;

    await fetch(`${API}/turma/excluir/${id}`, {
        method: "DELETE"
    });

    carregarTurmas();
}

async function excluirAtividade(id) {
    if (!confirm("Excluir atividade?")) return;

    await fetch(`${API}/atividade/excluir/${id}`, {
        method: "DELETE"
    });

    carregarAtividades();
}