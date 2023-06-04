import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  // todo: show fighter info (image, name, health, etc.)
  if (fighter) {
    fighterElement.appendChild(createFighterImage(fighter));

    const fighterInfo = createElement({
      tagName: 'div',
      className: 'fighter-preview-info',
    });

    ['name', 'health', 'attack', 'defense'].forEach(field => {
      if (fighter.hasOwnProperty(field)) {
        const title = createElement({
          tagName: 'span',
          className: 'field-title',
        });
        title.textContent += field + ': ';

        const value = createElement({
          tagName: 'span',
          className: 'field-value',
        });
        value.textContent += fighter[field];

        const container = createElement({
          tagName: 'div',
        });
        container.appendChild(title).appendChild(value);
        fighterInfo.appendChild(container);
      }
    });

    fighterElement.appendChild(fighterInfo);
  }

  return fighterElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = {
    src: source,
    title: name,
    alt: name
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}
