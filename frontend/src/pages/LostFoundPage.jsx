import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LostFoundPage.css';

const LostFoundPage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    itemType: 'lost',
    location: '',
    date: '',
    image: null,
    status: 'open'
  });
  const [activeTab, setActiveTab] = useState('lost');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchLostItems();
  }, [activeTab]);

  const fetchLostItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/lostitems?type=${activeTab}`);
      setItems(response.data);
      filterItems(response.data, searchQuery, filterType);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = (itemsList, query, statusFilter) => {
    let filtered = itemsList;
    
    if (query.trim()) {
      filtered = filtered.filter(item =>
        item.itemName.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.location.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    setFilteredItems(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      data.append('createdBy', localStorage.getItem('userId'));
      
      await axios.post(`${API_URL}/lostitems`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setFormData({
        itemName: '',
        description: '',
        itemType: 'lost',
        location: '',
        date: '',
        image: null,
        status: 'open'
      });
      
      fetchLostItems();
      alert('Item posted successfully!');
    } catch (error) {
      console.error('Error posting item:', error);
      alert('Failed to post item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (itemId, newStatus) => {
    try {
      setLoading(true);
      await axios.patch(`${API_URL}/lostitems/${itemId}`, { status: newStatus });
      fetchLostItems();
    } catch (error) {
      console.error('Error updating item status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterItems(items, query, filterType);
  };

  const handleFilterChange = (status) => {
    setFilterType(status);
    filterItems(items, searchQuery, status);
  };

  return (
    <div className="lost-found-container">
      <header className="page-header">
        <h1>Lost & Found</h1>
        <p>Report lost items or post found items in your hostel</p>
      </header>

      <div className="lost-found-content">
        {/* Report Section */}
        <section className="report-section">
          <h2>Report {activeTab === 'lost' ? 'Lost' : 'Found'} Item</h2>
          <form onSubmit={handleSubmit} className="lost-found-form">
            <div className="form-group">
              <label>Item Name *</label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                placeholder="e.g., Red Backpack"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Type *</label>
                <select
                  name="itemType"
                  value={formData.itemType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide detailed description of the item"
                rows="4"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Block A, Room 201"
                required
              />
            </div>

            <div className="form-group">
              <label>Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Posting...' : 'Post Item'}
            </button>
          </form>
        </section>

        {/* Browse Section */}
        <section className="browse-section">
          <div className="browse-header">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'lost' ? 'active' : ''}`}
                onClick={() => setActiveTab('lost')}
              >
                Lost Items
              </button>
              <button
                className={`tab ${activeTab === 'found' ? 'active' : ''}`}
                onClick={() => setActiveTab('found')}
              >
                Found Items
              </button>
            </div>
          </div>

          <div className="filters">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-box"
            />
            <select
              value={filterType}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="matched">Matched</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {loading ? (
            <div className="loading">Loading items...</div>
          ) : filteredItems.length > 0 ? (
            <div className="items-grid">
              {filteredItems.map((item) => (
                <div key={item._id} className="item-card">
                  {item.image && (
                    <div className="item-image">
                      <img src={item.image} alt={item.itemName} />
                    </div>
                  )}
                  <div className="item-details">
                    <h3>{item.itemName}</h3>
                    <p className="item-type">Type: {item.itemType}</p>
                    <p className="item-location">Location: {item.location}</p>
                    <p className="item-description">{item.description}</p>
                    <p className="item-date">Date: {new Date(item.date).toLocaleDateString()}</p>
                    <span className={`status-badge ${item.status}`}>{item.status}</span>
                    {item.status === 'open' && (
                      <button
                        onClick={() => handleUpdateStatus(item._id, 'matched')}
                        className="btn-match"
                      >
                        Mark as Matched
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-items">
              No {activeTab} items found. Try adjusting your search filters.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default LostFoundPage;
