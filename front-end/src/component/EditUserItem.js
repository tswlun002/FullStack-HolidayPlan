import CssTextField from './CssTextField';
import EditIcon from '@mui/icons-material/Edit';
import CustomerTypography from '../component/CustomerTypography'
import {Stack} from '@mui/material';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

const EditUserItem =(props)=>{
    const{componentLabel,field,IsEditFieldOpen,setIsEditFieldOpen,editIconProps,componentValue,editable, id} = props;
    return (
     <>
        <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="flex-start"
        >
            <CustomerTypography sx={{colro:"black", p:{sm:"1rem 0rem",xs:"0.1rem 0rem"}}}fontFamily={"bold"} fontSize={{sm:"1rem",xs:"0.8rem"}}align="center"> 
                {`${componentLabel}:  ${componentValue||"loading ..."}`}
            </CustomerTypography>
            {   editable&&( IsEditFieldOpen?< CloseIcon sx={editIconProps} onClick={()=>setIsEditFieldOpen({[field]:!IsEditFieldOpen})}/>:
                <EditIcon sx={{...editIconProps,fontSize:{xs:"1rem",sm:"1.5rem"}}} onClick={()=>setIsEditFieldOpen({[field]:!IsEditFieldOpen})}/>)
            }
        </Stack>
       {
        <Collapse in={IsEditFieldOpen} timeout="auto" unmountOnExit>
            <CssTextField
                {...props}
                focus={true}
                key={id}
                sx={{marginTop:"4px"}}
            />
        </Collapse>
       }
       
     </>
    )
}
export default EditUserItem;