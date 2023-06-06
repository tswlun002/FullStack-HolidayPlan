import { styled } from '@mui/material/styles';
import { Button} from '@mui/material';

const AccountButton = styled(Button)({
    '&:hover': {
    border:"1px solid red",
    },
    '&.Mui-focused': {
    border:"1px solid red",
    },
});

export default  AccountButton;