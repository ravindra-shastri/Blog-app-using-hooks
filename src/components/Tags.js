import React, { useState, useEffect } from "react";
import Loader from "./Loader";

export default function Tags(props) {

  const [tags, setTags] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`https://mighty-oasis-08080.herokuapp.com/api/tags`)
      .then((res) => {
        if (!res.ok) {
          return res.json()
            .then(({ errors }) => {
              return (errors);
            });
        }
        return res.json();
      })
      .then(({ tags }) => {
        setTags(tags);
        setError('')
      })
      .catch((err) => {
        setError("Not able to fetch Tags");
      });
  }, []);

  const selectTag = (tag) => {
    props.selectedTag(tag);
  }

  if (error) {
    return <h4>{error}</h4>;
  }
  if (!tags) {
    return <Loader />;
  }

  return (
    <>
      <aside className="tag-main-container">
        <h6 className="tag-title">
          Popular Tags
        </h6>
        <div className="tag-container">
          {
            tags.map((tag) => {
              if (tag !== "") {
                return (
                  <span className="tag"
                    key={tag}
                    onClick={(e) => selectTag(tag)}
                    value={tag}
                  >
                    {tag}
                  </span>
                );
              } else {
                return "";
              }
            })
          }
        </div>
      </aside>
    </>
  );
}



