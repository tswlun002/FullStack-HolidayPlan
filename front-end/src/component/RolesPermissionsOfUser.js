import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function RolesPermissionsOfUser({permissions}) {

  const [personName, setPersonName] = React.useState([]);

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 ,justifyContent:"center",
            alignItems:"center"}}>
        <InputLabel   sx={{color:"black",fontSize:"bold"}}id="demo-multiple-checkbox-label">{permissions.length===0?"None":""}</InputLabel>

        <Select
           disabled={permissions.length===0}
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          input={<OutlinedInput label="Permissions" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
          variant="filled"
        >
         {
             permissions.map((permission) => (

                <MenuItem key={permission.name} value={permission.name} >
                  <ListItemText primary={permission.name} />
                  <IconButton sx={{width:"1rem"}}><DeleteIcon/></IconButton>
                </MenuItem>
              ))
         }
      
        </Select>
       
      </FormControl>
    </div>
  );
}
