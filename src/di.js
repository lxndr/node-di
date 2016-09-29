const $meta = Symbol('di metadata');
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
      const cons = Class.prototype.constructor;

      if (cons.length > 0) {
        console.log(`Class provider ${cons.name} has ${cons.length} arguments`);
        provider.useValue = null;
      } else {
        currentContainer = this;
        provider.useValue = new Class();
      }
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
    if (key) {
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
        console.log('prop:', key);
        delete desc.initializer;
        delete desc.writable;
        desc.get = function () {
          console.log('get:', key);
          return currentContainer.resolve(prop.type);
        };
        desc.set = function (instance) {
          console.log('set:', key);
          currentContainer.set(prop.type, instance);
        };
      }
    } else {
      const meta = init(target.prototype);
    }
  };
}

export function bootstrap(Class, providers) {
  const container = new Container(providers);
  return container.resolve(Class);
}
