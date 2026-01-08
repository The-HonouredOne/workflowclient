import { Handle, Position, NodeProps } from "reactflow";

export default function OutputNode({ data }: NodeProps) {
  return (
    <div className="min-w-[200px] rounded-xl border-2 border-green-400 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <span className="text-xs font-bold">OUT</span>
          </div>
          <p className="font-semibold text-sm">{data.label}</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="min-h-[40px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
          {data.value || "Waiting for input..."}
        </div>
      </div>

      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
    </div>
  );
}
