import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InputAdornment from '@mui/material/InputAdornment';
import {IconButton} from '@mui/material';


export default function PasswordVisibility({dispatcher,fieldData,isVisible}){

   return(
       <InputAdornment   sx={{padding:"0.1rem",}} position="end">
            <IconButton
              onClick={()=>dispatcher({[fieldData]:!isVisible})}
           >
            {isVisible?<VisibilityIcon/>:<VisibilityOffIcon/>}
            </IconButton>
       </InputAdornment>
   )
}
