export const userlocalStorageData = () => {
    const localData = sessionStorage.getItem("token")
    const userRole = sessionStorage.getItem("User_Role")
    const userToken = JSON.parse(localData)
    const Role_User = JSON.parse(userRole)
    return { userToken, Role_User }
}


export const ProperDateFormat = ({dateString}) => {
    console.log("dateString at common ", dateString)
    // Convert the string to a Date object
    const date = new Date(dateString);

    // Extract date, month, and year
    const day = date.getDate();
    // Add leading zeros if day is single digit
    const formattedDay = day < 10 ? `0${day}` : day;
    // Month is zero-based, so add 1 to get the correct month
    const month = date.getMonth() + 1;
    // Add leading zeros if month is single digit
    const formattedMonth = month < 10 ? `0${month}` : month;
    const year = date.getFullYear();

    // Concatenate and return the formatted date
    return `${formattedDay}/${formattedMonth}/${year}`;
  };