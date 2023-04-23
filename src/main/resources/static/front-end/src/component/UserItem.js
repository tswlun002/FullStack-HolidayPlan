import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import { IconButton } from '@material-ui/core'
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {CreateAuthContext} from '../context/CreateAuthContext';
import { green, cyan} from '@mui/material/colors';

const ExpandMore = styled((props) => {
      const { expand, ...other } = props;
      return <IconButton {...other} />;
        })(({ theme, expand }) => ({
          transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
          marginLeft: 'auto',
          transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
          }),
}));
export default function UserItem({data}) {
   const { dispatchLogin } = React.useContext(CreateAuthContext);


  console.log(data);
  const {firstname,  lastname, age,username, userType, roles}=data;
    const color =  userType=="ADMIN"?green[500]:cyan[500];
  const permissions =[]
  const addToPermission =(permissionList)=>{
    permissionList.forEach((p)=>permissions.push(p))
  }
  roles.forEach((r)=>addToPermission(r.permissions))


    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    }

  return (
      <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar  sx={{ bgcolor:color}}><Typography sx={{color:"white", textAlign: "center",fontSize:"0.7rem"}}>{userType}</Typography></Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={`${firstname} ${lastname}`}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
               {username}
              </Typography>

            </React.Fragment>
          }
        />
         <ListItemButton>

              <ExpandMore
                   expand={expanded}
                   onClick={handleExpandClick}
                   aria-expanded={expanded}
                   aria-label="Edit"
                   sx={{marginLeft:"auto", maxWidth:"10%"}}
                 >
                  {
                     <ExpandMoreIcon/>
                  }
              </ExpandMore>
         </ListItemButton>
      </ListItem>


      <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CheckboxListSecondary data={permissions}/>
          <Divider variant="inset" component="li" />
       </Collapse>
      </>
  );
}
const CheckboxListSecondary = ({data})=>{
      const [checked, setChecked] = React.useState([1]);

      const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
      };

  return (
    <List dense sx={{margin:"0rem 4rem", maxWidth: 400 }}>
      {data.map((value) => {
        const labelId = `checkbox-list-secondary-label-${value.name}`;
        return (
          <ListItem
            key={value.name}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={handleToggle(value.name)}
                checked={checked.indexOf(value.name) !== -1}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            }
            disablePadding
          >
            <ListItemButton>
              <ListItemText id={labelId} primary={value.name} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}