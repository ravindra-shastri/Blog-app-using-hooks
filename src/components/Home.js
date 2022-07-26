import React, { useState, useEffect } from "react";
import Tags from "./Tags";
import ArticlePagination from "./ArticlePagination";
import { Link } from 'react-router-dom';
const LIMIT = 10;

export default function Home() {

  const [state, setState] = useState({
    articles: [],
    articlesCount: 0,
    activePage: 1,
    activetag: ""
  })

  const getArticles = ({ tag = '' } = {}) => {
    const { activePage = 1 } = state || {};
    const offset = tag ? 0 : ((activePage - 1) * LIMIT);

    let c;
    try {
      c = JSON.parse(localStorage.getItem('user'))
    } catch (e) {
      c = {};
    }

    const { token = '' } = c || {};
    fetch(`https://mighty-oasis-08080.herokuapp.com/api/articles?limit=${LIMIT}
    &offset=${offset}${tag ? `&tag=${tag}` : ''}`, {
      headers: {
        Authorization: `Token ${token}`,
      }
    })
      .then((res) => res.json())
      .then(({ articles, articlesCount }) => {
        setState(state => ({ ...state, articles, articlesCount }))
      })
  }

  // Called on load. So no initial tag is available
  useEffect(() => {
    getArticles()
  }, []);

  const getDate = (date) => {
    let newdate = new Date(date).toISOString().split("T")[0];
    return newdate;
  }

  const handleCurrentPage = (index) => {
    setState(state => ({
      ...state,
      activePage: index,
    }));
  }

  // Called when page is changed
  useEffect(() => {
    getArticles({ tag: state.activetag });
  }, [state.activePage]);

  // Called when tag is removed or added new tag
  useEffect(() => {
    getArticles({ tag: state.activetag });
  }, [state.activetag]);

  const handleFavorite = (article) => {
    const { slug, favorited } = article;

    let method = favorited ? 'DELETE' : 'POST';
    let c;
    try {
      c = JSON.parse(localStorage.getItem('user'))
    } catch (e) {
      c = {};
    }
    const { token = '' } = c || {};

    fetch(`https://mighty-oasis-08080.herokuapp.com/api/articles/${slug}/favorite`, {
      method: method,
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json()
            .then(({ errors }) => {
              return (errors);
            });
        }
        return getArticles()
      })
      .catch((err) => console.log(err));
  };

  const removeTag = () => {
    setState(state => ({ ...state, activetag: "" }));
  }

  const selectedTag = (tag) => {
    setState(state => ({ ...state, activetag: tag }));
  }


  return (
    <>
      <div className="header-container">
        <h2 className="header">
          Welcome to Blog App <br />
          <span className="header-span">
            A place to share your knowledge.
          </span>
        </h2>
      </div>
      <div className="article-tag-container">
        <div className="article-display-card">
          <div className="feed-card">
            <h6 onClick={() => removeTag()}>
              <Link className="feed" to="/">
                Global Feed
              </Link>
            </h6>
            {state.activetag && (
              <h6>
                <Link className="feed" to="/">
                  # {state.activetag}
                </Link>
              </h6>
            )}
          </div>
          <hr className="feed-hr-line" />
          {state.articles.map((article) =>
            <div className="author-container" key={article.slug}>
              <div className="author-img-container">
                <div key={article}>
                  <Link className="link"
                    to={`/profiles/${article.author.username}`}
                  >
                    <button className="author-img-content-home">
                      <div>
                        <img
                          className="author-img"
                          src={article.author.image}
                          alt="author"
                        />
                      </div>
                      <div className="author-name-date">
                        <h2 className="home-author-name">
                          {article.author.username}
                        </h2>
                        <p className="article-date">
                          {getDate(article.createdAt)}
                        </p>
                      </div>
                    </button>
                  </Link>
                </div>
                <p
                  className="like"
                  onClick={() => handleFavorite(article)}
                >
                  <i className="fa-solid fa-heart like-icon"> 
                    <span className="like-span">
                      {article.favoritesCount}
                    </span>
                  </i>
                </p>
              </div>
              <Link className="link"
                to={`/articles/${article.slug}`}
              >
                <button className="author-description-btn-home">
                  <div className="author-desc">
                    <h2 className="author-title">
                      {article.title}
                    </h2>
                    <p className="author-description">
                      {article.description}
                    </p>
                  </div>
                  <div className="read-more-content">
                    <p className="read-more-btn">
                      Read More ...
                    </p>
                    <p className="taglist">
                      {article.tagList}
                    </p>
                  </div>
                </button>
              </Link>
              <hr className="hr-line" />
            </div>
          )
          }
        </div>
        <div>
          <Tags
            getArticles={getArticles}
            selectedTag={selectedTag}
          />
        </div>
      </div>
      <ArticlePagination
        activePage={state.activePage}
        totalPage={Math.ceil(state.articlesCount / LIMIT)}
        handleCurrentPage={handleCurrentPage}
      />
    </>
  )
};







