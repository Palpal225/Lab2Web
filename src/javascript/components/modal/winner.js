import { showModal } from './modal';
import { createFighterImage } from '../fighterPreview';
import { createElement } from '../../helpers/domHelper';

export function showWinnerModal(fighter) {
    // call showModal function
    showModal({
        title: 'YOU WIN!!!!!!',
        bodyElement: createBodyElement(fighter),
        onClose: () => {
            document.location.href="/";
        }
    });
}
function createBodyElement(fighter) {
    const fighterElement = createElement({
        tagName: 'div',
        className: 'modal-card___winner'
    });

    fighterElement.appendChild(createFighterImage(fighter));
    fighterElement.innerHTML += `
    <h1>${fighter.name}</h1>
  `;
    return fighterElement;
}