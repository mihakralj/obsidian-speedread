import { Plugin } from 'obsidian';
import { EditorView, Decoration, ViewPlugin, DecorationSet, ViewUpdate } from '@codemirror/view';

class BoldFirstLetterPlugin extends Plugin {
  onload() {
    this.registerEditorExtension(boldFirstLetterExtension());
  }
}

function boldFirstLetterExtension() {
  return ViewPlugin.define(view => new BoldFirstLetterView(view), {
    decorations: v => v.decorations
  });
}

class BoldFirstLetterView {
  decorations: DecorationSet;

  constructor(view: EditorView) {
    this.decorations = this.computeDecorations(view);
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.computeDecorations(update.view);
    }
  }

  computeDecorations(view: EditorView): DecorationSet {

    const wordRegExp = /\b\w+\b/g; // RegExp to find whole words
    const decos = [];

    const { from, to } = view.viewport;

    const fromLine = view.state.doc.lineAt(from).number;
    const toLine = view.state.doc.lineAt(to).number;
    const iter = view.state.doc.iterLines(fromLine, toLine);

    // Line number offset at the start of the viewport
    let lineNo = view.state.doc.lineAt(from).number;

    // Iterate over each line within the visible range
    let lineStart = from;
    while (!iter.next().done) {
      const lineText = iter.value;


      let match;
      const m = 2; // Maximum highlighted letters
      while ((match = wordRegExp.exec(lineText)) !== null) {
        const k = match[0].length; // Length of the word
        const b = Math.min(Math.floor(k / 3), m); // Letters to decorate at the beginning
        const l = Math.min(Math.floor((k - 1) / 3), m); // Letters to decorate at the end
        const start = lineStart + match.index;
        const end = start + k;

        // Apply decoration to the first `b` letters
        if (b > 0) {
          const decorationStart = Decoration.mark({ class: "h" }).range(start, start + b);
          decos.push(decorationStart);
        }

        // Apply decoration to the last `l` letters
        if (l > 0) {
          const decorationEnd = Decoration.mark({ class: "l" }).range(end - l, end);
          decos.push(decorationEnd);
        }
      }

      // Update lineStart for the next iteration
      lineStart += lineText.length + 1; // Assuming +1 for the newline character
    }

    return Decoration.set(decos, true);
  }

}

module.exports = BoldFirstLetterPlugin;
