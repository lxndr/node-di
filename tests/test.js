import {Container, inject} from '../src/di';

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
}

@inject(C)
class D {
  constructor(c) {
    this.c = c;
  }
}

const di = new Container();
const a = di.create(A);

console.log(a);
