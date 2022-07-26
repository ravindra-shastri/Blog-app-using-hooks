import React, { useState } from "react";
import { Link } from 'react-router-dom';

export default function SignupPage(props) {

  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    errors: {
      username: "",
      email: "",
      password: "",
    }
  })

  const handleChange = ({ target }) => {
    let { name, value } = target;
    let errors = state.errors;
    setState({...state, [name]: value, errors });
  };

  const handleSubmit = (event) => {
    let {
      email,
      password,
      username,
      errors
    } = state;
    event.preventDefault();
    if (
      username
      && password
      && email
    ) {
      fetch(`https://mighty-oasis-08080.herokuapp.com/api/users`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          user: {
            username,
            password,
            email
          }
        }),
      })
        .then((res) => {
          if (!res.ok) {
            return res.json()
              .then((data) => {
                for (let key in data.errors) {
                  errors[key] =
                    `${key} ${data.errors[key]}`;
                }
                return (errors);
              });
          }
          return res.json();
        })
        .catch((errors) =>
          setState({...state, errors }));
    }
  };

    let {
      username,
      password,
      email
    } = state.errors;
    
    return (
      <>
        <div>
          <div className="signup-header">
            <h2>
              Sign Up
            </h2>
            <Link className="para" to="/login">
              <p>
                Have an account?
              </p>
            </Link>
          </div>
          <form
            onSubmit={handleSubmit}
            className="form-signup"
          >
            <input
              type="text"
              name="username"
              className="input"
              id="username"
              placeholder="Enter Username"
              value={state.username}
              onChange={(e) => handleChange(e)}
              min="6"
              max="20"
            />
            <span> {username} </span>

            <input
              type="email"
              pattern=" [/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/],
              'Please enter a valid email address'"
              name="email"
              id="email"
              className="input"
              placeholder="Enter Email"
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
              placeholder=" Enter Password"
              value={state.password}
              name="password"
              onChange={(e) => handleChange(e)}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
              title="Must contain at least
               one number and 
               one uppercase and 
               lowercase letter, and
               at least 6 or more characters"
              required
            />
            <span>
              {password}
            </span>
            <div className="btn">
              <input
                type="submit"
                className="signup-btn"
                value="Sign Up"
                disabled={username || email || password}
              />
            </div>
          </form>
        </div>
      </>
    )
  }
