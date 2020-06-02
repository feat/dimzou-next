import Immutable from 'immutable';

const KEY_SEPARATOR = '-';

class MultiDecorator {
  constructor(decorators) {
    this.decorators = Immutable.List(decorators);
  }

  getDecorations(block, contentState) {
    const decorations = new Array(block.getText().length).fill(null);

    this.decorators.forEach((decorator, i) => {
      const subDecorations = decorator.getDecorations(block, contentState);

      subDecorations.forEach((key, offset) => {
        if (!key) {
          return;
        }

        decorations[offset] = i + KEY_SEPARATOR + key;
      });
    });

    return Immutable.List(decorations);
  }

  getComponentForKey(key) {
    const decorator = this.getDecoratorForKey(key);
    return decorator.getComponentForKey(
      MultiDecorator.getInnerKey(key),
    );
  }

  getPropsForKey(key) {
    const decorator = this.getDecoratorForKey(key);
    return decorator.getPropsForKey(
      MultiDecorator.getInnerKey(key),
    );
  }

  getDecoratorForKey(key) {
    const parts = key.split(KEY_SEPARATOR);
    const index = Number(parts[0]);

    return this.decorators.get(index);
  }


  static getInnerKey(key) {
    const parts = key.split(KEY_SEPARATOR);
    return parts.slice(1).join(KEY_SEPARATOR);
  }
}

export default MultiDecorator;
