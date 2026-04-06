import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import './AdminDashboard.css';

const AdminDashboard = ({ user }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ open: 0, in_progress: 0, resolved: 0 });

  useEffect(() => {
    fetchIssues();
    
    // Subscribe to realtime updates
    const subscription = supabase
      .channel('admin:issues')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'issues' }, () => {
        fetchIssues();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIssues(data || []);
      
      // Calculate stats
      const s = { open: 0, in_progress: 0, resolved: 0 };
      data?.forEach(i => {
        if (i.status === 'Open') s.open++;
        else if (i.status === 'In Progress') s.in_progress++;
        else if (i.status === 'Resolved') s.resolved++;
      });
      setStats(s);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('issues')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      // Realtime subscription handles UI update
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Control Panel</h1>
        <p>Hostel Maintenance & Grievance Management</p>
      </header>

      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-val">{stats.open}</span>
          <span className="stat-label">Open Issues</span>
        </div>
        <div className="stat-card">
          <span className="stat-val">{stats.in_progress}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-card">
          <span className="stat-val">{stats.resolved}</span>
          <span className="stat-label">Resolved</span>
        </div>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div className="loader">Refreshing master records...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Current Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map(issue => (
                <tr key={issue.id}>
                  <td>
                    <strong>{issue.title}</strong>
                    <p className="description-preview">{issue.description.substring(0, 50)}...</p>
                  </td>
                  <td>{issue.location}</td>
                  <td>
                    <span className={`status-tag ${issue.status.toLowerCase().replace(' ', '-')}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      value={issue.status}
                      onChange={(e) => updateStatus(issue.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
