import SERVER_API from '../config';

// const tokenIsExpired = () => {
//     const token = localStorage.getItem('access');
//     if(token){
//         if(token.exp < new Date().getTime() / 1000){
//             return true
//         }else{
//             return false
//         }
//     }else{
//         return false
//     }
// }

// const tokenRefresh = () => {
//     const token = localStorage.getItem('access');
//     const refresh = localStorage.getItem('refresh');
//     if(token && refresh){
//         const fetchData = async () => {
//             const responseOptions = {

//             }
//             const response = await fetch('http://localhost:8000/auth/jwt/refresh/')
//         } 
//     }
// }

// export const getProfile = async (username) => {
//     try{
//         const response = await fetch(`http://localhost:8000/api/v1/profileData/${username}`);
//         if(response.ok){
//             return await response.json();
//         }else{
//             return null;
//         }
//     }catch(error){
//         console.log(error);
//         return null
//     }

// }
