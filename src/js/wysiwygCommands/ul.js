/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 */

import CommandManager from '../commandManager';

/**
 * UL
 * Add UL to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/UL
 * @ignore
 */
const UL = CommandManager.command('wysiwyg', /** @lends UL */{
    name: 'UL',
    keyMap: ['CTRL+U', 'META+U'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYSIWYGEditor instance
     */
    exec(wwe) {
        const sq = wwe.getEditor();
        let range = sq.getSelection();
        const listManager = wwe.componentManager.getManager('list');
        const {
            startContainer,
            endContainer,
            startOffset,
            endOffset
         } = range;

        wwe.focus();
        sq.saveUndoState(range);

        const lines = listManager.getLinesOfSelection(startContainer, endContainer);

        for (let i = 0; i < lines.length; i += 1) {
            this._changeFormatToUnorderedListIfNeed(wwe, lines[i]);
        }

        range = sq.getSelection();
        range.setStart(startContainer, startOffset);
        range.setEnd(endContainer, endOffset);
        sq.setSelection(range);
        sq.saveUndoState(range);
    },
    /**
     * Change format to unordered list if need
     * @param {WysiwygEditor} wwe Wysiwyg editor instance
     * @param {HTMLElement} target Element target for change
     * @private
     */
    _changeFormatToUnorderedListIfNeed(wwe, target) {
        const sq = wwe.getEditor();
        const range = sq.getSelection();

        if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
            range.setStart(target, 0);
            range.collapse(true);
            sq.setSelection(range);

            if (sq.hasFormat('LI')) {
                wwe.saveSelection(range);
                sq.replaceParent(range.startContainer, 'ol', 'ul');
                wwe.restoreSavedSelection();
            } else {
                wwe.unwrapBlockTag();
                sq.makeUnorderedList();
            }
        }
    }
});

module.exports = UL;
