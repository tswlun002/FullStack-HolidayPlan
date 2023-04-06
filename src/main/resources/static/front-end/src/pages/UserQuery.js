import { Box } from "@mui/material"
import Typography from "@mui/material/Typography";

const UserQuery =  ()=>{
   console.log("Here on user query");
    return (
        <Box display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                flowDirection="column"
                >
            <Typography align="center" >
                <h2>{`User query here`}</h2>
            </Typography>

        </Box>
    )
}

export default  UserQuery;