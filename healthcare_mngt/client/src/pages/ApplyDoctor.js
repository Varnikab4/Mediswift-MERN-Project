import React, { useState } from "react";
import Layout from "../components/Layout";
import {
  Row,
  Col,
  Input,
  Form,
  Button,
  TimePicker,
  Upload,
  message,
} from "antd";
// import { UploadOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import Footer from "../components/Footer";
import "../styles/FormPage.css"; // Import shared CSS

const ApplyDoctor = () => {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);

  // Handle form submission
  const handleFinish = async (values) => {
    console.log("Form Submitted:", values);
    try {
      dispatch(showLoading());

      // Format timings properly
      const formattedTimings = values.timings
        ? [
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm"),
          ]
        : null;

      // Create base doctor data object with formatted timings
      const doctorData = {
        ...values,
        userId: user._id,
        timings: formattedTimings,
      };

      // Remove the original timings to avoid sending moment objects
      delete doctorData.timings;
      // Add the properly formatted timings back
      doctorData.timings = formattedTimings;

      // If there's a file to upload, use FormData for that
      if (fileList.length > 0) {
        const formData = new FormData();
        formData.append("profileImage", fileList[0]);

        // Upload the file first
        // const uploadRes = await axios.post(
        //   "/api/v1/user/upload-profile-image",
        //   formData,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${localStorage.getItem("token")}`,
        //       "Content-Type": "multipart/form-data",
        //     },
        //   }
        // );

        // Get the uploaded image URL or ID
        // const profileImageUrl = uploadRes.data.imageUrl; // Adjust based on your API response

        // Add the image URL to doctor data
        // doctorData.profileImageUrl = profileImageUrl;

        const res = await axios.post("/api/v1/user/apply-doctor", doctorData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        dispatch(hideLoading());
        if (res.data.success) {
          message.success(res.data.message);
          navigate("/");
        } else {
          message.error(res.data.message);
        }
      } else {
        // If no file, just send the doctor data as is
        const res = await axios.post("/api/v1/user/apply-doctor", doctorData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        dispatch(hideLoading());
        if (res.data.success) {
          message.success(res.data.message);
          navigate("/");
        } else {
          message.error(res.data.message);
        }
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };
  return (
    <Layout>
      <div className="doctor-form-container">
        <div className="form-header">
          <h1>Apply Doctor</h1>
          <p>Complete the form below to apply as a healthcare professional</p>
        </div>
        <Form
          layout="vertical"
          onFinish={handleFinish}
          className="form-card"
        >
          <h4 className="section-title">Personal Details</h4>
          {/* <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Upload Profile Image">
                <div className="upload-container">
                  <Upload
                    fileList={fileList}
                    beforeUpload={(file) => {
                      setFileList([file]); // Replace with just the latest file
                      return false;
                    }}
                    onRemove={() => {
                      setFileList([]);
                    }}
                  >
                    <Button icon={<UploadOutlined className="upload-icon" />}>Click to Upload</Button>
                  </Upload>
                </div>
              </Form.Item>
            </Col>
          </Row> */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  { required: true, message: "Please enter your first name" },
                ]}
              >
                <Input placeholder="Enter First Name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  { required: true, message: "Please enter your last name" },
                ]}
              >
                <Input placeholder="Enter Last Name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Phone No"
                name="phone"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <Input placeholder="Enter Phone" maxLength={10} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter Email" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Website" name="website">
                <Input placeholder="Enter Website URL" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "Please enter your address" },
                ]}
              >
                <Input placeholder="Enter Address" />
              </Form.Item>
            </Col>
          </Row>
          <h4 className="section-title">Professional Details</h4>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Specialization"
                name="specialization"
                rules={[
                  {
                    required: true,
                    message: "Please enter your specialization",
                  },
                ]}
              >
                <Input placeholder="Enter Specialization" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Experience"
                name="experience"
                rules={[
                  { required: true, message: "Please enter your experience" },
                ]}
              >
                <Input placeholder="Enter Experience" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Timings"
                name="timings"
                rules={[
                  {
                    required: true,
                    message: "Please select your consultation timings",
                  },
                ]}
              >
                <TimePicker.RangePicker format="HH:mm" className="w-100" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Fees Per Consultation"
                name="feesPerConsultation"
                rules={[
                  {
                    required: true,
                    message: "Please enter your consultation fee",
                  },
                ]}
              >
                <Input placeholder="Enter Fees" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item label="Bio" name="bio">
                <Input.TextArea
                  placeholder="Enter a short biography"
                  rows={4}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="submit-button"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Footer />
    </Layout>
  );
};

export default ApplyDoctor;