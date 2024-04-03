
import {  useReducer, useState} from "react"
import {  Typography,Box,Card,CardContent,CardHeader } from '@mui/material';
import CssTextField from './CssTextField';
import ColorButton from './ColorButton';
import {RegisterAdmin } from '../utils/User';
import UseAxiosPrivate from '../utils/UseAxiosPrivate'
import { PRIMAR_COLOR } from "../utils/Constant";
import PasswordVisibility from './PasswordVisibility';
import Register from "../pages/Register"
const RegisterAdminForm =()=>{
    return (
      <Register/>
    )
}

export default RegisterAdminForm;