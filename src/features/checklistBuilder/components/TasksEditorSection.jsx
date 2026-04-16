import { Edit, Plus, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SortableTaskItem } from "../../checklistBuilder/components/SortableTaskItem";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";

const PHASE_OPTIONS = [
  { value: "", label: "Ingen fas" },
  { value: "0-30", label: "0–30 dagar" },
  { value: "31-60", label: "31–60 dagar" },
  { value: "61-90", label: "61–90 dagar" },
];

function getPhaseLabel(phase) {
  if (phase === "0-30") return "0–30 dagar";
  if (phase === "31-60") return "31–60 dagar";
  if (phase === "61-90") return "61–90 dagar";
  return "Ingen fas";
}

function getPhaseBadgeClasses(phase) {
  if (phase === "0-30") {
    return "bg-green-50 text-green-700 border border-green-200";
  }

  if (phase === "31-60") {
    return "bg-blue-50 text-blue-700 border border-blue-200";
  }

  if (phase === "61-90") {
    return "bg-purple-50 text-purple-700 border border-purple-200";
  }

  return "bg-gray-50 text-gray-600 border border-gray-200";
}

function getPhaseSectionClasses(phase) {
  if (phase === "0-30") return "border-green-200";
  if (phase === "31-60") return "border-blue-200";
  if (phase === "61-90") return "border-purple-200";
  return "border-gray-200";
}

function normalizeTask(task, index) {
  return {
    id: task.id || crypto.randomUUID(),
    title: task?.title || "",
    description: task?.description || "",
    order: typeof task?.order === "number" ? task.order : index + 1,
    phase: task?.phase || null,
    questions: Array.isArray(task?.questions) ? task.questions : [],
  };
}

export default function TasksEditorSection({
  aiError,
  aiLoading,
  checklistTitle,
  tasks,
  onCancel,
  onSaveChecklist,
}) {
  const [includedIndexes, setIncludedIndexes] = useState(new Set());
  const [editedTasks, setEditedTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [draftTask, setDraftTask] = useState({});

  const [newTask, setNewTask] = useState({
  title: "",
  description: "",
  phase: null,
  questions: [""],
});

  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const normalizedTasks = tasks.map((task, index) => normalizeTask(task, index));
    setEditedTasks(normalizedTasks);

    // Alla tasks ingår från början.
    setIncludedIndexes(new Set(normalizedTasks.map((_, i) => i)));
  }, [tasks]);

  function toggleIncluded(index) {
    setIncludedIndexes((prev) => {
      const next = new Set(prev);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  }

  // Räknar ut nya ordningen i tasks efter en drag and drop
  function handleDragEnd(event) {
    setEditedTasks((items) => {
      return move(items, event)
    })
  }

  function startEditing(index) {
    setEditingIndex(index);
    setDraftTask({ ...editedTasks[index] });
  }

  function cancelEditing() {
    setEditingIndex(null);
    setDraftTask({});
  }

  function saveEditing(index) {
    setEditedTasks((prev) =>
      prev.map((task, i) => (i === index ? normalizeTask(draftTask, i) : task))
    );
    setEditingIndex(null);
    setDraftTask({});
  }

  function handleDraftChange(field, value) {
    setDraftTask((prev) => ({ ...prev, [field]: value }));
  }

  function handleQuestionChange(qIndex, value) {
    setDraftTask((prev) => {
      const updatedQuestions = [...(prev.questions ?? [])];
      updatedQuestions[qIndex] = value;
      return { ...prev, questions: updatedQuestions };
    });
  }

  // Hanterar ny fråga i eget task
  function handleNewQuestion(qIndex, value) {
    setNewTask((prev) => {
      const updated = [...prev.questions];
      updated[qIndex] = value;
      return { ...prev, questions: updated };
    });
  }

  // Lägger till en ny fråga i eget task
  function addQuestionField() {
    setNewTask((prev) => ({
      ...prev,
      questions: [...prev.questions, ""],
    }));
  }

  // Tar bort en fråga i eget task
  function removeQuestionField(qIndex) {
    setNewTask((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== qIndex),
    }));
  }

  function removeTask(taskToRemove) {
  const isSure = window.confirm("Är du säker på att du vill ta bort?");
  if (!isSure) return;

  setEditedTasks((prev) => prev.filter((_, i) => i !== taskToRemove));
  setEditingIndex(null);
  setDraftTask({});

  setIncludedIndexes((prev) => {
    const next = new Set();
    prev.forEach((i) => {
      if (i < taskToRemove) next.add(i);
      else if (i > taskToRemove) next.add(i - 1);
    });
    return next;
  });
}

  function handleAddTask() {
  if (!newTask.title.trim()) return;

  const taskToAdd = {
    ...newTask,
    id: crypto.randomUUID(),
    title: newTask.title.trim(),
    description: newTask.description.trim(),
    phase: newTask.phase || null,
    questions: newTask.questions.filter((q) => q.trim() !== ""),
    order: editedTasks.length + 1,
  };

  setEditedTasks((prev) => [...prev, taskToAdd]);

  setIncludedIndexes((prev) => {
    const next = new Set(prev);
    next.add(editedTasks.length);
    return next;
  });

  setNewTask({
    title: "",
    description: "",
    phase: null,
    questions: [""],
  });

  setShowAddForm(false);
}

  function handleSave() {
  const tasksToSave = editedTasks
    .filter((_, i) => includedIndexes.has(i))
    .map((task, index) => ({
      ...task,
      order: index + 1,
      phase: task.phase || null,
    }));

  console.log("Tasks som ska sparas:", tasksToSave);

  onSaveChecklist(tasksToSave);
}

