import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('30');
  const [selectedMetric, setSelectedMetric] = useState('summary');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/analytics/summary?days=${dateRange}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (format) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/analytics/export-report?format=${format}`, {
        responseType: format === 'pdf' ? 'blob' : 'json'
      });

      if (format === 'pdf') {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `analytics-report-${new Date().toISOString().split('T')[0]}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        const dataStr = JSON.stringify(response.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `analytics-report-${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const MetricsCard = ({ title, value, subtitle, icon, trend }) => (
    <div className="metrics-card">
      <div className="card-header">
        <h3>{title}</h3>
        {icon && <span className="card-icon">{icon}</span>}
      </div>
      <div className="card-body">
        <p className="metric-value">{value}</p>
        {subtitle && <p className="metric-subtitle">{subtitle}</p>}
        {trend && (
          <p className={`metric-trend ${trend > 0 ? 'positive' : 'negative'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last period
          </p>
        )}
      </div>
    </div>
  );

  const ChartContainer = ({ title, children }) => (
    <div className="chart-container">
      <h3>{title}</h3>
      <div className="chart-body">{children}</div>
    </div>
  );

  return (
    <div className="analytics-dashboard">
      {/* Header */}
      <header className="analytics-header">
        <div className="header-left">
          <h1>Analytics Dashboard</h1>
          <p>Track and analyze hostel issues, performance metrics, and operational insights</p>
        </div>
        <div className="header-controls">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="date-range-select"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button
            onClick={() => handleExportReport('pdf')}
            disabled={loading}
            className="btn-export"
          >
            📄 Export PDF
          </button>
          <button
            onClick={() => handleExportReport('csv')}
            disabled={loading}
            className="btn-export"
          >
            📊 Export CSV
          </button>
        </div>
      </header>

      {/* Main Content */}
      {loading ? (
        <div className="loading">Loading analytics data...</div>
      ) : analytics ? (
        <div className="dashboard-content">
          {/* KPI Cards */}
          <section className="kpi-section">
            <MetricsCard
              title="Total Issues"
              value={analytics.totalIssues || 0}
              subtitle="All-time issues reported"
              icon="📋"
              trend={analytics.issuesTrend}
            />
            <MetricsCard
              title="Open Issues"
              value={analytics.openIssues || 0}
              subtitle="Awaiting resolution"
              icon="🔴"
              trend={analytics.openTrend}
            />
            <MetricsCard
              title="Avg Resolution Time"
              value={`${analytics.avgResolutionTime || 0} hrs`}
              subtitle="Average hours to resolve"
              icon="⏱️"
              trend={analytics.resolutionTimeTrend}
            />
            <MetricsCard
              title="SLA Compliance"
              value={`${analytics.slaCompliance || 0}%`}
              subtitle="Issues resolved within SLA"
              icon="✅"
              trend={analytics.slaComplianceTrend}
            />
          </section>

          {/* Chart Sections */}
          <section className="charts-section">
            <div className="charts-grid">
              <ChartContainer title="Issues by Status">
                <div className="simple-chart">
                  <div className="chart-item">
                    <span>Reported: {analytics.issuesByStatus?.reported || 0}</span>
                    <div className="progress-bar">
                      <div
                        className="progress-fill reported"
                        style={{
                          width: `${(
                            ((analytics.issuesByStatus?.reported || 0) /
                              (analytics.totalIssues || 1)) *
                            100
                          ).toFixed(1)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="chart-item">
                    <span>Assigned: {analytics.issuesByStatus?.assigned || 0}</span>
                    <div className="progress-bar">
                      <div
                        className="progress-fill assigned"
                        style={{
                          width: `${(
                            ((analytics.issuesByStatus?.assigned || 0) /
                              (analytics.totalIssues || 1)) *
                            100
                          ).toFixed(1)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="chart-item">
                    <span>In Progress: {analytics.issuesByStatus?.inProgress || 0}</span>
                    <div className="progress-bar">
                      <div
                        className="progress-fill in-progress"
                        style={{
                          width: `${(
                            ((analytics.issuesByStatus?.inProgress || 0) /
                              (analytics.totalIssues || 1)) *
                            100
                          ).toFixed(1)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="chart-item">
                    <span>Resolved: {analytics.issuesByStatus?.resolved || 0}</span>
                    <div className="progress-bar">
                      <div
                        className="progress-fill resolved"
                        style={{
                          width: `${(
                            ((analytics.issuesByStatus?.resolved || 0) /
                              (analytics.totalIssues || 1)) *
                            100
                          ).toFixed(1)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </ChartContainer>

              <ChartContainer title="Issues by Category">
                <div className="category-list">
                  {analytics.categoriesBreakdown &&
                    Object.entries(analytics.categoriesBreakdown).map(([category, count]) => (
                      <div key={category} className="category-item">
                        <span>{category}</span>
                        <span className="category-count">{count}</span>
                      </div>
                    ))}
                </div>
              </ChartContainer>

              <ChartContainer title="Top Performing Staff">
                <div className="staff-list">
                  {analytics.staffPerformance &&
                    analytics.staffPerformance.slice(0, 5).map((staff, index) => (
                      <div key={index} className="staff-item">
                        <span className="staff-rank">#{index + 1}</span>
                        <span className="staff-name">{staff.name}</span>
                        <span className="staff-score">{staff.score} points</span>
                      </div>
                    ))}
                </div>
              </ChartContainer>

              <ChartContainer title="Response Time Metrics">
                <div className="metrics-detail">
                  <div className="metric-row">
                    <span>Average First Response</span>
                    <strong>{analytics.avgFirstResponse || '0'} hrs</strong>
                  </div>
                  <div className="metric-row">
                    <span>Fastest Response</span>
                    <strong>{analytics.fastestResponse || '0'} mins</strong>
                  </div>
                  <div className="metric-row">
                    <span>Slowest Response</span>
                    <strong>{analytics.slowestResponse || '0'} hrs</strong>
                  </div>
                </div>
              </ChartContainer>
            </div>
          </section>

          {/* Recent Issues */}
          <section className="recent-issues-section">
            <h2>Recent Issues</h2>
            <div className="issues-table">
              <table>
                <thead>
                  <tr>
                    <th>Issue ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentIssues &&
                    analytics.recentIssues.map((issue) => (
                      <tr key={issue._id}>
                        <td>{issue._id.slice(0, 8)}</td>
                        <td>{issue.title}</td>
                        <td>{issue.category}</td>
                        <td>
                          <span className={`status-badge ${issue.status.toLowerCase()}`}>
                            {issue.status}
                          </span>
                        </td>
                        <td>{new Date(issue.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`priority-badge ${issue.priority.toLowerCase()}`}>
                            {issue.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : (
        <div className="error">Failed to load analytics data. Please try again.</div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
