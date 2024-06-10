import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

const Signup = ({ props }) => {
  const { setHasAcc, setIsLogin } = props;
  const [submitted, setSubmitted] = useState(false);
  const [companies, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    cid: '',
    dp: null,
  });

  const fetchCompanies = async () => {
    try {
      const response = await fetch('http://localhost:8000/fetchcompany');
      const data = await response.json();
      setCountries(data.companies);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (formData.name && formData.email && formData.password && formData.role && formData.cid && formData.dp) {
      const data = new FormData();
      data.append('username', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('role', formData.role);
      data.append('cid', formData.cid);
      data.append('file', formData.dp);  // Use 'file' instead of 'dp'

      try {
        const response = await fetch('http://localhost:8000/users/signup/', {
          method: 'POST',
          body: data,
        });

        if (response.ok) {
          const result = await response.json();
          toast.success('Signup successfully!');
          localStorage.setItem('token', result.token);
          localStorage.setItem("user_id", result.user_id);
          console.log(result);
          setHasAcc(true);
          setIsLogin(true);
        } else {
          console.error('Error signing up:', response.statusText);
          toast.error('Error signing up:', response.statusText);
          // Handle signup error (e.g., show an error message)
        }
      } catch (error) {
        console.error('Error signing up:', error);
        toast.error('Error signing up:', error);
        // Handle signup error (e.g., show an error message)
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      dp: e.target.files[0]
    });
  };

  const change_hasAcc = () => {
    setHasAcc(true);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 shadow" style={{ maxWidth: 800, width: '100%' }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        <Form onSubmit={onSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3 text-left" controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={submitted && !formData.name}
                />
                {submitted && !formData.name && (
                  <Form.Control.Feedback type="invalid">
                    Name is required
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3 text-left" controlId="formEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={submitted && !formData.email}
                />
                {submitted && !formData.email && (
                  <Form.Control.Feedback type="invalid">
                    Email is required
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3 text-left" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={submitted && !formData.password}
                />
                {submitted && !formData.password && (
                  <Form.Control.Feedback type="invalid">
                    Password is required
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3 text-left" controlId="formRole">
                <Form.Label>Role</Form.Label> <Form.Control type="text"
                  placeholder="Enter your role" name="role" value={formData.role}
                  onChange={handleChange} isInvalid={submitted && !formData.role} />
                {submitted && !formData.role && (<Form.Control.Feedback type="invalid"> Role is required
                </Form.Control.Feedback>)}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3 text-left" controlId="formCompany">
            <Form.Label>Company</Form.Label>
            <Form.Control
              as="select"
              name="cid"
              value={formData.cid}
              onChange={handleChange}
              isInvalid={submitted && !formData.cid}
              style={{ maxHeight: '100px', overflowY: 'auto' }}
            >
              <option value="">Select your company</option>
              {companies.map((company) => (
                <option key={company.cid} value={company.cid}>
                  {company.cname}
                </option>
              ))}
            </Form.Control>
            {submitted && !formData.cid && (
              <Form.Control.Feedback type="invalid">
                Company is required
              </Form.Control.Feedback>
            )}
          </Form.Group>


          <Form.Group className="mb-3 text-left" controlId="formProfilePicture">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control
              type="file"
              name="dp"
              onChange={handleFileChange}
              isInvalid={submitted && !formData.dp}
            />
            {submitted && !formData.dp && (
              <Form.Control.Feedback type="invalid">
                Profile picture is required
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <p onClick={change_hasAcc} style={{ cursor: "pointer" }}>Already have an account? Login</p>
          <Button variant="primary" type="submit" className="w-25 float-center mt-3 btn">
            Sign Up
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Signup;
