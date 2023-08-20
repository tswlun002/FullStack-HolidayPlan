
import { Typography} from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomerTypography = styled(Typography)({
    width:"100%",
    marginTop:"8px",
    textTransform: "capitalize",
    textAlign: "start",

    '& label.Mui-focused': {
      color: 'black',

    },
  });
  export default  CustomerTypography;