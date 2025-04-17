import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { Row, Divider } from "antd";
import AllDoctorList from "../components/AllDoctorList";
import Footer from "../components/Footer";
import "../styles/DoctorsList.css";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [doctorsBySpecialization, setDoctorsBySpecialization] = useState({});
  const [loading, setLoading] = useState(true);

  const getUserData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/user/getAllDoctors", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
        
        // Group doctors by specialization
        const groupedDoctors = {};
        res.data.data.forEach(doctor => {
          const specialization = doctor.specialization || "Other";
          if (!groupedDoctors[specialization]) {
            groupedDoctors[specialization] = [];
          }
          groupedDoctors[specialization].push(doctor);
        });
        
        setDoctorsBySpecialization(groupedDoctors);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Layout>
      <h1 className="text-center">Our Trusted Doctors</h1>
      
      {loading ? (
        <div className="loading-container">
          <p>Loading doctors...</p>
        </div>
      ) : (
        <>
          {Object.keys(doctorsBySpecialization).map((specialization) => (
            <div key={specialization}>
              <Divider orientation="left" className="specialization-divider">
                <h2 className="specialization-title">{specialization}</h2>
              </Divider>
              <Row className="specialization-row">
                {doctorsBySpecialization[specialization].map((doctor) => (
                  <AllDoctorList doctor={doctor} key={doctor._id} />
                ))}
              </Row>
            </div>
          ))}
        </>
      )}
      
      <Footer />
    </Layout>
  );
};

export default DoctorsList;