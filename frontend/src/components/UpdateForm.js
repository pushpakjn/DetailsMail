import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UpdateForm() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        hobbies: ''
    });

    const openForm = () => {
        setIsOpen(true);
        // Fetch user data here based on user ID
        // Replace 'userId' with the actual ID of the user
        fetchUserData('userId');
    };

    const fetchUserData = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/user/${id}`);
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/user/${formData.id}`, formData);
            console.log('User updated successfully:', response.data);
            // Close the pop-up form after successful update
            setIsOpen(false);
            // Optionally, navigate to another page
            navigate('/');
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div>
            <button onClick={openForm}>Update User</button>
            {isOpen && (
                <div className="popup-form">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="name">Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} />
                        <label htmlFor="phoneNumber">Phone Number:</label>
                        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                        <label htmlFor="email">Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        <label htmlFor="hobbies">Hobbies:</label>
                        <input type="text" name="hobbies" value={formData.hobbies} onChange={handleChange} />
                        <button type="submit">Update</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default UpdateForm;
