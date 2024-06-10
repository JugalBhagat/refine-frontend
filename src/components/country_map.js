import React, { useState, useEffect } from 'react';
import { VectorMap } from '@react-jvectormap/core';
import { worldMill } from '@react-jvectormap/world';
import ReactCountryFlag from "react-country-flag";

const CountryMap = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/companies/fetchcountry', {
          headers: {
            'Authorization': token
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        if (data && data.message === 'Fetch All Country and Company Data successfully' && data.data) {
          const formattedData = data.data.map(country => ({
            name: country.name,
            code: country.code,
            count: country.count,
            latLng: JSON.parse(country.latLng),
            companies: country.companies.split(',').map(company => company.trim())
          }));
          setCompanies(formattedData);
          console.log("Formatted companies data:", formattedData);
        } else {
          throw new Error('Invalid data structure in response');
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    console.log("Updated companies data:", companies);
  }, [companies]);

  return (
    <>
      {companies.length === 0 ? (
        <p>No companies data available</p>
      ) : (
        <>
          <VectorMap
            map={worldMill}
            markers={companies.map(company => ({
              name: company.name,
              latLng: company.latLng
            }))}
            backgroundColor='#D1D1D1'
            markerStyle={{
              initial: {
                fill: "red"
              }
            }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px', marginBottom: '20px' }}>
            {companies.map((company, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '5px', padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <ReactCountryFlag countryCode={company.code} svg style={{ width: '1em', height: '1em', marginRight: '10px' }} />
                <span>{company.name} : {company.count} </span>
              </div>
            ))}
          </div>
        </>
      )}
      <div style={{ marginBottom: '20px', color: 'white' }}>this is space holder</div>
    </>
  );
};

export default CountryMap;
