import React, { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card';
import Graph1 from '../img/graph1.png';
import Graph2 from '../img/graph2.png';
import Graph3 from '../img/graph3.png';
import CountryMap from '../components/country_map';
import GaugeChart from 'react-gauge-chart';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {

  const [monArr, setMonArr] = useState([]);
  const [userIRate, setUserIRate] = useState([]);

  const [activities, setActivities] = useState([]);
  // eslint-disable-next-line
  const [userCount, setUserCount] = useState(0);
  // eslint-disable-next-line
  const [noteCount, setNoteCount] = useState(0);
  // eslint-disable-next-line
  const [companiesCount, setCompaniesCount] = useState(0);

  useEffect(() => {                   // fetch notes
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/notes/fetchall', {
          headers: {
            Authorization: token
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

        if (data && data.message === 'Fetched All Notes' && data.data) {
          const formattedData = data.data.map(note => ({
            id: note.nid,
            time: new Date(note.created_at).toLocaleDateString(),
            user: note.created_by,
            action: 'created',
            deal: note.note_title,
            status: 'NEW'
          }));
          setActivities(formattedData);
          console.log(formattedData);
        } else {
          throw new Error('Invalid data structure in response');
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, []);

  useEffect(() => {                   // fetch monthly user stats
    const fetchMonArr = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/users/monstats', {
          headers: {
            Authorization: token
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMonArr(data);

        // let data1 = [15, 57, 68, 69, 62, 96, 111, 119, 130, 129, 150, 190];

        let currentMonth = new Date().getMonth() + 1;
        let totalUsers = data.slice(0, currentMonth).reduce((sum, value) => sum + value, 0);
        let averageMonthlyIncrease = totalUsers / currentMonth;

        setUserIRate(averageMonthlyIncrease);

      } catch (error) {
        console.error('Error fetching Monthly User Stats:', error);
      }
    };

    fetchMonArr();
  }, []);


  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/users/fetchall/', {
                headers: {
                    Authorization: token
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.total_result !== undefined) {
                setUserCount(data.total_result);
            } else {
                console.error("Invalid response format for user count");
            }
        } catch (error) {
            console.error("Error fetching user count:", error);
        }
    };

    fetchUserData();
}, []);

useEffect(() => {
    const fetchNoteCount = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/notes/totalnotes', {
                headers: {
                    Authorization: token
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.total !== undefined) {
                setNoteCount(data.total);
            } else {
                console.error("Invalid response format for note count");
            }
        } catch (error) {
            console.error("Error fetching note count:", error);
        }
    };

    fetchNoteCount();
}, []);

