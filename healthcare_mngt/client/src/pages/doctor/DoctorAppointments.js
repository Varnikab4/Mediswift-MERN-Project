import Layout from "./../../components/Layout";
import axios from "axios";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { Table } from "antd";
import { message } from "antd";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get("/api/v1/doctor/doctor-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const handleStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/update-status",
        { appointmentsId: record._id, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getAppointments();
      }
    } catch (error) {
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    // {
    //   title: "Name",
    //   dataIndex: "name",
    //   render: (text, record) => (
    //     <span>
    //       {record.doctorId.firstName} {record.doctorId.lastName}
    //     </span>
    //   ),
    // },
    // {
    //   title: "Phone",
    //   dataIndex: "phone",
    //   render: (text, record) => <span>{record.doctorId.phone}</span>,
    // },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => {
        // Check if date is already in DD-MM-YYYY format
        const formattedDate = moment(record.date, "DD-MM-YYYY").isValid() 
          ? record.date 
          : moment(record.date).isValid() 
            ? moment(record.date).format("DD-MM-YYYY") 
            : "Invalid date";
            
        // Check if time is already in HH:mm format
        const formattedTime = moment(record.time, "HH:mm").isValid()
          ? record.time
          : moment(record.time).isValid()
            ? moment(record.time).format("HH:mm")
            : "Invalid time";
            
        return (
          <span>
            {formattedDate} {" "} {formattedTime}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <div className="d-flex">
              <button
                className="btn btn-success"
                onClick={() => handleStatus(record, "approved")}
              >
                Approve
              </button>
              <button
                className="btn btn-danger ms-2"
                onClick={() => handleStatus(record, "reject")}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <h1>Appointments List</h1>
      <Table columns={columns} dataSource={appointments}></Table>
    </Layout>
  );
};

export default DoctorAppointments;