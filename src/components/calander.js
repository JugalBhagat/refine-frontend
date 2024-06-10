import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';

const localizer = momentLocalizer(moment)
// const localizer = globalizeLocalizer(globalize)

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
    const [events, setEvents] = useState([]);
    const [fetchItMan , setFetchItMan] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        start: null,
        end: null
    });

    useEffect(() => {
        fetchEvents();
    }, [fetchItMan]);

    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': token
            };
            const response = await fetch('http://localhost:8000/events/fetchallevents', {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            const data = await response.json();

            // Transform the data into the desired format
            const transformedEvents = data.data.map(event => {
                // Splitting start_time and end_time
                const startTimeParts = event.start_time.split(':');
                const endTimeParts = event.end_time.split(':');

                // Constructing Date objects with parsed time components
                const startDate = new Date(event.date);
                startDate.setHours(parseInt(startTimeParts[0], 10));
                startDate.setMinutes(parseInt(startTimeParts[1], 10));

                const endDate = new Date(event.date);
                endDate.setHours(parseInt(endTimeParts[0], 10));
                endDate.setMinutes(parseInt(endTimeParts[1], 10));

                // Returning the transformed event object
                return {
                    title: event.event_title,
                    username: event.username,
                    start: startDate,
                    end: endDate
                };
            });


            setEvents(transformedEvents);
        } catch (error) {
            console.error('Error fetching events:', error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('user_id');

        const { title, start, end } = formData;
        console.log(start.slice(0, 10));
        console.log(start.slice(12,) + ":00");
        console.log(end.slice(12,) + ":00");

        const formData2 = new FormData();
        formData2.append('event_title', title);
        formData2.append('uid', uid);
        formData2.append('date', start.slice(0, 10));
        formData2.append('start_time', start.slice(12,) + ":00");
        formData2.append('end_time', end.slice(12,) + ":00");

        try {
            const response = await fetch('http://localhost:8000/events/addevent', {
                method: 'POST',
                headers: {
                    'Authorization': token,
                },
                body: formData2
            });

            if (!response.ok) {
                throw new Error('Failed to add event');
            }
            const data = await response.json();

            console.log('Event added successfully:', data);
            fetchEvents();
            toast.success('Event added successfully');
            setFetchItMan(true);
            closeModal();
        } catch (error) {
            console.error('Error adding event:', error.message);
            toast.error('Failed to add event'); // Show error toast
        }
    };

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
                            {events.slice(0, 3).map((activity, index) => (
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
                        events={events}
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
                        <input id="title" name="title" className="form-control" type="text" placeholder="Enter event title" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="start">Start Time</label>
                        <input id="start" name="start" className="form-control" type="datetime-local" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="end">End Time</label>
                        <input id="end" name="end" className="form-control" type="datetime-local" onChange={handleChange} />
                    </div>
                    <button type="submit" className="mt-3 btn btn-primary">Add Event</button>
                </form>
            </Modal>

        </div>
    )
}

export default Notes
