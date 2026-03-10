/**
 * Neditor.js
 */
import { EditorUtils } from '../utils/EditorUtils.js';

export class Neditor {
    constructor(options = {}) {
        this.containerId = options.containerId || 'editor';
        this.el = document.getElementById(this.containerId);
        this.plugins = {};
        this.events = {};
        this.isSourceMode = false;

        if (!this.el) {
            console.error(`Editor container #${this.containerId} not found.`);
            return;
        }

        this.init();
    }

    init() {
        console.log('Neditor core initializing...');
        this.el.addEventListener('input', () => this.emit('change'));

        // Handle pasting to prevent unintended table structure changes (Bug Fix)
        this.el.addEventListener('paste', (e) => {
            if (e.defaultPrevented) return;

            const selection = window.getSelection();
            if (!selection.rangeCount) return;

            const anchorNode = selection.anchorNode;
            const isInTable = anchorNode && (anchorNode.nodeType === 3 ? anchorNode.parentElement : anchorNode).closest('table');
            const text = (e.clipboardData || window.clipboardData).getData('text');

            if (!text) return;

            // If text contains tabs, or if we are in a table and pasting multi-line text,
            // we force plain text insertion to prevent the browser from creating new cells/rows.
            if (text.includes('\t') || (isInTable && (text.includes('\n') || text.includes('\r')))) {
                e.preventDefault();
                // Replace tabs with 4 spaces
                const cleanText = text.replace(/\t/g, '    ');
                this.execCommand('insertText', cleanText);
            }
        });

        this.el.addEventListener('focus', () => {
            if (this.el.innerText.trim() === "" && this.el.querySelectorAll('img, table, .scrap_bx, .video-container').length === 0) {
                this.el.innerHTML = "";
            }
        });
    }

    registerPlugin(name, PluginClass) {
        try {
            const plugin = new PluginClass(this);
            this.plugins[name] = plugin;
            if (typeof plugin.init === 'function') {
                plugin.init();
            }
            console.log(`Plugin registered: ${name}`);
        } catch (err) {
            console.error(`Failed to register plugin ${name}:`, err);
        }
    }

    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    execCommand(command, value = null) {
        document.execCommand(command, false, value);
        this.el.focus();
        this.emit('change');
    }

    insertNode(node) {
        EditorUtils.insertNode(this.el, node);
        this.emit('change');
    }

    getContent() {
        return this.el.innerHTML;
    }

    setContent(html) {
        this.el.innerHTML = html;
        this.emit('change');
    }
}
