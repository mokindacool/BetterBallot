import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5002';

function Admin() {
  const [candidates, setCandidates] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    party: '',
    biography: '',
    education: [''],
    experience: [''],
    endorsements: [''],
    policies: [{ title: '', description: '', priority: 50 }],
    socialMedia: {
      website: '',
      email: '',
      twitter: '',
      facebook: '',
      instagram: ''
    },
    electionInfo: {
      district: '',
      zipcodes: [],
      office: ''
    }
  });

  const [elections, setElections] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkElectionInfo, setBulkElectionInfo] = useState({
    district: '',
    zipcodes: [],
    office: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchCandidates();
    fetchElections();
  }, [navigate]);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/candidates`);
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const fetchElections = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/elections`);
      const data = await response.json();
      setElections(data);
    } catch (error) {
      console.error('Error fetching elections:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [name]: value
      }
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handlePolicyChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      policies: prev.policies.map((policy, i) =>
        i === index ? { ...policy, [field]: value } : policy
      )
    }));
  };

  const addPolicy = () => {
    setFormData(prev => ({
      ...prev,
      policies: [...prev.policies, { title: '', description: '', priority: 50 }]
    }));
  };

  const removePolicy = (index) => {
    setFormData(prev => ({
      ...prev,
      policies: prev.policies.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors = [];

    // Required fields
    if (!formData.name.trim()) {
      errors.push('Name is required');
    }
    if (!formData.position.trim()) {
      errors.push('Position is required');
    }

    // Election info validation
    if (!formData.electionInfo.district) {
      errors.push('District selection is required');
    }
    if (!formData.electionInfo.office.trim()) {
      errors.push('Office name is required');
    }
    if (formData.electionInfo.zipcodes.length === 0) {
      errors.push('At least one zipcode must be selected');
    }

    // Policy validation
    const validPolicies = formData.policies.filter(p => p.title.trim() || p.description.trim());
    if (validPolicies.length > 0) {
      validPolicies.forEach((policy, index) => {
        if (policy.title.trim() && !policy.description.trim()) {
          errors.push(`Policy #${index + 1}: Description is required when title is provided`);
        }
        if (!policy.title.trim() && policy.description.trim()) {
          errors.push(`Policy #${index + 1}: Title is required when description is provided`);
        }
      });
    }

    // Social media URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (formData.socialMedia.website && !urlPattern.test(formData.socialMedia.website)) {
      errors.push('Invalid website URL');
    }
    if (formData.socialMedia.twitter && !urlPattern.test(formData.socialMedia.twitter)) {
      errors.push('Invalid Twitter URL');
    }
    if (formData.socialMedia.facebook && !urlPattern.test(formData.socialMedia.facebook)) {
      errors.push('Invalid Facebook URL');
    }
    if (formData.socialMedia.instagram && !urlPattern.test(formData.socialMedia.instagram)) {
      errors.push('Invalid Instagram URL');
    }

    // Email validation
    if (formData.socialMedia.email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.socialMedia.email)) {
        errors.push('Invalid email address');
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      alert('Please fix the following errors:\n\n' + errors.join('\n'));
      return;
    }

    try {
      const url = isEditing
        ? `${BACKEND_URL}/api/candidates/${currentCandidate.id}`
        : `${BACKEND_URL}/api/candidates`;

      const method = isEditing ? 'PUT' : 'POST';

      // Filter out empty strings from arrays
      const cleanedData = {
        ...formData,
        education: formData.education.filter(e => e.trim() !== ''),
        experience: formData.experience.filter(e => e.trim() !== ''),
        endorsements: formData.endorsements.filter(e => e.trim() !== ''),
        policies: formData.policies.filter(p => p.title.trim() !== '' && p.description.trim() !== '')
      };

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(cleanedData)
      });

      if (response.ok) {
        alert(isEditing ? 'Candidate updated successfully!' : 'Candidate created successfully!');
        resetForm();
        fetchCandidates();
      } else {
        const errorData = await response.json();
        alert('Error saving candidate: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving candidate:', error);
      alert('Error saving candidate: ' + error.message);
    }
  };

  const handleEdit = (candidate) => {
    setIsEditing(true);
    setCurrentCandidate(candidate);
    setFormData({
      name: candidate.name,
      position: candidate.position,
      party: candidate.party || '',
      biography: candidate.biography || '',
      education: candidate.education.length > 0 ? candidate.education : [''],
      experience: candidate.experience.length > 0 ? candidate.experience : [''],
      endorsements: candidate.endorsements.length > 0 ? candidate.endorsements : [''],
      policies: candidate.policies.length > 0 ? candidate.policies : [{ title: '', description: '', priority: 50 }],
      socialMedia: candidate.socialMedia || {
        website: '',
        email: '',
        twitter: '',
        facebook: '',
        instagram: ''
      },
      electionInfo: {
        district: candidate.electionInfo?.district || '',
        zipcodes: candidate.electionInfo?.zipcodes || [],
        office: candidate.electionInfo?.office || ''
      }
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/candidates/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        if (response.ok) {
          alert('Candidate deleted successfully!');
          fetchCandidates();
        } else {
          alert('Error deleting candidate');
        }
      } catch (error) {
        console.error('Error deleting candidate:', error);
        alert('Error deleting candidate');
      }
    }
  };

  const handleElectionChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      electionInfo: {
        ...prev.electionInfo,
        [field]: value
      }
    }));
  };

  const handleZipcodeChange = (zipcode) => {
    setFormData(prev => {
      const currentZipcodes = prev.electionInfo.zipcodes || [];
      const newZipcodes = currentZipcodes.includes(zipcode)
        ? currentZipcodes.filter(z => z !== zipcode)
        : [...currentZipcodes, zipcode];

      return {
        ...prev,
        electionInfo: {
          ...prev.electionInfo,
          zipcodes: newZipcodes
        }
      };
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentCandidate(null);
    setFormData({
      name: '',
      position: '',
      party: '',
      biography: '',
      education: [''],
      experience: [''],
      endorsements: [''],
      policies: [{ title: '', description: '', priority: 50 }],
      socialMedia: {
        website: '',
        email: '',
        twitter: '',
        facebook: '',
        instagram: ''
      },
      electionInfo: {
        district: '',
        zipcodes: [],
        office: ''
      }
    });
  };

  // Bulk operations
  const toggleCandidateSelection = (candidateId) => {
    setSelectedCandidates(prev =>
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const selectAllCandidates = () => {
    if (selectedCandidates.length === candidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(candidates.map(c => c.id));
    }
  };

  const handleBulkAssignElection = () => {
    if (selectedCandidates.length === 0) {
      alert('Please select at least one candidate');
      return;
    }
    setShowBulkModal(true);
  };

  const handleBulkZipcodeChange = (zipcode) => {
    setBulkElectionInfo(prev => {
      const currentZipcodes = prev.zipcodes || [];
      const newZipcodes = currentZipcodes.includes(zipcode)
        ? currentZipcodes.filter(z => z !== zipcode)
        : [...currentZipcodes, zipcode];

      return {
        ...prev,
        zipcodes: newZipcodes
      };
    });
  };

  const submitBulkAssignment = async () => {
    if (!bulkElectionInfo.district || !bulkElectionInfo.office || bulkElectionInfo.zipcodes.length === 0) {
      alert('Please fill in all election fields and select at least one zipcode');
      return;
    }

    try {
      let successCount = 0;
      let failCount = 0;

      for (const candidateId of selectedCandidates) {
        const candidate = candidates.find(c => c.id === candidateId);
        if (!candidate) continue;

        const updatedCandidate = {
          ...candidate,
          electionInfo: bulkElectionInfo
        };

        const response = await fetch(`${BACKEND_URL}/api/candidates/${candidateId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(updatedCandidate)
        });

        if (response.ok) {
          successCount++;
        } else {
          failCount++;
        }
      }

      alert(`Bulk assignment complete!\nSuccessful: ${successCount}\nFailed: ${failCount}`);
      setShowBulkModal(false);
      setSelectedCandidates([]);
      setBulkElectionInfo({ district: '', zipcodes: [], office: '' });
      fetchCandidates();
    } catch (error) {
      console.error('Error in bulk assignment:', error);
      alert('Error performing bulk assignment');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCandidates.length === 0) {
      alert('Please select at least one candidate');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedCandidates.length} candidate(s)?`)) {
      return;
    }

    try {
      let successCount = 0;
      let failCount = 0;

      for (const candidateId of selectedCandidates) {
        const response = await fetch(`${BACKEND_URL}/api/candidates/${candidateId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        if (response.ok) {
          successCount++;
        } else {
          failCount++;
        }
      }

      alert(`Bulk delete complete!\nDeleted: ${successCount}\nFailed: ${failCount}`);
      setSelectedCandidates([]);
      fetchCandidates();
    } catch (error) {
      console.error('Error in bulk delete:', error);
      alert('Error performing bulk delete');
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Candidate Management</h1>
        <div className="header-actions">
          <span className="admin-user">Logged in as: {localStorage.getItem('adminUser')}</span>
          <button onClick={() => navigate('/')} className="back-btn">Back to Home</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="admin-content">
        {/* Candidates List */}
        <div className="candidates-list">
          <div className="list-header">
            <h2>All Candidates ({candidates.length})</h2>
            <button onClick={selectAllCandidates} className="select-all-btn">
              {selectedCandidates.length === candidates.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {selectedCandidates.length > 0 && (
            <div className="bulk-actions-bar">
              <span>{selectedCandidates.length} selected</span>
              <div className="bulk-btns">
                <button onClick={handleBulkAssignElection} className="bulk-assign-btn">
                  Assign to Election
                </button>
                <button onClick={handleBulkDelete} className="bulk-delete-btn">
                  Delete Selected
                </button>
                <button onClick={() => setSelectedCandidates([])} className="cancel-selection-btn">
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="candidates-grid">
            {candidates.map(candidate => (
              <div
                key={candidate.id}
                className={`candidate-card ${selectedCandidates.includes(candidate.id) ? 'selected' : ''}`}
              >
                <input
                  type="checkbox"
                  className="candidate-checkbox"
                  checked={selectedCandidates.includes(candidate.id)}
                  onChange={() => toggleCandidateSelection(candidate.id)}
                />
                <div className="card-content">
                  <h3>{candidate.name}</h3>
                  <p>{candidate.position}</p>
                  <p className="party">{candidate.party}</p>
                  <div className="card-actions">
                    <button onClick={() => handleEdit(candidate)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDelete(candidate.id)} className="delete-btn">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="candidate-form">
          <h2>{isEditing ? 'Edit Candidate' : 'Add New Candidate'}</h2>

          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div className="form-section">
              <h3>Basic Information</h3>
              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="position"
                placeholder="Position (e.g., Mayor Candidate) *"
                value={formData.position}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="party"
                placeholder="Party Affiliation"
                value={formData.party}
                onChange={handleInputChange}
              />
              <textarea
                name="biography"
                placeholder="Biography"
                value={formData.biography}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            {/* Education */}
            <div className="form-section">
              <h3>Education</h3>
              {formData.education.map((edu, index) => (
                <div key={index} className="array-item">
                  <input
                    type="text"
                    placeholder="Education entry"
                    value={edu}
                    onChange={(e) => handleArrayChange('education', index, e.target.value)}
                  />
                  {formData.education.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem('education', index)} className="remove-btn">×</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('education')} className="add-btn">+ Add Education</button>
            </div>

            {/* Experience */}
            <div className="form-section">
              <h3>Experience</h3>
              {formData.experience.map((exp, index) => (
                <div key={index} className="array-item">
                  <input
                    type="text"
                    placeholder="Experience entry"
                    value={exp}
                    onChange={(e) => handleArrayChange('experience', index, e.target.value)}
                  />
                  {formData.experience.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem('experience', index)} className="remove-btn">×</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('experience')} className="add-btn">+ Add Experience</button>
            </div>

            {/* Endorsements */}
            <div className="form-section">
              <h3>Endorsements</h3>
              {formData.endorsements.map((end, index) => (
                <div key={index} className="array-item">
                  <input
                    type="text"
                    placeholder="Endorsement organization"
                    value={end}
                    onChange={(e) => handleArrayChange('endorsements', index, e.target.value)}
                  />
                  {formData.endorsements.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem('endorsements', index)} className="remove-btn">×</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('endorsements')} className="add-btn">+ Add Endorsement</button>
            </div>

            {/* Policies */}
            <div className="form-section">
              <h3>Policies</h3>
              {formData.policies.map((policy, index) => (
                <div key={index} className="policy-item">
                  <input
                    type="text"
                    placeholder="Policy Title"
                    value={policy.title}
                    onChange={(e) => handlePolicyChange(index, 'title', e.target.value)}
                  />
                  <textarea
                    placeholder="Policy Description"
                    value={policy.description}
                    onChange={(e) => handlePolicyChange(index, 'description', e.target.value)}
                    rows="3"
                  />
                  <div className="priority-input">
                    <label>Priority: {policy.priority}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={policy.priority}
                      onChange={(e) => handlePolicyChange(index, 'priority', parseInt(e.target.value))}
                    />
                  </div>
                  {formData.policies.length > 1 && (
                    <button type="button" onClick={() => removePolicy(index)} className="remove-btn">Remove Policy</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addPolicy} className="add-btn">+ Add Policy</button>
            </div>

            {/* Social Media */}
            <div className="form-section">
              <h3>Social Media</h3>
              <input
                type="url"
                name="website"
                placeholder="Website URL"
                value={formData.socialMedia.website}
                onChange={handleSocialMediaChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.socialMedia.email}
                onChange={handleSocialMediaChange}
              />
              <input
                type="url"
                name="twitter"
                placeholder="Twitter URL"
                value={formData.socialMedia.twitter}
                onChange={handleSocialMediaChange}
              />
              <input
                type="url"
                name="facebook"
                placeholder="Facebook URL"
                value={formData.socialMedia.facebook}
                onChange={handleSocialMediaChange}
              />
              <input
                type="url"
                name="instagram"
                placeholder="Instagram URL"
                value={formData.socialMedia.instagram}
                onChange={handleSocialMediaChange}
              />
            </div>

            {/* Election Assignment */}
            <div className="form-section">
              <h3>Election & Voting District *</h3>
              <p className="section-note">Assign this candidate to specific zipcodes so voters can find them when searching.</p>

              <select
                value={formData.electionInfo.district}
                onChange={(e) => handleElectionChange('district', e.target.value)}
                className="district-select"
                required
              >
                <option value="">Select District *</option>
                <option value="District 1">District 1</option>
                <option value="District 2">District 2</option>
                <option value="District 3">District 3</option>
                <option value="District 4">District 4</option>
                <option value="District 5">District 5</option>
                <option value="District 6">District 6</option>
                <option value="District 7">District 7</option>
                <option value="District 8">District 8</option>
                <option value="Citywide">Citywide (Mayor, Rent Board, School Board)</option>
              </select>

              <input
                type="text"
                placeholder="Office Name (e.g., City Council District 2, Mayor)"
                value={formData.electionInfo.office}
                onChange={(e) => handleElectionChange('office', e.target.value)}
                required
              />

              <div className="zipcode-section">
                <label>Select Zipcodes where this candidate can be voted for: *</label>
                <div className="zipcode-grid">
                  {['94701', '94702', '94703', '94704', '94705', '94707', '94708', '94709', '94710', '94720'].map(zipcode => (
                    <label key={zipcode} className="zipcode-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.electionInfo.zipcodes.includes(zipcode)}
                        onChange={() => handleZipcodeChange(zipcode)}
                      />
                      <span>{zipcode}</span>
                    </label>
                  ))}
                </div>
                {formData.electionInfo.zipcodes.length === 0 && (
                  <p className="warning-text">⚠️ You must select at least one zipcode for voters to find this candidate!</p>
                )}
              </div>

              <div className="info-box">
                <strong>Why is this important?</strong>
                <p>When voters enter their zipcode on the homepage, the system uses this information to show them only the candidates they can vote for in their area.</p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {isEditing ? 'Update Candidate' : 'Create Candidate'}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} className="cancel-btn">Cancel</button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Bulk Assignment Modal */}
      {showBulkModal && (
        <div className="modal-overlay" onClick={() => setShowBulkModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Bulk Assign to Election</h2>
            <p className="modal-subtitle">Assigning {selectedCandidates.length} candidate(s) to an election</p>

            <div className="modal-form">
              <label>District *</label>
              <select
                value={bulkElectionInfo.district}
                onChange={(e) => setBulkElectionInfo({...bulkElectionInfo, district: e.target.value})}
                className="district-select"
              >
                <option value="">Select District</option>
                <option value="District 1">District 1</option>
                <option value="District 2">District 2</option>
                <option value="District 3">District 3</option>
                <option value="District 4">District 4</option>
                <option value="District 5">District 5</option>
                <option value="District 6">District 6</option>
                <option value="District 7">District 7</option>
                <option value="District 8">District 8</option>
                <option value="Citywide">Citywide (Mayor, Rent Board, School Board)</option>
              </select>

              <label>Office Name *</label>
              <input
                type="text"
                placeholder="e.g., City Council District 2, Mayor"
                value={bulkElectionInfo.office}
                onChange={(e) => setBulkElectionInfo({...bulkElectionInfo, office: e.target.value})}
              />

              <label>Zipcodes *</label>
              <div className="zipcode-grid">
                {['94701', '94702', '94703', '94704', '94705', '94707', '94708', '94709', '94710', '94720'].map(zipcode => (
                  <label key={zipcode} className="zipcode-checkbox">
                    <input
                      type="checkbox"
                      checked={bulkElectionInfo.zipcodes.includes(zipcode)}
                      onChange={() => handleBulkZipcodeChange(zipcode)}
                    />
                    <span>{zipcode}</span>
                  </label>
                ))}
              </div>

              <div className="modal-actions">
                <button onClick={submitBulkAssignment} className="submit-btn">
                  Assign to Election
                </button>
                <button onClick={() => setShowBulkModal(false)} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
