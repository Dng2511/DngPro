import React from "react";
import { getProfile } from "../../services/Api";

const Profile = () => {

    const [profile, setProfile] = React.useState(null);

    React.useEffect(() => {
        getProfile().then((response) => {
            setProfile(response.data);
            console.log(response.data);
        });
    }, []);

    return (
        <div>
            <h1>Profile Page</h1>
        </div>
        
    );
}

export default Profile;