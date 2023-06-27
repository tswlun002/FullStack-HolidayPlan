import { CardHeader,Card, List, ListItem,ListItemText, Button,IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState ,useReducer} from 'react';

export default function SelectedItems({heading, SelectedItems,setSelectedItems,openListSelectedItems, setOpenListSelectedItems}){
    const removeItem = (itemTORemove, items)=>{
        return items.filter(item=> item.name !==itemTORemove);
    }
    const [itemsLocally, setItemsLocally] = useState(SelectedItems);

   const [reuqestResponse , setResponse] = useReducer((state, action)=>{return {...state,...action}},{isRequestError:false,message:"",isRequestSuccessful:false});
    return (
         <Modal
                  open ={openListSelectedItems}
                  onClose={()=>setOpenListSelectedItems(false)}
                  aria-labelledby="child-modal-title"
                  aria-describedby="child-modal-description"
                  sx={{display:"flex",justifyContent:'center',alignItems:'center' }}
              
            >
             <Card
            
                sx={{display:"block",justifyContent:'center',
                        alignItems:'center' , bgcolor:'white',
                        padding:"0rem 1rem 1rem 1rem",
                        minWidth:250
                }}
            >
                 <CardHeader subheader={heading}
                    action={<IconButton onClick={()=>{setOpenListSelectedItems(false);setItemsLocally([]);}}><CancelIcon/></IconButton>}
                />
                <List >
                 
                {  
                        
                    itemsLocally.map(
                    (item)=>{
                        return (
                        <ListItem sx={{width:"100%"}}>
                            <ListItemText key={item.name} primary={item.name}/>
                            <IconButton 
                                key={item.id} 
                                sx={{width:"1rem"}}
                                onClick={()=> setItemsLocally(()=>{
                                    return removeItem(item.name, itemsLocally);
                                })}
                            >
                                <DeleteIcon/>
                            </IconButton>
                        </ListItem>
                        )
                    }
                    )
                }
                </List>
                <Button
                     variant="contained" fullWidth
                     onClick={()=>
                     {
                     	setSelectedItems(itemsLocally);
                        
                     }
                  }
                >
                    Confirm
                </Button>
              </Card>
        </Modal>
        
    )
}
