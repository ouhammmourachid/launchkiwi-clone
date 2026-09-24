/**
 * rich-text-editor.tsx
 * Minimal contentEditable editor (bold, italic, H2/H3, lists, undo/redo)
 * for the launch description. Output HTML is reduced to a small whitelist.
 */

"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { htmlTextLength } from "@/lib/utils/format";

const ALLOWED_TAGS = new Set(["P", "BR", "STRONG", "B", "EM", "I", "H2", "H3", "UL", "OL", "LI"]);

/** Keeps whitelisted tags (without attributes) and the text inside everything else. */
function sanitize(root: HTMLElement): string {
  const walk = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return (node.textContent ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    if (!(node instanceof HTMLElement)) return "";
    const inner = Array.from(node.childNodes).map(walk).join("");
    const tag = node.tagName === "DIV" ? "P" : node.tagName;
    if (!ALLOWED_TAGS.has(tag)) return inner;
    if (tag === "BR") return "<br>";
    const name = tag.toLowerCase();
    return `<${name}>${inner}</${name}>`;
  };
  const html = Array.from(root.childNodes).map(walk).join("");
  return htmlTextLength(html) === 0 ? "" : html;
}

const Icon = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
);

type Commands = { exec: (command: string) => void; heading: (tag: "h2" | "h3") => void };
type Tool = { label: string; content: ReactNode; run: (commands: Commands) => void };

const TOOL_GROUPS: Tool[][] = [
  [
    { label: "Bold", content: <span className="font-bold">B</span>, run: ({ exec }) => exec("bold") },
    { label: "Italic", content: <span className="font-serif italic">I</span>, run: ({ exec }) => exec("italic") },
  ],
  [
    { label: "Heading 2", content: "H2", run: ({ heading }) => heading("h2") },
    { label: "Heading 3", content: "H3", run: ({ heading }) => heading("h3") },
  ],
  [
    {
      label: "Bulleted list",
      content: (
        <Icon>
          <path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />
        </Icon>
      ),
      run: ({ exec }) => exec("insertUnorderedList"),
    },
    {
      label: "Numbered list",
      content: (
        <Icon>
          <path d="M10 6h10M10 12h10M10 18h10M4 5h1v4M4 9h2M4 15.5a1 1 0 0 1 2 0c0 1-2 1.5-2 3h2" />
        </Icon>
      ),
      run: ({ exec }) => exec("insertOrderedList"),
    },
  ],
  [
    {
      label: "Undo",
      content: (
        <Icon>
          <path d="M9 14 4 9l5-5" />
          <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
        </Icon>
      ),
      run: ({ exec }) => exec("undo"),
    },
    {
      label: "Redo",
      content: (
        <Icon>
          <path d="m15 14 5-5-5-5" />
          <path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" />
        </Icon>
      ),
      run: ({ exec }) => exec("redo"),
    },
  ],
];

interface RichTextEditorProps {
  id?: string;
  value: string;
  onChange: (html: string) => void;
  placeholder: string;
  max: number;
  min: number;
  invalid?: boolean;
  describedBy?: string;
}

export function RichTextEditor({ id, value, onChange, placeholder, max, min, invalid, describedBy }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Only push external changes (e.g. autofill) into the DOM — never while typing.
  useEffect(() => {
    const el = ref.current;
    if (el && sanitize(el) !== value) el.innerHTML = value;
  }, [value]);

  const emit = () => {
    const el = ref.current;
    if (!el) return;
    const html = sanitize(el);
    if (!html && el.innerHTML) el.innerHTML = ""; // drop a stray <br> so the placeholder shows
    onChange(html);
  };

  const exec = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    emit();
  };
  const heading = (tag: "h2" | "h3") => {
    const current = String(document.queryCommandValue("formatBlock")).toLowerCase();
    exec("formatBlock", current === tag ? "p" : tag);
  };

  const length = htmlTextLength(value);

  return (
    <div className={`overflow-hidden rounded-xl border bg-dune-990 transition focus-within:border-sun ${invalid ? "border-[#7f2d26]" : "border-dune-900"}`}>
      <div role="toolbar" aria-label="Formatting" className="flex flex-wrap items-center gap-1 border-b border-dune-900 bg-dune-940 px-3 py-2">
        {TOOL_GROUPS.map((group, i) => (
          <div key={i} className={`flex items-center gap-1 ${i > 0 ? "border-l border-dune-850 pl-1" : ""}`}>
            {group.map((tool) => (
              <button
                key={tool.label}
                type="button"
                title={tool.label}
                aria-label={tool.label}
                // Keep the selection inside the editor when clicking a tool.
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => tool.run({ exec, heading })}
                className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-semibold text-dune-200 transition hover:bg-dune-900 hover:text-white"
              >
                {tool.content}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div
        id={id}
        ref={ref}
        role="textbox"
        aria-multiline
        aria-invalid={invalid}
        aria-describedby={describedBy}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emit}
        onBlur={emit}
        className="rich-text min-h-44 px-4 py-3 text-sm leading-relaxed text-white outline-none empty:before:pointer-events-none empty:before:text-dune-700 empty:before:content-[attr(data-placeholder)]"
      />

      <p className={`border-t border-dune-900 px-4 py-2 text-right text-[11px] ${length > max ? "text-danger" : "text-dune-500"}`}>
        {length.toLocaleString("en-US")} / {max.toLocaleString("en-US")} characters · {min} minimum
      </p>
    </div>
  );
}
