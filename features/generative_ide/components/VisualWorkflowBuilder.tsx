// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/features/generative_ide/components/VisualWorkflowBuilder.tsx
================================================================================

```tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import { useAIContext } from '../../../context/AIContext';
import { AiModel } from '../../../types';
import {
  AiFeatureBuilderProps,
  AiFeatureBuilderComponentType,
  AiFeatureBuilderAction,
  AiFeatureBuilderData,
  AiFeatureBuilderConnection,
} from '../../AiFeatureBuilder';
import {
  ContextMenu,
  ContextMenuOption,
} from '../../../components/ContextMenu';
import { generateCodeFromWorkflow } from '../services/codeGenerationService'; // Assuming this service exists
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';

import {
  MdDragHandle,
  MdEdit,
  MdDelete,
  MdContentCopy,
} from 'react-icons/md';

// Define the types for the different components
interface ComponentNode {
  id: string;
  type: AiFeatureBuilderComponentType;
  x: number;
  y: number;
  data: AiFeatureBuilderData;
  label?: string; // Optional label for display
  description?: string; // Optional description
}

interface ConnectionLine {
  id: string;
  source: string;
  target: string;
  sourcePort?: string; // Specific port on the source
  targetPort?: string; // Specific port on the target
}


interface VisualWorkflowBuilderProps {
  onWorkflowChange?: (workflow: {
    components: ComponentNode[];
    connections: ConnectionLine[];
  }) => void;
  initialWorkflow?: {
    components: ComponentNode[];
    connections: ConnectionLine[];
  };
  availableComponents: AiFeatureBuilderComponentType[]; // Pass the available components
}

const ComponentPalette: React.FC<{
  availableComponents: AiFeatureBuilderComponentType[];
  onComponentAdd: (type: AiFeatureBuilderComponentType, x: number, y: number) => void;
}> = ({ availableComponents, onComponentAdd }) => {
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
  } | null>(null);

  const [selectedComponentType, setSelectedComponentType] = useState<AiFeatureBuilderComponentType | null>(null);


  const handleContextMenu = (
    event: React.MouseEvent,
    componentType: AiFeatureBuilderComponentType
  ) => {
    event.preventDefault();
    setSelectedComponentType(componentType); // Store the component type
    setContextMenu({
      isOpen: true,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
    setSelectedComponentType(null);
  };


  const handleAddClick = () => {
    if (selectedComponentType && contextMenu) {
      onComponentAdd(selectedComponentType, contextMenu.x, contextMenu.y);
      handleCloseContextMenu();
    }
  };


  return (
    <div style={{ padding: '8px', borderRight: '1px solid #ccc', width: '200px', backgroundColor: '#f0f0f0' }}>
      <Typography variant="h6" gutterBottom>
        Components
      </Typography>

      {availableComponents.map((componentType) => (
        <div
          key={componentType.type}
          style={{
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginBottom: '4px',
            cursor: 'pointer',
            backgroundColor: '#fff',
          }}
          onContextMenu={(e) => handleContextMenu(e, componentType)}
        >
          {componentType.label || componentType.type}
        </div>
      ))}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          isOpen={contextMenu.isOpen}
          onClose={handleCloseContextMenu}
          options={[
            {
              label: 'Add to Workflow',
              onClick: handleAddClick,
            },
          ]}
        />
      )}
    </div>
  );
};

const ComponentNodeRenderer: React.FC<{
  node: ComponentNode;
  onNodeClick: (nodeId: string) => void;
  onNodeContextMenu: (event: React.MouseEvent, nodeId: string, componentType: AiFeatureBuilderComponentType) => void;
  isSelected: boolean;
}> = ({ node, onNodeClick, onNodeContextMenu, isSelected }) => {
  const componentStyle = {
    position: 'absolute' as 'absolute',
    left: node.x,
    top: node.y,
    width: 150,
    padding: '10px',
    border: isSelected ? '2px solid blue' : '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    zIndex: isSelected ? 2 : 1, // Higher z-index for selected nodes
    boxShadow: isSelected ? '0 0 5px rgba(0, 0, 255, 0.5)' : 'none', // Add a subtle shadow
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    onNodeContextMenu(event, node.id, {type: node.type.type, label: node.type.label,  inputs: node.type.inputs, outputs: node.type.outputs,  description: node.type.description }); // Pass the component type
  };

  return (
    <div style={componentStyle} onClick={() => onNodeClick(node.id)} onContextMenu={handleContextMenu}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontWeight: 'bold' }}>{node.label || node.type.label || node.type.type}</span>
      </div>

      <Typography variant="body2" color="textSecondary" style={{ fontSize: '0.8rem', marginBottom: '8px' }}>
        {node.description || node.type.description}
      </Typography>

      {/* Render input/output ports (simplified) -  consider dynamic rendering based on component type */}
      {node.type.inputs && (
        <div>
          <Typography variant="caption" color="textSecondary">Inputs:</Typography>
          {node.type.inputs.map((input, index) => (
            <div key={`input-${index}`} style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
              {input.label || input.name}
            </div>
          ))}
        </div>
      )}
      {node.type.outputs && (
        <div>
          <Typography variant="caption" color="textSecondary">Outputs:</Typography>
          {node.type.outputs.map((output, index) => (
            <div key={`output-${index}`} style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
              {output.label || output.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ConnectionLineRenderer: React.FC<{
  line: ConnectionLine;
  nodes: ComponentNode[];
}> = ({ line, nodes }) => {
  const sourceNode = nodes.find((node) => node.id === line.source);
  const targetNode = nodes.find((node) => node.id === line.target);

  if (!sourceNode || !targetNode) {
    return null; // or display an error
  }

  const sourceX = sourceNode.x + 75; // Adjust based on component width / port position
  const sourceY = sourceNode.y + 20;  // Adjust based on component height / port position
  const targetX = targetNode.x + 75; // Adjust based on component width / port position
  const targetY = targetNode.y + 20; // Adjust based on component height / port position

  // Calculate the control points for a smooth Bezier curve
  const controlPointX1 = sourceX + (targetX - sourceX) / 2;
  const controlPointY1 = sourceY;
  const controlPointX2 = controlPointX1;
  const controlPointY2 = targetY;

  const path = `M ${sourceX} ${sourceY} C ${controlPointX1} ${controlPointY1}, ${controlPointX2} ${controlPointY2}, ${targetX} ${targetY}`;

  return (
    <path
      d={path}
      stroke="black"
      strokeWidth={2}
      fill="none"
      markerEnd="url(#arrowhead)" // Use a marker to indicate direction
    />
  );
};


const VisualWorkflowBuilder: React.FC<VisualWorkflowBuilderProps> = ({
  onWorkflowChange,
  initialWorkflow,
  availableComponents,
}) => {
  const [components, setComponents] = useState<ComponentNode[]>(
    initialWorkflow?.components || []
  );
  const [connections, setConnections] = useState<ConnectionLine[]>(
    initialWorkflow?.connections || []
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    nodeId?: string; // Optional: Store the ID of the node the context menu is for
  } | null>(null);

  const [componentSettings, setComponentSettings] = useState<{
    isOpen: boolean;
    nodeId?: string; // ID of the node being edited
    data: any; // Data for the component, specific to its type
  }>({ isOpen: false, data: {} });

  const aiContext = useAIContext();
  const { currentModel } = aiContext; // Access AI model


  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const [componentData, setComponentData] = useState<
    { [nodeId: string]: any }
  >({});


  useEffect(() => {
    if (onWorkflowChange) {
      onWorkflowChange({ components, connections });
    }
  }, [components, connections, onWorkflowChange]);


  const handleComponentAdd = useCallback(
    (type: AiFeatureBuilderComponentType, x: number, y: number) => {
      const newNode: ComponentNode = {
        id: uuidv4(),
        type,
        x,
        y,
        data: {}, // Initialize with empty data
        label: type.label || type.type, // Use label if available
        description: type.description,
      };
      setComponents((prevComponents) => [...prevComponents, newNode]);
    },
    []
  );

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    // Optionally close the context menu if open
    setContextMenu(null);
  };


  const handleNodeContextMenu = (
    event: React.MouseEvent,
    nodeId: string,
    componentType: AiFeatureBuilderComponentType
  ) => {
    event.preventDefault(); // Prevent the default context menu
    setContextMenu({
      isOpen: true,
      x: event.clientX,
      y: event.clientY,
      nodeId, // Store the nodeId in the context menu state
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };


  const handleEditComponent = () => {
    if (contextMenu?.nodeId) {
      const node = components.find((c) => c.id === contextMenu.nodeId);
      if (node) {
        setComponentSettings({
          isOpen: true,
          nodeId: contextMenu.nodeId,
          data: componentData[contextMenu.nodeId] || {}, // Load existing data if any
        });
      }
    }
    handleCloseContextMenu();
  };

  const handleDuplicateComponent = () => {
    if (contextMenu?.nodeId) {
      const nodeToDuplicate = components.find(c => c.id === contextMenu.nodeId);
      if (nodeToDuplicate) {
        const newNode: ComponentNode = {
          ...nodeToDuplicate,
          id: uuidv4(), // Generate a new ID
          x: nodeToDuplicate.x + 20, // Offset the position slightly
          y: nodeToDuplicate.y + 20,
        };
        setComponents(prev => [...prev, newNode]);
      }
    }
    handleCloseContextMenu();
  };

  const handleDeleteComponent = () => {
    if (contextMenu?.nodeId) {
      setComponents((prevComponents) =>
        prevComponents.filter((component) => component.id !== contextMenu.nodeId)
      );
      setConnections((prevConnections) =>
        prevConnections.filter(
          (connection) =>
            connection.source !== contextMenu.nodeId &&
            connection.target !== contextMenu.nodeId
        )
      );
      setSelectedNodeId(null);
    }
    handleCloseContextMenu();
  };

  const handleComponentSettingsClose = () => {
    setComponentSettings({ isOpen: false, data: {} });
  };

  const handleComponentSettingsSave = (nodeId: string, newData: any) => {
    setComponentData((prevData) => ({
      ...prevData,
      [nodeId]: newData,
    }));
    handleComponentSettingsClose();
  };


  const handleConnectNodes = (sourceId: string, targetId: string) => {
    const newConnection: ConnectionLine = {
      id: uuidv4(),
      source: sourceId,
      target: targetId,
    };
    setConnections((prevConnections) => [...prevConnections, newConnection]);
  };

  const handleGenerateCode = async () => {
    setIsGeneratingCode(true);

    try {
      // Prepare the workflow data
      const workflowData = {
        components,
        connections,
        componentData, // Pass the component-specific data
      };

      // Call the code generation service
      const code = await generateCodeFromWorkflow(workflowData, currentModel?.id);

      // Update the state with the generated code
      setGeneratedCode(code);
    } catch (error: any) {
      // Handle errors from the code generation process
      console.error('Code generation failed:', error);
      setGeneratedCode(`Error generating code: ${error.message}`); // Display the error message
    } finally {
      setIsGeneratingCode(false);
    }
  };


  const handleDrag = (nodeId: string, x: number, y: number) => {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === nodeId ? { ...component, x, y } : component
      )
    );
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <ComponentPalette
        availableComponents={availableComponents}
        onComponentAdd={handleComponentAdd}
      />
      <div style={{ flex: 1, position: 'relative', overflow: 'auto' }}>
        {/* SVG for connections */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <defs>
            <marker id="arrowhead" viewBox="0 0 10 10" refX="5" refY="5"
                    markerWidth="6" markerHeight="6"
                    orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
            </marker>
          </defs>
          {connections.map((line) => (
            <ConnectionLineRenderer key={line.id} line={line} nodes={components} />
          ))}
        </svg>

        {components.map((node) => (
          <ComponentNodeRenderer
            key={node.id}
            node={node}
            onNodeClick={handleNodeClick}
            onNodeContextMenu={handleNodeContextMenu}
            isSelected={selectedNodeId === node.id}
          />
        ))}

        {/* Drag and Drop area for the components */}
        {components.map((node) => (
          <DraggableComponent
            key={node.id}
            node={node}
            onDrag={handleDrag}
            isSelected={selectedNodeId === node.id}
            onNodeClick={handleNodeClick}
            componentData={componentData[node.id] || {}}
            handleConnectNodes={handleConnectNodes}

          />
        ))}

        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            isOpen={contextMenu.isOpen}
            onClose={handleCloseContextMenu}
            options={[
              {
                label: 'Edit',
                onClick: handleEditComponent,
              },
              {
                label: 'Duplicate',
                onClick: handleDuplicateComponent,
              },
              {
                label: 'Delete',
                onClick: handleDeleteComponent,
              },
            ]}
          />
        )}


      </div>
      {/* Code Preview */}
      <div style={{ width: '300px', padding: '16px', borderLeft: '1px solid #ccc', overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          Code Preview
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateCode}
          disabled={isGeneratingCode || !components.length} // Disable if generating or no components
        >
          {isGeneratingCode ? 'Generating...' : 'Generate Code'}
        </Button>


        {generatedCode && (
          <pre style={{ marginTop: '16px', backgroundColor: '#f5f5f5', padding: '8px', overflowX: 'auto', fontSize: '0.8rem' }}>
            {generatedCode}
          </pre>
        )}
      </div>

      {/* Component Settings Modal */}
      <ComponentSettingsModal
        open={componentSettings.isOpen}
        onClose={handleComponentSettingsClose}
        nodeId={componentSettings.nodeId}
        componentType={components.find(c => c.id === componentSettings.nodeId)?.type} // Pass the component type
        initialData={componentSettings.data}
        onSave={handleComponentSettingsSave}
      />
    </div>
  );
};


interface DraggableComponentProps {
  node: ComponentNode;
  onDrag: (nodeId: string, x: number, y: number) => void;
  isSelected: boolean;
  onNodeClick: (nodeId: string) => void;
  componentData: any;
  handleConnectNodes: (sourceId: string, targetId: string) => void;
}


const DraggableComponent: React.FC<DraggableComponentProps> = ({ node, onDrag, isSelected, onNodeClick, componentData, handleConnectNodes }) => {
  const [position, setPosition] = useState({ x: node.x, y: node.y });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const [connectMenu, setConnectMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    sourceId: string;
  } | null>(null);

  useEffect(() => {
    setPosition({ x: node.x, y: node.y });
  }, [node.x, node.y]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };


  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragRef.current!.offsetWidth / 2;
    const newY = e.clientY - 20;  // Adjust for the title bar height or offset

    setPosition({ x: newX, y: newY });
    onDrag(node.id, newX, newY);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging]);

  const componentStyle = {
    position: 'absolute' as 'absolute',
    left: position.x,
    top: position.y,
    width: 150,
    padding: '10px',
    border: isSelected ? '2px solid blue' : '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'grab',
    zIndex: isSelected ? 2 : 1, // Higher z-index for selected nodes
    boxShadow: isSelected ? '0 0 5px rgba(0, 0, 255, 0.5)' : 'none', // Add a subtle shadow
  };

  const handleConnectContextMenu = (event: React.MouseEvent, sourceId: string) => {
    event.preventDefault();
    setConnectMenu({
      isOpen: true,
      x: event.clientX,
      y: event.clientY,
      sourceId,
    });
  };

  const handleCloseConnectMenu = () => {
    setConnectMenu(null);
  };

  const handleConnectClick = (targetId: string) => {
    if (connectMenu?.sourceId) {
      handleConnectNodes(connectMenu.sourceId, targetId);
    }
    handleCloseConnectMenu();
  };


  return (
    <>
      <div
        ref={dragRef}
        style={componentStyle}
        onMouseDown={handleMouseDown}
        onClick={() => onNodeClick(node.id)}
        // onContextMenu={handleContextMenu}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', cursor: 'grab' }}>
          <span style={{ fontWeight: 'bold' }}>{node.label || node.type.label || node.type.type}</span>
          {/* Add more interactive elements for the title bar as needed */}
        </div>

        <Typography variant="body2" color="textSecondary" style={{ fontSize: '0.8rem', marginBottom: '8px' }}>
          {node.description || node.type.description}
        </Typography>

        {/* Render input/output ports (simplified) -  consider dynamic rendering based on component type */}
        {node.type.inputs && (
          <div>
            <Typography variant="caption" color="textSecondary">Inputs:</Typography>
            {node.type.inputs.map((input, index) => (
              <div key={`input-${index}`} style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
                {input.label || input.name}
              </div>
            ))}
          </div>
        )}

        {node.type.outputs && (
          <div>
            <Typography variant="caption" color="textSecondary">Outputs:</Typography>
            {node.type.outputs.map((output, index) => (
              <div
                key={`output-${index}`}
                style={{ fontSize: '0.75rem', marginBottom: '4px' }}
                onContextMenu={(e) => handleConnectContextMenu(e, node.id)}
              >
                {output.label || output.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {connectMenu && (
        <ContextMenu
          x={connectMenu.x}
          y={connectMenu.y}
          isOpen={connectMenu.isOpen}
          onClose={handleCloseConnectMenu}
          options={components
            .filter(c => c.id !== connectMenu.sourceId)
            .map(c => ({
              label: `Connect to ${c.label || c.type.label || c.type.type}`,
              onClick: () => handleConnectClick(c.id),
            }))}
        />
      )}
    </>
  );
};


interface ComponentSettingsModalProps {
  open: boolean;
  onClose: () => void;
  nodeId?: string; // ID of the node being edited
  componentType?: AiFeatureBuilderComponentType;
  initialData: any;
  onSave: (nodeId: string, data: any) => void;
}

const ComponentSettingsModal: React.FC<ComponentSettingsModalProps> = ({
  open,
  onClose,
  nodeId,
  componentType,
  initialData,
  onSave,
}) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    if (nodeId) {
      onSave(nodeId, data);
      onClose();
    }
  };

  if (!componentType) {
    return null; // Or render a loading state
  }
  const inputs = componentType.inputs || [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Component Settings: {componentType.label || componentType.type}</DialogTitle>
      <DialogContent>
        {inputs.map((input) => (
          <TextField
            key={input.name}
            label={input.label || input.name}
            name={input.name}
            value={data[input.name] || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline={input.type === 'text'}  // Assuming 'text' type implies multiline
            rows={input.type === 'text' ? 4 : undefined}
          />
        ))}
        {/* Render other input types based on input.type */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default VisualWorkflowBuilder;
```