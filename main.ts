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
        let decos = Decoration.none;
        const regExp = /\b\w/g; // Regular expression to find the first letter of each word.

      // Correctly iterating through the document
      for (let pos = 0; pos < view.state.doc.length; pos++) {
        let lineStart = view.state.doc.lineAt(pos).from;
        let lineEnd = view.state.doc.lineAt(pos).to;
        let text = view.state.doc.sliceString(lineStart, lineEnd);

        let match;
        while ((match = regExp.exec(text)) !== null) {
            const start = lineStart + match.index;
            const end = start + match[0].length;
            const decoration = Decoration.mark({ class: "h" }).range(start, end);
            decos = decos.update({ add: [decoration] });
        }
    }

        return decos;
    }
}

module.exports = BoldFirstLetterPlugin;
