import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CssTextField from './CssTextField';
import EditIcon from '@mui/icons-material/Edit';
import CustomerTypography from '../component/CustomerTypography'
import {Stack} from '@mui/material';
const EditUserItem =(props)=>{
    const{componentLabel,field,IsEditFieldOpen,setIsEditFieldOpen,editIconProps} = props;
    return (
     <>
        <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="flex-start"
        >
            <CustomerTypography  align="center"> <h2>{componentLabel}</h2></CustomerTypography>
            {IsEditFieldOpen?< VisibilityOffIcon sx={editIconProps} onClick={()=>setIsEditFieldOpen({[field]:!IsEditFieldOpen})}/>:
                <EditIcon sx={editIconProps} onClick={()=>setIsEditFieldOpen({[field]:!IsEditFieldOpen})}/>
            }
        </Stack>
       {
        IsEditFieldOpen&&
        <CssTextField
            {...props}
        />
       }
       
     </>
    )
}
export default EditUserItem;