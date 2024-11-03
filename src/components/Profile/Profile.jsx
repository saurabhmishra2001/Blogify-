import { useSelector } from 'react-redux'

function Profile() {
    const userData = useSelector((state) => state.auth.userData)

    return (
        <div className="max-w-screen-xl mx-auto p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center space-x-4">
                    {userData?.profilePicture ? (
                        <img 
                            className="w-16 h-16 rounded-full"
                            src={userData.profilePicture} 
                            alt={userData.name} 
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl">
                            {userData?.name?.charAt(0) || 'U'}
                        </div>
                    )}
                    <div>
                        <h1 className="text-xl font-semibold dark:text-white">{userData?.name}</h1>
                        <p className="text-gray-500 dark:text-gray-400">{userData?.email}</p>
                    </div>
                </div>
                
                {/* Add more profile information and settings as needed */}
                <div className="mt-6">
                    <h2 className="text-lg font-semibold dark:text-white mb-4">Profile Information</h2>
                    {/* Add form or display more user information */}
                </div>
            </div>
        </div>
    )
}

export default Profile 