import React from 'react';
import { VectorMap } from '@react-jvectormap/core';
import { worldMill } from '@react-jvectormap/world';
import ReactCountryFlag from "react-country-flag";

const companies = [
  { name: 'United States', code: 'US', count: 24, latLng: [37.0902, -95.7129] },
  { name: 'Germany', code: 'DE', count: 18, latLng: [51.1657, 10.4515] },
  { name: 'United Kingdom', code: 'GB', count: 6, latLng: [55.3781, -3.4360] },
  { name: 'Canada', code: 'CA', count: 4, latLng: [56.1304, -106.3468] },
  { name: 'Spain', code: 'ES', count: 3, latLng: [40.4637, -3.7492] },
  { name: 'France', code: 'FR', count: 2, latLng: [46.6034, 1.8883] },
  { name: 'India', code: 'IN', count: 2, latLng: [20.5937, 78.9629] },
];


const CountryMap = () => {

  return (
    <>
    <VectorMap map={worldMill} 
      markers={companies}
      backgroundColor='#D1D1D1'
      markerStyle={{
        initial:{
          fill:"red"
        },
      }} />;
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px',marginBottom:'20px' }}>
        {companies.map((company, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '5px', padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <ReactCountryFlag countryCode={company.code} svg style={{ width: '1em', height: '1em', marginRight: '10px' }} />
            <span>{company.name} {company.count}</span>
          </div>
        ))}
      </div>
      <div style={{marginBottom:'20px',color:'white'}}>this is space holder</div>
    </>
  );
};

export default CountryMap;
