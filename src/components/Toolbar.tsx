export default function Toolbar({
  onSave,
  onLoad,
  onDelete,
  onClear,
  workflows
}: {
  onSave: () => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  workflows: any[];
}) {
  return (
    <div className="absolute z-10 top-3 left-3 flex gap-2">
      <button
        onClick={onSave}
        className="rounded bg-blue-600 px-3 py-1 text-white"
      >
        Save
      </button>
      <select
        onChange={(e) => e.target.value && onLoad(e.target.value)}
        className="rounded border px-3 py-1"
        defaultValue=""
      >
        <option value="">Load Workflow</option>
        {workflows.map((wf) => (
          <option key={wf._id} value={wf._id}>
            Workflow {wf._id.slice(-6)}
          </option>
        ))}
      </select>
      <select
        onChange={(e) => e.target.value && onDelete(e.target.value)}
        className="rounded border px-3 py-1 bg-red-50"
        defaultValue=""
      >
        <option value="">Delete Workflow</option>
        {workflows.map((wf) => (
          <option key={wf._id} value={wf._id}>
            Delete {wf._id.slice(-6)}
          </option>
        ))}
      </select>
      <button
        onClick={onClear}
        className="rounded bg-red-500 px-3 py-1 text-white"
      >
        Clear
      </button>
    </div>
  );
}
