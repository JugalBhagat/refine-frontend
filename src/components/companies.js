import React, { useState, useEffect } from 'react';
import CompanyCard from './companyCard';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 1049,
    },
};

function Companies() {
    const [searchTerm, setSearchTerm] = useState('');
    const [modalIsOpen_add, setIsOpen_add] = React.useState(false);
    const [countries, setCountries] = useState([]);
    const [companiesData, setCompaniesData] = useState([]);
    const [reload, setReload] = useState(false);
    const [formData, setFormData] = useState({
        cid:'',
        logo: null,
        companyName: '',
        country: '',
        revenue: '',
        type: '',
        size: ''
    });

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('http://localhost:8000/fetchcountry');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data && data.message && data.countries) {
                    setCountries(data.countries);
                } else {
                    throw new Error('Invalid data structure in response');
                }
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8000/companies/allcompanies', {
                    headers: {
                        'Authorization': token
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data);

                if (data && data.message === 'All data fetched' && data.data) {
                    const formattedData = data.data.map(company => ({
                        cid:company.cid,
                        logo: URL.createObjectURL(new Blob([new Uint8Array(company.logo.data)], { type: 'image/jpeg' })),
                        companyName: company.cname,
                        revenue: company.revenue,
                        type: company.type,
                        size: company.size,
                        country: company.country
                    }));
                    setCompaniesData(formattedData);
                    // console.log(formattedData);
                } else {
                    throw new Error('Invalid data structure in response');
                }
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };
        fetchCompanies();
    }, [modalIsOpen_add,reload]);

    const handleOnSubmit_add = () => {
        const token = localStorage.getItem('token');
        const formDataToSend = new FormData();
        formDataToSend.append('file', formData.logo);
        formDataToSend.append('cname', formData.companyName);
        formDataToSend.append('country', formData.country);
        formDataToSend.append('revenue', formData.revenue);
        formDataToSend.append('type', formData.type);
        formDataToSend.append('size', formData.size);

        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': token
            },
            body: formDataToSend
        };

        fetch('http://localhost:8000/companies/add', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.message === "Company Added successful") {
                    toast.success("Company added successfully!");
                    setFormData({
                        logo: null,
                        companyName: '',
                        country: '',
                        revenue: '',
                        type: '',
                        size: ''
                    });
                    setIsOpen_add(false);
                } else {
                    toast.error(data.message || "Error adding company");
                }
            })
            .catch(error => {
                toast.error("Network error, please try again");
            });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            logo: e.target.files[0]
        });
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    };

    const openModal_add = () => {
        setIsOpen_add(true);
    };

    const closeModal_add = () => {
        setIsOpen_add(false);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCompanies = companiesData.filter(company =>
        company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="div-body">
            <ToastContainer />
            <div className="row justify-content-between mt-4">
                <div className="col-md-3 mx-2 text-left">
                    <button className='btn btn-primary' onClick={openModal_add}>+ Add new Company</button>
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
                            <CompanyCard company={company} setReload={setReload} />
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
                        <input id="logo" className="form-control" type="file" accept="image/*" onChange={handleFileChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="companyName">Company Name</label>
                        <input id="companyName" className="form-control" type="text" placeholder="Enter company name" value={formData.companyName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <select id="country" className="form-control" value={formData.country} onChange={handleChange}>
                            <option value="">Select Country</option>
                            {countries.map((country, index) => (
                                <option key={index} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="revenue">Revenue</label>
                        <input id="revenue" className="form-control" type="text" placeholder="Enter revenue" value={formData.revenue} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Type</label>
                        <input id="type" className="form-control" type="text" placeholder="Enter type" value={formData.type} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="size">Size</label>
                        <input id="size" className="form-control" type="text" placeholder="Enter size" value={formData.size} onChange={handleChange} />
                    </div>
                    <button type="button" className="btn btn-primary" onClick={handleOnSubmit_add}>Add Company</button>
                </form>
            </Modal>
        </div>
    );
}

export default Companies;
