import React,{useState } from 'react';
import { Container, Form, Button} from 'react-bootstrap';
import { toast } from 'react-toastify';
import useProfileStore from '../zustand_store/profileStore';

const Login = ({ props }) => {
  const { hasAcc, setHasAcc, setIsLogin } = props;
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const setProfile = useProfileStore((state) => state.setProfile); 
  // const profile = useProfileStore((state) => state.profile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validateForm()) return;

    const data = new FormData();
    data.append('email', formData.email);
    data.append('password', formData.password);

    try {
      const response = await fetch('http://localhost:8000/users/login/', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        localStorage.setItem('token', result.token);
        setIsLogin(true);
        setProfile({
          user_id:result.user_id,
          username: result.username,
          email: result.email,
          dp: result.dp,
          role: result.role,
          cid: result.cid,
        });
      } else {
        const error = await response.json();
        toast.error(`Login failed: ${error.message}`);
      }
    } catch (error) {
      toast.error('An error occurred while logging in');
    }
  };

  const change_hasAcc = () => {
    setHasAcc(false);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 shadow" style={{ maxWidth: 500, width: '100%' }}>
        <h2 className="text-center mb-4">Login</h2>
        <Form onSubmit={onSubmit} className="text-center">
          <Form.Group className="mb-3 text-left" controlId="formEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={submitted && !!errors.email}
            />
            {submitted && !!errors.email && (
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3 text-left" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              isInvalid={submitted && !!errors.password}
            />
            {submitted && !!errors.password && (
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            )}
          </Form.Group>

          <p onClick={change_hasAcc} style={{ cursor: "pointer" }}>Create Account? Signup</p>
          <Button variant="primary" type="submit" className="w-25 float-center mt-3 btn">
            Login
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Login;