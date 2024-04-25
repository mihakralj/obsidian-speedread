import { Plugin, Notice, MarkdownView } from 'obsidian';
import { EditorView } from '@codemirror/view';

export default class MyPlugin extends Plugin {
    async onload() {
        this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
            this.reformatBody();
        });
    }

    private reformatBody() {

		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		const editorView = (view!.editor as any).cm as EditorView;

    	const visibleRanges = editorView.viewportLineBlocks;

		if (visibleRanges.length > 0) {
			const firstBlock = visibleRanges[0];
			const lastBlock = visibleRanges[visibleRanges.length - 1];

			// Correctly interpreting 'from' and 'to' as character positions, not line numbers
			const firstVisiblePos = firstBlock.from;
			const lastVisiblePos = lastBlock.to;

			// Extracting the text for the visible range using 'sliceString'
			const visibleText = editorView.state.doc.sliceString(firstVisiblePos, lastVisiblePos);

			console.log(`Visible text: ${visibleText}`);
		} else {
			console.log("No visible lines.");
		}

        //new Notice('This is a notice!');
    }
}