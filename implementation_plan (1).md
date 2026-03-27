***

# Implementation Plan: Exportação e Importação Avançada de Excel (Offline UI)

## 1. Contexto e Objetivo
O objetivo é implementar uma funcionalidade de importação e exportação de relatórios ESG (ex: Combustão Móvel) baseada em planilhas Excel altamente customizadas. O Excel gerado atuará como uma "UI Offline" para o usuário final: ele deve conter estilos, células bloqueadas/desbloqueadas condicionalmente, textos de instrução e validações visuais. Após o preenchimento, o sistema deve ler este Excel, fazer o "un-pivot" dos dados (transformar colunas de meses em payloads individuais) e enviar para o backend.

## 2. Stack Tecnológica
* **Frontend:** React, TypeScript, Vite.
* **Manipulação de Excel:** `exceljs` (leitura e escrita ricas) e `file-saver` (download no browser). **NÃO utilizar bibliotecas de CSV simples.**
* **UI Components:** Shadcn UI (DropdownMenu, Button, Input) e Lucide React (Ícones).
* **State/Fetch:** React Query (`useMutation`, `useQuery`) e Axios.

## 3. Estruturas de Dados de Referência
A LLM deve considerar que o Frontend já possui os seguintes dados carregados em memória na página (ex: `AuditReportsPage.tsx`):
* `assets`: Array de objetos representando as Fontes Emissoras.
    * *Exemplo:* `{ id: 14, description: "Volks", sourceType: "mobile_combustion", reportingFrequency: "mensal", assetFields: "{\"unitMeasure\":\"Litros\", \"fuelType\":\"Óleo Diesel\"}" }`
* `reports`: Array de objetos enriquecidos contendo os lançamentos já feitos.
    * *Exemplo:* `{ id: 19, year: 2026, period: "Janeiro", consumption: 10, sourceDescription: "Volks", unitMeasure: "Litros" }`

---

## 4. Fases de Implementação

### Fase 1: Setup e Interface de Usuário
1.  **Dependências:** Assegurar a instalação de `exceljs` e `file-saver`.
2.  **Modificação na UI:** Substituir o botão de "Exportar Excel" atual por um `DropdownMenu` do Shadcn contendo duas opções: "Baixar Template" e "Importar Dados".
3.  **Input Oculto:** Criar um `<input type="file" accept=".xlsx" className="hidden" />` referenciado via `useRef`. O clique em "Importar Dados" deve acionar programaticamente o `.click()` deste input.

### Fase 2: Geração do "Super Template" (Exportação)
Criar uma função utilitária `generateEsgExcelTemplate(assets, reports, currentYear, moduleName)`.
**Requisitos de formatação do Excel (`exceljs`):**
1.  **Cabeçalho e Instruções:**
    * Linha 1: Título do Módulo (ex: "Combustão Móvel") em negrito, fonte grande.
    * Linhas 2 e 3: Células mescladas contendo as instruções de preenchimento para o usuário. Fundo de cor leve, texto com quebra de linha (`wrapText: true`).
2.  **Cabeçalhos das Colunas (Linha 4):**
    * Definir as seguintes colunas fixas: Unidade, Fonte Emissora, Combustível, Unidade de Medida, Frequência, Responsável.
    * Definir as colunas de entrada de dados: Janeiro, Fevereiro, Março... Dezembro, Anual.
3.  **Geração das Linhas (A partir da linha 5):**
    * Iterar sobre o array de `assets`. Cada asset é uma linha no Excel.
    * Preencher as colunas informativas fixas usando os dados do `asset` (lembrando de fazer `JSON.parse(asset.assetFields)` para extrair `unitMeasure` e `fuelType`).
4.  **Lógica de Proteção e Hachuras (Crucial):**
    * **Proteger a aba (Worksheet):** `worksheet.protect('senha_secreta')`.
    * **Condicional de Frequência:**
        * Se `asset.reportingFrequency === 'mensal'`: As células da coluna "Janeiro" a "Dezembro" devem ter `locked: false` (fundo branco). A célula "Anual" deve ter `locked: true` e fundo cinza escuro/hachurado (`fill`).
        * Se `asset.reportingFrequency === 'anual'`: As células de "Janeiro" a "Dezembro" recebem `locked: true` e fundo cinza. A célula "Anual" recebe `locked: false` e fundo branco.
    * Todas as colunas informativas (Unidade, Fonte Emissora, etc.) devem ser `locked: true`.
5.  **Preenchimento de Dados Existentes:**
    * Se no array `reports` já existir um lançamento para aquele `asset` (comparar `sourceDescription`) em um mês específico (ex: `period === 'Janeiro'`), preencher o valor do `consumption` na célula correspondente na geração do Excel.

### Fase 3: Leitura e Parsing do Excel (Importação)
Criar uma função utilitária `parseEsgExcelTemplate(file, assets)`.
**Requisitos de leitura:**
1.  Ler o arquivo via `new ExcelJS.Workbook().xlsx.load(fileBuffer)`.
2.  Pegar a primeira aba (`worksheets[0]`).
3.  Pular as linhas de cabeçalho (iniciar a leitura a partir da linha 5).
4.  **Mapeamento `De -> Para`:**
    * Ler o valor da célula correspondente a "Fonte Emissora" (ex: Coluna B).
    * Buscar no array `assets` (memória do frontend) qual é o `assetId` que possui aquela `description`. Se não encontrar, ignorar a linha ou logar erro.
5.  **Extração de Dados:**
    * Ler os valores numéricos inseridos nas colunas de Janeiro a Anual.

### Fase 4: Transformação de Dados e Submissão para API
Esta fase transforma a estrutura "Wide" (1 linha = 12 meses) em "Long" (1 linha = 1 payload).
**Lógica de Transformação:**
1.  Para cada linha validada na Fase 3, iterar pelas colunas de período.
2.  Se a coluna "Janeiro" tiver o valor `15`, gerar um objeto payload:
    ```json
    {
      "sourceDescription": "Volks",
      "year": 2026,
      "period": "Janeiro",
      "consumption": 15
    }
    ```
3.  Repetir para todos os meses ou período "Anual" que contenham valores (ignorar células vazias ou zeradas).
4.  **Submissão:** O array final de payloads deve ser enviado via requisição para a rota de criação/atualização do backend usando `Promise.all` para chamadas individuais, ou um endpoint de "upsert/bulk" se existir no backend (`POST /esg/:sourceType`).

---

## Instruções para a LLM que vai gerar o código:
1.  Crie arquivos separados para a lógica do Excel para não poluir o componente de UI (ex: `src/features/esg/utils/excelImportExport.ts`).
2.  Utilize o modelo padrão de dicionário (mapper) para converter índices de colunas do Exceljs (ex: Coluna 7 = Janeiro, Coluna 8 = Fevereiro, etc.).
3.  Preveja tratamentos de erros de importação (ex: "Arquivo inválido", "Nenhum dado encontrado") e use um Toast/Snackbar para notificar o usuário na interface do React.
4.  Certifique-se de que a exportação (`file-saver`) utiliza o nome do módulo dinâmico, ex: `Template_Combustao_Movel_2026.xlsx`.