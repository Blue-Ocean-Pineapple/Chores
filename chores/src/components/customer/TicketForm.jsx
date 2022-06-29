import React from "react";
import axios from "axios";

export default class TickerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      wage: "",
      description: "",
      location: ""
    };
  }

  handleNewPost(nameArg, wageArg, descriptionArg, locationArg) {
    this.setState({
      name: nameArg,
      wage: wageArg,
      description: descriptionArg,
      location: locationArg,
    }, this.handleAddPost);
  }

  handleAddPost() {
    axios.post('http://localhost:3001/api/clients/create', {
      name: this.state.name,
      wage: this.state.wage,
      description: this.state.description,
      location: this.state.location,
      creatorId: 'tester',
    });
  }

  render() {
    return (
      <section>
        <header>
          <h2>New Ticket</h2>
        </header>
        <form onSubmit={(event) => {
          event.preventDefault();
          this.handleNewPost(event.target.name.value, event.target.wage.value, event.target.description.value, event.target.location.value);
          alert("Form submitted")
        }}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              placeholder="Ticket name"
              required
              autocomplete="off"
            />
          </label> <br></br>

          <label>
            Wage: $
            <input
              type="text"
              name="wage"
              placeholder="$$$"
              required
              autocomplete="off"
            />
          </label> <br></br>

          <label>
            Description:
            <input
              type="text"
              name="description"
              placeholder="Enter additional information here"
              required
              autocomplete="off"
            />
          </label> <br></br>

          <label>
            Location:
            <input
              type="text"
              name="location"
              placeholder="Address Of Chore"
              required
              autocomplete="off"
            />
          </label> <br></br>


          <input type="submit" value="Submit Ticket" />

          <hr />
        </form>
      </section>
    );
  }
}
