/**
 * StoragePlugin.js
 */
export class StoragePlugin {
    constructor(editor) {
        this.editor = editor;
        this.storageKey = 'web-editor-content';
        this.enabled = true;
    }

    init() {
        const savedContent = localStorage.getItem(this.storageKey);
        if (savedContent) {
            this.editor.setContent(savedContent);
        }

        this.editor.on('change', () => {
            if (!this.enabled) return;
            this._save();
        });
    }

    _save() {
        const content = this.editor.getContent();
        localStorage.setItem(this.storageKey, content);
        console.log('Content auto-saved.');
    }

    disable(disabled) {
        // Storage plugin doesn't have UI to disable, but the logic is handled in the listener
    }
}
