import * as React from 'react';
import './QueryCard.css';
import IconButton from '@mui/material/IconButton';
import  {FaTrash} from 'react-icons/fa'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CustomerTypography from './CustomerTypography'
import { Button ,CardActions, Box,Stack} from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import {CreateAuthContext} from '../context/CreateAuthContext';
import UseAxiosPrivate from '../utils/UseAxiosPrivate'
import { FormControl,RadioGroup, FormControlLabel,Radio,FormLabel } from '@mui/material';
import CustomerTextArea from'../component/CustomerTextArea'
import {SendQueryResponse,DeleteQuery} from '../utils/Query'
const header_background  ="linear-gradient(to right,rgba(145, 111, 179, 0.5),rgba(102, 51, 153, 0.85),rgba(77,26,127  , 0.90),rgba(155, 104, 207, 0.6))!important";

const QueryStatusActions = ({queryState, dispatchQuery, disAbled})=>{
    return(
    <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">Query Status</FormLabel>
        <RadioGroup  className='radio-group'
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            onChange={(event)=>{dispatchQuery({queryStatus:event.target.value}); console.log(event.target.value);}}
            value={queryState.queryStatus}
            >
            <div className='radio-group'style={{display:"flex"}}>
                <FormControlLabel disabled={disAbled} value="ACTIVE"  control={<Radio  />} label="Active" />
                <FormControlLabel disabled={disAbled} value="SOLVED"  control={<Radio  />} label="Solved" />
            </div>
        </RadioGroup>
    </FormControl>)
}

const QueryCard = ({data, index, updateQueryCard,deleteQueryCard})=> {
     const {querySummary, queryDescription,date,queryStatus}=data;
    const{userLoginState} = React.useContext(CreateAuthContext)

    const useAxiosPrivate = UseAxiosPrivate();

     const [ queryState, dispatchQuery] = React.useReducer((state, action)=>{
        return {...state, ...action}
     }, {
         response:"",
         queryStatus:queryStatus,
         isResponseError:false,
         errorMessage:"",
         isResponseSuccess:false,
         querySentStatus:""
     })
    

    React.useEffect(()=>{
       if(queryState.isResponseSuccess &&  userLoginState.userType==="USER"){
              setTimeout(()=>{
                    deleteQueryCard(index);
              }, 1000)
       }
       if(queryState.isResponseSuccess && userLoginState.userType==="ADMIN"){
            dispatchQuery({querySentStatus:"Query response sent successfully"});
       }

    },[queryState.isResponseSuccess])

    const onSubmit =(e)=>{

        e.preventDefault();
        if(userLoginState.userType==="ADMIN"){
            if(queryState.response.trim() ==="" || queryState.queryStatus.trim() ===""){
               dispatchQuery({isResponseError:true, errorMessage:"All fields are required"})
            }else{

                SendQueryResponse(data.user.username, data.id,useAxiosPrivate, queryState, dispatchQuery)
                if(queryState.isResponseSuccess){
                   updateQueryCard(index);
                }
            }
        }else if(userLoginState.userType==="USER"){
            DeleteQuery(useAxiosPrivate,data.id, dispatchQuery)
        }
    }



    return (

  
    <Card key={data.id} sx={{ maxWidth: 400,  margin:"1%",
       paddingBottom:"1rem" ,display:"block", minWidth:"20rem"}}>
       <CardContent>
         <CustomerTypography
           direction="row"
            justifyContent="start"
            alignItems="start"
            flowdirection="row"
            spacing={2}
            sx={{     background:header_background,padding:"1rem 0rem", width:"100%",}}
            >
                <span style={{padding:"0rem 2rem"}}>  Query From: {
                     data.user?.firstname && data.user?.lastname  &&
                    `${data.user?.firstname}  ${data.user?.lastname }`
                    }
                </span>
         </CustomerTypography>


         <CustomerTypography gutterBottom variant="h7" component="div" align="center">
            Date:{data.localDateTime}

          </CustomerTypography>

          <CustomerTypography sx={{fontWeight: "bold"}}  gutterBottom variant="h7" component="div" align="center">
               Query Summary:
          </CustomerTypography>
           <CustomerTypography>
               {querySummary}
          </CustomerTypography>
          <CustomerTypography  sx={{fontWeight: "bold"}}   gutterBottom variant="h7" component="div" align="center">
           Query description:
          </CustomerTypography>
          <CustomerTypography>
               {queryDescription}
           </CustomerTypography>
          
          {

             ( queryState.queryStatus==="ACTIVE" && userLoginState.userType==="ADMIN" )?
              <CardActions>
                  <CustomerTextArea
                        disabled={userLoginState.userType==="USER" || (
                        userLoginState.userType==="ADMIN" && queryState.queryStatus==="SOLVED") }
                        width ="100%"
                        required
                        multiline={true}
                        maxRows="10"
                        focused
                        minRows="2"
                        helpertext=""
                        id="demo-helper-text-aligned"
                        label="Response"
                        variant="outlined"
                        color="secondary" type="text" className=" Response-input" placeholder="Enter full  Response"
                        autoComplete='new-Response' value={queryState.response}
                        onChange={(e)=>dispatchQuery({ response:e.target.value,isResponseError:false})}/>
              </CardActions>:
              <>
                  <CustomerTypography  sx={{fontWeight: "bold"}}   gutterBottom variant="h7" component="div" align="center">
                    Query Response:
                   </CustomerTypography>
                   <CustomerTypography>
                        {data.response}
                   </CustomerTypography>
               </>

          }
          <CardActions sx={{display:userLoginState.userType==="ADMIN"?"block":"flex"}}>

              <QueryStatusActions sx={{marginRight:"auto !important"}}  disAbled={userLoginState.userType==="USER"} queryState={queryState} dispatchQuery={dispatchQuery} />
            {

              userLoginState.userType==="ADMIN"?
              <Button   disabled={queryState.response.trim()==='' || queryState.queryStatus==="ACTIVE" ?true:false} variant="outlined" size="small" color="primary" onClick={onSubmit}>
                    Send Response
              </Button>
               :
               userLoginState.userType==="USER"&&
               <IconButton variant="outlined" size="small" className="delete-query" sx={{color:"red",marginLeft:"auto",maxWidth:"10%"}} onClick={onSubmit}>
                 {<FaTrash/>}
                </IconButton>
            }
          </CardActions >
          {
               queryState.isResponseError ?
               <CustomerTypography sx={{color:"red"}}>
                    {queryState.errorMessage}
               </CustomerTypography>
               :
               queryState.isResponseSuccess&&<CustomerTypography sx={{color:"red"}}>
                    {queryState.querySentStatus}
               </CustomerTypography>

          }

    </CardContent>

    </Card>
 
  );
}

export default QueryCard;