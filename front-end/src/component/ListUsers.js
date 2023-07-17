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
import { NavLink } from 'react-router-dom';
import SelectedItems from '../component/SelectedItems';
import UsePrivateAxios from '../utils/UseAxiosPrivate'
import {getErrorMessage} from '../utils/Error';
import RolesPermissionsOfUser from './RolesPermissionsOfUser';
import AddRoleToUser from './AddRoleToUser';
import AddPermissionToUser from './AddPermissionToUser';
import {FaUserEdit} from 'react-icons/fa';
import Avatar from '@mui/material/Avatar';
const header_background  ="linear-gradient(to right,rgba(243, 156, 18, 0.5),rgba(243, 156, 18, 0.85),rgba(243, 156, 18,0.90),rgba(243, 156, 18, 0.6))!important";

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
        console.log(stabilizedThis.map((el)=>el[0]));
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

function EnhancedTableToolbar(props) {
        const { numSelected, setAddPermission} = props;
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


            {props.BarItems.map((item, index) =>{

              return  <NavLink
                          onClick={()=>{
                           item.fun(true);
                          }}
                          to={item.link}
                          end ={item.name=="Add Role"}
                          key={index}
                          style={({isPending, isActive})=>{
                            return {
                              color:isActive?"white":
                              isPending?"green":"black",
                              textDecoration:"none",  padding:"2rem 1rem"}
                          }}
                        >
                          {item.name}
                        </NavLink>

                  })

              }
          </Box>
        </Toolbar>);
}

EnhancedTableToolbar.propTypes = {
         numSelected: PropTypes.number.isRequired,
};

