import "./App.css";
import Card from "./components/Card";
import Actions from "./components/Actions";
import CertificateSvg from "./assets/certificate.svg";
import LicenseSvg from "./assets/license.svg";
import QualificationSvg from "./assets/qualification.svg";
import SkillSvg from "./assets/skill.svg";
import TrainingSvg from "./assets/training.svg";

function App() {
  return (
    <div>
      <div className="cards">
        <div>
          <Card item="Certificates" icon={CertificateSvg} />
        </div>
        <div>
          <Card item="Skills" icon={SkillSvg} />
        </div>
        <div>
          <Card item="Trainings" icon={TrainingSvg} />
        </div>
        <div>
          <Card item="Licences" icon={LicenseSvg} />
        </div>
        <div>
          <Card item="Qualifications" icon={QualificationSvg} />
        </div>
      </div>
      <div className="quickActions">
        <Actions />
      </div>
    </div>
  );
}

export default App;
