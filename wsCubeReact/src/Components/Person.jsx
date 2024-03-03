import { Component } from "react";

class Person extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render() {
    return (
      <div className="meow text-center">
        <h1>
          <label htmlFor="name">Name : </label>
          <i>{this.props.name}</i>
          <br />
          <label htmlFor="name">Age : </label>
          <i>{this.props.age}</i>
        </h1>
      </div>
    );
  }
}
export default Person;
