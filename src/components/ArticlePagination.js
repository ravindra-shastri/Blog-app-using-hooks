import React from 'react';
export default class ArticlePagination extends React.Component {

  render() {
    let {
      activePage,
      handleCurrentPage,
      totalPage
    } = this.props;

    let pagesArray = [];
    for (let i = 1; i <= totalPage; i++) {
      pagesArray.push(i);
    }

    return (
      <>
        <div className="page-container">
          <div>
            <button
              className="prev-btn"
              onClick={() =>
                handleCurrentPage(activePage - 1)}
              disabled={activePage <= 1}
            >
              {"Prev"}
            </button>
          </div>
          <div className="pagination-num">
            {pagesArray.map((page, index) =>
              <span
                key={page}
                className={activePage === page ? "active" : "page"}
                onClick={() => handleCurrentPage(page)}
              >
                {page}
              </span>
            )}
          </div>
          <div>
            {
              <button
                className="next-btn"
                onClick={() => handleCurrentPage(activePage + 1)}
                disabled={activePage >= totalPage}
              >
                {"Next"}
              </button>
            }
          </div>
        </div>
      </>
    )
  }
}
