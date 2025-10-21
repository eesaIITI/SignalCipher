import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import Loader from "./Loader";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // const port = "http://localhost:5000";
  const port  = "https://signal-cipher.vercel.app";

  useEffect(() => {
    setLoading(true);
    fetch(`${port}/getAllUsers`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.users);
          toast.success("Users loaded successfully");
        } else {
          toast.error("Failed to load users");
        }
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        toast.error("Error fetching users");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader label="Loading users..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-8 text-center">All Users</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
          {users.length === 0 && <div className="card text-center text-text-secondary">No users found</div>}
          {users.map((user) => (
            <div key={user._id} onClick={() => setSelectedUser(user)}
              className={`card cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                selectedUser?._id === user._id ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
              }`}>
              <h3 className="font-bold text-lg text-primary mb-2">{user.UserName || "Unnamed User"}</h3>
              <p className="text-sm text-text-secondary mb-1">{user.UserEmail}</p>
              <div className="flex gap-4 text-xs text-text-secondary">
                <span><strong>Solved:</strong> {user.Qns_Solved?.length || 0}</span>
                <span><strong>Current:</strong> Q{user.CurrQn}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-2">
          {selectedUser ? (
            <div className="card animate-scale-in">
              <h2 className="text-2xl font-bold text-gradient mb-6">User Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><p className="text-sm text-text-secondary">User ID</p><p className="font-mono text-sm">{selectedUser._id}</p></div>
                  <div><p className="text-sm text-text-secondary">Name</p><p className="font-semibold">{selectedUser.UserName || "Not provided"}</p></div>
                  <div><p className="text-sm text-text-secondary">Email</p><p className="font-medium">{selectedUser.UserEmail}</p></div>
                  <div><p className="text-sm text-text-secondary">Current Question</p><p className="font-semibold">Q{selectedUser.CurrQn}</p></div>
                </div>
                <div><p className="text-sm text-text-secondary mb-2">Questions Solved</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.Qns_Solved?.length ? selectedUser.Qns_Solved.map((qn, idx) => (
                      <span key={idx} className="badge-success">Q{qn}</span>
                    )) : <span className="text-text-secondary italic">None</span>}
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <h3 className="text-lg font-semibold mb-4">Solve History</h3>
                  {selectedUser.SolveHistory?.length ? (
                    <div className="space-y-2">{selectedUser.SolveHistory.map((entry, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-surface-hover rounded-lg">
                        <span className="font-semibold text-primary">Question {entry.Qno}</span>
                        <span className="text-sm text-text-secondary">{entry.SolvedAt}</span>
                      </div>
                    ))}</div>
                  ) : <p className="text-text-secondary italic">No questions solved yet</p>}
                </div>
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center text-center">
              <div><div className="text-6xl mb-4">👈</div><p className="text-text-secondary">Click on a user to view details</p></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UsersList;
