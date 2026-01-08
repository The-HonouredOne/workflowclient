import { Node } from "reactflow";
import { useEffect, useRef } from "react";

export default function SettingsPanel({
  node,
  updateNode,
  close
}: {
  node: Node;
  updateNode: (k: string, v: string) => void;
  close: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  return (
    <aside
      ref={ref}
      className="w-80 bg-white border-l border-gray-200 shadow-lg"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Node Settings</h3>
          <button
            onClick={close}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Node Name
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={node.data.label || ''}
              onChange={(e) => updateNode("label", e.target.value)}
              placeholder="Enter node name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              rows={3}
              value={node.data.description || ''}
              onChange={(e) => updateNode("description", e.target.value)}
              placeholder="Enter description (optional)"
            />
          </div>

          {node.type === "inputNode" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Value
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={node.data.value || ''}
                onChange={(e) => updateNode("value", e.target.value)}
                placeholder="Enter default value"
              />
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p><strong>Node ID:</strong> {node.id}</p>
            <p><strong>Type:</strong> {node.type}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
