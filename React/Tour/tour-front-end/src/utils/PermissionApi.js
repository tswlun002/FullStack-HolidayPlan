export async function getAllPermissions({axios,controller}){
    const API = '/holiday-plan/api/admin/permission/permissions/';
    return await axios.get(API, {signal:controller.signal})
    
 }