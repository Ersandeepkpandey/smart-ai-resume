import { useState, useRef, useEffect } from 'react';
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link as LinkIcon, Type, Palette, ChevronDown
} from 'lucide-react';

const fontSizes = ['12px', '14px', '16px', '18px', '20px'];
const fontFamilies = ['Arial', 'Times New Roman', 'Roboto', 'Georgia', 'Verdana'];
const alignments = [
  { icon: <AlignLeft className="w-4 h-4" />, label: 'Left' },
  { icon: <AlignCenter className="w-4 h-4" />, label: 'Center' },
  { icon: <AlignRight className="w-4 h-4" />, label: 'Right' },
];
const lists = [
  { icon: <List className="w-4 h-4" />, label: 'Bulleted' },
  { icon: <ListOrdered className="w-4 h-4" />, label: 'Numbered' },
];

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (open && ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);
  return { open, setOpen, ref };
}

function Dropdown({ label, children }: { label: React.ReactNode, children: React.ReactNode }) {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center px-2 py-1 border rounded bg-white hover:bg-gray-50 text-xs gap-1"
        onClick={() => setOpen(v => !v)}
        type="button"
      >
        {label}
        <ChevronDown className={`w-3 h-3 ml-0.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 mt-1 z-50 bg-white rounded shadow-lg p-2 flex flex-col gap-1 min-w-[100px] max-w-[95vw] border">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Toolbar() {
  return (
    <div className="flex flex-wrap items-center gap-1 px-2 py-1 bg-white rounded shadow border w-full overflow-x-auto">
      {/* Font size dropdown */}
      <Dropdown label={<span className="flex items-center"><Type className="w-4 h-4 mr-1" />Font</span>}>
        {fontSizes.map(size => (
          <button key={size} className="px-2 py-1 text-xs text-left hover:bg-gray-100 rounded w-full">{size}</button>
        ))}
      </Dropdown>
      {/* Font family dropdown */}
      <Dropdown label={<span className="text-xs">Aa</span>}>
        {fontFamilies.map(f => (
          <button key={f} className="px-2 py-1 text-xs text-left hover:bg-gray-100 rounded w-full">{f}</button>
        ))}
      </Dropdown>
      {/* Color dropdown */}
      <Dropdown label={<Palette className="w-4 h-4" />}>
        <div className="flex gap-1 flex-wrap">
          {["#000000", "#e53e3e", "#3182ce", "#38a169", "#d69e2e", "#805ad5"].map(color => (
            <button key={color} className="w-5 h-5 rounded-full border-2 border-white hover:border-gray-300" style={{ background: color }} />
          ))}
        </div>
      </Dropdown>
      {/* Divider */}
      <span className="border-l h-5 mx-1" />
      {/* Formatting */}
      <button className="p-1" title="Bold"><Bold className="w-4 h-4" /></button>
      <button className="p-1" title="Italic"><Italic className="w-4 h-4" /></button>
      <button className="p-1" title="Underline"><Underline className="w-4 h-4" /></button>
      {/* Divider */}
      <span className="border-l h-5 mx-1" />
      {/* Alignment dropdown */}
      <Dropdown label={<AlignLeft className="w-4 h-4" />}>
        {alignments.map(a => (
          <button key={a.label} className="flex items-center gap-2 px-2 py-1 text-xs hover:bg-gray-100 rounded w-full">{a.icon}{a.label}</button>
        ))}
      </Dropdown>
      {/* Divider */}
      <span className="border-l h-5 mx-1" />
      {/* Lists dropdown */}
      <Dropdown label={<List className="w-4 h-4" />}>
        {lists.map(l => (
          <button key={l.label} className="flex items-center gap-2 px-2 py-1 text-xs hover:bg-gray-100 rounded w-full">{l.icon}{l.label}</button>
        ))}
      </Dropdown>
      {/* Divider */}
      <span className="border-l h-5 mx-1" />
      {/* Link */}
      <button className="p-1" title="Link"><LinkIcon className="w-4 h-4" /></button>
    </div>
  );
}