import React from 'react';
export default class Comment extends React.Component {

  getDate = (date) => {
    let newDate = new Date(date).toISOString().split('T')[0];
    return newDate;
  }
  render() {
    let comments = this.props.comments;
    return (
      <>
        <div>
          {comments.length > 0 ? (
            comments.map((comment) => {
              return (
                <div key={comment.createdAt}>
                  <div>
                    <img src={comment.author.image}
                      alt={comment.author.username}
                    />
                  </div>
                  <div>
                    <h3>
                      {comment.author.username}
                    </h3>
                    <h3>
                      {comment.createdAt}
                    </h3>
                  </div>
                  <div>
                    <button
                      onClick={(e) => this.props.handleDelete(comment.id)}
                    >
                      <i className="fa-solid fa-trash-can">
                      </i>
                    </button>
                  </div>
                  <p>
                    {comment.body}
                  </p>
                </div>
              )
            })
          ) :
            <div className="no-comment">
              < h2 className="no-comment-msg" >
                No comments yet
              </h2>
            </div>
          }
        </div>
      </>
    );
  }
}

