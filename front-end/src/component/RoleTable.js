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
import PermissionsOfRole from './PermissionsOfRole'
import { RolePermissionContext } from '../context/RolePermissionContext';
import Collapse from '@mui/material/Collapse';
import Modal from '@mui/material/Modal';
import AddPermissionToRole from '../component/AddPermissionToRole';
import { NavLink, useParams } from 'react-router-dom';
import AddRole from './AddRole';
import SelectedItems from '../component/SelectedItems';
import { getAllPermissions } from '../utils/PermissionApi';
import  {getAllRoles} from '../utils/RoleApi';
import UsePrivateAxios from '../utils/UseAxiosPrivate'
import {getErrorMessage} from '../utils/Error';
const header_background  ="linear-gradient(to right,rgba(145, 111, 179, 0.5),rgba(102, 51, 153, 0.85),rgba(77,26,127  , 0.90),rgba(155, 104, 207, 0.6))!important";


function createData(name, permissions) {
  return {
    name,
    permissions,
  };
}



function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
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
  console.log(array);
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
    id: 'Roles',
    numeric: false,
    disablePadding: true,
    label: 'Roles',
  },
  {
    id: 'Permissions',
    numeric: true,
    disablePadding: false,
    label: 'Permissions of Role',
  }
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
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
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
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
                          color:isActive?"orange":
                          isPending?"green":"black", 
                          textDecoration:"none",  padding:"2rem 1rem"}
                      }}
                    >
                      {item.name}
                    </NavLink>
                        
              })
            
          }  
      </Box>
  </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('Roles');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const {roles, setRoles, permissions} =  React.useContext(RolePermissionContext);
  const {barRoleActions} = useParams();
  const [isAddPermission, setAddPermission] = React.useState(false);
  const useAxiosPrivate = UsePrivateAxios();
  
  React.useEffect(()=>{

    let isMounted = true;
    const controller = new AbortController();
    
    const API = '/holiday-plan/api/admin/role/roles/';
    isMounted && useAxiosPrivate.get(API, {signal:controller.signal})
    .then(response => {
            if(response.ok || response.status===200){
              console.log(response.data);
              setRoles(
                {
                  listRoles:response.data,
                  exceptionMessage:"Succefully get roles"
                }
              );

            }
    })
    .catch(err => {
             console.log("*************************************************");
            console.log(err);
            console.log("*************************************************");
            if(!err?.response.ok){
              const errorMessage  = getErrorMessage(err);
              setRoles({exceptionMessage:errorMessage});
            }
            else{
              setRoles({exceptionMessage:"Server Error"});
            } 
    });
    return ()=>{isMounted=false; controller.abort();}

  },[]);


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = roles.listRoles.map((element) => element.name);
      setSelected(newSelected);
      
      return;
    }
    setSelected([]);
    setAddPermission(false);
    
  };

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

    setSelected(newSelected);
    if(newSelected.length===0){
      setAddPermission(false);
    }
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

  const isSelected = (element) => selected.indexOf(element) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - roles.listRoles.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(roles.listRoles, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [roles.listRoles,order, orderBy, page, rowsPerPage],
  );

  const [anchorElUser, setAnchorElUser] = React.useState(null);
   
  const currentPath = "/home-admin/roles-permissions";
  const[isAddRole, setAddRole] = React.useState(false);
  const [role, setRole] = React.useState('');
  const [deleterole , setDeleteRole] = React.useState(false);
  //Store Data 
  const [error, setError] = React.useState(false);

  

  return (
  roles.listRoles.length===0?
      <Typography align="center" variant="h4" color="red" font-size="1rem">{roles.exceptionMessage}</Typography>
   :
    <Box sx={{ width: '100%', display:{xs:"block",md:"flex"}}}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar 
          BarItems={[
          {name:"Add Role", link:`${currentPath}/add-role`,fun:setAddRole},
          {name:"Delete Role",link:`${currentPath}/delete-role`, fun:setDeleteRole},
          {name:"Add Permission",link:`${currentPath}/add-permission`,fun:setAddPermission},
        ]}
          setAnchorElUser ={setAnchorElUser}
          anchorElUser={anchorElUser}
          numSelected={selected.length} 
          setAddPermission={setAddPermission} 
          setAddRole={setAddRole}
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
              rowCount={roles.listRoles.length}
            />
            <TableBody>
              
              {
               
               visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        onClick={(event) => handleClick(event, row)}
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell align="right"><PermissionsOfRole permissions={row.permissions}/></TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
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
      
      <Collapse in={isAddPermission} timeout="auto" unmountOnExit  sx={{display:{xs:"none",md:"block"}}}>
          <AddPermissionToRole setAddPermission={setAddPermission}/>  
      </Collapse>
      <Modal
         open ={isAddPermission}
         onClose={()=>setAddPermission(false)}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
          sx={{display:{xs:"flex",md:"none"},justifyContent:'center',alignItems:'center' }}
      >
        <AddPermissionToRole  setAddPermission={setAddPermission}/>
      </Modal>
      <Collapse in={isAddRole} timeout="auto" unmountOnExit  sx={{display:{xs:"none",md:"block"}}}>
          <AddRole  setRole={setRole} setAddRole={setAddRole}/>  
      </Collapse>
      <Modal
         open ={isAddRole}
         onClose={()=>setAddPermission(false)}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
          sx={{display:{xs:"flex",md:"none"},justifyContent:'center',alignItems:'center' }}
      >
        <AddRole setRole={setRole} setAddRole={setAddRole}/>
      </Modal>
      {deleterole&&<SelectedItems 
                    heading ={"Delete Role" }
                    SelectedItems={selected}
                    setSelectedItems={setSelected}
                    openListSelectedItems={deleterole}
                    setOpenListSelectedItems={setDeleteRole}
                
      />}
    </Box>
  );
}
