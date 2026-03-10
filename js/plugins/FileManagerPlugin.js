/**
 * FileManagerPlugin.js
 * Manages the attachment list at the bottom of the editor.
 */
import { ApiService } from '../utils/ApiService.js';

export class FileManagerPlugin {
    constructor(editor) {
        this.editor = editor;
        this.bottomList = document.getElementById('bottomAttachmentList');
        this.representativeImage = null;
        this.enabled = true;
        this.showInToolbar = false;
    }

    init() {
        if (!this.bottomList) {
            console.error('Bottom attachment list container not found.');
            return;
        }

        // Listen for changes in the editor to update the bottom list
        this.editor.on('change', () => this.updateBottomList());

        // Initial render
        setTimeout(() => this.updateBottomList(), 100);
    }

    /**
     * Updates the persistent list of images at the bottom of the editor 
     * based on the current images in the content.
     */
    async updateBottomList() {
        if (!this.bottomList) return;

        const editorContent = this.editor.getContent();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = editorContent;
        const editorImageUrls = Array.from(tempDiv.querySelectorAll('img')).map(img => img.src);

        if (editorImageUrls.length === 0) {
            this.bottomList.innerHTML = '<div class="empty-state-small" style="font-size: 12px; color: #94a3b8; width: 100%; text-align: center; padding: 10px;">첨부된 이미지가 없습니다.</div>';
            return;
        }

        this.bottomList.innerHTML = '';

        editorImageUrls.forEach(url => {
            const item = document.createElement('div');
            const isRep = this.representativeImage === url;
            item.className = `attachment-bottom-item ${isRep ? 'representative' : ''}`;
            item.innerHTML = `
                <img src="${url}" alt="attachment">
                <div class="rep-indicator">대표</div>
                <button class="remove-btn" title="삭제 (서버 및 본문)">
                    <i class="fas fa-times"></i>
                </button>
                <button class="star-btn" title="대표 이미지로 설정">
                    <i class="fas fa-star"></i>
                </button>
            `;

            const starBtn = item.querySelector('.star-btn');
            starBtn.onclick = (e) => {
                e.stopPropagation();
                this.setRepresentative(url);
            };

            // Scroll to image on click
            item.onclick = () => {
                const allImgs = this.editor.el.querySelectorAll('img');
                allImgs.forEach(img => {
                    if (img.src === url) {
                        img.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        img.style.outline = '3px solid var(--primary-color)';
                        setTimeout(() => img.style.outline = '', 2000);
                    }
                });
            };

            item.querySelector('.remove-btn').onclick = async (e) => {
                e.stopPropagation();
                if (confirm('이 이미지를 에디터 본문과 서버에서 모두 삭제하시겠습니까?')) {
                    try {
                        const filename = url.split('/').pop().split('?')[0];
                        console.log('Attempting to delete:', { url, filename });

                        await ApiService.deleteFile(filename);
                        console.log('Successfully deleted from server:', filename);

                        const editorImgs = this.editor.el.querySelectorAll('img');
                        editorImgs.forEach(img => {
                            if (img.src === url) {
                                img.remove();
                            }
                        });
                        this.editor.emit('change');

                        if (this.representativeImage === url) {
                            this.representativeImage = null;
                        }
                    } catch (err) {
                        console.error('Delete flow failed:', err);
                        alert('삭제 실패: ' + err.message);
                    }
                }
            };

            this.bottomList.appendChild(item);
        });
    }

    setRepresentative(url) {
        this.representativeImage = url;
        this.updateBottomList();
        this.editor.emit('representativeImageSet', url);
    }

    disable(disabled) {
        this.enabled = !disabled;
    }

    toggleVisibility(visible) {
        this.showInToolbar = visible;
    }
}
