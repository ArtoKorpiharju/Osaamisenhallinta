import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

function Actions() {
  const addButtons: string[] = ["Competence", "Qualification"];
  const buttonComponents = [];
  addButtons.forEach((button) => {
    buttonComponents.push(
      <Button
        sx={{
          textTransform: "none",
          color: "black",
          backgroundColor: "white",
          padding: "10px 40px 10px 15px",
          maxWidth: "250px",
          borderRadius: "4px",
          display: "flex",
          gap: "10px",
          "&:hover": {
            backgroundColor: "#C9CFD5",
          },
        }}
      >
        <AddIcon />
        <Typography sx={{ fontWeight: 700 }}>Add {button}</Typography>
      </Button>,
    );
  });

  return (
    <Box
      sx={{
        backgroundColor: "#E4ECF3",
        border: "1px solid #C9CFD5",
        display: "inline-flex",
        flexDirection: "column",
        padding: "10px 30px 20px 15px",
        borderRadius: "4px",
      }}
    >
      <Typography
        sx={{
          fontSize: 21,
          fontWeight: 700,
        }}
      >
        Quick actions
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          marginTop: "10px",
          gap: "20px",
        }}
      >
        {buttonComponents}
      </Box>
    </Box>
  );
}

export default Actions;
