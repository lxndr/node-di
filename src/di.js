const $meta = Symbol('di metadata');
let currentContainer = null;

export class Container {
  constructor(providers) {
    this.providers = providers;
  }

  create(Class, parent) {
    const meta = Class.prototype[$meta];
    currentContainer = this;
    return new Class();
  }
}

function init(proto) {
  let meta = proto[$meta];
  if (!meta) {
    meta = proto[$meta];
  }
  return meta;
}

export function inject(Class, newInstance) {
  return function(target, key, desc) {
    if (key) {
      const meta = init(target);

      desc.writable = false;
      desc.initializer = function() {
        return currentContainer.create(Class);
      };
    } else {
      const meta = init(target.prototype);
    }
  };
}
