import * as React from 'react';
import './ResourcesTab.scss';
import { Resource } from '../../../models/resource';

interface IResourcesTabProps {
  resources: Resource[];
}

const ResourcesTab = ({ resources }: IResourcesTabProps) => {
  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = (event: any, url: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLinkClick(url);
    }
  };

  if (!resources || resources.length === 0) {
    return (
      <div className="resources-tab">
        <div className="resources-tab__empty">
          <p>No resources available for this step.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="resources-tab">
      <div className="resources-tab__header">
        <h3 className="resources-tab__title">Learning Resources</h3>
        <p className="resources-tab__description">
          Review these resources before taking the survey. All links open in a new tab.
        </p>
      </div>

      <div className="resources-tab__list">
        {resources.map((resource) => (
          <div
            key={resource.title}
            className="resource-item"
            onClick={() => handleLinkClick(resource.url)}
            onKeyDown={(e) => handleKeyDown(e, resource.url)}
            tabIndex={0}
            role="button"
            aria-label={`Open ${resource.title} in new tab`}
          >
            <div className="resource-item__icon">
              {resource.title === 'external' ? '🔗' : '📄'}
            </div>

            <div className="resource-item__content">
              <h4 className="resource-item__title">{resource.title}</h4>
              <p className="resource-item__url">{resource.url}</p>
            </div>

            <div className="resource-item__action">
              <span className="resource-item__arrow">→</span>
            </div>
          </div>
        ))}
      </div>

      <div className="resources-tab__footer">
        <div className="resources-tab__note">
          <strong>Note:</strong> It's recommended to review all resources before attempting the survey.
          You need 100% accuracy to pass each step.
        </div>
      </div>
    </div>
  );
};

export default ResourcesTab;