import { Handle, Position, NodeProps } from "reactflow";
import { useCallback } from "react";

export default function InputNode({ id, data }: NodeProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (data.updateNodeData) {
      data.updateNodeData(id, 'value', e.target.value);
    }
  }, [id, data]);

  return (
    <div className="min-w-[200px] rounded-xl border-2 border-blue-400 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <span className="text-xs font-bold">IN</span>
          </div>
          <p className="font-semibold text-sm">{data.label}</p>
        </div>
      </div>
      
      <div className="p-4">
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          value={data.value || ''}
          onChange={handleChange}
          placeholder="Enter text"
        />
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </div>
  );
}
