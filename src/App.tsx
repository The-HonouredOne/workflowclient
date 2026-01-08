import React, { useState, useEffect } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState
} from "reactflow";
import axios from "axios";

import InputNode from "./components/nodes/InputNode";
import OutputNode from "./components/nodes/OutputNode";
import Sidebar from "./components/Sidebar";
import SettingsPanel from "./components/SettingsPanel";
import Toolbar from "./components/Toolbar";
import { validateWorkflow } from "./utils/validation";
import { propagateData } from "./utils/dataFlow";

const nodeTypes = { inputNode: InputNode, outputNode: OutputNode };
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<any>(null);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/workflows`);
      setWorkflows(response.data);
    } catch (error) {
      console.error("Failed to load workflows:", error);
    }
  };

  propagateData(nodes, edges);

  const saveWorkflow = async () => {
    const errors = validateWorkflow(nodes, edges);
    if (errors.length) return alert(errors.join("\n"));

    try {
      await axios.post(`${API_URL}/api/workflows`, {
        nodes,
        edges
      });
      alert("Workflow saved");
      loadWorkflows();
    } catch (error) {
      alert("Failed to save workflow");
    }
  };

  const loadWorkflow = async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/workflows/${id}`);
      setNodes(response.data.nodes);
      setEdges(response.data.edges);
      setCurrentWorkflow(response.data);
    } catch (error) {
      alert("Failed to load workflow");
    }
  };

  const deleteCurrentWorkflow = async () => {
    if (!currentWorkflow) return;
    
    if (confirm(`Are you sure you want to delete this workflow?`)) {
      try {
        await axios.delete(`${API_URL}/api/workflows/${currentWorkflow._id}`);
        alert("Workflow deleted");
        clearCanvas();
        setCurrentWorkflow(null);
        loadWorkflows();
      } catch (error) {
        alert("Failed to delete workflow");
      }
    }
  };

  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setCurrentWorkflow(null);
  };

  const exportWorkflow = () => {
    const workflowData = {
      nodes,
      edges,
      exportedAt: new Date().toISOString(),
      version: "1.0"
    };
    
    const dataStr = JSON.stringify(workflowData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importWorkflow = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workflowData = JSON.parse(e.target?.result as string);
        if (workflowData.nodes && workflowData.edges) {
          setNodes(workflowData.nodes);
          setEdges(workflowData.edges);
          setCurrentWorkflow(null);
          alert('Workflow imported successfully!');
        } else {
          alert('Invalid workflow file format');
        }
      } catch (error) {
        alert('Error reading workflow file');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    //this is to fix the bug when i start typing in setting panel the nodes are disappearing
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      setNodes((nds) => nds.filter((node) => !node.selected));
      setEdges((eds) => eds.filter((edge) => !edge.selected));
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Workflow Builder</h1>
              {currentWorkflow && (
                <p className="text-sm text-gray-600 mt-1">
                  Currently loaded: <span className="font-medium">Workflow {currentWorkflow._id.slice(-6)}</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={saveWorkflow}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                💾 Save Workflow
              </button>
              <select
                onChange={(e) => e.target.value && loadWorkflow(e.target.value)}
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
                  onClick={exportWorkflow}
                  className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  📤 Export
                </button>
                <label className="inline-flex items-center px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
                  📥 Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={importWorkflow}
                    className="hidden"
                  />
                </label>
              </div>
              
              {currentWorkflow && (
                <button
                  onClick={deleteCurrentWorkflow}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  🗑️ Delete This Workflow
                </button>
              )}
              <button
                onClick={clearCanvas}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                🆕 New Workflow
              </button>
            </div>
          </div>
        </header>

        {/* Canvas Area */}
        <div
          className="flex-1 relative"
          onDrop={(e) => {
            const type = e.dataTransfer.getData("nodeType");
            setNodes((n) => [
              ...n,
              {
                id: crypto.randomUUID(),
                type: type === "input" ? "inputNode" : "outputNode",
                position: { x: 200, y: 200 },
                data: { label: type, description: "", value: "" }
              }
            ]);
          }}
          onDragOver={(e) => e.preventDefault()}
        >

          <ReactFlow
            nodes={nodes.map(node => ({
              ...node,
              data: {
                ...node.data,
                updateNodeData: (nodeId: string, key: string, value: string) => {
                  setNodes(nds => nds.map(n =>
                    n.id === nodeId
                      ? { ...n, data: { ...n.data, [key]: value } }
                      : n
                  ));
                }
              }
            }))}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={(c) => setEdges((e) => addEdge(c, e))}
            onNodeClick={(_, n) => setSelectedNode(n)}
            fitView
            className="bg-gray-50"
          >
            <Background color="#e5e7eb" gap={20} />
            <MiniMap className="bg-white border border-gray-200 rounded-lg" />
            <Controls className="bg-white border border-gray-200 rounded-lg" />
          </ReactFlow>
        </div>
      </div>

      {selectedNode && (
        <SettingsPanel
          node={nodes.find(n => n.id === selectedNode.id) || selectedNode}
          updateNode={(k, v) => {
            setNodes((nds) =>
              nds.map((n) =>
                n.id === selectedNode.id
                  ? { ...n, data: { ...n.data, [k]: v } }
                  : n
              )
            );
            // Update selectedNode to keep it in sync
            setSelectedNode(prev => prev ? {
              ...prev,
              data: { ...prev.data, [k]: v }
            } : null);
          }}
          close={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}
