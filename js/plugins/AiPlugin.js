/**
 * AiPlugin.js
 */
import { ApiService } from '../utils/ApiService.js';

export class AiPlugin {
    constructor(editor) {
        this.editor = editor;
        this.aiEditBtn = document.getElementById('aiEditBtn');
        this.aiMenu = document.getElementById('aiMenu');
        this.enabled = true;
        this.showInToolbar = true;
    }

    init() {
        if (!this.aiEditBtn || !this.aiMenu) return;

        this.aiEditBtn.addEventListener('click', (e) => {
            if (this.editor.isSourceMode || !this.enabled) return;
            e.stopPropagation();
            this.aiMenu.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            this.aiMenu.classList.remove('active');
        });

        this.aiMenu.querySelectorAll('button[data-ai]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const command = btn.dataset.ai;
                this.aiMenu.classList.remove('active');

                const selection = window.getSelection();
                const selectedText = selection.toString().trim();

                if (!selectedText) {
                    alert('텍스트를 선택해 주세요.');
                    return;
                }

                await this._processAi(command, selectedText, selection);
            });
        });
    }

    async _processAi(command, text, selection) {
        const originalIcon = this.aiEditBtn.innerHTML;
        this.aiEditBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        this.aiEditBtn.disabled = true;

        try {
            // Using ApiService (currently still mock inside, but path is ready)
            const resultText = await ApiService.processAiCommand(command, text);
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(resultText));
            this.editor.emit('change');
        } catch (err) {
            console.error('AI processing failed:', err);
        } finally {
            this.aiEditBtn.innerHTML = originalIcon;
            this.aiEditBtn.disabled = false;
            this.editor.el.focus();
        }
    }

    disable(disabled) {
        if (this.aiEditBtn) this.aiEditBtn.disabled = disabled;
    }

    toggleVisibility(visible) {
        this.showInToolbar = visible;
        const aiContainer = this.aiEditBtn ? this.aiEditBtn.closest('.ai-dropdown-container') : null;
        if (aiContainer) {
            aiContainer.classList.toggle('hidden-toolbar', !visible);
        }
    }
}
