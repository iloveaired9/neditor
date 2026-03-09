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
