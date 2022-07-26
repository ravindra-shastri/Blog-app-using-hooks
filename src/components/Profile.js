import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import ArticlePagination from './ArticlePagination';
import UserArticle from './UserArticle';

export default function Profile(props) {

  const [state, setState] = useState({
    loading: false,
    user: "",
    articles: [],
    articlesCount: null,
    articlesPerPage: 10,
    activePage: 1,
    feedSelected: 'author',
    error: '',
  })

  const [profileData, setProfileData] = useState({});

  const getProfile = ({ username = "" } = {}) => {
    setState({ ...state, loading: true });
    let c;
    try {
      c = JSON.parse(localStorage.getItem('user'))
    } catch (e) {
      c = {};
    }
    const { token = '' } = c || {};
    fetch(`https://mighty-oasis-08080.herokuapp.com/api/profiles/${username}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then(({ profile }) => {
        setState({ ...state, profile })
        setProfileData(profile);
      })
      .finally(() => {
        setState({ ...state, loading: false })
      })
  }

  useEffect(() => {
    const { match: { params: { id = '' } = {} } = {} } = props || {};
    getProfile({ username: id });
  }, []);

  const handleClick = ({ target }) => {
    let { id } = target.dataset;
    setState({ ...state, activePage: id })
  };

  const updateCurrentPage = (index) => {
    setState({ ...state, activePage: index });
  };

  const handleFollow = () => {
    let { username, following } = profileData;
    let method = following ? 'DELETE' : 'POST';
    let c;
    try {
      c = JSON.parse(localStorage.getItem('user'))
    } catch (e) {
      c = {};
    }
    const { token = '' } = c || {};
    fetch(`https://mighty-oasis-08080.herokuapp.com/api/profiles/${username}/follow`, {
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
        return res.json();
      })
      .then(({ profile }) => {
        setState({ ...state, profile });
        setProfileData(profile);
      })
      .catch((err) => console.log(err));
  };

  let profile = profileData;
  let { articles, articlesCount, articlesPerPage,
    activePage, feedSelected, error } = state;
  return (
    <>
      <div>
        <header className="profile-header">
          <div>
            <img
              className="profile-img"
              src={profile.image}
              alt={profile.username}
            />
          </div>
          <div className="profile-user">
            {profile.username}
          </div>
          <div className="profile-bio">
            {profile.bio}
          </div>
          <div className="edit-profile">
            <button
              onClick={handleFollow}
            >
              <i
                className={!profile.following ?
                  "fas fa-plus mr-2" : "fas fa-minus mr-2"}
              >
              </i>
              {!profile.following ? 'follow ' : 'unfollow '}
              {profile.username}
            </button>
          </div>
        </header>
        <div className="edit-profile">
          <Link to="/settings">
            <button>
              <i className="fas fa-user-edit mr-2"></i>
              Edit Profile
            </button>
          </Link>
        </div>
        <article className="profile-article">
          <div>
            <span
              className=
              {feedSelected === 'author' ? "active" : ""}
              onClick={() =>
                setState({ ...state, feedSelected: 'author', activePage: 1 })}>
              <div className="feed">
                My Article
              </div>
            </span>
            <span
              className={feedSelected === 'favorited' ? 'favorited' : ''}
              onClick={() =>
                setState({ ...state, feedSelected: 'favorited', activePage: 1 })}
            >
              <div className="feed" to="/">
                Favorited Articles
              </div>
            </span>
          </div>
          <div>
            <UserArticle
              articles={articles}
              error={error}
              {...props}
            />
          </div>
        </article>
        <div>
          <ArticlePagination
            articlesCount={articlesCount}
            articlesPerPage={articlesPerPage}
            activePage={activePage}
            handleClick={handleClick}
            updateCurrentPage={updateCurrentPage}
          />
        </div>
      </div >
    </>
  )
}






