import  { createContext} from 'react';
export const CreateAuthContext = createContext(); // added this

/*
const initialState = {
    isAuthenticated: false,
    access_token: null,
    refresh_token: null,
    
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "LOGIN":
        return {
          ...state,
          isAuthenticated: true,
          access_token: action.payload.access_token,
          refresh_token: action.payload.refresh_token
        };
      case "LOGOUT":
        
        return {
          ...state,
          isAuthenticated: false,
          access_token: null,
          refresh_token: null,
        };
      default:
        return state;
    }
}

const CreateAuthContext = createContext(); // added this
 const AuthenticationContext = ({ children }) => {
    const[userLoginState, dispatchLogin] = useReducer(reducer, initialState)
    return (
      <CreateAuthContext.Provider value={{userLoginState, dispatchLogin}}>
        {children}
      </CreateAuthContext.Provider>
    );
  };
  export  default AuthenticationContext*/
