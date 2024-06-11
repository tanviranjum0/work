//            Type Property as a Variable!!!!!!!

// type details = { name: string; age: number };
// type strnum = number | string;
// const userDetails = (id: strnum, user: details) => {
//   console.log(`User id is ${id}, Name is ${user.name} and age is ${user.age}`);
// };
// userDetails(34, { name: "tan", age: 47 });
// const sayHello = (user: details) => {
//   console.log(` Name is ${user.name} and age is ${user.age}`);
// };
// sayHello({ name: "tan", age: 47 });

//               Returned Undefined or Nothing(void)!!!!!!
// let myFunc: (a: number, b: number) => number;
// let myFunc2: (a: number, b: number) => void;
// myFunc = (a: number, b: number) => {
//   console.log("Function consoled and returned", a, b);
//   return a - b;
//   // console.log(a, b);
// };
// myFunc2 = (a: number, b: number) => {
//   console.log("Not returned but Consoled", a, b);
// };
// myFunc(3, 4);
// myFunc2(5, 6);
// let calcultion: (a: number, b: number, c: string) => number;
// calcultion = (a: number, b: number, c: string) => {
//   if ((c = "add")) {
//     return a + b;
//   } else {
//     return a - b;
//   }
// };
// calcultion(5, 4, "add");

//              Working With Classes!!!!!

// class Player {
//   name: string;
//   age: number;
//   country: string;
//   constructor(n: string, a: number, c: string) {
//     this.name = n;
//     this.age = a;
//     this.country = c;
//   }
//   play() {
//     console.log(`${this.name} is ${this.country} and ${this.age}`);
//   }
// }
// const Tanvir = new Player("Tanvir", 19, "Bangladesh");
// const Shakib = new Player("Shakib", 40, "England");
// const players: Player[] = [];
// players.push(Shakib);
// players.push(Tanvir);
// console.log(players);

//     Class Access Modifiers:public,private,readonly!!!!!

// class Player {
//   readonly name: string;
//   private age: number;
//   public country: string;
//   constructor(n: string, a: number, c: string) {
//     this.name = n;
//     this.age = a;
//     this.country = c;
//   }
//   play() {
//     console.log(`${this.name} is ${this.country} and ${this.age}`);
//   }
// }
// const Tanvir = new Player("Tanvir", 19, "Bangladesh");
// const Shakib = new Player("Shakib", 40, "England");
// const players: Player[] = [];
// players.push(Shakib);
// players.push(Tanvir);
// Shakib.name = "Mashrafi";
// console.log(Shakib.name);
// console.log(Shakib.age);
// console.log(players);

//      Module System=Import/Export
//     We have to set "module" :"es2015" and
//   "target":"es6". While importing should have to use .js file extension also inside a {}
//

// import { Player } from "./player.js";
// const Tanvir = new Player("Tanvir", 19, "Bangladesh");
// const Shakib = new Player("Shakib", 40, "England");
// const players: Player[] = [];
// players.push(Shakib);
// players.push(Tanvir);
// Shakib.name = "Mashrafi";
// console.log(Shakib.name);
// console.log(Shakib.age);
// console.log(players);

//          TypeScript Interface!!!!!!

// interface RectangleOptions {
//   width: number;
//   length: number;
// }
// function drawRectangle(options: RectangleOptions) {
//   let width = options.width;
//   let length = options.length;
// }

// let a = { width: 30, length: 20 };
// drawRectangle(a);
// import { Player } from "./interfaces/player.js";
// import { IsPlayer } from "./interfaces/IsPlayer.js";
// const Tanvir = new Player("Tanvir", 19, "Bangladesh");
// let Shakib: IsPlayer;
// Shakib = new Player("Shakib", 40, "England");
// const players: Player[] = [];
// players.push(Shakib);
// players.push(Tanvir);
// Shakib.name = "Mashrafi";
//          GENERICS!!!!!

// const addId = <T extends object>(obj: T) => {
//   let id = Math.floor(Math.random() * 100);
//   return { ...obj, id };
// };
// // let user = addId({
// //   name: "Tanvir",
// //   age: 40,
// // });
// let user = addId("Mashrafi");

// interface APIresponse<T> {
//   status: number;
//   type: string;
//   data: T;
// }
// const response: APIresponse<object> = {
//   status: 200,
//   type: "success",
//   data: {
//     name: "Tanvir",
//     age: 29,
//   },
// };

//       ENUM type!!!!!

// enum responseT {
//   Success,
//   Failed,
//   Unauthenticated,
//   Forbidden,
// }
// interface APIresponse<T> {
//   status: number;
//   type: responseT;
//   data: T;
// }
// const response: APIresponse<object> = {
//   status: 200,
//   type: responseT.Failed,
//   data: {
//     name: "Tanvir",
//     age: 29,
//   },
// };
// console.log(response);
