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


  // -------------load all workflowslist ---------------------------------

  const loadWorkflows = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/workflows`);
      setWorkflows(response.data);
    } catch (error) {
      console.error("Failed to load workflows:", error);
    }
  };

  propagateData(nodes, edges);


  //---------------------------- for saving or updating workflow-------------------

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


  // --------------------------------------load the workflow selected from dropdown---------------------------

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


  // ------------------------------delete workflow that have been loaded by clicking on dropdown------------------

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



  //--------------------------- export work flow--------------------------
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


//  -------------------------------- import workflow----------------------------------

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
        <Toolbar
          onSave={saveWorkflow}
          onLoad={loadWorkflow}
          onExport={exportWorkflow}
          onImport={importWorkflow}
          onDelete={deleteCurrentWorkflow}
          onClear={clearCanvas}
          workflows={workflows}
          currentWorkflow={currentWorkflow}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

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
