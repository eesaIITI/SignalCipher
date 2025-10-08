import React, { useEffect, useState } from "react";
import "./UsersList.css";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const port  = "https://signal-cipher.vercel.app";
  // const port = "http://localhost:5000";
  // Fetch all users on component mount
  useEffect(() => {
    fetch( `${port}/getAllUsers`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.users);
        }
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="users-container">
      {/* LEFT PANEL — USER LIST */}
      <div className="users-list">
        <h2>All Users</h2>
        {users.length === 0 && <p>No users found</p>}
        {users.map((user) => (
          <div
            key={user._id}
            className={`user-card ${selectedUser?._id === user._id ? "active" : ""}`}
            onClick={() => setSelectedUser(user)}
          >
            <p className="user-name"><strong>{user.UserName || "Unnamed User"}</strong></p>
            <p className="user-email">{user.UserEmail}</p>
            <p className="user-progress">
              Solved: {user.Qns_Solved?.length || 0} | Curr: {user.CurrQn}
            </p>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL — SELECTED USER DETAILS */}
      <div className="user-details">
        {selectedUser ? (
          <div>
            <h2>User Details</h2>
            <p><strong>User ID:</strong> {selectedUser._id}</p>
            <p><strong>Name:</strong> {selectedUser.UserName || "Not provided"}</p>
            <p><strong>Email:</strong> {selectedUser.UserEmail}</p>
            <p><strong>Current Question:</strong> {selectedUser.CurrQn}</p>
            <p><strong>Questions Solved:</strong> 
              {selectedUser.Qns_Solved?.length
                ? ` ${selectedUser.Qns_Solved.join(", ")}`
                : " None"}
            </p>

            {/* 🔥 Solve History Section */}
            <div className="solve-history">
              <h3>Solve History</h3>
              {selectedUser.SolveHistory && selectedUser.SolveHistory.length > 0 ? (
                <ul>
                  {selectedUser.SolveHistory.map((entry, i) => (
                    <li key={i}>
                      <strong>Q{entry.Qno}</strong> → {entry.SolvedAt}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No questions solved yet</p>
              )}
            </div>
          </div>
        ) : (
          <p className="no-selection">Click on a user to view details</p>
        )}
      </div>
    </div>
  );
}

export default UsersList;
