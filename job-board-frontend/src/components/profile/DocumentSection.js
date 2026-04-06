import React, { useState, useEffect } from 'react';
import { getDocuments, uploadDocument, downloadDocument,
    deleteDocument } from "/Users/haymac/Desktop/FYP/redo/JobBoard/job-board-frontend/src/api/api.js";
import '/Users/haymac/Desktop/FYP/redo/JobBoard/job-board-frontend/src/components/profile/ProfileStyle.css';

const DocumentsSection = ({ onUpdate }) => {
    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [documentType, setDocumentType] = useState('CV');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            const response = await getDocuments();
            setDocuments(response.data);
        } catch (error) {
            console.error('Error loading documents:', error);
            alert('Failed to load documents');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file');
            return;
        }

        setUploading(true);
        try {
            await uploadDocument(selectedFile, documentType);
            await loadDocuments();
            setSelectedFile(null);
            document.getElementById('file-input').value = '';
            onUpdate(); // Refresh profile completion
            alert('Document uploaded successfully!');
        } catch (error) {
            console.error('Error uploading document:', error);
            alert('Failed to upload document');
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (doc) => {
        try {
            const response = await downloadDocument(doc.id);

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', doc.documentName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading document:', error);
            alert('Failed to download document');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document?')) {
            return;
        }

        try {
            await deleteDocument(id);
            await loadDocuments();
            onUpdate(); // Refresh profile completion
            alert('Document deleted successfully');
        } catch (error) {
            console.error('Error deleting document:', error);
            alert('Failed to delete document');
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDocumentIcon = (type) => {
        switch(type) {
            case 'CV': return '📄';
            case 'COVER_LETTER': return '📝';
            case 'CERTIFICATE': return '🎓';
            default: return '📎';
        }
    };

    const getDocumentsByType = (type) => {
        return documents.filter(doc => doc.documentType === type);
    };

    if (loading) {
        return <div className="loading">Loading documents...</div>;
    }

    return (
        <div className="documents-section">
            <div className="section-header">
                <h2>Documents</h2>
            </div>

            {/* Upload Form */}
            <div className="upload-form">
                <h3>Upload Document</h3>
                <div className="upload-controls">
                    <div className="form-group">
                        <label>Document Type</label>
                        <select
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                        >
                            <option value="CV">CV/Resume</option>
                            <option value="COVER_LETTER">Cover Letter</option>
                            <option value="CERTIFICATE">Certificate</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Select File</label>
                        <input
                            id="file-input"
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                    </div>

                    <button
                        className="btn-upload"
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
                {selectedFile && (
                    <p className="file-info">
                        Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                )}
            </div>

            {/* Documents List */}
            <div className="documents-list">
                {/* CVs */}
                <div className="document-category">
                    <h3>📄 CV/Resume</h3>
                    {getDocumentsByType('CV').length === 0 ? (
                        <p className="empty-message">No CV uploaded yet. Upload one to apply to jobs!</p>
                    ) : (
                        getDocumentsByType('CV').map(doc => (
                            <div key={doc.id} className="document-card">
                                <div className="document-info">
                                    <span className="document-icon">{getDocumentIcon(doc.documentType)}</span>
                                    <div className="document-details">
                                        <h4>{doc.documentName}</h4>
                                        <p>
                                            {formatFileSize(doc.fileSize)} •
                                            Uploaded {formatDate(doc.uploadedAt)}
                                        </p>
                                    </div>
                                </div>
                                <div className="document-actions">
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleDownload(doc)}
                                        title="Download"
                                    >
                                        ⬇️
                                    </button>
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleDelete(doc.id)}
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Cover Letters */}
                <div className="document-category">
                    <h3>📝 Cover Letters</h3>
                    {getDocumentsByType('COVER_LETTER').length === 0 ? (
                        <p className="empty-message">No cover letters uploaded.</p>
                    ) : (
                        getDocumentsByType('COVER_LETTER').map(doc => (
                            <div key={doc.id} className="document-card">
                                <div className="document-info">
                                    <span className="document-icon">{getDocumentIcon(doc.documentType)}</span>
                                    <div className="document-details">
                                        <h4>{doc.documentName}</h4>
                                        <p>
                                            {formatFileSize(doc.fileSize)} •
                                            Uploaded {formatDate(doc.uploadedAt)}
                                        </p>
                                    </div>
                                </div>
                                <div className="document-actions">
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleDownload(doc)}
                                        title="Download"
                                    >
                                        ⬇️
                                    </button>
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleDelete(doc.id)}
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Certificates */}
                <div className="document-category">
                    <h3>🎓 Certificates</h3>
                    {getDocumentsByType('CERTIFICATE').length === 0 ? (
                        <p className="empty-message">No certificates uploaded.</p>
                    ) : (
                        getDocumentsByType('CERTIFICATE').map(doc => (
                            <div key={doc.id} className="document-card">
                                <div className="document-info">
                                    <span className="document-icon">{getDocumentIcon(doc.documentType)}</span>
                                    <div className="document-details">
                                        <h4>{doc.documentName}</h4>
                                        <p>
                                            {formatFileSize(doc.fileSize)} •
                                            Uploaded {formatDate(doc.uploadedAt)}
                                        </p>
                                    </div>
                                </div>
                                <div className="document-actions">
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleDownload(doc)}
                                        title="Download"
                                    >
                                        ⬇️
                                    </button>
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleDelete(doc.id)}
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Other Documents */}
                {getDocumentsByType('OTHER').length > 0 && (
                    <div className="document-category">
                        <h3>📎 Other Documents</h3>
                        {getDocumentsByType('OTHER').map(doc => (
                            <div key={doc.id} className="document-card">
                                <div className="document-info">
                                    <span className="document-icon">{getDocumentIcon(doc.documentType)}</span>
                                    <div className="document-details">
                                        <h4>{doc.documentName}</h4>
                                        <p>
                                            {formatFileSize(doc.fileSize)} •
                                            Uploaded {formatDate(doc.uploadedAt)}
                                        </p>
                                    </div>
                                </div>
                                <div className="document-actions">
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleDownload(doc)}
                                        title="Download"
                                    >
                                        ⬇️
                                    </button>
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleDelete(doc.id)}
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="upload-tips">
                <h4>Tips for your documents:</h4>
                <ul>
                    <li>Use PDF format for best compatibility and professional appearance</li>
                    <li>Keep file size under 5MB for faster uploads and downloads</li>
                    <li>Include relevant work experience and skills in your CV</li>
                    <li>Make sure contact information is up to date</li>
                    <li>Use clear, descriptive file names (e.g., "John_Doe_CV_2026.pdf")</li>
                    <li>Tailor your cover letter to each job application</li>
                </ul>
            </div>
        </div>
    );
};

export default DocumentsSection;