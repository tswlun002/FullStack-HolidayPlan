import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import {ListItemText,Checkbox, ListSubheader,TextField, InputAdornment} from '@mui/material';
import Select from '@mui/material/Select';
import SearchIcon from "@mui/icons-material/Search";

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

export default function FilterList({Options=[],label="",name="name", selectOption=()=>{}}) {
  const containsText = (option, searchText) => JSON.stringify(option[name]).toLowerCase().indexOf(searchText.toLowerCase()) > -1;
  const [searchText, setSearchText] = React.useState("");
  const displayedOptions = React.useMemo(
  () => Options.filter((option) => containsText(option, searchText)),
  [searchText,Options]
  );
  const [selected, setSelected] = React.useState([]);

  
  const isSelected = (element) => {
    return selected.map(option=>option[name]).indexOf(element[name]) !==-1;

  };
  const handleClick = (element) => {

            const selectedIndex = selected.map(option=>option[name]).indexOf(element[name]);
            let newSelected = [];

            if (selectedIndex === -1) {
                newSelected = newSelected.concat(selected, element);
            } else if (selectedIndex === 0) {
                newSelected = newSelected.concat(selected.slice(1));
            } else if (selectedIndex === selected.length - 1) {
                newSelected = newSelected.concat(selected.slice(0, -1));
            } else if (selectedIndex > 0) {
                newSelected = newSelected.concat(
                    selected.slice(0, selectedIndex),
                    selected.slice(selectedIndex + 1),
               );
            }

             newSelected = newSelected.filter((item)=>{return Options.some((item1)=>{return (JSON.stringify(item1[name]).toLowerCase()===JSON.stringify(item[name]).toLowerCase()); });});
            setSelected(newSelected);
            selectOption({[name]:newSelected.map((option)=>option[name])});
    }

  return (
    <div>
      <FormControl sx={{ m: 1,"& fieldset": { border: 'none' }}}>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          displayEmpty
          multiple
          input={<OutlinedInput label="Permissions" />}
          renderValue={()=><em>{label}</em>}
          value={displayedOptions}
          MenuProps={MenuProps}
         
          inputProps={{ 'aria-label': 'Without label' }}
        >
              <ListSubheader muiskiplisthighlight fullWidth sx={{boxShadow:"inherit !important;"}}>
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
               displayedOptions.map((option) => {
                   const isItemSelected  = isSelected(option);
                   const labelId = `enhanced-table-checkbox-${option[name]}`;

                  return(<MenuItem  value={option[name]} >
                    <ListItemText  primary={option[name]} />
                    <Checkbox 
                      checked={isItemSelected} 
                      onClick={()=>handleClick(option)}
                      inputProps={{
                        'aria-labelledby': labelId,
                      }}
                  />
                  </MenuItem>
                )})
              }
      
        </Select>
       
      </FormControl>
    </div>
  );
}
