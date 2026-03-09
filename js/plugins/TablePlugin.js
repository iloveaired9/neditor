/**
 * TablePlugin.js
 */
export class TablePlugin {
    constructor(editor) {
        this.editor = editor;
        this.insertTableBtn = document.getElementById('insertTable');
        this.tablePicker = document.getElementById('tablePicker');
        this.tableGrid = document.getElementById('tableGrid');
        this.tableStatus = document.getElementById('tableStatus');
        this.enabled = true;
        this.showInToolbar = true;
    }

    init() {
        if (!this.insertTableBtn || !this.tablePicker) return;

        this._createGrid();

        this.insertTableBtn.addEventListener('click', (e) => {
            if (this.editor.isSourceMode || !this.enabled) return;
            e.stopPropagation();
            this.tablePicker.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            this.tablePicker.classList.remove('active');
        });
    }

    _createGrid() {
        for (let r = 1; r <= 10; r++) {
            for (let c = 1; c <= 10; c++) {
                const cell = document.createElement('div');
                cell.className = 'table-cell';
                cell.dataset.row = r;
                cell.dataset.col = c;
                this.tableGrid.appendChild(cell);
                cell.addEventListener('mouseover', () => this._updateGridHighlight(r, c));
                cell.addEventListener('click', () => this._insertTable(r, c));
            }
        }
    }

    _updateGridHighlight(row, col) {
        if (!this.enabled) return;
        const cells = this.tableGrid.querySelectorAll('.table-cell');
        cells.forEach(cell => {
            const r = parseInt(cell.dataset.row);
            const c = parseInt(cell.dataset.col);
            cell.classList.toggle('selected', r <= row && c <= col);
        });
        this.tableStatus.innerText = `${row} x ${col}`;
    }

    _insertTable(rows, cols) {
        if (!this.enabled) return;
        const table = document.createElement('table');
        for (let i = 0; i < rows; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement(i === 0 ? 'th' : 'td');
                cell.innerHTML = i === 0 ? 'Header' : 'Cell';
                tr.appendChild(cell);
            }
            table.appendChild(tr);
        }
        this.editor.insertNode(table);
        this.tablePicker.classList.remove('active');
    }

    disable(disabled) {
        if (this.insertTableBtn) this.insertTableBtn.disabled = disabled;
    }
}
