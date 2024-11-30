import {createContext,useState,useEffect} from 'react'
export const UserContext = createContext();

export function UserContextProvider({children}){
    const API_URL = "http://localhost:5000/profile";
    const [userInfo, setUserInfo] = useState({});
    useEffect(() => {
        // Fetch user data when the component mounts
        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_URL}/profile`, {
                    credentials: 'include',
                });
                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        fetchUser();
    }, [API_URL]);
    return (
        <UserContext.Provider value={{userInfo,setUserInfo}}>
            {children}
        </UserContext.Provider>
    )
}