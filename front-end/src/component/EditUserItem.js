import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CssTextField from './CssTextField';
import EditIcon from '@mui/icons-material/Edit';
import CustomerTypography from '../component/CustomerTypography'
import {Stack} from '@mui/material';
import Collapse from '@mui/material/Collapse';

const EditUserItem =(props)=>{
    const{componentLabel,field,IsEditFieldOpen,setIsEditFieldOpen,editIconProps,componentValue} = props;
    return (
     <>
        <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="flex-start"
        >
            <CustomerTypography  fontSize={"1rem"}align="center"> <h4>{`${componentLabel}:  ${componentValue}`}</h4></CustomerTypography>
            {IsEditFieldOpen?< VisibilityOffIcon sx={editIconProps} onClick={()=>setIsEditFieldOpen({[field]:!IsEditFieldOpen})}/>:
                <EditIcon sx={editIconProps} onClick={()=>setIsEditFieldOpen({[field]:!IsEditFieldOpen})}/>
            }
        </Stack>
       {
        <Collapse in={IsEditFieldOpen} timeout="auto" unmountOnExit>
            <CssTextField
                {...props}
                sx={{marginTop:"4px"}}
            />
        </Collapse>
       }
       
     </>
    )
}
export default EditUserItem;