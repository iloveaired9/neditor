/**
 * ImagePlugin.js
 */
import { ApiMocks } from '../utils/ApiMocks.js';

export class ImagePlugin {
    constructor(editor) {
        this.editor = editor;
        this.insertImageBtn = document.getElementById('insertImage');
        this.imageInput = document.getElementById('imageInput');
        this.enabled = true;
        this.showInToolbar = true;
    }

    init() {
        if (!this.insertImageBtn || !this.imageInput) return;

        this.insertImageBtn.addEventListener('click', () => {
            if (this.editor.isSourceMode || !this.enabled) return;
            this.imageInput.click();
        });

        this.imageInput.addEventListener('change', async (e) => {
            if (!this.enabled) return;
            const file = e.target.files[0];
            if (file) {
                await this._handleUpload(file);
            }
        });
    }

    async _handleUpload(file) {
        const originalIcon = this.insertImageBtn.innerHTML;
        this.insertImageBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        this.insertImageBtn.disabled = true;

        try {
            const mockUrl = await ApiMocks.simulateImageUpload(file);
            this.editor.execCommand('insertImage', mockUrl);

            setTimeout(() => {
                const images = this.editor.el.querySelectorAll('img');
                images.forEach(img => {
                    if (!img.style.maxWidth) {
                        img.style.maxWidth = '100%';
                        img.style.height = 'auto';
                        img.style.borderRadius = '12px';
                        img.style.display = 'block';
                        img.style.margin = '24px 0';
                        img.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    }
                });
                this.editor.emit('change');
            }, 100);
        } catch (err) {
            console.error('Image upload failed:', err);
        } finally {
            this.insertImageBtn.innerHTML = originalIcon;
            this.insertImageBtn.disabled = false;
            this.imageInput.value = '';
        }
    }

    disable(disabled) {
        if (this.insertImageBtn) this.insertImageBtn.disabled = disabled;
    }
}
