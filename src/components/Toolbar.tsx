export default function Toolbar({
  onSave,
  onLoad,
  onExport,
  onImport,
  onDelete,
  onClear,
  workflows,
  currentWorkflow,
  sidebarOpen,
  setSidebarOpen
}: {
  onSave: () => void;
  onLoad: (id: string) => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  onClear: () => void;
  workflows: any[];
  currentWorkflow: any;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Workflow Builder</h1>
            {currentWorkflow && (
              <p className="text-xs lg:text-sm text-gray-600 mt-1">
                Currently loaded: <span className="font-medium">Workflow {currentWorkflow._id.slice(-6)}</span>
              </p>
            )}
          </div>
        </div>
        
        {/* Desktop Controls */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onSave}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            💾 {currentWorkflow ? 'Update Workflow' : 'Save Workflow'}
          </button>
          <select
            onChange={(e) => e.target.value && onLoad(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            defaultValue=""
          >
            <option value="">📂 Load Workflow</option>
            {workflows.map((wf) => (
              <option key={wf._id} value={wf._id}>
                Workflow {wf._id.slice(-6)}
              </option>
            ))}
          </select>
          
          {/* Export/Import Section */}
          <div className="flex items-center gap-2 border-l border-gray-300 pl-3">
            <button
              onClick={onExport}
              className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              📤 Export
            </button>
            <label className="inline-flex items-center px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
              📥 Import
              <input
                type="file"
                accept=".json"
                onChange={onImport}
                className="hidden"
              />
            </label>
          </div>
          
          {currentWorkflow && (
            <button
              onClick={onDelete}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              🗑️ Delete This Workflow
            </button>
          )}
          <button
            onClick={onClear}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            🆕 New Workflow
          </button>
        </div>
        
        {/* Mobile Action Button */}
        <div className="lg:hidden">
          <button
            onClick={onSave}
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            💾 Save
          </button>
        </div>
      </div>
      
      {/* Mobile Controls Row */}
      <div className="lg:hidden mt-3 flex gap-2 overflow-x-auto pb-2">
        <select
          onChange={(e) => e.target.value && onLoad(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-0 flex-shrink-0"
          defaultValue=""
        >
          <option value="">📂 Load</option>
          {workflows.map((wf) => (
            <option key={wf._id} value={wf._id}>
              {wf._id.slice(-6)}
            </option>
          ))}
        </select>
        
        <button
          onClick={onExport}
          className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex-shrink-0"
        >
          📤
        </button>
        
        <label className="inline-flex items-center px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors cursor-pointer flex-shrink-0">
          📥
          <input
            type="file"
            accept=".json"
            onChange={onImport}
            className="hidden"
          />
        </label>
        
        {currentWorkflow && (
          <button
            onClick={onDelete}
            className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex-shrink-0"
          >
            🗑️
          </button>
        )}
        
        <button
          onClick={onClear}
          className="inline-flex items-center px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors flex-shrink-0"
        >
          🆕
        </button>
      </div>
    </header>
  );
}
