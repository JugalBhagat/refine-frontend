import React, { useState } from 'react'
import CompanyCard from './companyCard'
import Brand2 from '../img/brand2.png';
import Brand3 from '../img/brand3.png';
import Brand4 from '../img/brand4.png';
import Brand5 from '../img/brand5.png';
import Brand6 from '../img/brand6.png';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        width: '30%',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
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

const companiesData = [
    {
        logo: Brand2,
        companyName: "Chanel",
        revenue: "610,116.00",
        type: "B2C",
        size: "Medium",
        country: "USA"
    },
    {
        logo: Brand3,
        companyName: "Louis vuiton",
        revenue: "820,234.00",
        type: "B2B",
        size: "Large",
        country: "Canada"
    },
    {
        logo: Brand4,
        companyName: "Versace",
        revenue: "1,520,390.00",
        type: "B2B",
        size: "Large",
        country: "UK"
    },
    {
        logo: Brand5,
        companyName: "Cocacola",
        revenue: "420,670.00",
        type: "B2C",
        size: "Small",
        country: "Australia"
    },
    {
        logo: Brand6,
        companyName: "Rolex",
        revenue: "920,000.00",
        type: "B2B",
        size: "Medium",
        country: "Germany"
    }
];



function Companies() {
    const [searchTerm, setSearchTerm] = useState('');
    const [modalIsOpen_add, setIsOpen_add] = React.useState(false);
    const [formData, setFormData] = useState({
        logo: '',
        companyName: '',
        country:'',
        revenue: '',
        type: '',
        size: ''
    });

    const openModal_add = () => {
        setIsOpen_add(true);
    };

    const closeModal_add = () => {
        setIsOpen_add(false);
    };

    const handleChange_add = (e) => {
        const { id, value, files } = e.target;
        if (id === 'logo' && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prevData) => ({
                    ...prevData,
                    logo: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [id]: value,
            }));
        }
        setIsOpen_add(false);
    };

    const handleOnSubmit_add = () => {
        console.log('Form Data:', formData);
        setFormData({
            logo: '',
            companyName: '',
            country:'',
            revenue: '',
            type: '',
            size: ''
        });

    };


    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCompanies = companiesData.filter(company =>
        company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="div-body">
            <div className="row justify-content-between mt-4">
                <div className="col-md-3 mx-2 text-left">
                    <button className='btn btn-outline-primary' onClick={openModal_add}>+ Add new Company</button>
                </div>
                <div className="col-md-3">
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                                </svg>
                            </span>
                        </div>
                        <input type="text" className="form-control" placeholder="Search here..." value={searchTerm} onChange={handleSearch} />
                    </div>
                </div>
            </div>

            <div className="card-container mb-4">
                <div className="row">
                    {filteredCompanies.map((company, index) => (
                        <div className="col-md-6 col-lg-3 col-sm-12" key={index}>
                            <CompanyCard company={company} />
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen_add}
                onRequestClose={closeModal_add}
                style={customStyles}
                contentLabel="Add Company Modal"
            >
                <button className="close-btn float-right" onClick={closeModal_add}>×</button>
                <h3 className="my-4 text-center">Add Company</h3>
                <form className="mt-4">
                    <div className="form-group">
                        <label htmlFor="logo">Logo</label>
                        <input id="logo" className="form-control" type="file" accept="image/*" onChange={handleChange_add} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="companyName">Company Name</label>
                        <input id="companyName" className="form-control" type="text" placeholder="Enter company name" value={formData.companyName} onChange={handleChange_add} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="companyCountry">Country</label>
                        <input id="companyCountry" className="form-control" type="text" placeholder="Enter Country" value={formData.country} onChange={handleChange_add} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="revenue">Revenue</label>
                        <input id="revenue" className="form-control" type="text" placeholder="Enter revenue" value={formData.revenue} onChange={handleChange_add} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Type</label>
                        <input id="type" className="form-control" type="text" placeholder="Enter type" value={formData.type} onChange={handleChange_add} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="size">Size</label>
                        <input id="size" className="form-control" type="text" placeholder="Enter size" value={formData.size} onChange={handleChange_add} />
                    </div>
                    <button type="button" className="mt-3 btn btn-primary" onClick={handleOnSubmit_add}>
                        Add Company
                    </button>
                </form>
            </Modal>

        </div>
    )
}

export default Companies
