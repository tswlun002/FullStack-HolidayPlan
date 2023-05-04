import Typography from '@mui/material/Typography';
const ErrorComponent = ({errorMessage})=>{
   return <Typography sx={{padding:"3rem",zIndex:1,backgroundColor:"white",color:"red"}} align="center" variant="body">
                     {errorMessage}
           </Typography>;
}

export default  ErrorComponent;
