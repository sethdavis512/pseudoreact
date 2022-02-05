import CodeMirror from 'react-codemirror';

interface EditorProps {
    handleChange: (v: string) => void;
    value: string;
}

const Editor: React.FunctionComponent<EditorProps> = ({
    handleChange,
    value,
}) => {
    const editorOptions = { lineNumbers: true, theme: 'monokai' };

    return (
        <CodeMirror
            autoFocus
            className="border-2 border-slate-900 rounded-md overflow-hidden"
            name="pseudoCode"
            onChange={handleChange}
            options={editorOptions}
            value={value}
        />
    );
};

export default Editor;
