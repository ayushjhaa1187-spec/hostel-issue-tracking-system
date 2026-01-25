import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Dashboard/Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Dashboard = ({ user, onLogout }) => {
  const [issues, setIssues] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [activeTab, setActiveTab] = useState('issues');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchIssues();
    fetchAnnouncements();
}, []);
  const fetchIssues = async () => {
    try {
      const response = await axios.get(`${API_URL}/issues`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIssues(response.data);
    } catch (err) {
      console.error('Error fetching issues:', err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${API_URL}/announcements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(response.data);
    } catch (err) {
      console.error('Error fetching announcements:', err);
    }
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/issues`,
        { title, description, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
      setDescription('');
      setLocation('');
      fetchIssues();
    } catch (err) {
      console.error('Error creating issue:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">Hostel Issue Tracking</div>
        <div className="nav-right">
          <span className="user-info">Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'issues' ? 'active' : ''}`}
            onClick={() => setActiveTab('issues')}
          >
            Issues
          </button>
          <button 
            className={`tab ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            Announcements
          </button>
        </div>

        {activeTab === 'issues' && (
          <div className="issues-section">
            {user?.role !== 'Student' && (
              <form onSubmit={handleCreateIssue} className="create-issue-form">
                <h3>Report New Issue</h3>
                <input
                  type="text"
                  placeholder="Issue Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Issue'}
                </button>
              </form>
            )}

            <div className="issues-list">
              <h3>All Issues</h3>
              {issues.map((issue) => (
                <div key={issue._id} className="issue-card">
                  <h4>{issue.title}</h4>
                  <p>{issue.description}</p>
                  <div className="issue-meta">
                    <span className="status-badge" style={{
                      backgroundColor: issue.status === 'Open' ? '#ff9999' : '#99ff99'
                    }}>
                      {issue.status}
                    </span>
                    <span className="location">📍 {issue.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="announcements-section">
            {announcements.map((ann) => (
              <div key={ann._id} className="announcement-card">
                <h4>{ann.title}</h4>
                <p>{ann.content}</p>
                <small>By: {ann.postedBy?.name}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
