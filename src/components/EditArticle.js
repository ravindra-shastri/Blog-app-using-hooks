import React, { useState, useEffect } from "react";

export default function EditArticle(props) {

  const [state, setState] = useState({
    errors: '',
    slug: '',
  })

  const [article, setArticle] = useState({})

  const getArticle = ({ slug = '' } = {}) => {
    fetch(`https://mighty-oasis-08080.herokuapp.com/api/articles/${slug}`)
      .then((res) => res.json())
      .then(({ article }) => setArticle(article))
  }

  useEffect(() => {
    const { params } = props.match || {};
    setState({ ...state, slug: params.slug });
    getArticle(params);
  }, []);

  const handleChange = ({ target }) => {
    let { name, value } = target;
    setArticle({
      ...article,
      [name]: value
    });
  };

  const handleSubmit = (event) => {
    let { title, description, tags = '', body } = article;
    event.preventDefault();
    if (title && description && tags && body) {
      let c;
      try {
        c = JSON.parse(localStorage.getItem('user'))
      } catch (e) {
        c = {};
      }
      const { token = '' } = c || {};
      const { slug = '' } = article;

      fetch(`https://mighty-oasis-08080.herokuapp.com/api/articles/${slug}`, {
        method: 'PUT',
        body: JSON.stringify({
          article: {
            title, description, body,
            tagList: tags.split(',').map((tag) => tag.trim()),
          },
        }),
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        },
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
        .then(({ data }) => {
          props.history.push(`/articles/${slug}`)
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setState({ ...state, errors: 'Enter all fields' });
    }
  };

  let { title = '', description = '', tags = '', body = '' } = article;
  return (
    <form>
      <fieldset className="update-article">
        <input
          className="edit-article"
          type="text"
          value={title}
          name="title"
          placeholder="Article Title"
          onChange={handleChange}
        />
        <input
          className="edit-article"
          type="text"
          value={description}
          name="description"
          placeholder="What about this article?"
          onChange={handleChange}
        />
        <textarea
          className="edit-article"
          rows="5"
          name="body"
          value={body}
          placeholder="Write your article"
          onChange={handleChange}
        >
        </textarea>
        <input
          className="edit-article"
          type="text"
          value={tags}
          name="tags"
          placeholder="Enter tags"
          onChange={handleChange}
        />
        <div className="update-article-btn-content">
          <input
            className="update-article-btn"
            type="submit"
            value="Update Article"
            onSubmit={handleSubmit}
          />
        </div>
      </fieldset>
    </form>
  )
}
