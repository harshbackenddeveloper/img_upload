// export const userlocalStorageData = () => {
//     const localData = localStorage.getItem("token")
//     const userRole = localStorage.getItem("User_Role")
//     const userToken = JSON.parse(localData)
//     const Role_User = JSON.parse(userRole)
//     return { userToken, Role_User }
// }



export const userlocalStorageData = () => {
    const localData = sessionStorage.getItem("token")
    const userRole = sessionStorage.getItem("User_Role")
    const userToken = JSON.parse(localData)
    const Role_User = JSON.parse(userRole)
    return { userToken, Role_User }
}


// export const userlocalStorageData = () => {
//     const localData = localStorage.getItem("token");
//     const userRole = localStorage.getItem("User_Role");
  
//     if (localData && userRole) {
//       const userToken = JSON.parse(localData);
//       const Role_User = JSON.parse(userRole);
//       return { userToken, Role_User };
//     } else {
//       return null;
//     }
//   };