import { Box, Typography } from "@mui/material";


const MissingPage =()=>{
   return (
    <Box display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          margin="0% 15%"
          flowDirection="column">
        <Typography align="center"><h2>404</h2></Typography>
        <br/>
        <Typography align="center"><h2>Page is not found</h2></Typography>

    </Box>
   )
}

export default MissingPage;