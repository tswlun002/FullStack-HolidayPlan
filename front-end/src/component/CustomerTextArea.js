
import { TextField} from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomerTextArea = styled(TextField)({
    width:"100%",
    marginTop:"8px",
    '& label.Mui-focused': {
      color: 'black',

    },

    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        border:"1px solid transparent",
        borderBottom:'1.5px solid blueviolet',


      },
      '&.Mui-focused fieldset': {
        border:"1px solid transparent",
        borderBottom:'1.5px solid blueviolet',


      },
      '& fieldset': {
        border:"1px solid transparent",
        borderBottom:'1px solid black',
      },
    },
  });
  export default  CustomerTextArea;