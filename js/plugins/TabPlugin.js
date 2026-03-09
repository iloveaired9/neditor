/**
 * TabPlugin.js
 */
export class TabPlugin {
    constructor(editor) {
        this.editor = editor;
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.sourceArea = document.getElementById('sourceArea');
        this.editorView = document.getElementById('editor-view');
        this.sourceView = document.getElementById('source-view');
        this.enabled = true;
        this.showInToolbar = true;
    }

    init() {
        if (!this.tabBtns.length || !this.sourceArea) return;

        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!this.enabled) return;
                const mode = btn.getAttribute('data-tab');
                this._switchTab(mode);
            });
        });
    }

    _switchTab(mode) {
        if (mode === 'source') {
            this.sourceArea.value = this.editor.getContent();
            this.editorView.style.display = 'none';
            this.sourceView.style.display = 'block';
            this.tabBtns[0].classList.remove('active');
            this.tabBtns[1].classList.add('active');
            this.editor.isSourceMode = true;
            this._togglePlugins(true);
        } else {
            this.editor.setContent(this.sourceArea.value);
            this.sourceView.style.display = 'none';
            this.editorView.style.display = 'block';
            this.tabBtns[1].classList.remove('active');
            this.tabBtns[0].classList.add('active');
            this.editor.isSourceMode = false;
            this._togglePlugins(false);
            this.editor.el.focus();
        }
    }

    _togglePlugins(disabled) {
        Object.keys(this.editor.plugins).forEach(name => {
            if (name === 'tabs') return; // Skip self to allow switching back

            const plugin = this.editor.plugins[name];
            if (typeof plugin.disable === 'function') {
                const shouldActuallyDisable = disabled || (plugin.enabled === false);
                plugin.disable(shouldActuallyDisable);
            }
        });
    }

    disable(disabled) {
        this.tabBtns.forEach(btn => btn.disabled = disabled);
    }

    toggleVisibility(visible) {
        this.showInToolbar = visible;
        const tabsContainer = document.querySelector('.tabs');
        if (tabsContainer) {
            tabsContainer.classList.toggle('hidden-toolbar', !visible);
        }
    }
}
