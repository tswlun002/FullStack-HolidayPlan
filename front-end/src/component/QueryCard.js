import * as React from 'react';
import './QueryCard.css';
import IconButton from '@mui/material/IconButton';
import  {FaTrash,FaMinus, FaPlus} from 'react-icons/fa'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CustomerTypography from './CustomerTypography'
import { Button ,CardActions,CardHeader,Grid} from '@mui/material';
import UseAxiosPrivate from '../utils/UseAxiosPrivate'
import {CreateAuthContext} from '../context/CreateAuthContext';
import { FormControl,RadioGroup, FormControlLabel,Radio,FormLabel } from '@mui/material';
import CustomerTextArea from'../component/CustomerTextArea'
import {SendQueryResponse,DeleteQuery} from '../utils/Query'
import { ERROR_COLOR, SECONDARY_COLOR, SECONDARY_HEADER_COLOR, SUCCESS_COLOR } from '../utils/Constant';


const QueryStatusActions = ({queryState, dispatchQuery, disAbled})=>{
    return(
    <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">Query Status</FormLabel>
        <RadioGroup  className='radio-group'
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            onChange={(event)=>{dispatchQuery({queryStatus:event.target.value});}}
            value={queryState.queryStatus}
            >
            <div className='radio-group'style={{display:"flex"}}>
                <FormControlLabel disabled={disAbled} value="ACTIVE"  control={<Radio  style={{color:SECONDARY_COLOR}}/>} label="Active" />
                <FormControlLabel disabled={disAbled} value="SOLVED"  control={<Radio  style={{color:SUCCESS_COLOR}}/>} label="Solved" />
            </div>
        </RadioGroup>
    </FormControl>)
}
const AdjustableParagraph = ({message})=>{
    const truncate = (input) =>input.length > 50 ? true : false;
    const [showMore,setShowMore] =React.useState(true);

    return(
        <Grid container wrap="nowrap" spacing={1}>
            <Grid item xs zeroMinWidth>
             <CustomerTypography noWrap={showMore}>{message}</CustomerTypography>
            </Grid>
            <Grid item xs={1}>
                { truncate(message)?
                  showMore?<FaPlus onClick={()=>setShowMore(false)}/>:
                  <FaMinus onClick={()=>setShowMore(true)}/>:
                  ""
                }
            </Grid>
        </Grid>
    )
}
const QueryCard = ({data, index,deleteQueryCard})=> {
     const {querySummary, queryDescription,queryStatus}=data;
    const{userLoginState} = React.useContext(CreateAuthContext)

    const useAxiosPrivate = UseAxiosPrivate();

     const [ queryState, dispatchQuery] = React.useReducer((state, action)=>{
        return {...state, ...action}
     }, {
         response:"",
         queryStatus:queryStatus,
         isResponseError:false,
         isResponseSuccess:false,
         requestResponse:""
     })
    

    React.useEffect(()=>{
       if(queryState.isResponseSuccess &&  userLoginState.roles.find(role=>role.name==="USER")){
              setTimeout(()=>{
                    deleteQueryCard(index);
              }, 1000)
       }
       if(queryState.isResponseSuccess && userLoginState.roles.find(role=>role.name==="ADMIN")){
            dispatchQuery({querySentStatus:"Query response sent successfully"});
       }

    },[queryState.isResponseSuccess])


    /**
     Summit query response
    */
    const onSubmit =async(e)=>{

        e.preventDefault();
        let editResponse = {isResponseError : false,requestResponse:"",isResponseSuccess:false}

        if(userLoginState.roles.find(role=>role.name==="ADMIN")){
            if(queryState.response.trim() ==="" || queryState.queryStatus.trim() ===""){
               dispatchQuery({isResponseError:true, requestResponse:"All fields are required"})
            }else{

               editResponse= await SendQueryResponse({username:data.user.username, queryId:data.id,useAxiosPrivate,response:queryState.response, queryStatus:queryState.queryStatus});
               dispatchQuery(editResponse);
               if(editResponse.isResponseSuccess){

                   dispatchQuery({response:"", queryStatus:"ACTIVE"})
               }
            }
        }
        else if(userLoginState.roles.find(role=>role.name==="USER")){
            DeleteQuery(useAxiosPrivate,data.id, dispatchQuery)
        }
    }
   


    return (
  
    <Card key={data.id} sx={{ maxWidth: 400,  margin:"1%",
       paddingBottom:"1rem" ,display:"block", minWidth:"20rem"}}>
        <CardHeader 
            sx={{background:SECONDARY_HEADER_COLOR}}
            title={<CustomerTypography
                        align="center"
                        sx={{width:"100%",}}
                        >
                            <span >  Query From: {
                                data.user?.firstname && data.user?.lastname  &&
                                `${data.user?.firstname}  ${data.user?.lastname }`
                                }
                            </span>
            </CustomerTypography>}
                 
            subheader={queryState.isQueryingError? queryState.requestResponse:queryState.isResponseSuccess?queryState.requestResponse:""}
            subheaderTypographyProps={{alignItems:"start",fontSize:"0.8rem",color:queryState.isQueryingError?ERROR_COLOR:queryState.isResponseSuccess&&SUCCESS_COLOR}}
            />
            
           
        
       <CardContent>
         


         <CustomerTypography gutterBottom variant="h7" component="div" align="center">
            Date:{data.localDateTime&&JSON.stringify(data.localDateTime).substring(1,11)}
          </CustomerTypography>
          <CustomerTypography sx={{fontWeight: "bold"}}  gutterBottom variant="h7" component="div" align="center">
               Query Summary:
          </CustomerTypography>
          <AdjustableParagraph message={querySummary}/>
          <CustomerTypography  sx={{fontWeight: "bold"}}   gutterBottom variant="h7" component="div" align="center">
           Query description:
          </CustomerTypography>
          <AdjustableParagraph message={queryDescription}/>
          
          {

             ( queryState.queryStatus==="ACTIVE" && userLoginState.roles.find(role=>role.name==="ADMIN") )?
              <CardActions>
                  <CustomerTextArea
                        disabled={userLoginState.roles.find(role=>role.name==="USER") || (
                        userLoginState.roles.find(role=>role.name==="ADMIN")&& queryState.queryStatus==="SOLVED") }
                        width ="100%" focused  minRows="2"  helpertext=""
                        required multiline={true}   maxRows="10"   variant="outlined"
                        id="demo-helper-text-aligned"    label="Response"
                        color="secondary" type="text" className=" Response-input" placeholder="Enter full  Response"
                        autoComplete='new-Response' value={queryState.response}
                        onChange={(e)=>dispatchQuery({ response:e.target.value,isResponseError:false})}/>
              </CardActions>:
              <>
                  <CustomerTypography  sx={{fontWeight: "bold"}}   gutterBottom variant="h7" component="div" align="center">
                    Query Response:
                   </CustomerTypography>
                   <AdjustableParagraph message={data.response}/>
                  
               </>

          }
          <CardActions sx={{display:userLoginState.roles.find(role=>role.name==="ADMIN")?"block":"flex"}}>

              <QueryStatusActions sx={{marginRight:"auto !important"}}  disAbled={userLoginState.roles.find(role=>role.name==="USER")} queryState={queryState} dispatchQuery={dispatchQuery} />
            {

              userLoginState.roles.find(role=>role.name==="ADMIN")?
              <Button   disabled={queryState.response.trim()===''?true:false} variant="outlined" size="small" color="primary" onClick={onSubmit}>
                    Send Response
              </Button>
               :
               userLoginState.roles.find(role=>role.name==="USER")&&
               <IconButton variant="outlined" size="small" className="delete-query" sx={{color:"red",marginLeft:"auto",maxWidth:"10%"}} onClick={onSubmit}>
                 {<FaTrash/>}
                </IconButton>
            }
          </CardActions >

    </CardContent>

    </Card>
 
  );
}

export default QueryCard;
