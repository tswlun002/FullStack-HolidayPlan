import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const ColorButton = styled(Button)(({ theme }) => ({
    color: "white",
    backgroundColor: "rgba(102, 51, 153, 0.85)",
    '&:hover': {
      backgroundColor: "blue",
    },
    
  }));
  export default ColorButton;