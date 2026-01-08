export default function Sidebar() {
  const onDragStart = (e: any, type: string) => {
    e.dataTransfer.setData("nodeType", type);
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Node Library</h2>
        <p className="text-sm text-gray-600">Drag nodes to the canvas to build your workflow</p>
      </div>

      <div className="space-y-3">
        <div
          draggable
          onDragStart={(e) => onDragStart(e, "input")}
          className="group cursor-move rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              IN
            </div>
            <div>
              <h3 className="font-medium text-blue-900">Input Node</h3>
              <p className="text-xs text-blue-700">Provides data to the workflow</p>
            </div>
          </div>
        </div>

        <div
          draggable
          onDragStart={(e) => onDragStart(e, "output")}
          className="group cursor-move rounded-xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-green-100 p-4 hover:border-green-300 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              OUT
            </div>
            <div>
              <h3 className="font-medium text-green-900">Output Node</h3>
              <p className="text-xs text-green-700">Displays workflow results</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Quick Tips</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Drag nodes from here to canvas</li>
          <li>• Connect nodes by dragging handles</li>
          <li>• Click nodes to edit settings</li>
          <li>• Press Delete to remove selected items</li>
        </ul>
      </div>
    </aside>
  );
}
