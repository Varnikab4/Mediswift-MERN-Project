import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Row,
  Col,
  Input,
  Form,
  Button,
  TimePicker,
  message,
  Card,
  Typography,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  SolutionOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import "../../styles/FormPage.css"; // Import shared CSS

const { Title, Text } = Typography;

const Profile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  // Fetch doctor details
  const getDoctorInfo = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorInfo",
        { userId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setDoctor(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Update doctor profile
  const handleFinish = async (values) => {
    const formattedValues = {
      ...values,
      timings: values.timings
        ? [
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm"),
          ]
        : null,
    };
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/doctor/updateProfile",
        { ...formattedValues, userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        navigate("/"); // Redirect to home page after successful update
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    getDoctorInfo();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <div className="doctor-form-container">
        <div className="form-header">
          <h1>Manage Your Profile</h1>
          <p>Update your professional information</p>
        </div>

        {doctor ? (
          <Card
            title="Doctor Profile"
            bordered={false}
            className="profile-card"
          >
            <Form
              layout="vertical"
              onFinish={handleFinish}
              initialValues={{
                ...doctor,
                timings: doctor.timings
                  ? [
                      moment(doctor.timings[0], "HH:mm"),
                      moment(doctor.timings[1], "HH:mm"),
                    ]
                  : null,
              }}
            >
              {/* Personal Details Section */}
              <h4 className="section-title">Personal Details</h4>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span>
                        <UserOutlined className="field-icon" /> First Name
                      </span>
                    }
                    name="firstName"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your first name",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your first name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span>
                        <UserOutlined className="field-icon" /> Last Name
                      </span>
                    }
                    name="lastName"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your last name",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your last name" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span>
                        <PhoneOutlined className="field-icon" /> Phone
                      </span>
                    }
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your phone number",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your phone number" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span>
                        <MailOutlined className="field-icon" /> Email
                      </span>
                    }
                    name="email"
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "Please enter a valid email",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your email" />
                  </Form.Item>
                </Col>
              </Row>

              {/* Professional Details Section */}
              <h4 className="section-title">Professional Details</h4>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span>
                        <SolutionOutlined className="field-icon" /> Specialization
                      </span>
                    }
                    name="specialization"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your specialization",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your specialization" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span>
                        <IdcardOutlined className="field-icon" /> Experience
                      </span>
                    }
                    name="experience"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your experience",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your experience (years)" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span>
                        <ClockCircleOutlined className="field-icon" /> Timings
                      </span>
                    }
                    name="timings"
                    rules={[
                      { required: true, message: "Please enter your timings" },
                    ]}
                  >
                    <TimePicker.RangePicker format="HH:mm" className="w-100" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span>
                        <DollarOutlined className="field-icon" /> Fees Per Consultation
                      </span>
                    }
                    name="feesPerConsultation"
                    rules={[
                      { required: true, message: "Please enter your fees" },
                    ]}
                  >
                    <Input placeholder="Enter your fees per consultation" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24}>
                  <Form.Item
                    label={
                      <span>
                        <SolutionOutlined className="field-icon" /> Bio
                      </span>
                    }
                    name="bio"
                    rules={[
                      { required: true, message: "Please enter your bio" },
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Enter a brief bio about yourself"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Button
                type="primary"
                htmlType="submit"
                className="submit-button"
              >
                Update Profile
              </Button>
            </Form>
          </Card>
        ) : (
          <div className="loading-container">
            <Text>Loading profile...</Text>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;