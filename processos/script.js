const app = document.querySelector(".app");
const toggle = document.querySelector(".toggle-menu");
const processList = document.querySelector("#processList");
const processSearch = document.querySelector("#processSearch");
const caseFacts = document.querySelector("#caseFacts");
const caseRequests = document.querySelector("#caseRequests");
const caseDocs = document.querySelector("#caseDocs");
const relatedTable = document.querySelector("#relatedTable");
const accordion = document.querySelector("#accordion");
const relatedCount = document.querySelector("#relatedCount");
const resultsText = document.querySelector("#resultsText");
const regionNote = document.querySelector("#regionNote");

const processes = [
  {
    id: "0000001",
    number: "9999999-99.9999.9.99.0001",
    party: "Parte 01",
    cpf: "99999999999",
    company: "Empresa 01",
    date: "19/09/2022",
    court: "TJPR",
    city: "Curitiba/PR",
    action: "Ação declaratória",
    subject: "Cartão consignado",
    lawyer: "Advogado 01",
    facts: [
      ["Parte", "Risco"], ["Advogado", "Sim"], ["Dano moral", "Não"],
      ["Hipossuficiência", "Não"], ["Justiça gratuita", "Sim"], ["Valor da causa", "Sim"],
      ["Documentos", "Não"]
    ],
    requests: [
      ["Indenização", "Sim"], ["Dano moral", "Sim"], ["Audiência", "Não"],
      ["Tutela provisória", "Não"], ["Conciliação", "Sim"], ["Repetição", "Sim"]
    ],
    docs: [
      ["Imagem de procuração", "Não"], ["RG/CPF anexado", "Sim"],
      ["Data divergente", "Sim"], ["Banco digital e certificado", "Não"]
    ],
    related: 14,
    region: "Região compatível com o polo ativo informado."
  },
  {
    id: "0000002",
    number: "9999999-99.9999.9.99.0002",
    party: "Parte 02",
    cpf: "88888888888",
    company: "Empresa 02",
    date: "12/10/2020",
    court: "TJBA",
    city: "Marau/BA",
    action: "Revisão contratual",
    subject: "Empréstimo pessoal",
    lawyer: "Advogado 02",
    facts: [
      ["Parte", "Risco"], ["Advogado", "Sim"], ["Dano moral", "Sim"],
      ["Hipossuficiência", "Sim"], ["Justiça gratuita", "Sim"], ["Valor da causa", "Não"],
      ["Documentos", "Não"]
    ],
    requests: [
      ["Indenização", "Sim"], ["Dano moral", "Sim"], ["Audiência", "Não"],
      ["Tutela provisória", "Sim"], ["Conciliação", "Não"], ["Repetição", "Sim"]
    ],
    docs: [
      ["Imagem de procuração", "Sim"], ["RG/CPF anexado", "Sim"],
      ["Data divergente", "Não"], ["Banco digital e certificado", "Sim"]
    ],
    related: 22,
    region: "Distribuição com padrão recorrente em comarca distinta."
  },
  {
    id: "0000003",
    number: "9999999-99.9999.9.99.0003",
    party: "Parte 03",
    cpf: "77777777777",
    company: "Empresa 03",
    date: "03/03/2020",
    court: "TJRS",
    city: "Canoas/RS",
    action: "Obrigação de fazer",
    subject: "Cobrança indevida",
    lawyer: "Advogado 03",
    facts: [
      ["Parte", "Baixo"], ["Advogado", "Não"], ["Dano moral", "Não"],
      ["Hipossuficiência", "Não"], ["Justiça gratuita", "Sim"], ["Valor da causa", "Não"],
      ["Documentos", "Sim"]
    ],
    requests: [
      ["Indenização", "Sim"], ["Dano moral", "Não"], ["Audiência", "Sim"],
      ["Tutela provisória", "Não"], ["Conciliação", "Sim"], ["Repetição", "Não"]
    ],
    docs: [
      ["Imagem de procuração", "Não"], ["RG/CPF anexado", "Não"],
      ["Data divergente", "Não"], ["Banco digital e certificado", "Não"]
    ],
    related: 9,
    region: "Sem sinais críticos no cruzamento inicial de município e parte."
  }
];

const relatedCompanies = [
  "Empresa 01",
  "Empresa 02",
  "Empresa 03",
  "Empresa 04",
  "Empresa 05",
  "Empresa 06",
  "Empresa 07",
  "Empresa 08",
  "Empresa 09",
  "Empresa 10"
];

const cities = ["Curitiba/PR", "Maringá/PR", "Salvador/BA", "Canoas/RS", "Recife/PE", "Goiânia/GO", "Fortaleza/CE"];
const subjects = ["Cartão consignado", "Empréstimo pessoal", "Cobrança indevida", "Contrato bancário", "Dano moral"];

function abstractCaseNumber(index) {
  return `9999999-99.9999.9.99.${String(index + 1).padStart(4, "0")}`;
}

