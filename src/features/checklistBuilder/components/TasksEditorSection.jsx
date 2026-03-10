import { Check, Edit, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
export default function TasksEditorSection({
  aiError,
  aiLoading,
  checklistTitle,
  tasks,
  onCancel,
  onSaveChecklist,
}) {
  const [selectedIndex, setSelectedIndex] = useState(
    () => new Set(tasks.map((_, i) => i)),
  );

  const [editedTasks, setEditedTasks] = useState(tasks);

  const [editingIndex, setEditingIndex] = useState(null);

  const [draftTask, setDraftTask] = useState({});

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    questions: [""],
  });

  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    setSelectedIndex(new Set(tasks.map((_, i) => i)));
    setEditedTasks(tasks);
  }, [tasks]);

  function toggleTask(index) {
    setSelectedIndex((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
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
      prev.map((task, i) => (i === index ? { ...draftTask } : task)),
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
    setSelectedIndex((prev) => {
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
      questions: newTask.questions.filter((q) => q.trim() !== ""),
      order: editedTasks.length + 1,
    };
    setEditedTasks((prev) => [...prev, taskToAdd]);
    setSelectedIndex((prev) => new Set([...prev, editedTasks.length]));
    setNewTask({ title: "", description: "", questions: [""] });
    setShowAddForm(false);
  }

  function handleSave() {
    const selectedTasks = editedTasks.filter((_, i) => selectedIndex.has(i));
    onSaveChecklist(selectedTasks);
  }

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
        <p className="text-sm text-gray-600 mb-4">
          Titel: <span className="font-semibold">{checklistTitle}</span>
        </p>
      ) : null}

      <section className="border-t border-gray-200">
        {editedTasks.length === 0 && !aiLoading ? (
          <div className="py-6 text-sm text-gray-500">
            Inga uppgifter ännu. Välj ett mode ovan för att generera en
            startlista, eller lägg till manuellt.
          </div>
        ) : null}

        {editedTasks.map((task, index) => (
          <div
            key={task.order ?? task.title}
            className="py-5 border-b border-gray-200"
          >
            {/* Redigerings mode */}
            {editingIndex === index ? (
              /* Redigerings mode */
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Titel
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    value={draftTask.title ?? ""}
                    onChange={(e) => handleDraftChange("title", e.target.value)}
                  />
                </div>

                {task.description !== undefined && (
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
                )}

                {Array.isArray(draftTask.questions) &&
                  draftTask.questions.length > 0 && (
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
                  )}

                <div className="flex gap-2 justify-end mt-1">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                  Avbryt
                  </button>
                  <button
                    type="button"
                    onClick={() => saveEditing(index)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-slate-700 text-white rounded hover:bg-slate-900 transition-colors"
                  >
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
                <div className="min-w-0">
                  <div className="text-gray-900 font-medium truncate">
                    {task.order ? `${task.order}. ` : ""}
                    {task.title}
                  </div>

                  {task.description ? (
                    <div className="text-sm text-gray-500 mt-1">
                      {task.description}
                    </div>
                  ) : null}

                  {task.phase ? (
                    <div className="mt-2 text-xs text-gray-500">
                      Fas: <span className="font-medium">{task.phase}</span>
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

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEditing(index)}
                    className="text-gray-400 hover:text-slate-700 transition-colors"
                    title="Redigera"
                  >
                    <Edit />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleTask(index)}
                    className="text-gray-400 hover:text-slate-900 transition-colors"
                    title={selectedIndex.has(index) ? "Avmarkera" : "Markera"}
                  >
                    {selectedIndex.has(index) ? <Check /> : <Plus />}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      <div className="mt-6 flex">
        <button
          onClick={() => setShowAddForm(true)}
          type="button"
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
                setNewTask({ title: "", description: "", questions: [""] });
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
