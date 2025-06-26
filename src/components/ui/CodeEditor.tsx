import React, { useState } from 'react';
import { Copy, Check, Maximize2, Minimize2 } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  language?: string;
  disabled?: boolean;
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  placeholder = "// Write your code here...",
  language = "javascript",
  disabled = false,
  className = "",
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-dashboard-bg' : 'relative'} ${className}`}>
      <div className={`bg-dashboard-card rounded-2xl border border-white/10 overflow-hidden ${isFullscreen ? 'h-full' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <span className="text-white/60 text-sm font-mono">{language}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              disabled={!value}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Copy code"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className={`relative ${isFullscreen ? 'h-full' : 'h-96'}`}>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full h-full p-6 bg-gray-900 text-white font-mono text-sm resize-none focus:outline-none border-none ${
              disabled ? 'cursor-not-allowed opacity-50' : ''
            }`}
            style={{ 
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              lineHeight: '1.6',
              fontSize: '14px',
              tabSize: 2
            }}
            spellCheck={false}
          />
          
          {/* Line numbers could be added here for more advanced editor */}
          <div className="absolute bottom-4 right-4 text-xs text-white/40 font-mono">
            {value.split('\n').length} lines, {value.length} chars
          </div>
        </div>
      </div>
      
      {/* Fullscreen overlay backdrop */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10"
          onClick={toggleFullscreen}
        />
      )}
    </div>
  );
};

export default CodeEditor;