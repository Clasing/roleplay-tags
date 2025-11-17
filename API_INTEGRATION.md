# Integración con API Externa

## Estructura de Datos

### Skills (Habilidades Principales)
**Endpoint:** `GET /api/v2/whiteboard-activities/skills`

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "value": "Speaking"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "value": "Listening"
  }
]
```

**Crear nueva skill:**
```
POST /api/v2/whiteboard-activities/skills
Content-Type: application/json

{
  "value": "Reading"
}
```

---

### Sub-Skills (Sub-habilidades)
**Endpoint:** `GET /api/v2/whiteboard-activities/sub-skills`

```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "value": "Pronunciation",
    "skill": "550e8400-e29b-41d4-a716-446655440000"
  }
]
```

**Crear nueva sub-skill:**
```
POST /api/v2/whiteboard-activities/sub-skills
Content-Type: application/json

{
  "value": "Fluency",
  "skill": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### Grammar Types (Tipos de Gramática)
**Endpoint:** `GET /api/v2/whiteboard-activities/grammar-types`

```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "value": "Present Simple",
    "language": "880e8400-e29b-41d4-a716-446655440000"
  }
]
```

**Crear nuevo tipo de gramática:**
```
POST /api/v2/whiteboard-activities/grammar-types
Content-Type: application/json

{
  "value": "Past Simple",
  "language": "880e8400-e29b-41d4-a716-446655440000"
}
```

---

### Sub-Grammar Types (Sub-tipos de Gramática)
**Endpoint:** `GET /api/v2/whiteboard-activities/sub-grammar-types`

```json
[
  {
    "id": "990e8400-e29b-41d4-a716-446655440000",
    "value": "Affirmative Sentences",
    "grammar": "770e8400-e29b-41d4-a716-446655440000",
    "language": "880e8400-e29b-41d4-a716-446655440000"
  }
]
```

**Crear nuevo sub-tipo de gramática:**
```
POST /api/v2/whiteboard-activities/sub-grammar-types
Content-Type: application/json

{
  "value": "Questions",
  "grammar": "770e8400-e29b-41d4-a716-446655440000",
  "language": "880e8400-e29b-41d4-a716-446655440000"
}
```

---

### Languages (Idiomas)
**Endpoint:** `GET /api/v2/whiteboard-activities/languages`

```json
[
  {
    "id": "880e8400-e29b-41d4-a716-446655440000",
    "language": "English"
  },
  {
    "id": "880e8400-e29b-41d4-a716-446655440001",
    "language": "Spanish"
  },
  {
    "id": "880e8400-e29b-41d4-a716-446655440002",
    "language": "French"
  }
]
```

**Crear nuevo idioma:**
```
POST /api/v2/whiteboard-activities/languages
Content-Type: application/json

{
  "language": "German"
}
```

---

### Activities (Guardar Roleplay Completo)
**Endpoint:** `POST /api/v2/whiteboard-activities/activities`

```json
{
  "rolePlayId": "123e4567-e89b-12d3-a456-426614174000",
  "language": "880e8400-e29b-41d4-a716-446655440000",
  "theme": "Daily Routines",
  "skillMain": ["550e8400-e29b-41d4-a716-446655440000"],
  "subSkill": ["660e8400-e29b-41d4-a716-446655440000", "660e8400-e29b-41d4-a716-446655440001"],
  "grammar": ["770e8400-e29b-41d4-a716-446655440000"],
  "subGrammar": ["990e8400-e29b-41d4-a716-446655440000"],
  "vocabularyI": "823e4567-e89b-12d3-a456-426614174007",
  "durationAprox": 30
}
```

**Nota importante:** Este endpoint requiere **IDs** (UUIDs) en lugar de nombres. El componente `TagsForm` se encarga automáticamente de convertir los nombres seleccionados a sus IDs correspondientes antes de enviar.

---

## Flujo de Trabajo

### 1. Carga Inicial
Al abrir el modal de Tags, el componente `TagsForm.tsx` ejecuta:
```typescript
useEffect(() => {
  const loadData = async () => {
    const [skills, subSkills, grammar, subgrammar, languages] = await Promise.all([
      getSkills(),
      getSubSkills(),
      getGrammarTypes(),
      getSubGrammarTypes(),
      getLanguages(),
    ]);
    // ... actualiza estados
  };
  loadData();
}, []);
```

### 2. Agregar Nuevos Valores
Cuando el usuario hace clic en "Agregar nuevo" en cualquier MultiSelect:

1. Se muestra un input inline
2. El usuario escribe el nuevo valor
3. Al hacer clic en ✓:
   - Se envía POST al endpoint correspondiente
   - Se espera la respuesta
   - Se recargan los datos actualizados
   - El nuevo valor aparece en la lista

### 3. Guardar Actividad Completa

Cuando el usuario hace clic en "Save":

1. **Recopila todos los datos:**
   - Theme (tema del roleplay)
   - Duration Aproximada (en minutos)
   - Language seleccionado
   - Skills, Sub-skills, Grammar, Sub-grammar seleccionados
   - Vocabulary ID

2. **Convierte nombres a IDs:**
   ```typescript
   const languageId = availableLanguages.find(l => l.language === selectedLanguage[0])?.id;
   const skillIds = selectedSkills.map(name => 
     availableSkills.find(s => s.value === name)?.id
   ).filter(id => id);
   // ... similar para otros campos
   ```

3. **Envía POST request:**
   ```typescript
   const payload: ActivityPayload = {
     rolePlayId: roleplay._id,
     language: languageId,
     theme: theme,
     skillMain: skillIds,
     subSkill: subSkillIds,
     grammar: grammarIds,
     subGrammar: subGrammarIds,
     vocabularyI: vocabularyTags,
     durationAprox: duration,
   };
   await createActivity(payload);
   ```

4. **Muestra feedback:**
   - Spinner durante el guardado
   - Alert de éxito o error
   - Botón deshabilitado mientras guarda

### 4. Relaciones entre Datos

#### Sub-Skills requieren un Skill parent:
```typescript
// Al crear una sub-skill, se usa el ID del primer skill seleccionado
const skillId = selectedSkills.length > 0 
  ? availableSkills.find(s => s.value === selectedSkills[0])?.id 
  : availableSkills[0]?.id;

await createSubSkill(value, skillId);
```

#### Grammar Types requieren un Language:
```typescript
// Se usa el idioma seleccionado en el dropdown
const languageId = availableLanguages.find(l => l.language === selectedLanguage)?.id;
await createGrammarType(value, languageId);
```

#### Sub-Grammar Types requieren Grammar y Language:
```typescript
const grammarTypeId = availableGrammar.find(g => g.value === selectedGrammar[0])?.id;
const languageId = availableLanguages.find(l => l.language === selectedLanguage)?.id;
await createSubGrammarType(value, grammarTypeId, languageId);
```

---

## Configuración

### Variables de Entorno
Asegúrate de tener en `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:9090
```

### Servidor API Externo
El servidor debe estar corriendo en `http://localhost:9090` antes de usar la aplicación.

---

## Archivos Modificados

### 1. `lib/api/skillsApi.ts`
- Define interfaces TypeScript para cada tipo de dato
- Implementa funciones GET para cargar datos
- Implementa funciones POST para crear nuevos valores
- Maneja errores y retorna arrays vacíos por defecto

### 2. `components/roleplay/TagsForm.tsx`
- Carga datos de la API en `useEffect`
- Mantiene estados para cada tipo de dato
- Implementa handlers para agregar valores con relaciones correctas
- Mapea objetos a strings para el componente `MultiSelect`

### 3. `components/roleplay/MultiSelect.tsx`
- Recibe prop opcional `onAddNew`
- Muestra botón "Agregar nuevo" cuando la prop está presente
- Implementa UI inline para agregar valores
- Llama a la función `onAddNew` pasada como prop

---

## Testing

### 1. Verificar que el servidor API está corriendo:
```bash
# El servidor debe responder en puerto 9090
curl http://localhost:9090/api/v2/whiteboard-activities/skills
```

### 2. Iniciar la aplicación Next.js:
```bash
pnpm dev
```

### 3. Probar funcionalidad:
1. Abrir la aplicación en `http://localhost:3000`
2. Hacer clic en un roleplay card
3. Seleccionar la tab "Tags"
4. Verificar que los selects se cargan con datos
5. Hacer clic en "Agregar nuevo" en cualquier select
6. Escribir un valor y confirmar
7. Verificar que el nuevo valor aparece en la lista

---

## Manejo de Errores

Todos los métodos de API incluyen try/catch:
```typescript
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Error message');
  return data;
} catch (error) {
  console.error('Error:', error);
  return []; // Valor por defecto seguro
}
```

Los componentes verifican si hay datos antes de renderizar:
```typescript
{isLoading ? (
  <LoadingSpinner />
) : (
  <MultiSelect options={data.map(item => item.value)} />
)}
```

---

## Próximos Pasos

1. **Guardar Tags en MongoDB**: Implementar endpoint POST para actualizar roleplay con los tags seleccionados
2. **Filtrado Inteligente**: Filtrar sub-skills según el skill seleccionado
3. **Validaciones**: Agregar validaciones antes de crear nuevos valores
4. **Feedback Visual**: Mostrar toasts de éxito/error al crear valores
