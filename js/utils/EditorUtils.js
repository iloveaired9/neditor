/**
 * EditorUtils.js
 */
export const EditorUtils = {
    insertNode(editor, node) {
        const selection = window.getSelection();
        const p = document.createElement('p');
        p.innerHTML = '<br>';

        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (editor.contains(range.commonAncestorContainer)) {
                range.deleteContents();

                if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                    node.appendChild(p);
                    range.insertNode(node);
                } else {
                    range.insertNode(node);
                    if (node.parentNode) {
                        node.parentNode.insertBefore(p, node.nextSibling);
                    } else {
                        editor.appendChild(p);
                    }
                }
            } else {
                editor.appendChild(node);
                editor.appendChild(p);
            }
        } else {
            editor.appendChild(node);
            editor.appendChild(p);
        }

        const newRange = document.createRange();
        newRange.setStart(p, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
        editor.focus();
    },

    extractYoutubeId(text) {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
        const match = text.match(regex);
        return match ? match[1] : false;
    }
};
