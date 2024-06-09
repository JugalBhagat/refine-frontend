import React from 'react'
import Card from 'react-bootstrap/Card';

function CompanyCard({ company }) {

    const { logo, companyName, revenue, type, size, country } = company;

    return (
        <Card className='mt-4'>
            <Card.Body>
                <div className="buttons text-end ">
                    <img width="20" height="20" src="https://img.icons8.com/carbon-copy/100/filled-trash.png" alt="filled-trash" />
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
