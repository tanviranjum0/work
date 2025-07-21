// // Generics
// // const addId = <T>(obj: T) => {
// //   return { ...obj, id: Math.floor(Math.random() * 1000) };
// // };
// // let user = addId({ name: "John", age: 30, country: "USA" });
// // console.log(user); // { name: 'John', age: 30, country: 'USA', id: 123 }

// // const addId = <T extends object>(obj: T) => {
// //   return { ...obj, id: Math.floor(Math.random() * 1000) };
// // };
// // let user = addId({ name: "John", age: 30, country: "USA" });

// // console.log(user); // { name: 'John', age: 30, country: 'USA', id: 123 }

// enum RType {
//   success = "success",
//   error = "error",
//   warning = "warning",
//   forbidden = "forbidden",
// }
// interface apiRes<T> {
//   statusCode: number;
//   type: RType;
//   data: T;
// }

// const res1: apiRes<string> = {
//   statusCode: 200,
//   type: RType.forbidden,
//   data: "Test",
// };

// console.log(res1); // { statusCode: 200, type: 'forbidden', data: 'Test' }

let a = [3, "Hello", true];
let b: [number, string, boolean] = [3, "Hello", true];
a[0] = { name: "John" };
