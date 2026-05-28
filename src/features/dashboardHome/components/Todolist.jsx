import { useState } from "react";
import { Trash2, CheckCircle2, Circle } from "lucide-react";

export default function Todolist({
  todos,
  loading,
  onAdd,
  onToggle,
  onDelete,
}) {
  const [inputValue, setInputValue] = useState("");

  const handleAddNew = () => {
    if (inputValue.trim() === "") return;

    onAdd(inputValue);

    setInputValue("");
  };

  if (loading) return <div className="text-sm text-slate-500 ">Laddar..</div>;

  return (
    <div>
      <div className="max-h-60 overflow-y-auto">
        <div className="flex mb-4">
          <input
            type="text"
            className="flex-1 p-2 border rounded"
            placeholder="Lägg till en uppgift.."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddNew()}
          />
          <button
            onClick={handleAddNew}
            className="ml-2 p-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 text-sm"
          >
            Lägg till
          </button>
        </div>
        <ul>
          {todos.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center mb-2 border-b pb-2"
            >
              <button
                onClick={() => onToggle(task.id)}
                className="flex-1 cursor-pointer select-none flex items-center gap-2"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <Circle className="w-4 h-4 text-green-600" />
                )}
                <span
                  className={`flex flex-row-reverse text-sm ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                >
                  {task.text}
                </span>
              </button>

              <Trash2
                onClick={() => onDelete(task.id)}
                className="w-4 h-4 hover:cursor-pointer"
              >
                Ta bort
              </Trash2>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
