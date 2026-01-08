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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      if (currentWorkflow && currentWorkflow._id) {
        // Update existing workflow
        await axios.put(`${API_URL}/api/workflows/${currentWorkflow._id}`, {
          nodes,
          edges
        });
        alert("Workflow updated");
      } else {
        // Create new workflow
        const response = await axios.post(`${API_URL}/api/workflows`, {
          nodes,
          edges
        });
        setCurrentWorkflow(response.data);
        alert("Workflow saved");
      }
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
    
    // Listen for mobile node add events
    const handleAddNode = (event: CustomEvent) => {
      const { type } = event.detail;
      const newNode = {
        id: crypto.randomUUID(),
        type: type === "input" ? "inputNode" : "outputNode",
        position: { x: 100, y: 100 }, // Default position for mobile
        data: { label: type, description: "", value: "" }
      };
      setNodes((n) => [...n, newNode]);
    };
    
    window.addEventListener('addNode', handleAddNode as EventListener);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('addNode', handleAddNode as EventListener);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-50
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:block
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
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
                onClick={saveWorkflow}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                💾 {currentWorkflow ? 'Update Workflow' : 'Save Workflow'}
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
            
            {/* Mobile Action Button */}
            <div className="lg:hidden">
              <button
                onClick={saveWorkflow}
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                💾 Save
              </button>
            </div>
          </div>
          
          {/* Mobile Controls Row */}
          <div className="lg:hidden mt-3 flex gap-2 overflow-x-auto pb-2">
            <select
              onChange={(e) => e.target.value && loadWorkflow(e.target.value)}
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
              onClick={exportWorkflow}
              className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex-shrink-0"
            >
              📤
            </button>
            
            <label className="inline-flex items-center px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors cursor-pointer flex-shrink-0">
              📥
              <input
                type="file"
                accept=".json"
                onChange={importWorkflow}
                className="hidden"
              />
            </label>
            
            {currentWorkflow && (
              <button
                onClick={deleteCurrentWorkflow}
                className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex-shrink-0"
              >
                🗑️
              </button>
            )}
            
            <button
              onClick={clearCanvas}
              className="inline-flex items-center px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors flex-shrink-0"
            >
              🆕
            </button>
          </div>
        </header>

        {/* Canvas Area */}
        <div
          className="flex-1 relative"
          onDrop={(e) => {
            const type = e.dataTransfer.getData("nodeType");
            if (!type) return;

            // Get the ReactFlow wrapper element
            const reactFlowBounds = e.currentTarget.getBoundingClientRect();
            
            // Calculate position relative to the ReactFlow canvas
            const position = {
              x: e.clientX - reactFlowBounds.left,
              y: e.clientY - reactFlowBounds.top,
            };

            setNodes((n) => [
              ...n,
              {
                id: crypto.randomUUID(),
                type: type === "input" ? "inputNode" : "outputNode",
                position,
                data: { label: type, description: "", value: "" }
              }
            ]);
          }}
          onDragOver={(e) => e.preventDefault()}
          // Add touch support for mobile
          onTouchStart={(e) => e.preventDefault()}
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
            className="bg-gray-50 touch-none"
            panOnScroll={true}
            zoomOnScroll={true}
            zoomOnPinch={true}
            panOnDrag={true}
          >
            <Background color="#e5e7eb" gap={20} />
            <MiniMap className="bg-white border border-gray-200 rounded-lg" />
            <Controls className="bg-white border border-gray-200 rounded-lg" />
          </ReactFlow>
        </div>
      </div>

      {selectedNode && (
        <div className={`
          fixed lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-50
          ${selectedNode ? 'translate-x-0' : 'translate-x-full'}
          right-0 top-0 h-full
        `}>
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
        </div>
      )}
    </div>
  );
}
