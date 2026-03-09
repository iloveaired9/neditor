/**
 * ToolbarPlugin.js
 */
export class ToolbarPlugin {
    constructor(editor) {
        this.editor = editor;
        this.buttons = document.querySelectorAll('button[data-command]');
        this.fontSizeSelect = document.getElementById('fontSize');
        this.foreColorPicker = document.getElementById('foreColor');
        this.undoBtn = document.getElementById('undo');
        this.redoBtn = document.getElementById('redo');
        this.enabled = true;
        this.showInToolbar = true;
    }

    init() {
        this._initFormattingButtons();
        this._initFontSize();
        this._initColorPicker();
        this._initUndoRedo();
    }

    _initFormattingButtons() {
        this.buttons.forEach(button => {
            button.addEventListener('mousedown', (e) => e.preventDefault());
            button.addEventListener('click', () => {
                if (this.editor.isSourceMode || !this.enabled) return;
                const command = button.getAttribute('data-command');
                this.editor.execCommand(command);
            });
        });
    }

    _initFontSize() {
        if (!this.fontSizeSelect) return;
        this.fontSizeSelect.addEventListener('change', () => {
            if (this.editor.isSourceMode || !this.enabled) return;
            if (this.fontSizeSelect.value) {
                this.editor.execCommand('fontSize', this.fontSizeSelect.value);
                this.fontSizeSelect.value = '';
            }
        });
    }

    _initColorPicker() {
        if (!this.foreColorPicker) return;
        this.foreColorPicker.addEventListener('input', () => {
            if (this.editor.isSourceMode || !this.enabled) return;
            this.editor.execCommand('foreColor', this.foreColorPicker.value);
        });
    }

    _initUndoRedo() {
        if (this.undoBtn) {
            this.undoBtn.addEventListener('click', () => {
                if (this.editor.isSourceMode || !this.enabled) return;
                this.editor.execCommand('undo');
            });
        }
        if (this.redoBtn) {
            this.redoBtn.addEventListener('click', () => {
                if (this.editor.isSourceMode || !this.enabled) return;
                this.editor.execCommand('redo');
            });
        }
    }

    disable(disabled) {
        this.buttons.forEach(btn => btn.disabled = disabled);
        if (this.fontSizeSelect) this.fontSizeSelect.disabled = disabled;
        if (this.foreColorPicker) this.foreColorPicker.disabled = disabled;
        if (this.undoBtn) this.undoBtn.disabled = disabled;
        if (this.redoBtn) this.redoBtn.disabled = disabled;
    }

    toggleVisibility(visible) {
        this.showInToolbar = visible;
        // Hide/Show all groups that contain these buttons
        const groups = new Set();
        this.buttons.forEach(btn => groups.add(btn.closest('.toolbar-group')));
        if (this.fontSizeSelect) groups.add(this.fontSizeSelect.closest('.toolbar-group'));
        if (this.undoBtn) groups.add(this.undoBtn.closest('.toolbar-group'));

        groups.forEach(group => {
            if (group) group.classList.toggle('hidden-toolbar', !visible);
        });
    }
}
