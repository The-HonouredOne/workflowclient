export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const onDragStart = (e: any, type: string) => {
    e.dataTransfer.setData("nodeType", type);
  };

  return (
    <aside className="w-72 lg:w-72 h-full bg-white border-r border-gray-200 p-4 lg:p-6 overflow-y-auto">
      {/* Mobile Close Button */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Node Library</h2>
          <p className="text-sm text-gray-600 hidden lg:block">Drag nodes to the canvas to build your workflow</p>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        <div
          draggable
          onDragStart={(e) => onDragStart(e, "input")}
          onClick={onClose} // Close sidebar on mobile after drag
          className="group cursor-move rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-3 lg:p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 touch-manipulation"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs lg:text-sm">
              IN
            </div>
            <div>
              <h3 className="font-medium text-blue-900 text-sm lg:text-base">Input Node</h3>
              <p className="text-xs text-blue-700 hidden lg:block">Provides data to the workflow</p>
            </div>
          </div>
        </div>

        <div
          draggable
          onDragStart={(e) => onDragStart(e, "output")}
          onClick={onClose} // Close sidebar on mobile after drag
          className="group cursor-move rounded-xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-green-100 p-3 lg:p-4 hover:border-green-300 hover:shadow-md transition-all duration-200 touch-manipulation"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xs lg:text-sm">
              OUT
            </div>
            <div>
              <h3 className="font-medium text-green-900 text-sm lg:text-base">Output Node</h3>
              <p className="text-xs text-green-700 hidden lg:block">Displays workflow results</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 lg:mt-8 p-3 lg:p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2 text-sm lg:text-base">Quick Tips</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Drag nodes to canvas</li>
          <li className="hidden lg:list-item">• Connect nodes by dragging handles</li>
          <li>• Click nodes to edit settings</li>
          <li className="hidden lg:list-item">• Press Delete to remove selected items</li>
        </ul>
      </div>
    </aside>
  );
}
