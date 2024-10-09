/*Q1. JS Variable needs to be created here. Below variable is just an example. Try to add more attributes.*/
const initialTravellers = [
  {
    id: 1, name: 'Jack', phone: 88885555,
    bookingTime: new Date(),
  },
  {
    id: 2, name: 'Rose', phone: 88884444,
    bookingTime: new Date(),
  },
  { id: 3, name: 'Pony', phone: '80847052', bookingTime: new Date() },
  { id: 4, name: 'Mike', phone: '88884444', bookingTime: new Date() },
];

// count nextId based on the initialTravellers
const maxId = initialTravellers.reduce((maxId, traveller) => {
  return Math.max(maxId, traveller.id);
}, 0);

function TravellerRow(props) {
  {/*Q3. Placeholder to initialize local variable based on traveller prop.*/}
  const { traveller } = props;
  return (
    <tr>
	  {/*Q3. Placeholder for rendering one row of a table with required traveller attribute values.*/}
    <td>{traveller.id}</td>
    <td>{traveller.name}</td>
    <td>{traveller.phone}</td>
    <td>{traveller.bookingTime.toLocaleString()}</td>
    </tr>
  );
}

function Display(props) {
  const { travellers } = props;
	/*Q3. Write code to render rows of table, reach corresponding to one traveller. Make use of the TravellerRow function that draws one row.*/

  return (
    <table className="bordered-table">
      <thead>
        <tr>
	  {/*Q3. Below table is just an example. Add more columns based on the traveller attributes you choose.*/}
          <th>ID</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Booking Time</th>
        </tr>
      </thead>
      <tbody>
        {/*Q3. write code to call the JS variable defined at the top of this function to render table rows.*/}
        {travellers.map((traveller) => (
          <TravellerRow key={traveller.id} traveller={traveller} />
        ))}
      </tbody>
    </table>
  );
}

class Add extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      phone: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  handlePhoneChange(e) {
    this.setState({ phone: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    /*Q4. Fetch the passenger details from the add form and call bookTraveller()*/
    const { name, phone } = this.state;

  //if it is empty
  if (!name || !phone) {
    alert('Please fill in all the fields.');
    return;
  }

  //if it is not a number
  if (isNaN(phone)) {
    alert('Phone number must be a number.');
    return;
  }

    const passenger = {
      id: this.props.getNextId(), // use the function provided by the parent component to get the next ID
      name,
      phone,
      bookingTime: new Date()
    };
    this.props.bookTraveller(passenger);
    this.setState({ name: '', phone: '' }); // clear the form
  }

  render() {
    return (
      <form name="addTraveller" onSubmit={this.handleSubmit}>
	    {/*Q4. Placeholder to enter passenger details. Below code is just an example.*/}
      <input type="text" name="travellername" placeholder="Name" value={this.state.name} onChange={this.handleNameChange} />
        <input type="text" name="travellerphone" placeholder="Phone" value={this.state.phone} onChange={this.handlePhoneChange} />
        <button>Add</button>
      </form>
    );
  }
}


class Delete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ name: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    /*Q5. Fetch the passenger details from the deletion form and call deleteTraveller()*/
    this.props.deleteTraveller(this.state.name); // 
    // clear the form
    this.setState({ name: '' });
  }
  

  render() {
    return (
      <form name="deleteTraveller" onSubmit={this.handleSubmit}>
	    {/*Q5. Placeholder form to enter information on which passenger's ticket needs to be deleted. Below code is just an example.*/}
      <input
          type="text"
          name="travellername"
          placeholder="Enter name to delete"
          value={this.state.name}
          onChange={this.handleChange}
        />
        <button type="submit">Delete</button>
      </form>
    );
  }
}

