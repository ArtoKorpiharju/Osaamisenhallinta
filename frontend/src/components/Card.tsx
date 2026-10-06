import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AbcIcon from "@mui/icons-material/Abc";

function Card(toAdd) {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        display: "inline-block",
        padding: "10px 15px 20px",
        borderLeft: "3px solid #034182",
        borderRadius: "4px",
        minWidth: "160px",
        flex: "1 1 0px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <Typography sx={{ fontWeight: 700 }}>Total {toAdd.item}</Typography>
        <AbcIcon />
      </Box>

      <Typography sx={{ fontSize: 21 }}>29</Typography>
    </Box>
  );
}

export default Card;
