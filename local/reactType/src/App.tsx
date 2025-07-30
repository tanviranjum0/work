let name: string;
let isStudent: boolean;
let age: number | string;
age = 49;
let hobbies: string[];
let role: [number, string];
interface Person {
  name: string;
  age?: number;
}

interface Guy extends Person {
  profession: string;
}

// let person: Person = {
//   name: "Tanvir Anjum",
// };

// let lotsIOfPeople: Person[];

let printName: (name: string) => void;
// let printName: (name: string) => never;

// function printName(name: string) {
//   console.log(name);
// }
// printName("Tanvir Anjum");

let personName: unknown;

const App = () => {
  return (
    <div>
      {name}
      {age}
    </div>
  );
};

export default App;
