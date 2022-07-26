import React, { useState, useEffect } from "react";
import Comment from './Comment';
export default function Comments(props) {

  const [inputText, setInputText] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getComments();
  }, []);

  const handleChange = ({ target }) => {
    let { value } = target;
    setInputText(value);
  }

  const addComment = (event) => {
    event.preventDefault();
    let slug = props.slug;
    if (inputText) {
      let c;
      try {
        c = JSON.parse(localStorage.getItem('user'))
      } catch (e) {
        c = {};
      }
      const { token = '' } = c || {};

      fetch(`https://mighty-oasis-08080.herokuapp.com/api/articles/${slug}/comments`, {
        method: 'POST',
        body: JSON.stringify({ comment: { body: inputText } }),
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        }
      })
        .then((res) => {
          if (!res.ok) {
            return res.json()
              .then((errors) => {
                return (errors);
              });
          }
          return res.json();
        })
        .then((data) => {
          setComments([])
          setInputText('')
        })
        .catch((err) => console.log(err));
    }
  }

  const handleDelete = (id) => {
    let slug = props.slug;
    let c;
    try {
      c = JSON.parse(localStorage.getItem('user'))
    } catch (e) {
      c = {};
    }
    const { token = '' } = c || {};
    fetch(`https://mighty-oasis-08080.herokuapp.com/api/articles/${slug}/comments/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) {
          return res.json()
            .then(({ errors }) => {
              return (errors);
            });
        }
        setComments('')
      })
      .catch((err) => console.log(err));
  };

  const getComments = () => {
    let slug = props.slug;
    fetch(`https://mighty-oasis-08080.herokuapp.com/api/articles/${slug}/comments`)
      .then((res) => {
        if (!res.ok) {
          return res.json()
            .then(({ errors }) => {
              return (errors);
            })
        }
        return res.json();
      })
      .then(({ comments }) => {
        setComments(comments);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div>
        <form
          onSubmit={addComment}
          className="comment-box"
        >
          <div className="comment-content">
            <textarea
              placeholder="Enter comment"
              onChange={handleChange}
              rows="1"
              value={inputText}
              name="inputText"
            >
            </textarea>
            <div>
              <input
                type="submit"
                value="Post Comment"
                className="submit-comment"
                onSubmit={addComment}
              />
            </div>
          </div>
          <div>
            <Comment
              comments={comments}
              handleDelete={handleDelete}
            />
          </div>
        </form>
      </div>
    </>
  )
}


