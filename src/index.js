const $meta = Symbol('di');
let currentContainer = null;

export class Container {
  constructor(providers = []) {
    this.providers = providers;
  }

  findProvider(type) {
    return this.providers.find(provider => provider.provide === type);
  }

  resolve(type) {
    let provider = this.findProvider(type);

    if (!provider) {
      if (typeof type === 'string') {
        throw new TypeError(`Provider ${type} not found`);
      }

      provider = {provide: type, useClass: type};
      this.providers.push(provider);
    }

    if (provider.useValue === undefined) {
      const Class = provider.useClass;
      currentContainer = this;
      provider.useValue = new Class();
    }

    return provider.useValue;
  }

  set(type, instance) {
    let provider = currentContainer.findProvider(type);

    if (!provider) {
      provider = {provide: type};
      this.providers.push(provider);
    }

    provider.useValue = instance;
  }
}

function init(proto) {
  if (!proto[$meta]) {
    proto[$meta] = {
      props: []
    };
  }
  return proto[$meta];
}

export function inject(type, options = {}) {
  return function (target, key, desc) {
    const prop = {
      name: key,
      type,
      newInstance: options.newInstance
    };
    const meta = init(target);
    meta.props.push(prop);

    if (prop.newInstance) {
      desc.initializer = function () {
        return currentContainer.create(prop.type);
      };
    } else {
      delete desc.initializer;
      delete desc.writable;
      desc.get = function () {
        return currentContainer.resolve(prop.type);
      };
      desc.set = function (instance) {
        currentContainer.set(prop.type, instance);
      };
    }
  };
}

export function bootstrap(Class, providers) {
  const container = new Container(providers);
  return container.resolve(Class);
}