export default function ListUsers() {
        const [order, setOrder] = React.useState('asc');
        const [orderBy, setOrderBy] = React.useState('f');
        const [selected, SetSelected] = React.useState([]);
        const [page, setPage] = React.useState(0);
        const [dense, setDense] = React.useState(false);
        const [rowsPerPage, setRowsPerPage] = React.useState(5);
        const {roles, setRoles} =  React.useContext(RolePermissionContext);
        const [isAddPermission, setAddPermission] = React.useState(false);
        const [isDeletePermission, setDeletermission] = React.useState(false);
        const useAxiosPrivate = UsePrivateAxios();
        const currentPath = "/home-admin/users";
        const[isAddRoleOpen, setAddRoleOpen] = React.useState(false);
        const [isRoleAdded, setIsRoleAdded] = React.useState(false);
        const [isDeleteRoleOpen , setIsDeleteRoleOpen] = React.useState(false);
        const [isRoleDeleted, setIsRoleDeleted] = React.useState(false);
        const [newPermissionAddedToUser,setNewPermissionAddedToUser]=React.useState(false);
        const [users , dispatchUsers] = React.useReducer(
                (state, action)=>{return {...state,...action}},
                {data:[],isRequestError:false,message:"",isRequestSuccessful:false}
        );
        //const[users, dispatchUsers] = React.useState([]);

        const setSelected =(role)=>{
            SetSelected(role);
            dispatchUsers( {isRequestError:false,message:"",isRequestSuccessful:false});
            setIsRoleDeleted(false);
        }
        /////////////////////////////////////////////////////////////////
        // FETCH USERS 
        ////////////////////////////////////////////////////////////////

        React.useEffect(()=>{
              let isMounted = true;
              const controller = new AbortController();
              const API = '/holiday-plan/api/admin/user/users/';
              useAxiosPrivate.get(API, {signal:controller.signal})
              .then(response =>
                  {
                    if(response.ok || response.status===200){
                      console.log("Ok");
                      console.log(response.data)
                      dispatchUsers({data:response.data})

                  }


                }
              ).catch(err =>
                {
                    console.log(err);
                    console.log("Not ok");
                    if(!err?.response.ok && err.name!=="AbortErr"){
                        let errorMessage =null;
                        if(err.response.status===404){
                          console.log("Not ok ,********");
                          errorMessage  ="Invalid credentials";
                        }
                        else if(err.response.status===401){
                              errorMessage  ="Denied access";
                        }
                        else{
                              console.log(err.response.statusText);
                              errorMessage  = getErrorMessage(err);
                        }
                        dispatchUsers({message:errorMessage,isRequestSuccessful : false,isRequestError:true})
                    }else dispatchUsers({message:"Server Error",isRequestSuccessful : false,isRequestError:true})

                }
              );

              return ()=>{isMounted=false; controller.abort();}
      },[isRoleAdded,newPermissionAddedToUser,isRoleDeleted]);

        //////////////////////////////////////////////////////////////////////////////
        //                      DELETE ROLE(s)
        ///////////////////////////////////////////////////////////////////////////////
        const deleteRoles = async(rolesToDelete)=>{
                if(rolesToDelete===null || rolesToDelete===undefined || rolesToDelete.length===0){
                    dispatchUsers({isRequestError:true,message:"No roles selected.",isRequestSuccessful:false});
                }else{
                   let  results ={isRequestSuccessful:false};
                   let lastRole=null;
                   let  successfulDeletedRoles=[];
                   for(let roleToDelete of rolesToDelete){
                        lastRole = roleToDelete;
                        results= await deleteRoleApi(roleToDelete.name);
                       if(results.isRequestError){
                           break;
                       }else successfulDeletedRoles.push(roleToDelete);
                   }
                    if(results.isRequestError){
                       results.message= `${results.message}. role:${lastRole.name}`;
                    }
                   if(results.isRequestSuccessful){

                        //remove deleted permissions from list
                        const newRoleList =(list)=> list.filter((roleItem)=>{
                              return !successfulDeletedRoles.find((roleItem1)=>roleItem.id===roleItem1.id && roleItem.name==roleItem1.name);
                        });
                        const temp =newRoleList(selected);
                        console.log(temp);
                        setSelected(temp);
                        setIsRoleDeleted(true);
                   }
                   dispatchUsers(results);
                }
        }
         // Delete role by name
       const deleteRoleApi  = (roleName)=>{

            const API = `/holiday-plan/api/admin/role/delete/?roleName=${roleName}`;
            const newRequestResponse ={isRequestSuccessful:false,isRequestError:false,message:""};

            return useAxiosPrivate.delete(API)
            .then(response => {
                if(response.ok || response.status===200){
                    newRequestResponse.isRequestSuccessful=true;
                    newRequestResponse.isRequestError=false;
                    newRequestResponse.message="Successfully deleted role."
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
              stableSort(users.data, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
              ),
            [users.data,order, orderBy, page, rowsPerPage],
        );

        const [anchorElUser, setAnchorElUser] = React.useState(null);

  return (
  users.data.length===0?
      <Typography align="center" variant="h4" color="red" font-size="1rem">{roles.exceptionMessage}</Typography>
   :
    <Box sx={{ width: '100%', display:{xs:"block",md:"flex"}}}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar 
          BarItems={[
            {name:"Delete-user",link:`${currentPath}/delete-user`, fun:setIsDeleteRoleOpen},
            {name:"Add-Role", link:`${currentPath}/add-role`,fun:setAddRoleOpen},
            {name:"Add-Permission",link:`${currentPath}/add-permission`,fun:setAddPermission},
        ]}
          setAnchorElUser ={setAnchorElUser}
          anchorElUser={anchorElUser}
          numSelected={selected.length} 
          setAddPermission={setAddPermission} 
          setAddRole={setAddRoleOpen}
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

                (users.isRequestError || users.isRequestSuccessful)&&
                 <TableRow>
                   <TableCell  variant="body" align="left"
                       sx={{width:"100%",height:"1rem",color:users.isRequestError?"red":"green"}}
                   >
                       {users.message}
                   </TableCell>
                 </TableRow>
              }

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
                        <TableCell align="center"><RolesPermissionsOfUser permissions={user.roles}/></TableCell>

                        <TableCell align="center"><RolesPermissionsOfUser permissions={user.permissions}/></TableCell>
                        <TableCell padding="checkbox">
                            <Avatar
                                sx={{ bgcolor:'#4169e1'}}
                                >
                                <FaUserEdit/>
                            </Avatar>
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
      {isDeleteRoleOpen&&<SelectedItems
                    heading ={"Roles to delete" }
                    SelectedItems={selected}
                    fieldName={"firstname,lastname"}
                    setSelectedItems={deleteRoles}
                    openListSelectedItems={isDeleteRoleOpen}
                    setOpenListSelectedItems={setIsDeleteRoleOpen}
                
      />}
    </Box>
  );
}
