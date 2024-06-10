import React, { useEffect } from 'react'
import Card from 'react-bootstrap/Card';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

function CompanyCard({ company,setReload }) {

    const { cid,logo, companyName, revenue, type, size, country } = company;

    useEffect(() => {
    //   console.log(cid);
    }, [])

    const handleDelCompany=async ()=>{
        console.log("del id of company"+cid);
        try {
            const token = localStorage.getItem('token'); // Assuming you have a token stored
            const response = await fetch(`http://localhost:8000/companies/delcompany/${cid}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token
                }
            });
            const data = await response.json();
            console.log(data); // Log the response for debugging
    
            if (response.ok) {
                toast.success(`Company ${cid} deleted successfully`);
                setReload(true);
            } else {
                toast.error(data.message || 'Failed to delete company');
            }
        } catch (error) {
            console.error('Error deleting company:', error);
            toast.error('Failed to delete company');
        }
    };
    
    const confirmDelete = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to See this Company of Id:'+cid,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelCompany();
            }
        });
    };

    return (
        <Card className='mt-4'>
            <Card.Body>
                <div className="text-end ">
                    <img width="20" height="20" className='buttons' src="https://img.icons8.com/carbon-copy/100/filled-trash.png" alt="filled-trash" onClick={confirmDelete} />
                </div>
                <div className="justify-content-between align-items-center">
                    <img src={logo} height="50" alt="company logo" />

                    <Card.Title className="mt-2">{companyName}</Card.Title>
                    <Card.Text className="text-center mt-3">
                        <div className="font-weight-bold">Open deals amount</div>
                        <div style={{ fontSize: '1.5rem', color: '#28a745' }}>${revenue}</div>
                    </Card.Text>
                </div>
                <div className="d-flex justify-content-between mt-3">
                    <div className="text-center">
                        <b>Type</b>
                        <p>{type}</p>
                    </div>
                    <div className="text-center">
                        <b>Size</b>
                        <p>{size}</p>
                    </div>
                    <div className="text-center">
                        <b>Country</b>
                        <p>{country}</p>
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}

export default CompanyCard
