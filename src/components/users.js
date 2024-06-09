import React, { useState } from 'react'
import Table from 'react-bootstrap/Table';
import { Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BiSortDown, BiSortUp } from 'react-icons/bi';
import { BsEye } from 'react-icons/bs';
import Modal from 'react-modal';


const ITEMS_PER_PAGE = 5; // Number of items per page

const jsonData = [
    {
        "id": 1,
        "name": "Marcus Krajcik Sr.",
        "email": "marcus-krajcik-sr.@liehn.net",
        "company": "Lueilwitz - Kiehn",
        "title": "Industrial Engineer",
        "profilePicture": "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
        "id": 2,
        "name": "Jerome Gutmann IV",
        "email": "jerome-reicv@-and-olson.net",
        "company": "Rowe, Kassulke and Olson",
        "title": "Research Scientist",
        "profilePicture": "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
        "id": 3,
        "name": "Oscar Witting",
        "email": "oscar-witting@morar-llc.io",
        "company": "Morar LLC",
        "title": "Customer Success Specialist",
        "profilePicture": "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
        "id": 4,
        "name": "Dorothy Reilly",
        "email": "dorothy-o'reilly@and-hoppe.co",
        "company": "Runte, Schneider and Hoppe",
        "title": "Lead Developer",
        "profilePicture": "https://randomuser.me/api/portraits/women/4.jpg"
    },
    {
        "id": 5,
        "name": "Edna Flatley",
        "email": "edna-flatley@upton-group.dev",
        "company": "Upton Group",
        "title": "Chief Marketing Officer",
        "profilePicture": "https://randomuser.me/api/portraits/women/5.jpg"
    },
    {
        "id": 6,
        "name": "Johnathan Morar",
        "email": "johnathan-morar@farrell-inc.co",
        "company": "Farrell Inc",
        "title": "Financial Analyst",
        "profilePicture": "https://randomuser.me/api/portraits/men/6.jpg"
    },
    {
        "id": 7,
        "name": "Dr. Orville Grady",
        "email": "dr.-orville-grady@abern-kubowski.io",
        "company": "Abernathy - Jakubowski",
        "title": "Head of Research",
        "profilePicture": "https://randomuser.me/api/portraits/men/7.jpg"
    },
    {
        "id": 8,
        "name": "Frances Hilll",
        "email": "frances-hilll@vandervort-blick-and-breitenberg.com",
        "company": "Vandervort, Blick and Breitenberg",
        "title": "Director of Operations",
        "profilePicture": "https://randomuser.me/api/portraits/women/8.jpg"
    },
    {
        "id": 9,
        "name": "Jared Hand",
        "email": "jared-hand@walter-inc.com",
        "company": "Walter Inc",
        "title": "Director of Sales",
        "profilePicture": "https://randomuser.me/api/portraits/men/9.jpg"
    }
];


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

