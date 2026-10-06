import "./App.css";
import Card from "./components/Card";
import QuickActions from "./components/QuickActions";
import Box from "@mui/material/Box";
import type { SvgIconComponent } from "@mui/icons-material";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";

function App() {
  let cards = new Map<string, SvgIconComponent>([
    ["Certificates", AttachFileIcon],
    ["Skills", DirectionsWalkIcon],
    ["Trainings", Diversity1Icon],
    ["Licenses", FolderOpenIcon],
    ["Qualifications", SensorOccupiedIcon],
  ]);
  const cardComponents = Array.from(cards).map(([item, Icon]) => (
    <Card key={item} item={item} icon={Icon} />
  ));

  return (
    <div>
      <Box sx={{ display: "flex", gap: "25px" }}>{cardComponents}</Box>
      <Box sx={{ marginTop: "25px" }}>
        <QuickActions />
      </Box>
    </div>
  );
}

export default App;
