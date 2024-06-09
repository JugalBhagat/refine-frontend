import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';

const localizer = momentLocalizer(moment)
// const localizer = globalizeLocalizer(globalize)

const myEventsList = [
    {
        title: 'Annual Meeting',
        username: "Lokesh",
        start: new Date(2024, 5, 3, 12, 0), // June 3, 2024, 12:00 PM
        end: new Date(2024, 5, 4, 13, 0),   // June 4, 2024, 1:00 PM
    },
    {
        title: 'Quarterly Review',
        username: "Alay",
        start: new Date(2024, 5, 5, 10, 0), // June 5, 2024, 10:00 AM
        end: new Date(2024, 5, 5, 11, 30),  // June 5, 2024, 11:30 AM
    },
    {
        title: 'Project Deadline',
        username: "Abhijeet",
        start: new Date(2024, 5, 8, 9, 0),  // June 8, 2024, 9:00 AM
        end: new Date(2024, 5, 8, 10, 0),   // June 8, 2024, 10:00 AM
    },
    {
        title: 'Team Building Event',
        username: "Vishlya",
        start: new Date(2024, 5, 11, 14, 0), // June 11, 2024, 2:00 PM
        end: new Date(2024, 5, 11, 17, 0),   // June 11, 2024, 5:00 PM
    },
    {
        title: 'Client Meeting',
        username: "Hardeep",
        start: new Date(2024, 5, 15, 9, 30), // June 15, 2024, 9:30 AM
        end: new Date(2024, 5, 15, 11, 0),   // June 15, 2024, 11:00 AM
    },
    {
        title: 'Department Meeting',
        username: "Abhijeet",
        start: new Date(2024, 5, 17, 10, 0), // June 17, 2024, 10:00 AM
        end: new Date(2024, 5, 17, 12, 0),   // June 17, 2024, 12:00 PM
    }, {
        title: 'Marketing Strategy',
        username: "Abhijeet",
        start: new Date(2024, 5, 20, 14, 0), // June 20, 2024, 2:00 PM
        end: new Date(2024, 5, 20, 15, 30),  // June 20, 2024, 3:30 PM
    },
    {
        title: 'Budget Review',
        username: "Abhijeet",
        start: new Date(2024, 5, 22, 10, 0), // June 22, 2024, 10:00 AM
        end: new Date(2024, 5, 22, 11, 0),   // June 22, 2024, 11:00 AM
    },
    {
        title: 'Product Launch',
        username: "Abhijeet",
        start: new Date(2024, 5, 25, 9, 0),  // June 25, 2024, 9:00 AM
        end: new Date(2024, 5, 25, 12, 0),   // June 25, 2024, 12:00 PM
    },
    {
        title: 'Sales Training',
        username: "Abhijeet",
        start: new Date(2024, 5, 27, 13, 0), // June 27, 2024, 1:00 PM
        end: new Date(2024, 5, 27, 16, 0),   // June 27, 2024, 4:00 PM
    },
    {
        title: 'Customer Feedback',
        username: "Abhijeet",
        start: new Date(2024, 5, 29, 11, 0), // June 29, 2024, 11:00 AM
        end: new Date(2024, 5, 29, 12, 30),  // June 29, 2024, 12:30 PM
    },
    {
        title: 'Investor Meeting',
        username: "Abhijeet",
        start: new Date(2024, 5, 30, 15, 0), // June 30, 2024, 3:00 PM
        end: new Date(2024, 5, 30, 17, 0),   // June 30, 2024, 5:00 PM
    },
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
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        username: '',
        start: null, 
        end: null 
    });

    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your submit logic here
        console.log(formData);
        closeModal();
    };

    return (
        <div className="div-body">
            <div className="row justify-content-between mt-4">
                <div className="col-md-3 mx-3 text-left">
                    <button className='btn btn-outline-primary' onClick={openModal}>+ Add Events</button>
                </div>
            </div>
            <div className='row'>
                <div className="col-md-3">
                    <div className="activity-container_cal">
                        <h3 className="activity-header_cal">Upcoming events</h3>
                        <ul className="activity-list_cal">
                            {myEventsList.slice(0, 3).map((activity, index) => (
                                <li key={index} className="activity-item_cal text-left">

                                    <hr />
                                    <div className="row">
                                        <div className="col-md-2">
                                            <i className="fa-solid fa-check"></i>
                                        </div>
                                        <div className="col-md-10">
                                            <span className="activity-date_cal">
                                                {activity.start.toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })},{' '}
                                                {activity.start.toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })} -{' '}
                                                {activity.end.toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                            {/* <div className="">
                                        <p className="">abhijeet</p>
                                    </div> */}
                                            <div className="activity-details_cal">
                                                <p className="activity-title_cal">{activity.title}<span className='by'> by {activity.username}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
                <div className="col-md-9">
                    <Calendar
                        localizer={localizer}
                        events={myEventsList}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        views={['month', 'week', 'day']}
                        defaultView="month"
                    />
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Event Details Modal"
            >
                <button className="close-btn float-right" onClick={closeModal}>×</button>
                <h3 className="my-4 text-center">Add Event</h3>
                <form className="mt-4" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input id="title" name="title" className="form-control" type="text" placeholder="Enter event title"  onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input id="username" name="username" className="form-control" type="text" placeholder="Enter your username"  onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="start">Start Time</label>
                        <input id="start" name="start" className="form-control" type="datetime-local"  onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="end">End Time</label>
                        <input id="end" name="end" className="form-control" type="datetime-local"  onChange={handleChange}/>
                    </div>
                    <button type="submit" className="mt-3 btn btn-primary">Add Event</button>
                </form>
            </Modal>

        </div>
    )
}

export default Notes
