import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { visuallyHidden } from '@mui/utils';
import { RolePermissionContext } from '../context/RolePermissionContext';
import Collapse from '@mui/material/Collapse';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import { NavLink, useSearchParams} from 'react-router-dom';
import SelectedItems from '../component/SelectedItems';
import UsePrivateAxios from '../utils/UseAxiosPrivate'
import {getErrorMessage} from '../utils/Error';
import SearchableSelect from './SearchableSelect';
import AddRoleToUser from './AddRoleToUser';
import AddPermissionToUser from './AddPermissionToUser';
import {FaUserEdit} from 'react-icons/fa';
import {Avatar,Divider,Stack,FormControlLabel,Switch} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterList from '../component/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { ERROR_COLOR, LOADING_COLOR, PRIMAR_COLOR, SECONDARY_COLOR, SECONDARY_HEADER_COLOR, SUCCESS_COLOR } from '../utils/Constant';
const header_background  =SECONDARY_HEADER_COLOR

function descendingComparator(a, b, orderBy) {
         a.fullname= `${a.firstname} ${a.lastname}`;
         b.fullname= `${b.firstname} ${b.lastname}`;
        if (b[orderBy] < a[orderBy]) {
             delete  a.fullname;
             delete  b.fullname;
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            delete  a.fullname;
            delete  b.fullname;
            return 1;
        }
        delete  a.fullname;
        delete  b.fullname;
        return 0;
}

function getComparator(order, orderBy) {
      return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {

        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
                 return order;
            }
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'fullname',
        numeric: false,
        disablePadding: true,
        label: 'Fullname',
    },
    
    {
        id: 'username',
        numeric: false,
        disablePadding: true,
        label: 'Email',
    },
    {
      id: 'age',
      numeric: false,
      disablePadding: true,
      label: 'Date of birth',
    },
    {
        id: 'roles',
        numeric: false,
        disablePadding: true,
        label: 'Roles',
    },
    {
        id: 'Permissions',
        numeric: false,
        disablePadding: false,
        label: 'Permissions',
    },
    {
        id: 'edit-user',
        numeric: false,
        disablePadding: false,
        label: 'Edit',
    }
];

