import React, { useState } from 'react'
import Table from 'react-bootstrap/Table';
import { Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BiPencil, BiTrash, BiSortDown, BiSortUp } from 'react-icons/bi';
import { BsEye } from 'react-icons/bs';
import Modal from 'react-modal';


const ITEMS_PER_PAGE = 5; // Number of items per page

const jsonData = [
    {
        "nid": 1,
        "note": "This is a note by Marcus Krajcik Sr.",
        "title": "Industrial Engineering Notes",
        "created_time": "2024-06-01T10:15:30Z",
        "created_by": "Marcus Krajcik Sr."
    },
    {
        "nid": 2,
        "note": "Research on new materials.",
        "title": "Material Research",
        "created_time": "2024-06-02T11:20:25Z",
        "created_by": "Jerome Gutmann IV"
    },
    {
        "nid": 3,
        "note": "Customer success strategies.",
        "title": "Customer Success",
        "created_time": "2024-06-03T09:10:15Z",
        "created_by": "Oscar Witting"
    },
    {
        "nid": 4,
        "note": "Lead developer responsibilities.",
        "title": "Development Notes",
        "created_time": "2024-06-04T08:50:45Z",
        "created_by": "Dorothy Reilly"
    },
    {
        "nid": 5,
        "note": "Marketing strategies for Q3.",
        "title": "Marketing Strategies",
        "created_time": "2024-06-05T14:25:30Z",
        "created_by": "Edna Flatley"
    },
    {
        "nid": 6,
        "note": "Financial analysis report.",
        "title": "Financial Analysis",
        "created_time": "2024-06-06T12:35:20Z",
        "created_by": "Johnathan Morar"
    },
    {
        "nid": 7,
        "note": "Research department updates.",
        "title": "Research Updates",
        "created_time": "2024-06-07T10:15:30Z",
        "created_by": "Dr. Orville Grady"
    },
    {
        "nid": 8,
        "note": "Operational improvements.",
        "title": "Operations",
        "created_time": "2024-06-08T15:45:10Z",
        "created_by": "Frances Hilll"
    },
    {
        "nid": 9,
        "note": "Sales strategies for Q4.",
        "title": "Sales Strategies",
        "created_time": "2024-06-09T16:20:00Z",
        "created_by": "Jared Hand"
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

function Notes() {
    const [sortConfig, setSortConfig] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalIsOpen_edit, setIsOpen_edit] = React.useState(false);
    const [modalIsOpen_add, setIsOpen_add] = React.useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isViewMode, setIsViewMode] = useState(false);
    const [formData, setFormData] = useState({
        nid: '',
        title: '',
        note: '',
        created_by: '',
        created_time: '',
      });

    const openModal_edit = (item, mode) => {
        setSelectedItem(item);
        setIsOpen_edit(true);
        setIsViewMode(mode === 'view');
    };

    const closeModal_edit = () => {
        setIsOpen_edit(false);
        setSelectedItem(null);
        setIsViewMode(false);
    };
    
    const openModal_add = (item, mode) => {
        setIsOpen_add(true);
    };

    const closeModal_add = () => {
        setIsOpen_add(false);
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
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.created_by.toLowerCase().includes(searchTerm.toLowerCase())
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

    const handleOnSubmit_edit = (e) => {
        e.preventDefault();
        console.log('Edited Values:', selectedItem);
    };

    const handleChange_add = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [id]: value,
        }));
      };

    const handleOnSubmit_add = (e) => {
        e.preventDefault();
        console.log('Added Values:', formData);
    }


    Modal.setAppElement('#root');

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
                    <button className='btn btn-outline-primary' onClick={openModal_add}>+ Add Note</button>
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
                <div className="container mt-4">
                    <Table hover responsive className="table-white rounded">
                        <thead className="thead-light rounded-top">
                            <tr>
                                <th className="col-title" onClick={() => handleSort('nid')}>
                                    Note Id {getSortIcon('nid')}
                                </th>
                                <th className="col-company" onClick={() => handleSort('title')}>
                                    Note Title {getSortIcon('title')}
                                </th>
                                <th className="col-company" onClick={() => handleSort('note')}>
                                    Note {getSortIcon('note')}
                                </th>
                                <th className="col-title" onClick={() => handleSort('created_by')}>
                                    Created By {getSortIcon('created_by')}
                                </th>
                                <th className="col-title" onClick={() => handleSort('created_time')}>
                                    Created_at {getSortIcon('created_time')}
                                </th>
                                <th className="col-actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item) => (
                                <tr key={item.nid}>

                                    <td>{item.nid}</td>
                                    <td>{item.title}</td>
                                    <td>{item.note}</td>
                                    <td>{item.created_by}</td>
                                    <td>{item.created_time}</td>
                                    <td>
                                        <button className="btn btn-link p-0" onClick={() => openModal_edit(item, 'view')}><BsEye /></button>
                                        <button className="btn btn-link p-0 mx-2" onClick={() => openModal_edit(item, 'edit')}><BiPencil /></button>
                                        <button className="btn btn-link p-0 text-danger"><BiTrash /></button>
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
                isOpen={modalIsOpen_edit}
                onRequestClose={closeModal_edit}
                style={customStyles}
                contentLabel="Edit View Modal"
            >
                <h3 className='my-3 text-center'>Edit / View Modal</h3>
                <button className="close-btn float-right" onClick={closeModal_edit}>×</button>
                <form className='mt-4'>
                    <div className="form-group">
                        <label htmlFor="nid">NID</label>
                        <input id="nid" className="form-control" type="text" value={selectedItem?.nid || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input id="title" className="form-control" type="text" value={selectedItem?.title || ''} onChange={(e) => setSelectedItem({ ...selectedItem, title: e.target.value })} readOnly={isViewMode} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="note">Note</label>
                        <input id="note" className="form-control" type="text" value={selectedItem?.note || ''} onChange={(e) => setSelectedItem({ ...selectedItem, note: e.target.value })} readOnly={isViewMode} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="created_by">Created By</label>
                        <input id="created_by" className="form-control" type="text" value={selectedItem?.created_by || ''} onChange={(e) => setSelectedItem({ ...selectedItem, created_by: e.target.value })} readOnly={isViewMode} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="created_time">Created Time</label>
                        <input id="created_time" className="form-control" type="text" value={selectedItem?.created_time || ''} readOnly />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3" disabled={isViewMode} onClick={handleOnSubmit_edit}>Save Changes</button>
                </form>

            </Modal>

            <Modal
                isOpen={modalIsOpen_add}
                onRequestClose={closeModal_add}
                style={customStyles}
                contentLabel="Add User Modal"
            >

                <button className="close-btn float-right" onClick={closeModal_add}>×</button>
                <h3 className="my-4 text-center">Add Notes</h3>
                <form className="mt-4">
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input id="title" className="form-control" type="text" placeholder="Enter title" value={formData.title} onChange={handleChange_add} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="note">Note</label>
                        <input id="note" className="form-control" type="text" placeholder="Enter note" value={formData.note} onChange={handleChange_add} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="created_by">Created By</label>
                        <input id="created_by" className="form-control" type="text" placeholder="Enter creator's name" value={formData.created_by} onChange={handleChange_add} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="created_time">Created Time</label>
                        <input id="created_time" className="form-control" type="text" placeholder="Enter created time" value={formData.created_time} onChange={handleChange_add}
                        />
                    </div>
                    <button type="button" className="mt-3 btn btn-primary" onClick={handleOnSubmit_add}>
                        Add Note
                    </button>
                </form>
            </Modal>


        </div>
    )
}

export default Notes
