import "./Card.css";

function Card(toAdd) {
  return (
    <div className="card">
      <div className="row">
        <p className="title">Total {toAdd.item}</p>
        <img className="icon" src={toAdd.icon} alt="svg" />
      </div>
      <p className="amount">29</p>
    </div>
  );
}

export default Card;
