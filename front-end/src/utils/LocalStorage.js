export const   extractFromLocalStorage=(key)=>JSON.parse(window.localStorage.getItem(key));
export const   setToLocalStorage=(key,value)=>window.localStorage.setItem(key,JSON.stringify(value));