const groupedEntries = useMemo(() => {
  const buckets = {
    "0-30": [],
    "31-60": [],
    "61-90": [],
    none: [],
  };

  editedTasks.forEach((task, index) => {
    if (task.phase === "0-30") {
      buckets["0-30"].push({ task, index });
    } else if (task.phase === "31-60") {
      buckets["31-60"].push({ task, index });
    } else if (task.phase === "61-90") {
      buckets["61-90"].push({ task, index });
    } else {
      buckets.none.push({ task, index });
    }
  });

  return buckets;
}, [editedTasks]);

const sections = [
  { key: "0-30", title: "0–30 dagar" },
  { key: "31-60", title: "31–60 dagar" },
  { key: "61-90", title: "61–90 dagar" },
  { key: "none", title: "Ingen fas" },
];

const includedCount = includedIndexes.size;

  return (
    <section className="w-full bg-white p-4 mt-6 border-2 border-gray-200 rounded-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Lägg till och redigera uppgifter
      </h3>

      {aiError ? <p className="text-sm text-red-600 mb-4">{aiError}</p> : null}

      {aiLoading ? (
        <p className="text-sm text-gray-500 mb-4">AI genererar checklista…</p>
      ) : null}

      {!aiLoading && checklistTitle ? (
        <p className="text-sm text-gray-600 mb-2">
          Titel: <span className="font-semibold">{checklistTitle}</span>
        </p>
      ) : null}

      {!aiLoading && editedTasks.length > 0 ? (
        <p className="text-sm text-gray-500 mb-4">
          {includedCount} av {editedTasks.length} uppgifter kommer att sparas.
        </p>
      ) : null}

      <section className="border-t border-gray-200">
        {editedTasks.length === 0 && !aiLoading ? (
          <div className="py-6 text-sm text-gray-500">
            Inga uppgifter ännu. Välj ett mode ovan för att generera en
            startlista, eller lägg till manuellt.
          </div>
        ) : null}

        <DragDropProvider onDragEnd={handleDragEnd}>
        {sections.map((section) => {
          const items = groupedEntries[section.key];

          if (!items || items.length === 0) return null;

          return (
            <div key={section.key} className="mt-6 first:mt-4">
              <div
                className={`rounded-lg border ${getPhaseSectionClasses(
                  section.key === "none" ? null : section.key
                )} bg-gray-50 px-4 py-3 mb-3 flex items-center justify-between`}
              >
                <div>
                  <h4 className="text-base font-semibold text-gray-900">
                    {section.title}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {items.length} uppgift{items.length !== 1 ? "er" : ""}
                  </p>
                </div>

                {section.key !== "none" ? (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getPhaseBadgeClasses(
                      section.key
                    )}`}
                  >
                    {getPhaseLabel(section.key)}
                  </span>
                ) : null}
              </div>

           

              {items.map(({ task, index }) => (
                <SortableTaskItem key={task.id} id={task.id} index={index}>
                <div
                  key={`${task.order ?? "task"}-${index}`}
                  className="py-5 border-b border-gray-200"
                >
                  {editingIndex === index ? (
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Titel
                        </label>
                        <input
                          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                          value={draftTask.title ?? ""}
                          onChange={(e) =>
                            handleDraftChange("title", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Fas
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                          value={draftTask.phase ?? ""}
                          onChange={(e) =>
                            handleDraftChange("phase", e.target.value || null)
                          }
                        >
                          {PHASE_OPTIONS.map((option) => (
                            <option key={option.value || "none"} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {task.description !== undefined ? (
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">
                            Beskrivning
                          </label>
                          <textarea
                            rows={2}
                            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                            value={draftTask.description ?? ""}
                            onChange={(e) =>
                              handleDraftChange("description", e.target.value)
                            }
                          />
                        </div>
                      ) : null}

                      {Array.isArray(draftTask.questions) &&
                      draftTask.questions.length > 0 ? (
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">
                            Frågor
                          </label>
                          <ul className="flex flex-col gap-2">
                            {draftTask.questions.slice(0, 3).map((q, qIdx) => (
                              <li key={qIdx}>
                                <input
                                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                                  value={q}
                                  onChange={(e) =>
                                    handleQuestionChange(qIdx, e.target.value)
                                  }
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                <div className="flex gap-2 justify-end mt-1">
  <button
    type="button"
    onClick={cancelEditing}
    className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors"
  >
    <X size={14} />
    Avbryt
  </button>

  <button
    type="button"
    onClick={() => saveEditing(index)}
    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-slate-700 text-white rounded hover:bg-slate-900 transition-colors"
  >
    <Save size={14} />
    Spara
  </button>

  <button
    type="button"
    onClick={() => removeTask(index)}
    className="px-3 py-1.5 text-xs bg-slate-700 text-white rounded hover:bg-slate-900"
  >
    Radera
  </button>
</div>
</div>
) : (
  <div className="flex items-start justify-between gap-4">
    <div className="min-w-0 flex-1">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={includedIndexes.has(index)}
          onChange={() => toggleIncluded(index)}
          className="mt-1 h-4 w-4 accent-slate-900"
        />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-gray-900 font-medium truncate">
              {task.order ? `${task.order}. ` : ""}
              {task.title}
            </div>

            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPhaseBadgeClasses(
                task.phase
              )}`}
            >
              {getPhaseLabel(task.phase)}
            </span>

            <span
              className={`text-xs font-medium ${
                includedIndexes.has(index)
                  ? "text-green-700"
                  : "text-gray-400"
              }`}
            >
              {includedIndexes.has(index)
                ? "Ingår i checklistan"
                : "Ingår inte"}
            </span>
          </div>

                            {task.description ? (
                              <div className="text-sm text-gray-500 mt-1">
                                {task.description}
                              </div>
                            ) : null}

                            {Array.isArray(task.questions) &&
                            task.questions.length > 0 ? (
                              <ul className="mt-2 list-disc pl-5 text-sm text-gray-600 space-y-1">
                                {task.questions.slice(0, 3).map((q, idx) => (
                                  <li key={idx}>{q}</li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        </div>
                      </div>

                <div className="flex items-center gap-2 shrink-0">
  <button
    type="button"
    onClick={() => startEditing(index)}
    className="text-gray-400 hover:text-slate-700 transition-colors"
    title="Redigera"
  >
    <Edit size={18} />
  </button>
</div>
</div>
)}
</div>
</SortableTaskItem>
))}
</div>
);
})}
</DragDropProvider>
      </section>

      <div className="mt-6 flex">
        <button
  type="button"
  onClick={() => setShowAddForm(true)}
  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
>
  <span className="text-lg leading-none">+</span>
  Lägg till uppgift
</button>
      </div>

      {showAddForm && (
        /* Lägga till eget task */
        <div className="mt-4 flex flex-col gap-3 border border-gray-200 rounded-lg p-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Titel</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Skriv en titel..."
              value={newTask.title}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Beskrivning
            </label>
            <textarea
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
              placeholder="Valfri beskrivning..."
              value={newTask.description}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Frågor</label>
            {newTask.questions.map((q, qIdx) => (
              <div key={qIdx} className="flex gap-2 mb-2">
                <input
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder={`Fråga ${qIdx + 1}...`}
                  value={q}
                  onChange={(e) => handleNewQuestion(qIdx, e.target.value)}
                />
                {newTask.questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestionField(qIdx)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestionField}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 mt-1"
            >
              <Plus /> Lägg till fråga
            </button>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setNewTask({ title: "", description: "", phase: null, questions: [""] });
              }}
              className="px-3 py-1.5 text-xs border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
            >
              Avbryt
            </button>
            <button
              type="button"
              onClick={handleAddTask}
              className="px-3 py-1.5 text-xs bg-slate-700 text-white rounded hover:bg-slate-900"
            >
              Lägg till
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Avbryt
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
        >
          Spara checklista
        </button>
      </div>
    </section>
  );
}
