/**
 * ImagePlugin.js
 */
import { ApiService } from '../utils/ApiService.js';

export class ImagePlugin {
    constructor(editor) {
        this.editor = editor;
        this.insertImageBtn = document.getElementById('insertImage');

        // Modal elements
        this.modal = document.getElementById('imageUploadModal');
        if (!this.modal) return;

        this.modalInput = document.getElementById('modalImageInput');
        this.addBtn = document.getElementById('addImagesBtn');
        this.clearBtn = document.getElementById('clearAllImages');
        this.confirmBtn = document.getElementById('confirmImageUpload');
        this.cancelBtn = document.getElementById('cancelImageUpload');
        this.closeBtn = this.modal.querySelector('.close-image-modal');
        this.dropZone = document.getElementById('imageDropZone');
        this.grid = document.getElementById('imageGrid');
        this.photoInfo = document.getElementById('photoInfo');

        // Settings
        this.alignRadios = document.getElementsByName('imgAlign');
        this.onePerRowCheck = document.getElementById('onePerRow');
        this.addMarginCheck = document.getElementById('addMargin');
        this.resizeSelect = document.getElementById('resizeWidth');

        this.selectedFiles = [];
        this.enabled = true;
        this.showInToolbar = true;
    }

    init() {
        if (!this.insertImageBtn || !this.modal) return;

        this.insertImageBtn.addEventListener('click', () => {
            if (this.editor.isSourceMode || !this.enabled) return;
            this._showModal();
        });

        this.closeBtn.onclick = () => this._hideModal();
        this.cancelBtn.onclick = () => this._hideModal();

        this.addBtn.onclick = () => this.modalInput.click();
        this.modalInput.onchange = (e) => this._handleFiles(e.target.files);

        this.clearBtn.onclick = () => {
            this.selectedFiles = [];
            this._renderGrid();
        };

        this.confirmBtn.onclick = () => this._handleConfirm();

        // Drag & Drop for modal
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('dragover');
        });

        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.classList.remove('dragover');
        });

        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('dragover');
            this._handleFiles(e.dataTransfer.files);
        });

        // Continue supporting direct paste/drag to editor for convenience
        this.editor.el.addEventListener('paste', async (e) => {
            if (!this.enabled || this.editor.isSourceMode) return;
            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    e.preventDefault();
                    const file = items[i].getAsFile();
                    this._showModal();
                    this._handleFiles([file]);
                }
            }
        });
    }

    _showModal() {
        this.modal.classList.add('active');
        this.selectedFiles = [];
        this._renderGrid();
    }

    _hideModal() {
        this.modal.classList.remove('active');
        this.modalInput.value = '';
    }

    _handleFiles(files) {
        if (!files) return;
        const fileList = Array.from(files);
        for (const file of fileList) {
            if (file.type.startsWith('image/')) {
                // Check if already added (simple name check)
                if (!this.selectedFiles.some(f => f.name === file.name && f.size === f.size)) {
                    this.selectedFiles.push(file);
                }
            }
        }
        this._renderGrid();
        this.modalInput.value = '';
    }

    _renderGrid() {
        this.grid.innerHTML = '';
        if (this.selectedFiles.length === 0) {
            this.grid.innerHTML = `
                <div class="empty-grid-msg">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>이미지를 여기에 드롭하거나 버튼을 눌러 추가하세요.</p>
                </div>
            `;
            this._updateInfo(null);
            return;
        }

        this.selectedFiles.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'image-item';

            const reader = new FileReader();
            reader.onload = (e) => {
                item.innerHTML = `
                    <img src="${e.target.result}" alt="${file.name}">
                    <div class="remove-img" data-index="${index}"><i class="fas fa-times"></i></div>
                `;
                item.querySelector('.remove-img').onclick = (ev) => {
                    ev.stopPropagation();
                    this.selectedFiles.splice(index, 1);
                    this._renderGrid();
                };

                item.onmouseover = () => this._updateInfo(file, e.target.result);
            };
            reader.readAsDataURL(file);
            this.grid.appendChild(item);
        });
    }

    _updateInfo(file, dataUrl) {
        if (!file) {
            this.photoInfo.innerHTML = '<p>가로: 0 세로: 0</p><p>이름: 없음</p>';
            return;
        }

        const img = new Image();
        img.onload = () => {
            this.photoInfo.innerHTML = `
                <p>가로: ${img.width}px</p>
                <p>세로: ${img.height}px</p>
                <p style="word-break: break-all;">이름: ${file.name}</p>
            `;
        };
        img.src = dataUrl;
    }

    async _handleConfirm() {
        if (this.selectedFiles.length === 0) {
            alert('업로드할 이미지를 추가해주세요.');
            return;
        }

        this.confirmBtn.disabled = true;
        this.confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 업로드 중...';

        try {
            const alignment = Array.from(this.alignRadios).find(r => r.checked)?.value || 'center';
            const onePerRow = this.onePerRowCheck.checked;
            const addMargin = this.addMarginCheck.checked;
            const resizeWidth = this.resizeSelect.value;

            for (const file of this.selectedFiles) {
                const result = await ApiService.uploadImage(file);
                const imageUrl = result.url;

                const imgHtml = this._buildImageHtml(imageUrl, {
                    alignment,
                    onePerRow,
                    addMargin,
                    resizeWidth
                });

                this.editor.execCommand('insertHTML', imgHtml);
            }

            this._hideModal();
            this.editor.emit('change');
        } catch (err) {
            console.error('Image upload failed:', err);
            alert('이미지 업로드에 실패했습니다.');
        } finally {
            this.confirmBtn.disabled = false;
            this.confirmBtn.innerHTML = '확인';
        }
    }

    _buildImageHtml(url, options) {
        const style = [
            'max-width: 100%',
            'height: auto',
            'border-radius: 12px',
            'display: block',
            'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        ];

        if (options.resizeWidth !== 'original') {
            style.push(`width: ${options.resizeWidth}px`);
        } else {
            style.push('width: auto');
        }

        if (options.addMargin) {
            style.push('margin: 24px auto');
        } else {
            style.push('margin: 0 auto');
        }

        if (options.alignment === 'left') {
            style.push('margin-left: 0');
            style.push('margin-right: auto');
        } else if (options.alignment === 'right') {
            style.push('margin-left: auto');
            style.push('margin-right: 0');
        }

        const containerStyle = options.onePerRow ? 'clear: both; width: 100%; text-align: ' + options.alignment : 'display: inline-block; margin: 5px;';

        return `<div class="img-container" style="${containerStyle}"><img src="${url}" style="${style.join('; ')}"></div>${options.onePerRow ? '<p><br></p>' : ''}`;
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
