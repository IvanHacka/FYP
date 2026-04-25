import React from 'react';
import "/Users/haymac/Desktop/FYP/redo/JobBoard/job-board-frontend/src/components/profile/ProfileStyle.css";

const ProfileCompletion = ({completion}) => {

    const percentage = completion?.completionScore ?? 0;
    const getCompletionMessage = () => {
        if (percentage >= 100) return 'You are ready to be employed!!';
        if (percentage >= 80) return 'Almost there! Few steps ahead.';
        if (percentage >= 60) return 'Good progress! Keep going.';
        if (percentage >= 40) return 'You are making some progress!';
        return 'Build your profile!';
    };

    const getSuggestions = () => {
        const suggestions = [];

        if (!completion?.hasBasicInfo) {
            suggestions.push('Complete your basic information');
        }

        if (!completion?.hasCv) {
            suggestions.push('Upload your CV');
        }

        if (!completion?.hasSkills) {
            suggestions.push('Add skills');
        }

        if (!completion?.hasExperience) {
            suggestions.push('Add your work experience');
        }

        if (!completion?.hasEducation) {
            suggestions.push('Add your education');
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