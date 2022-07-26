import React, { useState } from "react";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import "../index.css";
import 'react-markdown-editor-lite/lib/index.css';

export default function AddArticle(props) {

  const [state, setState] = useState({
    title: '',
    description: '',
    tags: '',
    body: '',
    error: '',
  })

  const handleChange = ({ target }) => {
    let { name, value } = target;
    setState({...state, [name]: value });
  };

  const handleSubmit = (event) => {
    let { title, description, tags, body } = state;
    tags = tags.split(',').map((tag) => tag.trim());
    event.preventDefault();
    if (title && description && tags && body) {
      let c;
      try {
        c = JSON.parse(localStorage.getItem('user'))
      } catch (e) {
        c = {};
      }
      const { token = '' } = c || {};
      fetch("https://mighty-oasis-08080.herokuapp.com/api/articles", {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          article: {
            title,
            description,
            body,
            tagList: tags
          },
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
        .then((data) => {
          props.history.push(`/articles/${data.article.slug}`);
        })
        .catch((err) => {
          setState({
            ...state,
            title: '',
            description: '',
            body: '',
            tags: '',
            error: '',
          });
        });
    } else {
      setState({
        ...state,
        title: '',
        description: '',
        body: '',
        tags: '',
        error: 'None of the field should be empty',
      });
    }
  }

  const handleEditorChange = ({ html, text }) => {
    setState({
      ...state,
      body: html,
    });
  };

  const clearEdit = ({ html, text }) => {
    return html = ""
  }

  const mdParser = new MarkdownIt();
  return (
    <>
      <div>
        <h2 className="new-article-header">
          Add New Article
        </h2>
        <form
          onSubmit={handleSubmit}
          className="new-article-container"
        >
          <input
            type="text"
            placeholder="Enter your Title"
            value={state.title}
            name="title"
            onChange={(e) => handleChange(e)}
            className="new-article-input"
          />
          <input
            type="text"
            placeholder="Enter Description"
            value={state.description}
            name="description"
            onChange={(e) => handleChange(e)}
            className="new-article-input"
          />
          <input
            type="text"
            placeholder="Enter Tags"
            value={state.tags}
            name="tags"
            onChange={(e) => handleChange(e)}
            className="new-article-input"
          />
          <MdEditor
            style={{ height: '500px' }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={(e) => handleEditorChange(e)}
            onSubmit={clearEdit}
            className="mdeditor"
          />

          <div className="new-article-btn">
            <input
              type="submit"
              value="Publish Article"
              className="signup-btn"
            />
          </div>
        </form>
      </div>
    </>
  )
}