const recommendations = [
  ["Requerimento de justiça gratuita apresentado sem justificativa, comprovação ou evidência mínima de necessidade econômica.", true],
  ["Pedido habitual e padronizado de dispensa de audiência preliminar ou de conciliação.", true],
  ["Ajuizamento de ações em comarcas distintas do domicílio da parte autora, da parte ré ou do local do fato controvertido.", true],
  ["Proposição de várias ações judiciais sobre o mesmo tema, pela mesma parte autora, distribuídas de forma fragmentada.", false],
  ["Distribuição de ações judiciais semelhantes, com petições iniciais que apresentam informações genéricas e causas de pedir idênticas.", true],
  ["Apresentação de procurações incompletas, com inserção manual de informações ou assinatura eletrônica não qualificada.", false],
  ["Concentração de grande volume de demandas sob o patrocínio de poucos profissionais.", true],
  ["Formulação de pedidos declaratórios sem demonstração de utilidade, necessidade e adequação da prestação jurisdicional.", false],
  ["Repetição de pedidos indenizatórios com pequena variação textual entre processos.", true],
  ["Ausência de documentos mínimos para individualização do fato no caso concreto.", false],
  ["Indícios de captação massiva de demandas por padrão de narrativa e documentos anexados.", true]
];

function rows(data) {
  return data.map(([label, value]) => `<dt>${label}</dt><dd>${value}</dd>`).join("");
}

function renderProcessButtons() {
  const repeated = Array.from({ length: 42 }, (_, i) => i);
  processList.innerHTML = repeated.map((_, index) => {
    const process = processes[index % processes.length];
    const number = index === 0 ? process.number : abstractCaseNumber(index);
    return `<button class="process-item${index === 0 ? " active" : ""}" data-index="${index % processes.length}" data-list-index="${index}">${number}</button>`;
  }).join("");
}

function filterProcessList(query) {
  const term = query.trim();
  document.querySelectorAll(".process-item").forEach((item) => {
    item.hidden = term.length > 0 && !item.textContent.includes(term);
  });
}

function renderRelated(process) {
  const header = `
    <div class="table-head cols-9">
      <span>Empresa polo Passivo</span><span>Nº Processo</span><span>Data de distribuição</span>
      <span>Siga Tribunal</span><span>Município</span><span>Ação judicial</span>
      <span>Assunto</span><span>Advogado</span><span>OAB</span>
    </div>`;
  const tableRows = Array.from({ length: process.related }, (_, index) => {
    const code = abstractCaseNumber(index);
    return `
    <div class="table-row cols-9 text-row">
      <span>${relatedCompanies[index % relatedCompanies.length]}</span>
      <span>${code}</span>
      <span>${String(10 + index).padStart(2, "0")}/10/2022</span>
      <span>${["TJPR", "TJBA", "TJRS", "TJPE"][index % 4]}</span>
      <span>${cities[index % cities.length]}</span>
      <span>${index % 3 === 0 ? "Ação declaratória" : "Revisão contratual"}</span>
      <span>${subjects[index % subjects.length]}</span>
      <span>Advogado ${String((index % 9) + 1).padStart(2, "0")}</span>
      <span>OAB ${String(999999 - index * 11111)}</span>
    </div>`;
  }).join("");
  relatedTable.innerHTML = header + tableRows;
  relatedCount.textContent = `(Total ${process.related})`;
  resultsText.textContent = `Exibindo 1-${Math.min(10, process.related)} de ${process.related} Processos`;
}

function renderAccordion() {
  accordion.innerHTML = recommendations.map(([text, ok], index) => `
    <div class="accordion-item${ok ? "" : " warning"}${index === 0 ? " open" : ""}">
      <button class="accordion-trigger" type="button">
        <span>${text}</span>
        <span class="status-dot"></span>
      </button>
      <div class="accordion-content">
        Critério exibido como item expansível para simulação. O conteúdo pode receber evidências, documentos e justificativas do processo selecionado.
      </div>
    </div>
  `).join("");
}

function selectProcess(index, selectedItem = null) {
  const process = processes[index];
  document.querySelector("#caseNumber").textContent = process.number;
  document.querySelector("#caseParty").textContent = process.party;
  document.querySelector("#caseCpf").textContent = process.cpf;
  document.querySelector("#caseCompany").textContent = process.company;
  document.querySelector("#caseTableNumber").textContent = process.number;
  document.querySelector("#caseDate").textContent = process.date;
  document.querySelector("#caseCity").textContent = process.city;
  document.querySelector("#caseLawyer").textContent = process.lawyer;
  caseFacts.innerHTML = rows(process.facts);
  caseRequests.innerHTML = rows(process.requests);
  caseDocs.innerHTML = rows(process.docs);
  regionNote.textContent = process.region;
  renderRelated(process);
  document.querySelectorAll(".process-item").forEach((item) => {
    item.classList.toggle("active", item === selectedItem);
  });
  if (!selectedItem) processList.querySelector(".process-item")?.classList.add("active");
}

toggle.addEventListener("click", () => {
  const isOpen = app.dataset.menu === "open";
  app.dataset.menu = isOpen ? "closed" : "open";
  toggle.setAttribute("aria-label", isOpen ? "Abrir lista de processos" : "Fechar lista de processos");
});

processList.addEventListener("click", (event) => {
  const button = event.target.closest(".process-item");
  if (!button) return;
  selectProcess(Number(button.dataset.index), button);
});

processSearch.addEventListener("input", (event) => {
  filterProcessList(event.target.value);
});

accordion.addEventListener("click", (event) => {
  const trigger = event.target.closest(".accordion-trigger");
  if (!trigger) return;
  trigger.closest(".accordion-item").classList.toggle("open");
});

renderProcessButtons();
renderAccordion();
selectProcess(0);
