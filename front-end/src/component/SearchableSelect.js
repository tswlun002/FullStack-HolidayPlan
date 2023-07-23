import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import ListSubheader from '@mui/material/ListSubheader';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from '@mui/material/InputAdornment';


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

export default function SearchableSelect({Options=[],name="name",deleteOption=()=>{}}) {

  
  const containsText = (option, searchText) => option[name].toLowerCase().indexOf(searchText.toLowerCase()) > -1;
  const [searchText, setSearchText] = React.useState("");
  const displayedOptions = React.useMemo(
  () => Options.filter((option) => containsText(option, searchText)),
  [searchText,Options]
  );
  
  

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 ,justifyContent:"center",
            alignItems:"center"}}>
        <InputLabel   sx={{color:"black",fontSize:"bold"}}id="demo-multiple-checkbox-label">{Options.length===0?"None":""}</InputLabel>
       
        <Select
           disabled={Options.length===0}
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          input={<OutlinedInput label="Permissions" />}
          
          value={displayedOptions}
          MenuProps={MenuProps}
          variant="filled"
        >
              
            <ListSubheader muiSkipListHighlight fullWidth sx={{boxShadow:"inherit !important;"}}>

                  <TextField
                    size="small"
                    autoFocus
                    placeholder="Type to search..."
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment sx ={{padding:"1rem",}} position="start">
                          <SearchIcon />
                        </InputAdornment>
                      )
                    }}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key !== "Escape") {
                        e.stopPropagation();
                      }
                    }}
                  />
              </ListSubheader>
              {
               displayedOptions.map((option) => (

                  <MenuItem key={option[name]} value={option[name]} >
                    <ListItemText primary={option[name]} />
                    <IconButton sx={{width:"1rem"}} onclick={()=>deleteOption()}><DeleteIcon/></IconButton>
                  </MenuItem>
                ))
              }
      
        </Select>
       
      </FormControl>
    </div>
  );
}
