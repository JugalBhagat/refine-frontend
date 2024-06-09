import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import myImage from '../img/my_img.jpg';
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

function Header({isLogin,setIsLogin}) {
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const profile = useProfileStore((state) => state.profile);
    const profileStore = useProfileStore();

    const [formData, setFormData] = useState({
        user_id:profile.user_id,
        username: profile.username,
        role: profile.role,
        email: profile.email,
        dp:profile.dp
    });

    useEffect(() => {
        if (profile.dp && profile.dp.type === 'Buffer') {
            const blob = new Blob([new Uint8Array(profile.dp.data)], { type: 'image/jpeg' });
            const reader = new FileReader();
            reader.onload = () => {
                setFormData(prevState => ({ ...prevState, dp: reader.result }));
            };
            reader.readAsDataURL(blob);
        }
        else{
            setIsLogin(false);
            profileStore.clearProfile();
            localStorage.removeItem("token");
            setIsLogin(false);
        }
    }, [profile.dp,isLogin]);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    function handleInputChange(e) {
        const { name, value } = e.target; // Destructure name and value from the event target
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value // Update the state dynamically based on input name
        }));
    }

    const handleApply = async () => {
        console.log(formData);
    
        // Create a FormData object and append the fields
        const formDataToSend = new FormData();
        formDataToSend.append("user_id", formData.user_id);
        formDataToSend.append("username", formData.username);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("role", formData.role);
    
        try {
            const response = await fetch("http://localhost:8000/users/updateuser", {
                method: "POST",
                body: formDataToSend, // Send the FormData object
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
                                {/* <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" /> */}
                            </form>
                            <form className="d-flex align-items-center">
                                {/* <img width="40" height="40" src="https://img.icons8.com/carbon-copy/100/bell--v1.png" alt="bell--v1" /> */}
                                <img className='logo mx-3' style={{ cursor: "pointer" }} src={formData.dp} alt="Description of the Logo" onClick={openModal} />
                            </form>
                        </div>
                    </div>
                </nav>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div className="account-settings">
                    <div className="header">
                        <h2>Account Settings</h2>
                        <button className="close-btn" onClick={closeModal}>×</button>
                    </div>
                    <div className="profile">
                        <img src={formData.dp} alt="Profile" className="profile-img " />
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

export default Header
