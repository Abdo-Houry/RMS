// components/Editor.tsx
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface SimpleEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export interface SimpleEditorRef {
    focus: () => void;
    clear: () => void;
    execCommand: (command: string, value?: string) => void;
    getContent: () => string;
}

export const SimpleEditor = forwardRef<SimpleEditorRef, SimpleEditorProps>(
    ({ value = "", onChange, placeholder, className = '' }, ref) => {
        const editorRef = useRef<HTMLDivElement>(null);
        const placeholderRef = useRef<HTMLDivElement>(null);

        // Function to execute commands
        const execCommand = (command: string, value?: string) => {
            if (editorRef.current) {
                editorRef.current.focus();
                document.execCommand(command, false, value);
                updateContent();
            }
        };

        // Function to get current content
        const getContent = () => {
            return editorRef.current?.innerHTML || "";
        };

        // Expose API
        useImperativeHandle(ref, () => ({
            focus: () => editorRef.current?.focus(),
            clear: () => {
                if (editorRef.current) {
                    editorRef.current.innerHTML = '';
                    onChange('');
                    updatePlaceholder();
                }
            },
            execCommand: execCommand,
            getContent: getContent,
        }));

        // Update content when value changes
        useEffect(() => {
            if (editorRef.current) {
                const currentContent = editorRef.current.innerHTML;
                const newValue = value || '';

                if (currentContent !== newValue) {
                    editorRef.current.innerHTML = newValue;
                    updatePlaceholder();
                }
            }
        }, [value]);

        // Update placeholder visibility
        const updatePlaceholder = () => {
            if (placeholderRef.current && editorRef.current) {
                const currentContent = editorRef.current.innerHTML;
                const hasContent = currentContent.trim() !== '';
                placeholderRef.current.style.display = hasContent ? 'none' : 'block';
            }
        };

        // Handle input
        const handleInput = () => {
            updateContent();
        };

        // Update form content
        const updateContent = () => {
            if (editorRef.current) {
                const html = editorRef.current.innerHTML;
                onChange(html);
                updatePlaceholder();
            }
        };

        // Keyboard shortcuts
        const handleKeyDown = (e: React.KeyboardEvent) => {
            // Ctrl/Cmd + B
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                execCommand('bold');
                return;
            }
            // Ctrl/Cmd + I
            if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
                e.preventDefault();
                execCommand('italic');
                return;
            }
            // Ctrl/Cmd + U
            if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
                e.preventDefault();
                execCommand('underline');
                return;
            }
        };

        // Handle paste to remove formatting
        const handlePaste = (e: React.ClipboardEvent) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
            updateContent();
        };

        // Handle focus to show placeholder
        const handleFocus = () => {
            updatePlaceholder();
        };

        // Handle blur
        const handleBlur = () => {
            updatePlaceholder();
        };

        return (
            <div className={`relative ${className}`}>
                {/* Placeholder */}
                {placeholder && (
                    <div
                        ref={placeholderRef}
                        className="absolute top-4 left-4 text-gray-400 pointer-events-none"
                        style={{ display: (value || '').trim() ? 'none' : 'block' }}
                    >
                        {placeholder}
                    </div>
                )}

                {/* Editor */}
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="min-h-[150px] w-full rounded-lg border border-gray-300 bg-background px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 resize-vertical overflow-y-auto"
                    suppressContentEditableWarning
                />
            </div>
        );
    }
);

SimpleEditor.displayName = 'SimpleEditor';