import React, { useState } from "react";
export default function Settings(props) {
 
  const [state, setState] = useState({
    image: "",
    username: "",
    email: "",
    password: "",
    bio: "",
    errors: {
      username: "",
      email: "",
      password: "",
    }
  })

  const handleChange = ({ target }) => {
    let { name, value } = target;
    let { errors } = state;
    setState({...state, [name]: value, errors });
  };

  const handleSubmit = (event) => {
    let {
      username,
      image,
      password,
      email,
      bio,
      errors
    } = state;
    event.preventDefault();
    if (username
      && image
      && password
      && email
      && bio) {
      fetch("https://mighty-oasis-08080.herokuapp.com/api/user", {
        method: 'PUT',
        body: JSON.stringify({
          user: {
            username,
            email,
            password,
            bio,
            image
          }
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            return res.json()
              .then((data) => {
                for (let key in data.errors) {
                  errors[key] =
                    `${key} ${data.errors[key]}`;
                }
                return ({ errors });
              });
          }
          return res.json();
        })
        .then((data) => {
          props.history.push(`/profiles/${data.user.username}`);
        })
        .catch((err) => setState({...state, errors }));
    }
  }
  
  let {
    username,
    email,
    password
  } = state.errors;

  return (
    <>
      <div>
        <form
          className="setting-form"
          onSubmit={handleSubmit}
        >
          <h4>
            Settings
          </h4>
          <fieldset className="setting-fieldset">
            <input
              type="text"
              placeholder="Image Url"
              value={state.image}
              onChange={handleChange}
              name="image"
              className="setting-input"
            />
            <input
              type="text"
              placeholder="Username"
              value={state.username}
              onChange={handleChange}
              name="username"
              className="setting-input"
            />
            <span>
              {username}
            </span>
            <input
              type="email"
              name="email"
              value={state.email}
              onChange={handleChange}
              placeholder="Email"
              pattern=" [/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/],
             'Please enter a valid email address'"
              className="setting-input"
            />
            <span>
              {email}
            </span>
            <input
              type="password"
              name="password"
              placeholder="password"
              value={state.password}
              onChange={handleChange}
              className="setting-input"
            />
            <span>
              {password}
            </span>
            <textarea
              type="text"
              name="bio"
              placeholder="Enter  your bio"
              rows="10"
              value={state.bio}
              onChange={handleChange}
              className="setting-input"
            >
            </textarea>
            <input
              type="submit"
              name="submit"
              value="Update"
              className="btn update-btn"
            />
          </fieldset>
        </form>
      </div>
    </>
  )
}

