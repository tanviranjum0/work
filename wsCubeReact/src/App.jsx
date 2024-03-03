import Person from "./Components/Person";
import { Component } from "react";
import "./App.css";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      persons: [
        {
          name: "Tanvir",
          age: "19",
        },
        {
          name: "Anjum",
          age: "19",
        },
        {
          name: "Rahim",
          age: "19",
        },
      ],
    };
  }

  render() {
    let persons;
    persons = this.state.persons.map((p) => {
      return <Person name={p.name} age={p.age} key={p.name} />;
    });
    return <div className="container align-center">{persons}</div>;
  }
}
export default App;
