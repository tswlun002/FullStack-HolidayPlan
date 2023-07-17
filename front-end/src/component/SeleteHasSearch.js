import React, { useState, useMemo } from "react";
import {
  Box,
  FormControl,
  ListSubheader,
  TextField,
  InputAdornment,
  ListItem,
  List,
  ListItemButton,
  ListItemText,
  Checkbox
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const containsText = (element, searchText) => element.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

export default function SelectHasSearch({allOptions=[],fieldName="name",setSeletedOptions}) {
        
        const [selected, setSelected] = useState([]);

        const itemName =(item)=>{
          return fieldName.split(',').map(field=>item[field.trim()]).join(' ');
        }
        const handleClick = (event, element) => {

                const selectedIndex = selected.indexOf(element);
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

                 newSelected = newSelected.filter((item)=>{return allOptions.some((item1)=>{return (item1.id===item.id); });});
                setSelected(newSelected);
                setSeletedOptions(newSelected);
        }
        const isSelected = (element) => selected.indexOf(element) !== -1;
        const [searchText, setSearchText] = useState("");
        const displayedOptions = useMemo(
        () => allOptions.filter((option) => containsText(option, searchText)),
        [searchText,allOptions]
        );


  return (
    <Box minWidth={400}>
      <FormControl fullWidth>
        <List 
            sx={{
                  width: '100%',
                  minWidth: 400,
                  position: 'relative',
                  overflow: 'auto',
                  maxHeight:"50vh",
                  '& ul': { padding: 0 }
            }}
          >

          <ListSubheader fullWidth sx={{boxShadow:"inherit !important;"}}>

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
            displayedOptions.map((option) =>{
              const labelId = `enhanced-table-checkbox-${option.id}`;
              const isItemSelected  = isSelected(option);
              return <ListItem>
                <ListItemButton fullWidth>
                
                  <ListItemText 
                    fullWidth 
                    key={itemName(option)} 
                    value={itemName(option)} 
                    primary={itemName(option)}
                  />
                  <Checkbox 
                      key={option.id}
                      checked={isItemSelected} 
                      onClick={(e)=>handleClick(e,option)}
                      inputProps={{
                        'aria-labelledby': labelId,
                      }}
                  />
                </ListItemButton>
              </ListItem>
            })
        }
        </List>
      </FormControl>
    </Box>
  );
}
