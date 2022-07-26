import React, { useState } from "react";
import { Link } from 'react-router-dom';

export default function Login() {
  const [state, setState] = useState({
    email: "",
    password: "",
    errors: {
      email: "",
      password: "",
    }
  });

  const handleChange = ({ target }) => {
    let { name, value } = target;
    let { errors } = state;
    setState({...state, [name]: value, errors });
  };

  const handleSubmit = (event) => {
    let { email, password } = state
    event.preventDefault();
    if (password && email) {
      fetch(`https://mighty-oasis-08080.herokuapp.com/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: {
            password, email
          }
        }),
      })
        .then((res) => {
          if (!res.ok) {
            return res.json()
              .then(({ errors }) => {
                return (errors);
              });
          }
          return res.json();
        })
        .then(({ user }) => {
          localStorage.setItem('user', JSON.stringify(user));
          setState({
            ...state,
            password: "",
            email: ""
          });
        })
        .catch((error) => {
          setState({...state, errors: { email: "Email or Password is incorrect" } })
        })
    }
  }

  let { email, password } = state.errors;

  return (
    <>
      <div>
        <div className="signin-header">
          <h2>
            Sign In
          </h2>
          <Link
            className="para"
            to="/signup"
          >
            <p>
              Need an account?
            </p>
          </Link>
        </div>
        <form
          onSubmit={handleSubmit}
          className="form-signin"
        >
          <input
            type="email"
            className="input"
            pattern="[/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/],
             'Please enter a valid email address'"
            name="email"
            id="email"
            placeholder="Email"
            value={state.email}
            onChange={(e) => handleChange(e)}
            required
          />
          <span>
            {email}
          </span>
          <input
            type="password"
            id="password"
            className="input"
            placeholder="Enter Password"
            value={state.password}
            name="password"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
            title="Must contain at least one number
               and one uppercase and lowercase letter,
                and at least 6 or more characters"
            onChange={(e) => handleChange(e)}
            required />
          <span>
            {password}
          </span>
          <div className="btn">
            <input
              className="signup-btn submit"
              type="submit"
              value="Login"
              disabled={password || email}
            />
          </div>
        </form>
      </div>
    </>
  )
}
