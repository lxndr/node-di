import {bootstrap, inject} from '../src/di';

class B {
  tell() {
    console.log('B');
  }
}

class C {
  tell() {
    console.log('C');
  }
}

class A {
  @inject(B) b;
  @inject(C) c;

  async init() {
    this.b.tell();
    this.c.tell();
  }
}

bootstrap(A).catch(err => {
  console.error(err.stack);
});

