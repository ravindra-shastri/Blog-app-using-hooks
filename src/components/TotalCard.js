import React from 'react';
import Card from './Card'

export default class TotalCard extends React.Component {
  
  render() {
    let totaldata = this.props.data
    console.log(totaldata)
    return (
      <div className="card-content">
        {
          totaldata.map((data, i) => {
            return <Card {...data} key={data.id} score={i + 1} />
          })
        }
      </div>
    )
  }
}