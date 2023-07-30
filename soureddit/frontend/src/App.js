import React, { useState } from 'react';
import validator from 'validator'; // Import the validator library

const SimpleForm = () => {
  // State to track form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  // State to track form submission status
  const [submitted, setSubmitted] = useState(false);

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform form validation here (e.g., check for empty fields)
    // You can also submit the form data to a server using API calls
    // For this example, we simply set the 'submitted' state to true
    setSubmitted(true);
  };

  // Function to handle input changes and update the form data
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  return (
    <div>
      <h1>Simple React Form</h1>
      {submitted ? (
        <div>
          <p>Thank you for submitting the form!</p>
          <p>Name: {formData.name}</p>
          <p>Email: {formData.email}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default SimpleForm;
