import "./Actions.css";
import AddButton from "./AddButton";

function Actions() {
  return (
    <div className="actions">
      <p className="header">Quick actions</p>
      <div className="addButtons">
        <div>
          <AddButton item="Competence" />
        </div>
        <div>
          <AddButton item="Qualification" />
        </div>
      </div>
    </div>
  );
}

export default Actions;