function EnhancedTableHead(props) {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =props;
        const createSortHandler = (property) => (event) => {
                onRequestSort(event, property);
        };

      return (
        <TableHead sx={{background:header_background}}>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={onSelectAllClick}
                inputProps={{
                  'aria-label': 'select all desserts',
                }}
              />
            </TableCell>
            {headCells.map((headCell) => (
              <TableCell
                key={headCell.id}
                align={'center'}
                padding={'checkbox'}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                  sx={{color:'black'}}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>

        </TableHead>
      );
}

EnhancedTableHead.propTypes = {
        numSelected: PropTypes.number.isRequired,
        onRequestSort: PropTypes.func.isRequired,
        onSelectAllClick: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc', 'desc']).isRequired,
        orderBy: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired,
};

const Filters =({filters, getFilterField,setFilterObject})=>{

  return filters.map((filter,index)=>
   <FilterList 
       key={index} 
       label={filter.label} 
       name={filter.name}
       Options={getFilterField(filter.name)} 
       selectOption={setFilterObject}
     />
   )
}

function EnhancedTableToolbar(props) {
        const { numSelected, setAddPermission} = props;
        const FILTERS = [{name:'fullname', label:"Fullname"},{name:"username",label:'Email'},{name:"age",label:'Date of birth'}]

        
        return (
        <Toolbar disableGutters sx={{background:header_background,}} >

          <Typography
              sx={{ flex: '1 1 10%' , padding:"0rem 1rem"}}
              color={numSelected > 0 ?"red":"black"}
              variant="subtitle1"
              component="div"
            >
              {numSelected} selected
            </Typography>
          <Box
             justifyContent="center" alignItems="center" sx={{ flexGrow: 1, display:'flex'}}
          >
            {
              props.openFilter&&
              <Stack
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={{ xs: 0.5, sm: 1, md: 2 }}
                  sx={{width:"100%"}}
                  useFlexGap flexWrap="wrap"
                  divider={<Divider orientation="vertical" flexItem />}   
             >
             
              {Filters({filters:FILTERS, getFilterField:props.getFilterField, setFilterObject:props.setFilterObject})}
              <FormControlLabel  
                  sx={{width:"2.5rem"}} 
                  control={<Switch   checked={props.filterIsChecked} onChange={props.filter} inputProps={{ 'aria-label': 'controlled' }}/>}
                 label="Filter" 
              />
               
              </Stack>
            }
            {
              props.openFilter? <ClearIcon  sx={{color:SECONDARY_HEADER_COLOR, padding:"1.3rem 0rem"}}onClick={props.clearFilter}/>:
              <FilterAltIcon  sx={{color:"black", padding:{lg:"2rem 1rem",sm:"1rem 1rem"}}}onClick={()=>props.setOpenFilter(()=>!props.openFilter)}/>
            }
            {props.BarItems.map((item, index) =>{

              return   (<NavLink
                                  onClick={()=>{
                                  item.fun(()=>!item.flag);
                                  }}
                                  
                                  end ={item.name=="Add Role"}
                                  key={index}
                                  style={{
                                      color:item.flag?"white":"black",
                                      textDecoration:"none",  
                                      padding:"2rem 1rem"
                                  }}
                                >
                                  {item.name}
                      </NavLink>)
                    

              })

          }
          </Box>
        </Toolbar>);
}

EnhancedTableToolbar.propTypes = {
         numSelected: PropTypes.number.isRequired,
};

const StyleAvatar =styled(Avatar)(({ theme }) => ({
  '&:hover': {
    border:`2px solid ${PRIMAR_COLOR}`,
    },
    '&.Mui-focused': {
    border:`2px solid ${PRIMAR_COLOR}`    },
  border: `2px solid ${theme.palette.background.paper}`,
}));


function filterUsers(AllUsers=[], filtersObject={}){
  
   if(AllUsers.length===0) return AllUsers;
   return AllUsers.filter((user)=>{  
         return filtersObject['fullname'].some((element)=>element===`${user['firstname']} ${user['lastname']}`) || 
                filtersObject['username'].some((element)=>element===user['username']) ||
                filtersObject['age'].some((element)=>element===(user['age']&&JSON.stringify(user['age']).substring(1,11)));
   });

}

export default function ListUsers() {
        let [searchParams, setSearchParams] = useSearchParams();
        const [order, setOrder] = React.useState('asc');
        const [orderBy, setOrderBy] = React.useState('f');
        const [selected, SetSelected] = React.useState([]);
        const [page, setPage] = React.useState(0);
        const [dense, setDense] = React.useState(false);
        const [rowsPerPage, setRowsPerPage] = React.useState(5);
        const {roles, setRoles} =  React.useContext(RolePermissionContext);
        const [isAddPermission, setAddPermission] = React.useState(false);
        const [isDeletePermissionFromUser, setIsDeletePermissionFromUser] = React.useState(false);
        const useAxiosPrivate = UsePrivateAxios();
        const [isAddRoleOpen, setAddRoleOpen] = React.useState(false);
        const [isRoleAdded, setIsRoleAdded] = React.useState(false);
        const [isDeleteUserOpen , setIsDeleteUserOpen] = React.useState(false);
        const [isUserDeleted, setIsUserDeleted] = React.useState(false);
        const [newPermissionAddedToUser,setNewPermissionAddedToUser]=React.useState(false);
        const [users , dispatchUsers] = React.useReducer(
                (state, action)=>{return {...state,...action}},
                {data:[],isLoading:false,isRequestError:false,message:"",isRequestSuccessful:false}
        );
        const FILTER_INIT_STATE={data:[],fullname:[], username:[],age:[]}
        const[filterIsChecked, setFilterIsChecked] = React.useState(false);
        const [openFilter , setOpenFilter] = React.useState(false);
        const[filterObject, setFilterObject] = React.useReducer((state, action)=>{return {...state, ...action}},FILTER_INIT_STATE);
        
        
        //const[users, dispatchUsers] = React.useState([]);

        const setSelected =(user)=>{
            SetSelected(user);
            dispatchUsers( {isRequestError:false,isLoading:false,message:"",isRequestSuccessful:false});
            setIsUserDeleted(false);
        }
        /////////////////////////////////////////////////////////////////
        // FETCH USERS 
        ////////////////////////////////////////////////////////////////

        React.useEffect(()=>{
              
              let isMounted = true;
              const controller = new AbortController();
              const API = '/holiday-plan/api/admin/user/users/';
              isMounted&&useAxiosPrivate.get(API, {signal:controller.signal})
              .then(response =>
                  {
                    if(response.ok || response.status===200){
                      dispatchUsers({data:response.data})
                  }
                }
              ).catch(err =>
                {

                    if(!err?.response.ok && err.name!=="AbortErr"){
                        let errorMessage =null;
                        if(err.response.status===404){
                          errorMessage  ="Invalid credentials";
                        }
                        else if(err.response.status===401){
                              errorMessage  ="Denied access";
                        }
                        else{
                              errorMessage  = getErrorMessage(err);
                        }
                        dispatchUsers({message:errorMessage,isRequestSuccessful : false,isRequestError:true, isLoading:false})
                    }else dispatchUsers({message:"Server Error",isRequestSuccessful : false,isRequestError:true,isLoading:false})

                }
              );

              return ()=>{isMounted=false; controller.abort();
                setTimeout(()=>{dispatchUsers( {isRequestError:false,isLoading:false,message:"",isRequestSuccessful:false})},5000)
              }
      },[isRoleAdded,newPermissionAddedToUser,isUserDeleted, isDeletePermissionFromUser]);

        //////////////////////////////////////////////////////////////////////////////
        //                      DELETE USER(s)
        ///////////////////////////////////////////////////////////////////////////////
        const deleteUsers = async(usersToDelete)=>{
                if(usersToDelete===null || usersToDelete===undefined || usersToDelete.length===0){
                    dispatchUsers({isRequestError:true,message:"No user selected.",isRequestSuccessful:false});
                }else{
                   let  results ={isRequestSuccessful:false};
                   let lastUser=null;
                   let  successfulDeletedRoles=[];
                   for(let userToDelete of usersToDelete){
                        lastUser = userToDelete;
                        results= await deleteUserApi(userToDelete.username);
                       if(results.isRequestError){
                           break;
                       }else successfulDeletedRoles.push(userToDelete);
                   }
                    if(results.isRequestError){
                       results.message= `${results.message}. user:${lastUser.username}`;
                    }
                   if(results.isRequestSuccessful){

                        //remove deleted permissions from list
                        const newRoleList =(list)=> list.filter((roleItem)=>{
                              return !successfulDeletedRoles.find((roleItem1)=>roleItem.id===roleItem1.id && roleItem.name==roleItem1.name);
                        });
                        const temp =newRoleList(selected);
                        setSelected(temp);
                        setIsUserDeleted(true);
                   }
                   dispatchUsers(results);
                }
        }
         // Delete user by username
       const deleteUserApi  = (username)=>{

            const API = `/holiday-plan/api/admin/user/delete/?username=${username}`;
            const newRequestResponse ={isRequestSuccessful:false,isRequestError:false,message:""};

            return useAxiosPrivate.delete(API)
            .then(response => {
                if(response.ok || response.status===200){
                    newRequestResponse.isRequestSuccessful=true;
                    newRequestResponse.isRequestError=false;
                    newRequestResponse.message="Successfully deleted user."
               }
              return newRequestResponse;
            })
            .catch(err => {
                if(!err?.response.ok){
                    const errorMessage  = getErrorMessage(err);
                    newRequestResponse.isRequestSuccessful=false;
                    newRequestResponse.isRequestError=true;
                    newRequestResponse.message=errorMessage;
                }
                else{
                    newRequestResponse.isRequestSuccessful=false;
                    newRequestResponse.isRequestError=true;
                    newRequestResponse.message="Server Error";
               }
               return newRequestResponse;
            });

       }
       /**
        * delete permission from user
        * @param {*} username   of the user to remove permission from
        * @param {*} permissionName of the permission to remove from user
        */
       const  deletePermissionfromUser = async(username, permissionName)=>{
        if(username===null) setRoles({isRequestError:true, isRequestSuccessful:false, message:"User is not seletect"});

        const API = `/holiday-plan/api/admin/user/delete/permission/?username=${username}&permissionName=${permissionName}`;
        const results =await useAxiosPrivate.delete(API)
          .then(response => {
              if(response.ok || response.status===200){
                return({isRequestSuccessful:true,isRequestError:false,message:`Successfully deleted permission:${permissionName} from user:${username}.`});
             }
             
          })
          .catch(err => {
              if(!err?.response.ok){
                  return({isRequestSuccessful:false,isRequestError:true,message:getComparator(err)});
              }
              else{
                return({isRequestSuccessful:false,isRequestError:true,message:getErrorMessage(err)});

             }
          });
          dispatchUsers(results);
          if(results.isRequestSuccessful){
             setIsDeletePermissionFromUser(()=>!isDeletePermissionFromUser);
          }
       
       }
       /**
        * delete role from user
        * @param {*} username  of user to remove role from
        * @param {*} roleName of the role to remove from user
        */
       const  deleteRolefromUser = async(username,roleName)=>{
        if(username===null) setRoles({isRequestError:true, isRequestSuccessful:false, message:"User is not seletect"});

          const API = `/holiday-plan/api/admin/user/delete/role/?username=${username}&roleName=${roleName}`;
          const results =await useAxiosPrivate.delete(API)
            .then(response => {
                if(response.ok || response.status===200){
                  return({isRequestSuccessful:true,isRequestError:false,message:`Successfully deleted role:${roleName} from user:${username}.`});
               }
               
            })
            .catch(err => {
                if(!err?.response.ok){
                    return({isRequestSuccessful:false,isRequestError:true,message:getComparator(err)});
                }
                else{
                  return({isRequestSuccessful:false,isRequestError:true,message:getErrorMessage(err)});

               }
            });
            dispatchUsers(results);
            if(results.isRequestSuccessful){
               setIsDeletePermissionFromUser(()=>!isDeletePermissionFromUser);
            }
         
       }

         //Sort Request
        const handleRequestSort = (event, property) => {
            const isAsc = orderBy === property && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(property);
        };
        //Handle select all roles
        const handleSelectAllClick = (event) => {

            if (event.target.checked) {
              setSelected(users.data);
              return;
            }
            setSelected([]);
            setAddPermission(false);
            setNewPermissionAddedToUser(false);
            setIsRoleAdded(false);

        };
         // Handle click on permission checkbox
        const handleClick = (event, user) => {
                 setSearchParams({username:user.username})
                const selectedIndex = selected.map(user1=>user1.username).indexOf(user.username);
                let newSelected = [];

                if (selectedIndex === -1) {
                  newSelected = newSelected.concat(selected, user);
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

                setSelected(newSelected);
                if(newSelected.length===0){
                  setAddPermission(false);
                }
                setNewPermissionAddedToUser(false);
                setIsRoleAdded(false);
        };

        const handleChangePage = (event, newPage) => {
                setPage(newPage);
        };

        const handleChangeRowsPerPage = (event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
        };

        const handleChangeDense = (event) => {
            setDense(event.target.checked);
        };

        const isSelected = (user) => {
            return selected.map(user1=>user1.username).indexOf(user.username) !==-1;
        }

        // Avoid a layout jump when reaching the last page with empty rows.
        const emptyRows =page > 0 ? Math.max(0, (1 + page) * rowsPerPage - roles.listRoles.length) : 0;

        const visibleRows = React.useMemo(() =>
              stableSort(filterIsChecked?filterObject.data:users.data, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
              ),
            [users.data,filterObject.data,filterIsChecked,order, orderBy, page, rowsPerPage],
        );

        const [anchorElUser, setAnchorElUser] = React.useState(null);

        const getFilterField = (filter)=>{
          return [... new Set(visibleRows.map((user)=>{ 
        
            if(filter==="age"){
             
              return user[filter]&&JSON.stringify(user[filter]).substring(1,11)
            }
            else if(filter==="fullname"){
              return `${user['firstname']} ${user['lastname']}`
            }
            else return user[filter]
          
          }))].map((field)=>{return {[filter]:field}});
        }


  //clears filters
  const clearFilter=()=>{
    setOpenFilter(()=>!openFilter);
    setFilterIsChecked(false);
    setFilterObject(FILTER_INIT_STATE);
  }
  const filter= ()=>{
    setFilterIsChecked(()=>!filterIsChecked);
    if(!filterIsChecked){

      setFilterObject({data:filterUsers(visibleRows,filterObject)});
      const data  = filterObject['data'];
      delete filterObject['data']
      setSearchParams(filterObject)
      filterObject['data']=data;
    }
    else setSearchParams({})

    
  }  

  return (
  <>
    {(users.isRequestError||(users.data.length===0)||users.isRequestSuccessful)&&
      <Typography align="center" variant="h5" 
         color={users.isRequestError?ERROR_COLOR:(users.data.length===0)?LOADING_COLOR:SUCCESS_COLOR}
         font-size="0.8rem">{(users.data.length===0&&!(users.isRequestError||users.isRequestSuccessful))?"Loading ...":users.message}
      </Typography>
    }
   
    <Box sx={{ width: '100%', display:{xs:"block",md:"flex"}}}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar 
          BarItems={[
            {name:"Delete-user", fun:setIsDeleteUserOpen,flag:isDeleteUserOpen},
            {name:"Add-Role",fun:setAddRoleOpen,flag:isAddRoleOpen},
            {name:"Add-Permission",fun:setAddPermission,flag:isAddPermission},
        ]}
          setAnchorElUser ={setAnchorElUser}
          anchorElUser={anchorElUser}
          numSelected={selected.length} 
          setAddPermission={setAddPermission} 
          setAddRole={setAddRoleOpen}
          openFilter={openFilter}
          setOpenFilter={setOpenFilter}
          setFilterObject={setFilterObject}
          clearFilter={clearFilter}
          filter={filter}
          filterIsChecked={filterIsChecked}
          getFilterField={getFilterField}
         
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 350 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead

              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={users.data.length}
            />
            <TableBody>
              

               {
               visibleRows.map((user, index) => {
                    const isItemSelected = isSelected(user);

                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={user.id}
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            onClick={(event) => handleClick(event, user)}
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                            padding="checkbox"
                          component="th"
                          id={labelId}
                          scope="row"
                          variant="body"
                          sx={{color:"black",fontFamily:"bold"}}
                          align="center"
                        >
                          {`${user.firstname} ${user.lastname}`}
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="checkbox"
                          align="center"
                          variant="body"
                          sx={{color:"black",fontFamily:"bold"}}
                        >
                          {user.username}
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="checkbox"
                          align="center"
                          variant="body"
                          sx={{color:"black",fontFamily:"bold"}}
                        >
                          {
                           user.age&&JSON.stringify(user.age).substring(1,11)
                          }
                        </TableCell>
                        <TableCell align="center"><SearchableSelect OptionsOf={user.username}  deleteOption={deleteRolefromUser}  Options={user.roles}/></TableCell>

                        <TableCell align="center"><SearchableSelect OptionsOf={user.username}  deleteOption={deletePermissionfromUser}Options={user.permissions}/></TableCell>
                        <TableCell padding="checkbox">
                            <StyleAvatar
                                sx={{ bgcolor:SECONDARY_COLOR}}
                                
                                >
                                  <NavLink
                                    to={user.username}
                                    key={user.id}
                                  >
                                    <FaUserEdit  style={{color:"white"}}/>
                                    </NavLink>
                              
                                    
                            </StyleAvatar>
                        </TableCell>
                      </TableRow>
                    );
                  })
              }
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )
               }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={roles.listRoles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      <Collapse 
          in={isAddPermission} 
          timeout="auto" unmountOnExit 
           sx={{display:{xs:"none",md:"block"}}}>
          <AddPermissionToUser
            setNewPermissionAddedToUser={setNewPermissionAddedToUser} 
            users={selected} setAddPermission={setAddPermission}
          />
      </Collapse>
      <Modal
          open ={isAddPermission}
          onClose={()=>setAddPermission(false)}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
          sx={{display:{xs:"flex",md:"none"},justifyContent:'center',alignItems:'center' }}
      >
          <AddPermissionToUser
            setNewPermissionAddedToUser={setNewPermissionAddedToUser}
            users={selected} setAddPermission={setAddPermission}
          />
      </Modal>

      <Collapse 
          in={isAddRoleOpen} 
          timeout="auto" unmountOnExit  
          sx={{display:{xs:"none",md:"block"}}}>
          <AddRoleToUser 
             setNewRoleAddedToUser={setIsRoleAdded} 
             users={selected} 
             setAddRole={setAddRoleOpen}
          />
      </Collapse>
      <Modal
          open ={isAddRoleOpen}
          onClose={()=>setAddPermission(false)}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
          sx={{display:{xs:"flex",md:"none"},justifyContent:'center',alignItems:'center' }}
      >
        <AddRoleToUser 
            setAddRole={setAddRoleOpen} 
            setNewRoleAddedToUser={setIsRoleAdded}
            users={selected}
        />
      </Modal>
      {isDeleteUserOpen&&<SelectedItems
                    heading ={"Users to delete" }
                    SelectedItems={selected}
                    fieldName={"firstname,lastname"}
                    setSelectedItems={deleteUsers}
                    openListSelectedItems={isDeleteUserOpen}
                    setOpenListSelectedItems={setIsDeleteUserOpen}
                
      />}
    </Box></>
  );
}
