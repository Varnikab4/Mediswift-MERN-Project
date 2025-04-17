import React from "react";
import Layout from "./../components/Layout";
import { message, Tabs } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { markAllNotificationsRead } from "../redux/features/userSlice"; // import action
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  // Handle mark all as read
  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/get-all-notification",
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        dispatch(markAllNotificationsRead()); // Update Redux store
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error marking notifications as read:", error);
      message.error("Something went wrong");
    }
  };

  // Handle delete all read notifications
  const handleDeleteAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/delete-all-notification",
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("All read notifications deleted successfully");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error deleting read notifications:", error);
      message.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <h4 className="p-3 text-center">Notification Page</h4>
      <Tabs>
        <Tabs.TabPane tab="Unread" key="0">
          <div
            className="d-flex justify-content-end"
            style={{ cursor: "pointer" }}
          >
            <h4 className="p-2 text-primary" onClick={handleMarkAllRead}>
              Mark All Read
            </h4>
          </div>
          {user?.notification.length > 0 ? (
            user.notification.map((notificationMsg, index) => (
              <div className="card" key={index} style={{ cursor: "pointer" }}>
                <div
                  className="card-text"
                  onClick={() => navigate(notificationMsg.onClickPath)}
                >
                  {notificationMsg.message}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No unread notifications</p>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Read" key="1">
          <div
            className="d-flex justify-content-end"
            style={{ cursor: "pointer" }}
          >
            <h4 className="p-2 text-primary" onClick={handleDeleteAllRead}>
              Delete All Read
            </h4>
          </div>
          {user?.seennotification.length > 0 ? (
            user.seennotification.map((notificationMsg, index) => (
              <div className="card" key={index} style={{ cursor: "pointer" }}>
                <div
                  className="card-text"
                  onClick={() => navigate(notificationMsg.onClickPath)}
                >
                  {notificationMsg.message}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No read notifications</p>
          )}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};

export default NotificationPage;
