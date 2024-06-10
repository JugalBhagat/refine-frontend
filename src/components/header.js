import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import clogo from '../img/brand1.png';
import useProfileStore from '../zustand_store/profileStore';
import { toast } from 'react-toastify';

const customStyles = {
    content: {
        position: 'absolute',
        top: '0',
        inset: "0px 0px 0px 30%",
        right: '0', // Stick to the right side
        bottom: '0',
        border: '1px solid #ccc',
        background: '#fff',
        overflow: 'auto',
        borderRadius: '4px',
        outline: 'none',
        padding: '20px',
        width: '35%', // Updated width to 35%
        height: '100%',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 100000, // Increased z-index
    },
    overlay: {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.75)', // Backdrop to disable other areas
        zIndex: 1049, // Just below the modal
    },
};

Modal.setAppElement('#root');

function Header({ isLogin, setIsLogin }) {
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const profileStore = useProfileStore();
    const profile = useProfileStore((state) => state.profile);
    const [formData, setFormData] = useState({
        user_id: '',
        username: '',
        role: '',
        email: '',
        dp: '',
        created_at: '',
    });

    useEffect(() => {
        console.log("Fetching user data...");
        const user_id = localStorage.getItem('user_id');
        const token = localStorage.getItem('token');
        if (user_id && token) {
            fetch(`http://localhost:8000/users/fetchuser/${user_id}`, {
                headers: {
                    Authorization: token
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("User data fetched successfully:", data);
                    profileStore.setProfile(data);
                    setFormData({
                        user_id: data.user_id,
                        username: data.username,
                        role: data.role,
                        email: data.email,
                        dp: data.dp,
                        created_at: data.created_at,
                    });
                })
                .catch(error => {
                    console.error("Error fetching user data:", error);
                    toast.error("Error fetching user data");
                });
        } else {
            console.log("No user_id or token found in localStorage");
        }
        // eslint-disable-next-line
    }, [isLogin]);

    useEffect(() => {
        setFormData({
            user_id: profile.user_id,
            username: profile.username,
            role: profile.role,
            email: profile.email,
            dp: profile.dp,
            created_at: profile.created_at,
        });

        if (profile.dp && profile.dp.type === 'Buffer') {
            const blob = new Blob([new Uint8Array(profile.dp.data)], { type: 'image/jpeg' });
            const reader = new FileReader();
            reader.onload = () => {
                setFormData(prevState => ({ ...prevState, dp: reader.result }));
            };
            reader.readAsDataURL(blob);
        }
    }, [profile]);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    const handleApply = async () => {
        console.log(formData);

        const formDataToSend = new FormData();
        formDataToSend.append("user_id", formData.user_id);
        formDataToSend.append("username", formData.username);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("role", formData.role);

        try {
            const response = await fetch("http://localhost:8000/users/updateuser", {
                method: "PUT",
                body: formDataToSend,
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });

            if (!response.ok) {
                toast.error("Network response was not ok");
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            console.log("Success:", result);
            toast.success("Data updated successfully");
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error:", error);
        }
    };

    const handleLogOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        setIsLogin(false);
        profileStore.clearProfile();
    };

    return (
        <>
            <div className='header-menu'>
                <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "#fff", height: "13vh", boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)" }}>
                    <div className="container-fluid">
                        <img className='mx-5 clogo' src={clogo} alt="Description of the Logo" />
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse ends-2" id="navbarSupportedContent">
                            <form className="d-flex mx-5">
                                {/* <h4>{formData.username}</h4> */}
                            </form>
                            <form className="d-flex align-items-center">
                                <div class="circle-container-logo mx-4">
                                    <img className='logo ' style={{ cursor: "pointer" }} src={formData.dp} alt="Description of the Logo" onClick={openModal} />
                                </div>
                            </form>
                        </div>
                    </div>
                </nav>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Account Settings Modal"
            >
                <div className="account-settings">
                    <div className="header">
                        <h2>Account Settings</h2>
                        <button className="close-btn" onClick={closeModal}>×</button>
                    </div>
                    <div className="profile">
                        <div className="circle-container-profile-img mx-4">
                            <img src={formData.dp} alt="Profile" className="profile-img" />
                        </div>
                        <h3>{formData.username}</h3>
                    </div>
                    <div className="section">
                        <h4>User profile</h4>
                        <div className="field">
                            <label>Name</label>
                            <input type="text" className='form-control' name="username" value={formData.username} onChange={handleInputChange} />
                            <button className="edit-btn">✎</button>
                        </div>
                        <div className="field">
                            <label>Role</label>
                            <input type="text" className='form-control' name="role" value={formData.role} onChange={handleInputChange} />
                            <button className="edit-btn">✎</button>
                        </div>
                        <div className="field">
                            <label>Email</label>
                            <input type="text" className='form-control' name="email" value={formData.email} onChange={handleInputChange} />
                            <button className="edit-btn">✎</button>
                        </div>
                    </div>
                    <div className="section">
                        <button className="btn btn-primary" onClick={handleApply}><i className="fa-solid fa-check"></i> Apply changes</button>
                    </div>
                    <div className="section">
                        <button className="btn btn-primary" onClick={handleLogOut}><i className="fa-solid fa-right-from-bracket"></i> Logout</button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default Header;
