import React from "react";
import axios from "axios";

class Login extends React.Component {
	constructor() {
		super()
		this.state = {
			username: "",
			password: ""
		}
	}

	loginProcess(event) {
		event.preventDefault()
		let endpoint = "http://localhost:8000/api/login";

		let request = {
			username: this.state.username,
			password: this.state.password
		};

		axios
			.post(endpoint, request)
			.then(result => {
				if (result.data.logged) {
					// simpan token di local storage
					localStorage.setItem("token", result.data.token);
					localStorage.setItem(
						"user", JSON.stringify(result.data.user));
					// window.alert("Congratulation! You're logged")
					window.location.href = "/"
				} else {
					window.alert("Maaf, username dan password Anda salah")
				}
			})
			.catch(error => console.log(error))
	}

	render() {
		return (
			<div className="bg-dark" style={{ height: "100vh" }}>
				<div className="container" style={{ width: "75%" }}>
				<br /><br /><br />
				<div className="col-lg-6" style={{marginLeft: "25%", marginTop: "10%"}}
					>
					<div className="card">
						<div className="card-header bg-secondary">
							<h4 className="text-white text-center">Login</h4>
						</div>
						<div className="card-body">
							<form onSubmit={ev => this.loginProcess(ev)}>
								Username
								<input type="text" className="form-control mb-2"
									required value={this.state.username}
									onChange={ev => this.setState({ username: ev.target.value })}
								/>

								Password
								<input type="password" className="form-control mb-2"
									required value={this.state.password}
									onChange={ev => this.setState({ password: ev.target.value })}
								/>

								<button type="submit" className="btn btn-secondary">
									Login
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
			</div>
			
		)
	}

}

export default Login