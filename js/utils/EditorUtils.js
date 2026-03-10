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
                range.insertNode(node);

                // Always insert a follow-up paragraph AFTER the inserted node for easier continuing text
                node.parentNode.insertBefore(p, node.nextSibling);
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
