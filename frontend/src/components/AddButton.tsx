import "./AddButton.css";

function AddButton(toAdd) {
  return (
    <div>
      <button>
        <div className="row">
          <p className="icon">+</p>
          <p className="title">Add {toAdd.item}</p>
        </div>
      </button>
    </div>
  );
}

export default AddButton;
