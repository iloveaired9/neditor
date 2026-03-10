/**
 * ImagePlugin.js
 */
import { ApiService } from '../utils/ApiService.js';

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

        // Handle image capture (pasting from clipboard)
        this.editor.el.addEventListener('paste', async (e) => {
            if (!this.enabled || this.editor.isSourceMode) return;

            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    e.preventDefault();
                    const file = items[i].getAsFile();
                    await this._handleUpload(file);
                }
            }
        });

        // Handle Drag and Drop
        this.editor.el.addEventListener('dragover', (e) => {
            if (!this.enabled || this.editor.isSourceMode) return;
            e.preventDefault();
            e.stopPropagation();
            this.editor.el.classList.add('drag-active');
        });

        this.editor.el.addEventListener('dragleave', (e) => {
            if (!this.enabled || this.editor.isSourceMode) return;
            e.preventDefault();
            e.stopPropagation();
            this.editor.el.classList.remove('drag-active');
        });

        this.editor.el.addEventListener('drop', async (e) => {
            if (!this.enabled || this.editor.isSourceMode) return;
            e.preventDefault();
            e.stopPropagation();
            this.editor.el.classList.remove('drag-active');

            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                for (const file of files) {
                    if (file.type.startsWith('image/')) {
                        await this._handleUpload(file);
                    }
                }
            }
        });
    }

    async _handleUpload(file) {
        const originalIcon = this.insertImageBtn.innerHTML;
        this.insertImageBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        this.insertImageBtn.disabled = true;

        try {
            // Using real ApiService instead of ApiMocks
            const result = await ApiService.uploadImage(file);
            const imageUrl = result.url;

            this.editor.execCommand('insertImage', imageUrl);

            // Clean up styling for the newly inserted image
            setTimeout(() => {
                const images = this.editor.el.querySelectorAll('img');
                images.forEach(img => {
                    if (img.src === imageUrl && !img.style.maxWidth) {
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
            alert('이미지 업로드에 실패했습니다.');
        } finally {
            this.insertImageBtn.innerHTML = originalIcon;
            this.insertImageBtn.disabled = false;
            this.imageInput.value = '';
        }
    }

    disable(disabled) {
        if (this.insertImageBtn) this.insertImageBtn.disabled = disabled;
    }

    toggleVisibility(visible) {
        this.showInToolbar = visible;
        if (this.insertImageBtn) {
            this.insertImageBtn.classList.toggle('hidden-toolbar', !visible);
        }
    }
}
