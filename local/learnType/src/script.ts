class player {
  name: string;
  age: number;
  country: string;
  constructor(n: string, a: number, c: string) {
    this.name = n;
    this.age = a;
    this.country = c;
  }
  play() {
    console.log(
      `${this.name} is playing.His age is ${this.age} and he is from ${this.country}`
    );
  }
}

const mashrafi = new player("Mashrafi", 40, "Bangladesh");
mashrafi.play();