class Homepage extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      freeSeats: props.freeSeats || [], //
    };
	}
	render(){
    const { freeSeats } = this.props;
    const seatArray = Array.from({ length: 10 }, (_, index) => index + 1);
    const seats = seatArray.map(seat => (
      <div
        key={seat}
        style={{
          backgroundColor: freeSeats.includes(seat) ? 'green' : 'grey',
          width: '30px',
          height: '30px',
          display: 'inline-block',
          margin: '5px'
        }}
      >
        {seat}
      </div>
    ));

    return (
      <div>
        <h2>Seat Availability</h2>
        {seats}
      </div>
    );
	}
}
class TicketToRide extends React.Component {
  constructor(props) {
    super(props);
    //Create a state variable to store the travellers.
    this.state = { 
      travellers: [], selector: 1, nextId: maxId + 1,
      freeSeats: Array.from({ length: 10 }, (_, index) => index + 1),
      availableIds: []
     };

    this.bookTraveller = this.bookTraveller.bind(this);
    this.deleteTraveller = this.deleteTraveller.bind(this);
    this.getNextId = this.getNextId.bind(this);
  }

  getNextId() {
    const { nextId } = this.state;
    this.setState({ nextId: nextId + 1 });
    return nextId;
  }

  setSelector(value)
  {
    /*Q2. Function to set the value of component selector variable based on user's button click.*/
    this.setState({ selector: value });
  }
  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const allSeats = Array.from({ length: 10 }, (_, index) => index + 1); // 假设有10个座位
    const occupiedSeats = initialTravellers.map(traveller => traveller.id);
    const freeSeats = allSeats.filter(seat => !occupiedSeats.includes(seat));
    setTimeout(() => {
      this.setState({ 
        travellers: initialTravellers,
        freeSeats: freeSeats 
      });
    }, 500);
  }

  bookTraveller(passenger) {
    if (this.state.freeSeats.length === 0) {
      alert('Already full!');
      return;
    }
    const nextId = this.getNextId();
    const newPassenger = {
      ...passenger,
      id: nextId
    };

    const { seat } = passenger;
    this.setState(prevState => ({
      travellers: [...prevState.travellers, newPassenger],
      freeSeats: prevState.freeSeats.filter(seat => seat !== nextId)
    }));
  }

  deleteTraveller(passenger) {
	  /*Q5. Write code to delete a passenger from the traveller state variable.*/
    //console.log("delete:" ,passenger);
    this.setState(prevState => {
      const travellerIndex = prevState.travellers.findIndex(traveller => traveller.name === passenger);
      if (travellerIndex !== -1) {
        const traveller = prevState.travellers[travellerIndex];
        return {
          travellers: prevState.travellers.filter(traveller => traveller.name !== passenger),
          freeSeats: [...prevState.freeSeats, traveller.id], // 添加被释放的座位
          availableIds: [...prevState.availableIds, traveller.id] // 添加到可用 id 池
        };
      }
      alert('Traveller not found!');
      return null; // 如果没有找到旅客，不更新状态
    });
  }


  render() {
    const { selector } = this.state; // get selector
    return (
      <div>
        <h1>Ticket To Ride</h1>
	<div>
	    {/*Q2. Code for Navigation bar. Use basic buttons to create a nav bar. Use states to manage selection.*/}
      <button onClick={() => this.setSelector(1)}>Homepage</button>
      <button onClick={() => this.setSelector(2)}>Display Travellers</button>
      <button onClick={() => this.setSelector(3)}>Add Traveller</button>
      <button onClick={() => this.setSelector(4)}>Delete Traveller</button>
	</div>
	<div>
		{/*Only one of the below four divisions is rendered based on the button clicked by the user.*/}
		{/*Q2 and Q6. Code to call Instance that draws Homepage. Homepage shows Visual Representation of free seats.*/}
		{/*Q3. Code to call component that Displays Travellers.*/}
		{/*Q4. Code to call the component that adds a traveller.*/}
		{/*Q5. Code to call the component that deletes a traveller based on a given attribute.*/
    /**test1*/}
    {selector === 1 && <Homepage freeSeats={this.state.freeSeats} />}
    {selector === 2 && <Display travellers={this.state.travellers} />}
    {selector === 3 &&  <Add bookTraveller={this.bookTraveller} getNextId={this.getNextId} />}
    {selector === 4 && <Delete deleteTraveller={this.deleteTraveller} />}
	</div>
      </div>
    );
  }
}

const element = <TicketToRide />;

ReactDOM.render(element, document.getElementById('contents'));
