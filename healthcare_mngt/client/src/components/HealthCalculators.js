// src/components/HealthCalculators.js

import React, { useState } from 'react';
import '../styles/HealthCalculator.css';

const HealthCalculators = () => {
    const [weight, setWeight] = useState('');
    const [heightCm, setHeightCm] = useState(''); // Height in centimeters
    const [bmiResult, setBmiResult] = useState(null);
    const [bmiCategory, setBmiCategory] = useState('');

    const calculateBMI = () => {
        // Convert height from cm to meters
        const heightInMeters = heightCm / 100; // Convert cm to meters
        
        if (weight && heightInMeters) {
            const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2); // BMI formula
            setBmiResult(bmi);
            setBmiCategory(getBMICategory(bmi)); // Get BMI category
        } else {
            setBmiResult(null); // Reset if inputs are invalid
            setBmiCategory(''); // Reset category
        }
    };

    const getBMICategory = (bmi) => {
        if (bmi < 18.5) return 'Underweight';
        if (bmi >= 18.5 && bmi < 24.9) return 'Normal weight';
        if (bmi >= 25 && bmi < 29.9) return 'Overweight';
        return 'Obesity';
    };

    return (
        <div className="calculators-section" style={{ position: 'relative', marginTop: '40px' }}>
            <img src="./assets/image.png" alt="Healthcare Staff" className="background-image" />
            <div className="calculator-container">
                <h2 className="heading">Health Calculators</h2>
                <div className="bmi-calculator">
                    <h3>BMI Calculator</h3>
                    <div className="calculator-inputs">
                        <input 
                            type="number" 
                            placeholder="Weight (kg)" 
                            value={weight} 
                            onChange={e => setWeight(e.target.value)} 
                        />
                        <input 
                            type="number" 
                            placeholder="Height (cm)" 
                            value={heightCm} 
                            onChange={e => setHeightCm(e.target.value)} 
                        />
                    </div>
                    <button onClick={calculateBMI}>Calculate BMI</button>
                    
                    <div className="bmi-result">
                        {bmiResult !== null && (
                            <h4>Your BMI: {bmiResult}</h4>
                        )}
                    </div>

                    {/* BMI Info Card next to BMI Calculator */}
                    {bmiResult !== null && (
                        <div className="bmi-info-card">
                            <h5 style={{ color: 'whitesmoke' }}>BMI Category:</h5>
                            <p style={{ color: 'whitesmoke' }}>{bmiCategory}</p>
                            <p style={{ color: 'whitesmoke' }}>{getBMIDescription(bmiCategory)}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Function to get description based on BMI category
const getBMIDescription = (category) => {
    switch (category) {
        case 'Underweight':
            return 'You are under the healthy weight range. Consider consulting a healthcare professional for advice.';
        case 'Normal weight':
            return 'You are within the healthy weight range. Keep up the good work!';
        case 'Overweight':
            return 'You are above the healthy weight range. Consider a balanced diet and regular exercise.';
        case 'Obesity':
            return 'You are in the obesity range. It is recommended to consult a healthcare professional.';
        default:
            return '';
    }
};

export default HealthCalculators;