function Users() {
    const [sortConfig, setSortConfig] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalIsOpen_view, setIsOpen_view] = React.useState(false);
    const [modalIsOpen_add, setIsOpen_add] = React.useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formDataAdd, setFormDataAdd] = useState({
        name: '',
        email: '',
        company: '',
        title: '',
        profilePicture: ''
    });

    const openModal_view = (item) => {
        setSelectedItem(item);
        setIsOpen_view(true);
    };

    const closeModal_view = () => {
        setIsOpen_view(false);
        setSelectedItem(null);
    };

    const openModal_add = (item) => {
        setIsOpen_add(true);
    };

    const closeModal_add = () => {
        setIsOpen_add(false);
    };

    function afterOpenModal_view() { }

    function afterOpenModal_add() { }

    const handleChange = (e) => {
        const { id, value, files } = e.target;
        if (id === 'profilePicture' && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormDataAdd((prevData) => ({
                    ...prevData,
                    profilePicture: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setFormDataAdd((prevData) => ({
                ...prevData,
                [id]: value,
            }));
        }
    };

    const handleOnSubmit_add = () => {
        console.log('Form Data:', formDataAdd);
        setFormDataAdd({
            name: '',
            email: '',
            company: '',
            title: '',
            profilePicture: ''
        });
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset pagination to first page when searching
    };

    const filteredData = () => {
        return sortedData().filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const sortedData = () => {
        let sortableData = [...jsonData];
        if (sortConfig !== null) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    };

    const getSortIcon = (columnName) => {
        if (!sortConfig || sortConfig.key !== columnName) {
            return <BiSortUp className="sort-icon" />;
        }
        if (sortConfig.direction === 'ascending') {
            return <BiSortUp className="sort-icon" />;
        } else {
            return <BiSortDown className="sort-icon" />;
        }
    };

    // Pagination logic
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredData().slice(indexOfFirstItem, indexOfLastItem);
    const totalItems = filteredData().length;
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    return (
        <div className="div-body">
            <div className="row justify-content-between mt-4">
                <div className="col-md-3 mx-3 text-left">
                    <button className='btn btn-outline-primary d-none' onClick={() => openModal_add()} disabled>+ Add User</button>
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

            <div className="table-container">
                {/* <h2 className='my-3'>User table</h2> */}
                <div className="container mt-2">
                    <Table hover responsive className="table-white rounded">
                        <thead className="thead-light rounded-top">
                            <tr>
                                <th className="col-id"> Dp </th>
                                <th className="col-id" onClick={() => handleSort('id')}>
                                    Id {getSortIcon('id')}
                                </th>
                                <th className="col-name" onClick={() => handleSort('name')}>
                                    Name {getSortIcon('name')}
                                </th>
                                <th className="col-email" onClick={() => handleSort('email')}>
                                    Email {getSortIcon('email')}
                                </th>
                                <th className="col-company" onClick={() => handleSort('company')}>
                                    Company {getSortIcon('company')}
                                </th>
                                <th className="col-title" onClick={() => handleSort('title')}>
                                    Title {getSortIcon('title')}
                                </th>
                                <th className="col-actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        {item.profilePicture && (
                                            <img src={item.profilePicture} className='tbl-user-img' alt="Profile" />
                                        )}
                                    </td>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.company}</td>
                                    <td>{item.title}</td>
                                    <td>
                                        <button className="btn btn-link p-0 mx-2" onClick={() => openModal_view(item)}><BsEye /></button>
                                        {/* <button className="btn btn-link p-0 text-danger"><BiTrash /></button> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Pagination className="justify-content-end">
                        <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                        {[...Array(Math.ceil(totalItems / ITEMS_PER_PAGE))].map((_, index) => (
                            <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(totalItems / ITEMS_PER_PAGE)} />
                    </Pagination>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen_view}
                onAfterOpen={afterOpenModal_view}
                onRequestClose={closeModal_view}
                style={customStyles}
                contentLabel="View Modal for User"
            >
                <h3 className="my-3 text-center">User Details</h3>
                <button className="close-btn float-right" onClick={closeModal_view}>×</button>
                <form className="mt-4">
                    <div className="form-group text-center">
                        {selectedItem?.profilePicture && (
                            <img
                                src={selectedItem.profilePicture}
                                alt="Profile"
                                style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '15px' }}
                            />
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input id="name" className="form-control" type="text" value={selectedItem?.name || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" className="form-control" type="email" value={selectedItem?.email || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="company">Company</label>
                        <input id="company" className="form-control" type="text" value={selectedItem?.company || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input id="title" className="form-control" type="text" value={selectedItem?.title || ''} readOnly />
                    </div>
                </form>

            </Modal>

            <Modal
                isOpen={modalIsOpen_add}
                onAfterOpen={afterOpenModal_add}
                onRequestClose={closeModal_add}
                style={customStyles}
                contentLabel="Add User Modal"
            >

                <button className="close-btn float-right" onClick={closeModal_add}>×</button>
                <h3 className="my-4 text-center">Add User Details</h3>
                <form className="mt-4">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input id="name" className="form-control" type="text" placeholder="Enter name" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" className="form-control" type="email" placeholder="Enter email" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="company">Company</label>
                        <input id="company" className="form-control" type="text" placeholder="Enter company" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input id="title" className="form-control" type="text" placeholder="Enter title" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="profilePicture">Profile Picture</label>
                        <input id="profilePicture" className="form-control" type="file" accept="image/*" onChange={handleChange} />
                    </div>
                    <button type="button" className="mt-3 btn btn-primary" onClick={handleOnSubmit_add}>Add User</button>
                </form>
            </Modal>
        </div>
    )
}

export default Users
