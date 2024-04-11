import "../../css/Profil/Profil.css";

function Profile({user}){
    return(
        <div className="profil">
            <h2>{user.firstName}</h2>
            <h2>{user.lastName}</h2>
        </div>
    );
}

export default Profile;