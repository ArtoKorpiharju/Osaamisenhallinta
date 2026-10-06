import "./App.css";
import Card from "./components/Card";
import QuickActions from "./components/QuickActions";
import Box from "@mui/material/Box";

function App() {
  const cards: string[] = [
    "Certificates",
    "Skills",
    "Trainings",
    "Licenses",
    "Qualifications",
  ];
  const cardComponents = [];

  cards.forEach((card) => {
    cardComponents.push(<Card item={card} />);
  });

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
