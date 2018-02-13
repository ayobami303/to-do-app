import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css';

const TodoForm = ({addTodo}) => {
	// Input tracker

	let input;

	return (
		<div>			
			<div className ="input-group mb-3">
				<input className="form-control" placeholder="Enter a new To do item" ref={node => {
					input = node;
				}} />
				<div className="input-group-append">
			    	<button className="btn btn-info" onClick ={() => {
						addTodo(input.value);
						input.value = '';
					}}>+</button>
				</div>
			</div>
		</div>
		);
}

const TodoList = ({todos, remove}) =>{
	//Map through thr todos

	const todoNode = todos.map((todo) => {
		return (<Todo todo ={todo} key ={todo.id} remove={remove}/>)
	});
	return (<ul className="list-group">{todoNode}</ul>);
}

const Todo = ({todo, remove}) => {
	return (<li className="list-group-item" onClick={()=>{
		remove(todo.id)}
	}> {todo.text}</li>);
};

const Title = (todoCount) => {
	return (
		<div>
			<div>
				<h1>to-do ({todoCount.todoCount})</h1>
			</div>
		</div>);
};


// Container Component
// Todo Id

window.id = 0;

class TodoApp extends React.Component{
	constructor(props){
		//Pass props to parent class
		super(props);
		//Set initial state
		this.state = {
			data: []
		}

		this.apiUrl = 'https://57b1924b46b57d1100a3c3f8.mockapi.io/api/todos';
	}

	//lifecycle method
	componentDidMount(){
		//make HTTP request with axios		
		axios.get(this.apiUrl)
		.then((res) => {
			//set state with result
			this.setState({data:res.data});
		});
	}

	//Add todo handler
	addTodo(val){
		//assemble data
		const todo = {text:val}
		//update data
		axios.post(this.apiUrl, todo)
		.then((res) => {
			this.state.data.push(res.data);
			this.setState({data: this.state.data});
		});

		// this.state.data.push(todo);
		//update state
		// this.setState({data: this.state.data});
	}

	//handle remove
	handleRemove(id){
		//filter all todos except the one removed
		const remainder = this.state.data.filter((todo) => {
			if(todo.id !== id) return todo;
		});
		//update state with filter
		axios.delete(this.apiUrl+'/'+id)
		.then((res) => {			
			this.setState({data: remainder});
		})
		// this.setState({data: remainder});
	}

	render(){
		return (
			<div>
				<Title todoCount = {this.state.data.length} />
				<TodoForm addTodo={this.addTodo.bind(this)}/>
				<TodoList todos ={this.state.data} remove={this.handleRemove.bind(this)}/>
			</div>
			)
		}
}


ReactDOM.render(<TodoApp />,document.getElementById('root'));
