import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import moment from "moment";
import { Table, Spin, Tag } from "antd";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAppointments = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirect to login");
      return;
    }

    try {
      const res = await axios.get("/api/v1/user/user-appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const columns = [
    {
      title: "Doctor",
      dataIndex: "doctorInfo",
      render: (doctorInfo) => {
        // Handle when doctorInfo might just be an ID string
        if (typeof doctorInfo === 'string') {
          return <span>Doctor ID: {doctorInfo}</span>;
        }
        
        // Handle when doctorInfo is a proper object
        if (doctorInfo && doctorInfo.firstName) {
          return <span>Dr. {doctorInfo.firstName} {doctorInfo.lastName}</span>;
        }
        
        return "Not available";
      }
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => {
        // Handle if date is a Date object (ISO string)
        if (moment(record.date).isValid()) {
          return moment(record.date).format("DD-MM-YYYY");
        }
        // If date is already in string format
        return record.date;
      },
    },
    {
      title: "Time",
      dataIndex: "time",
      render: (text, record) => {
        // Handle if time is a Date object (ISO string)
        if (moment(record.time).isValid()) {
          return moment(record.time).format("HH:mm");
        }
        // If time is already in string format
        return record.time;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        let color = "blue";
        if (status === "approved") color = "green";
        if (status === "rejected") color = "red";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  return (
    <Layout>
      <h1 className="text-center mb-4">My Appointments</h1>
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spin size="large" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center">
          <p>No appointments found</p>
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={appointments}
          pagination={{ pageSize: 10 }}
          rowKey="_id"
        />
      )}
    </Layout>
  );
};

export default Appointments;