
import CssTextField from '../component/CssTextField';



const RoleAndPermission =()=>{

   //onChange={(e)=>dispatchRegister({userType:e.target.value.toUpperCase()})}
                    // value={userRegister.userType}
    return (


        <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group"></FormLabel>
            <RadioGroup  className='radio-group'
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"

            >
                <div className='radio-group'style={{display:"flex"}}>
                    <FormControlLabel value="ADMIN" control={<Radio />} label="Admin" />
                    <FormControlLabel value="USER" control={<Radio />} label="User" />
                </div>
            </RadioGroup>
        </FormControl>

        <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group"></FormLabel>
            <CheckBoxGroup  className='radio-group'
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
            >
                <div className='radio-group'style={{display:"flex"}}>
                    <FormControlLabel value="WRITE" control={<CheckBox />} label="WRITE" />
                    <FormControlLabel value="READ" control={<CheckBox />} label="READ" />

                </div>
            </CheckBoxGroup>
        </FormControl>

       <CssTextField
             required
            variant="outlined"
            helpertext=""
            id="demo-helper-text-aligned"
            label="confirm-password"
            color="secondary"
            type="text" autoComplete='new-password' className="password-input" placeholder="confirm password" value={register.confirmPassword}
            onChange={(e)=>dispatchRegister({confirmPassword:e.target.value, isLoginError:false})}
        />

        <CssTextField
             required
            variant="outlined"
            helpertext=""
            id="demo-helper-text-aligned"
            label="confirm-password"
            color="secondary"
            type="password" autoComplete='new-password' className="password-input" placeholder="confirm password" value={register.confirmPassword}
            onChange={(e)=>dispatchRegister({confirmPassword:e.target.value, isLoginError:false})}
        />

    )


}