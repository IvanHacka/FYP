import React from 'react';
import "/Users/haymac/Desktop/FYP/redo/JobBoard/job-board-frontend/src/components/profile/ProfileStyle.css";

const ProfileCompletion = ({ percentage }) => {
    const getCompletionMessage = () => {
        if (percentage >= 100) return '🎉 Your profile is completed!';
        if (percentage >= 80) return 'Almost there! Few steps ahead.';
        if (percentage >= 60) return 'Good progress! Keep going.';
        if (percentage >= 40) return 'You are making some progress!';
        return 'Build your profile!';
    };

    const getSuggestions = () => {
        const suggestions = [];

        if (percentage < 30) {
            suggestions.push('Upload your CV to stand out');
        }
        if (percentage < 50) {
            suggestions.push('Add your work experience');
        }
        if (percentage < 70) {
            suggestions.push('List your skills');
        }
        if (percentage < 90) {
            suggestions.push('Add education and certificates');
        }

        return suggestions;
    };

    return (
        <div className="profile-completion">
            <div className="completion-header">
                <span className="completion-label">Profile Completion</span>
                <span className="completion-percentage">{percentage}%</span>
            </div>

            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <p className="completion-message">{getCompletionMessage()}</p>

            {percentage < 100 && (
                <div className="completion-suggestions">
                    <h4>Complete your profile:</h4>
                    <ul>
                        {getSuggestions().map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProfileCompletion;