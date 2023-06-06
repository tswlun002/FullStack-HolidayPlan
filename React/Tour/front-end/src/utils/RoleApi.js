export async function getAllRoles({axios,controller}){
    const API = '/holiday-plan/api/admin/role/roles/';
    return await axios.get(API, {signal:controller.signal})
    
 }