useEffect(() => {
    const fetchCompaniesCount = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/companies/totcompany', {
                headers: {
                    Authorization: token
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.total_company !== undefined) {
                setCompaniesCount(data.total_company);
            } else {
                console.error("Invalid response format for company count");
            }
        } catch (error) {
            console.error("Error fetching company count:", error);
        }
    };

    fetchCompaniesCount();
}, []);





  useEffect(() => {
    console.log(monArr);
    console.log(userIRate);
  }, [monArr])


  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'User Growth per month',
        // data: [15, 57, 68, 69, 62, 96, 111, 119, 130, 129, 150, 190],
        data: monArr,
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.5,
      },
    ],
  };


  // const activities = [
  //   { id: 1, time: '20 days ago', user: 'Ryan Howard', action: 'created', deal: 'Handcrafted Rubber Pants', status: 'NEW' },
  //   { id: 2, time: '20 days ago', user: 'Creed Bratton', action: 'created', deal: 'Practical Wooden Pizza', status: 'WON' },
  //   { id: 4, time: '20 days ago', user: 'Angela Martin', action: 'created', deal: 'Refined Frozen Pants', status: 'UNDER REVIEW' },
  //   { id: 5, time: '20 days ago', user: 'Toby Flenderson', action: 'created', deal: 'Sleek Steel Shirt', status: 'NEW' },
  //   { id: 4, time: '20 days ago', user: 'Angela Martin', action: 'created', deal: 'Refined Frozen Pants', status: 'UNDER REVIEW' },
  //   { id: 5, time: '20 days ago', user: 'Toby Flenderson', action: 'created', deal: 'Sleek Steel Shirt', status: 'NEW' },
  //   { id: 4, time: '20 days ago', user: 'Angela Martin', action: 'created', deal: 'Refined Frozen Pants', status: 'UNDER REVIEW' },
  //   { id: 5, time: '20 days ago', user: 'Toby Flenderson', action: 'created', deal: 'Sleek Steel Shirt', status: 'NEW' },
  //   { id: 4, time: '20 days ago', user: 'Angela Martin', action: 'created', deal: 'Refined Frozen Pants', status: 'UNDER REVIEW' },
  //   { id: 5, time: '20 days ago', user: 'Toby Flenderson', action: 'created', deal: 'Sleek Steel Shirt', status: 'NEW' },
  // ];


  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 250,
        type: 'linear',
      },
    },
  };


  return (
    <div>
      <div className="div-body">
        <div className="first-row mt-3" style={{ display: "flex" }}>
          <Card style={{ width: '24rem', marginRight: "10px" }}>
            <Card.Body>
              <div className="row align-items-center">
                <div className="col-md-8">
                  <Card.Title style={{ color: 'gray', fontSize: "15px" }}>No of Users</Card.Title>
                  <Card.Text className='user-count-text' >{userCount}</Card.Text></div>
                <div className="col-md-4">
                  <img className='mid-logos' src={Graph1} alt="graph logo" />
                </div>
              </div>
            </Card.Body>
          </Card>
          <Card style={{ width: '24rem', marginRight: "10px" }}>
            <Card.Body>
              <div className="row align-items-center">
                <div className="col-md-8">
                  <Card.Title style={{ color: 'gray', fontSize: "15px" }}>No of Companies</Card.Title>
                  <Card.Text className='user-count-text' >{companiesCount}</Card.Text></div>
                <div className="col-md-4">
                  <img className='mid-logos' src={Graph2} alt="graph logo" />
                </div>
              </div>
            </Card.Body>
          </Card>
          <Card style={{ width: '24rem', marginRight: "10px" }}>
            <Card.Body>
              <div className="row align-items-center">
                <div className="col-md-8">
                  <Card.Title style={{ color: 'gray', fontSize: "15px" }}>No of Notes</Card.Title>
                  <Card.Text className='user-count-text' >{noteCount}</Card.Text></div>
                <div className="col-md-4">
                  <img className='mid-logos' src={Graph3} alt="graph logo" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="sec-row mt-2" style={{ display: "flex" }}>
          <Card style={{ width: '24rem', marginRight: "10px" }}>
            <Card.Body>
              <div className="row align-items-center">
                <div className="col-md-12">
                  <Card.Title style={{ color: 'gray', fontSize: "15px" }}>Average Monthly User Increase</Card.Title>


                  <GaugeChart
                    id="gauge-chart"
                    nrOfLevels={30}
                    percent={userIRate / 100}
                    textColor="#000"
                    colors={["#EA4228", "#F5CD19", "#5BE12C"]}
                    arcPadding={0.03}
                  />
                  <div className="row mt-3">
                    <div className="col-md-6"><div>Expected</div>
                      <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                        ${"35%"}
                      </div></div>
                    <div className="col-md-6">
                      <div>Realized</div>
                      <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                        ${"50%"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
          <Card style={{ width: '49rem', marginRight: "10px" }}>
            <Card.Body>
              <div className="row align-items-center">
                <div className="col-md-12">
                  <Card.Title style={{ color: 'gray', fontSize: "15px" }}>Incraseing Rate of User (Monthly)</Card.Title>
                  <div>
                    <Line data={chartData} options={options} />
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="third-row mt-2" style={{ display: "flex" }}>
          <Card style={{ width: '36rem', marginRight: "10px", height: "fit-content", maxHeight: "500px", overflowY: 'scroll', scrollbarWidth: "thin" }}>
            <Card.Body>
              <div className="row align-items-center">
                <div className="col-md-12">
                  <div className="col-md-12 mb-3" style={{ borderBottom: "1px solid gray", padding: "5px", justifyContent: "space-between", display: "flex", alignItems: "center" }}>
                    <Card.Title style={{ color: 'gray', fontSize: "15px" }}>Notes</Card.Title>
                  </div>
                  <ul className="activity-list">
                    {activities.slice(0, 7).map(activity => (
                      <li key={activity.id} className="activity-item">
                        {/* <img src={Graph3} alt="icon" className="activity-icon" /> */}
                        <div className="activity-details">
                          <p>
                            {/* <strong>{activity.user}</strong> {activity.action} <strong> {activity.deal} Note </strong> at <strong>{activity.time}</strong>. */}
                            <strong>{activity.deal}</strong> {activity.action} by <strong> {activity.user} </strong> at <strong>{activity.time}</strong>.
                          </p>
                        </div>
                      </li>
                    ))}

                  </ul>
                </div>
              </div>
            </Card.Body>
          </Card>
          <Card style={{ width: '37rem', marginRight: "10px", marginBottom: "30px", }}>
            <Card.Body>
              <div className="row align-items-center" >
                <div className="col-md-12" style={{ borderBottom: "1px solid gray", padding: "5px", justifyContent: "space-between", display: "flex", alignItems: "center" }}>
                  <Card.Title style={{ color: 'gray', fontSize: "15px" }}>Companies in Globe</Card.Title>
                  {/* <button type='button' className='btn btn-sm btn-outline-dark'>See all Companies</button> */}
                </div>
                <div className='mt-5' style={{ width: "750px", height: "350px" }}>
                  <CountryMap />
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
