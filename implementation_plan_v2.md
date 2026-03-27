# Implementation Plan v2: Exportação e Importação Avançada de Excel (Offline UI)

> [!NOTE]
> Esta é a versão revisada do plano original, incorporando as correções da [review sênior](file:///C:/Users/Vinícius Abreu/.gemini/antigravity/brain/ede4a865-f004-4567-af13-bb3fca51901c/senior_review.md).

---

## 1. Contexto e Objetivo

Implementar importação/exportação de relatórios ESG via planilhas Excel customizadas ("UI Offline"). O Excel gerado contém estilos, células condicionalmente bloqueadas, instruções e validações visuais. Na importação, o sistema lê o Excel, faz un-pivot dos dados e envia ao backend via **endpoint bulk atômico**.

**Diferenças do plano original:**
- Biblioteca unificada (`exceljs` — removendo `xlsx`)
- Endpoint `bulk-upsert` no backend com transação Prisma
- Identificação de assets por ID oculto (não por nome)
- Campos dinâmicos via `getModuleFields()` (genérico para todos os 23 módulos)
- Proteção do Excel sem senha hardcoded

---

## 2. Stack Tecnológica

| Camada | Tecnologia | Observação |
|--------|-----------|------------|
| Frontend | React, TypeScript, Vite | Existente |
| Excel | **`exceljs`** + `file-saver` | `xlsx` será removido do projeto |
| UI Components | Shadcn UI, Lucide React | Existente |
| State/Fetch | React Query, Axios | Existente |
| Backend | Express, Prisma, Zod | Existente |

> [!IMPORTANT]
> Os 2 arquivos existentes que usam `xlsx` devem ser migrados para `exceljs`:
> - `features/audit/utils/exportToExcel.ts`
> - `features/data-entry/hooks/useExcelImport.ts`
>
> Após migração, remover `xlsx` do `package.json`.

---

## 3. Estruturas de Dados de Referência

O Frontend terá em memória:

### `assets` — Array de Fontes Emissoras
```json
{
  "id": 14,
  "description": "Volks",
  "sourceType": "mobile_combustion",
  "reportingFrequency": "mensal",
  "unitId": 5,
  "assetFields": "{\"unitMeasure\":\"Litros\", \"fuelType\":\"Óleo Diesel\"}"
}
```

### `reports` — Array de lançamentos existentes
```json
{
  "id": 19,
  "year": 2026,
  "period": "Janeiro",
  "consumption": 10,
  "sourceDescription": "Volks",
  "unitId": 5
}
```

### `moduleFields` — Campos dinâmicos do módulo (de `module-fields.ts`)
```typescript
// Ex: mobile_combustion
[
  { name: 'consumption', label: 'Consumo', type: 'number' },
  { name: 'distance', label: 'Distância (km)', type: 'number' }
]
```

---

## 4. Fases de Implementação

### Fase 0: Migração de Dependências (Pré-requisito)

1. Instalar `exceljs` e `file-saver` (+ `@types/file-saver`).
2. **Migrar** `features/audit/utils/exportToExcel.ts` de `xlsx` para `exceljs`.
3. **Migrar** `features/data-entry/hooks/useExcelImport.ts` de `xlsx` para `exceljs`.
4. Remover `xlsx` do `package.json` e rodar `npm install`.
5. Testar que as funcionalidades existentes (exportação de auditoria, importação de data-entry) continuam funcionando.

---

### Fase 1: Endpoint Bulk Upsert no Backend

#### 1.1 Novo método em `EsgGenericService`

Adicionar ao `esg.service.ts`:

```typescript
async bulkUpsert(entries: any[]) {
    const operations = entries.map(entry => {
        const cleanData = this.schema.parse(entry);
        return this.delegate.upsert({
            where: {
                unitId_year_period_sourceDescription: {
                    unitId: cleanData.unitId,
                    year: cleanData.year,
                    period: cleanData.period,
                    sourceDescription: cleanData.sourceDescription ?? '',
                }
            },
            update: cleanData,
            create: cleanData,
        });
    });
    // Transação atômica — tudo ou nada
    return prisma.$transaction(operations);
}
```

> [!WARNING]
> Requer criação de **índice composto único** no Prisma schema para cada tabela ESG:
> ```prisma
> @@unique([unitId, year, period, sourceDescription])
> ```
> Este é o ponto mais sensível da implementação. Se o banco já tiver dados duplicados para a mesma combinação, a migration falhará. **Limpar duplicatas antes de rodar a migration.**

#### 1.2 Novo controller e rota

Adicionar ao `esg.controller.ts`:

```typescript
export const bulkUpsert = async (req: Request, res: Response) => {
    const { sourceType } = req.params;
    const { service } = getRegistryEntry(sourceType);
    const { entries } = req.body; // Array de payloads

    if (!Array.isArray(entries) || entries.length === 0) {
        return res.status(400).json({ message: 'Nenhum registro enviado' });
    }

    if (entries.length > 500) {
        return res.status(400).json({ message: 'Máximo 500 registros por envio' });
    }

    const results = await service.bulkUpsert(entries);
    res.status(200).json({ 
        created: results.length,
        message: `${results.length} registros processados com sucesso` 
    });
};
```

Adicionar ao `esg.routes.ts`:

```typescript
router.post('/:sourceType/bulk-upsert', esgController.bulkUpsert);
```

---

### Fase 2: Interface de Usuário (Frontend)

1. Substituir o botão "Exportar Excel" por um `DropdownMenu` (Shadcn):
   - **"⬇ Baixar Template"** → chama `generateEsgExcelTemplate()`
   - **"⬆ Importar Dados"** → aciona input oculto `.xlsx`
2. Criar `<input type="file" accept=".xlsx" className="hidden" />` com `useRef`.
3. Adicionar **indicador de progresso** (componente `Progress` do Shadcn) para importações.

---

### Fase 3: Geração do Template Excel (Exportação)

Criar arquivo: `src/features/esg/utils/excelTemplateGenerator.ts`

Função: `generateEsgExcelTemplate(assets, reports, currentYear, moduleType, unitName)`

#### 3.1 Estrutura da Planilha

| Linha | Conteúdo |
|-------|----------|
| 1 | Título do módulo (ex: "Combustão Móvel — 2026") — negrito, fonte 16 |
| 2-3 | Instruções de preenchimento — células mescladas, fundo `#E8F0FE`, `wrapText: true` |
| 4 | **Cabeçalhos** (ver abaixo) |
| 5+ | Uma linha por asset |

#### 3.2 Colunas (Dinâmicas)

| Posição | Coluna | Fonte | Editável |
|---------|--------|-------|----------|
| A | `__assetId` (oculta, width=0) | `asset.id` | ❌ Locked |
| B | Fonte Emissora | `asset.description` | ❌ Locked |
| C...N | Campos do asset (`fuelType`, `unitMeasure`, etc.) | `JSON.parse(asset.assetFields)` | ❌ Locked |
| N+1 | Frequência | `asset.reportingFrequency` | ❌ Locked |
| N+2...N+13 | Janeiro...Dezembro | `moduleFields[0]` primário | Condicional |
| N+14 | Anual | `moduleFields[0]` primário | Condicional |

> [!NOTE]
> **Coluna A oculta** contém o `assetId` numérico. Na importação, este é o identificador primário — elimina problemas de matching por nome. O header da coluna A deve ser `__assetId` (prefixo de metadado).

#### 3.3 Lógica de Multi-campo

Se o módulo tem **mais de um campo editável** (ex: `mobile_combustion` tem `consumption` e `distance`), gerar **um bloco de 13 colunas (12 meses + anual) por campo**, com sub-headers:

```
| ... | Consumo - Jan | Consumo - Fev | ... | Consumo - Anual | Distância - Jan | Distância - Fev | ... |
```

Para módulos com campo único, manter headers simples: `Jan | Fev | ... | Anual`.

#### 3.4 Proteção Condicional por Frequência

```typescript
const PROTECTION_PASSWORD = process.env.VITE_EXCEL_PROTECTION_KEY || 'ecofinance_template_2026';
worksheet.protect(PROTECTION_PASSWORD, { /* opções */ });
```

| Frequência | Jan–Dez | Anual |
|-----------|---------|-------|
| `mensal` | ✅ `locked: false`, fundo branco | ❌ `locked: true`, fundo cinza `#D9D9D9` |
| `anual` | ❌ `locked: true`, fundo cinza `#D9D9D9` | ✅ `locked: false`, fundo branco |

#### 3.5 Preenchimento de Dados Existentes

Para cada asset, buscar no array `reports` os lançamentos que tenham o mesmo `unitId` e `sourceDescription`. Preencher o valor do campo primário na célula correspondente ao período.

#### 3.6 Metadata da Planilha (Aba oculta)

Criar uma **segunda aba oculta** chamada `__metadata` contendo:
- Célula A1: `version=2.0`
- Célula A2: `sourceType=mobile_combustion`
- Célula A3: `year=2026`
- Célula A4: `generatedAt=2026-03-26T21:00:00Z`
- Célula A5: `unitId=5`

Isso permite validar na importação se o arquivo é compatível.

---

### Fase 4: Leitura e Parsing do Excel (Importação)

Criar arquivo: `src/features/esg/utils/excelTemplateParser.ts`

Função: `parseEsgExcelTemplate(file, assets, moduleType)`

#### 4.1 Validação Inicial

1. Carregar via `new ExcelJS.Workbook().xlsx.load(buffer)`.
2. **Verificar aba `__metadata`:**
   - Se não existe → erro: "Arquivo não é um template válido do Ecofinance".
   - Se `version` incompatível → erro com orientação para baixar novo template.
   - Se `sourceType` não bate com o módulo atual → erro: "Template é de outro módulo".
3. Pegar a aba principal (`worksheets[0]`).

#### 4.2 Extração de Dados

1. Ler a partir da **linha 5** (pular cabeçalho + instruções).
2. Para cada linha:
   - Ler coluna A (`__assetId`) → buscar no array `assets` pelo `id`.
   - Se o `assetId` não existir nos assets carregados → **ignorar linha + logar warning**.
3. Ler as colunas de período (Jan–Dez / Anual) respeitando a frequência.
4. Ignorar células vazias, nulas ou zero.

#### 4.3 Mapeamento e Validação de Valores

```typescript
interface ParsedEntry {
    assetId: number;
    sourceDescription: string;
    unitId: number;
    year: number;
    period: string;       // "Janeiro" | "Fevereiro" | ... | "Anual"
    [fieldName: string]: any; // campos dinâmicos do módulo
}
```

- Validar que valores numéricos são de fato números (`isNaN` check)
- Validar que valores estão em faixa aceitável (ex: `percentNitrogen` entre 0-100)
- Acumular erros por linha para exibir resumo ao final

---

### Fase 5: Transformação e Submissão

#### 5.1 Transformação Wide → Long

Para cada linha do Excel × cada período com valor preenchido, gerar:

```json
{
    "unitId": 5,
    "sourceDescription": "Volks",
    "year": 2026,
    "period": "Janeiro",
    "consumption": 15,
    "fuelType": "Óleo Diesel",
    "isCompanyControlled": true
}
```

> [!IMPORTANT]
> Os campos do asset (`fuelType`, `isCompanyControlled`, etc.) devem ser injetados automaticamente usando `getAssetInjectedFields(moduleType, assetConfig)` de `module-fields.ts`.

#### 5.2 Submissão via Bulk Upsert

```typescript
const response = await api.post(`/esg/${sourceType}/bulk-upsert`, { entries: payloads });
```

- Enviar **todo o array de uma vez** ao endpoint bulk.
- Se a resposta for sucesso → Toast: `"✅ X registros importados com sucesso"`.
- Se falhar → Toast de erro com mensagem do backend.
- Após sucesso → **invalidar as queries** do React Query para forçar re-fetch dos dados atualizados.

#### 5.3 Feedback de Progresso

Para UX, exibir durante o processamento:
1. **"Lendo planilha..."** → durante o parse
2. **"Validando X registros..."** → durante a transformação
3. **"Enviando para o servidor..."** → durante a chamada API
4. **"✅ Concluído"** ou **"⚠ Concluído com X avisos"**

---

## 5. Organização de Arquivos

```
frontend-react/src/features/esg/utils/
├── excelTemplateGenerator.ts   ← [NEW] Geração do template
├── excelTemplateParser.ts      ← [NEW] Leitura/parsing do Excel
└── excelConstants.ts           ← [NEW] Constantes (nomes de colunas, cores, etc.)

frontend-react/src/features/esg/hooks/
└── useExcelBulkImport.ts       ← [NEW] Hook que orquestra parse + submit + progress

backend-new/src/modules/esg/
├── esg.service.ts              ← [MODIFY] Adicionar bulkUpsert()
├── esg.controller.ts           ← [MODIFY] Adicionar controller bulkUpsert
└── esg.routes.ts               ← [MODIFY] Adicionar rota POST /:sourceType/bulk-upsert

frontend-react/src/features/audit/utils/
└── exportToExcel.ts            ← [MODIFY] Migrar de xlsx para exceljs

frontend-react/src/features/data-entry/hooks/
└── useExcelImport.ts           ← [MODIFY] Migrar de xlsx para exceljs
```

---

## 6. Checklist de Tratamento de Erros

| Cenário | Tratamento |
|---------|-----------|
| Arquivo não é `.xlsx` | Toast de erro no input `accept` |
| Arquivo sem aba `__metadata` | Toast: "Arquivo não é template Ecofinance" |
| `sourceType` do template ≠ módulo atual | Toast: "Template é de módulo diferente" |
| `assetId` não encontrado nos assets | Warning, pular linha, contar no resumo |
| Valor não numérico em célula numérica | Warning, pular célula, contar no resumo |
| Erro 400/500 do backend | Toast de erro com mensagem server |
| Planilha vazia (sem dados) | Toast info: "Nenhum dado encontrado" |
| Mais de 500 registros | Erro: "Máximo 500 registros por envio" |

---

## 7. Convenções de Nomenclatura

- Nome do arquivo exportado: `Template_{ModuleName}_{UnitName}_{Year}.xlsx`
  - Ex: `Template_Combustao_Movel_Matriz_SP_2026.xlsx`
- Nome da aba principal: `"Dados de Entrada"`
- Nome da aba de metadata: `"__metadata"` (oculta)

---

## 8. Instruções para a LLM Implementadora

1. Arquivos do Excel separados dos componentes de UI (pasta `utils/`).
2. Usar `MODULE_FIELDS` e `ASSET_INJECTED_FIELDS` de `module-fields.ts` para determinar colunas e campos injetados — **nunca hardcodar campos de módulos específicos**.
3. Usar `esgRegistry` para obter o nome do módulo via `getRegistryEntry(sourceType).name`.
4. Tratar erros com `toast` do Sonner (já usado no projeto).
5. Limpar o input de file após upload (`event.target.value = ''`).
6. Após submit com sucesso, chamar `queryClient.invalidateQueries()` para re-fetch.
