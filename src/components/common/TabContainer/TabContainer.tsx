import * as React from 'react';
import './TabContainer.scss';

interface ITabContainerProps {
  tabs: any;
  defaultTab?: number;
  className?: string;
}
const TabContainer = ({ tabs, defaultTab = 0, className = '' }: ITabContainerProps) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const handleKeyDown = (event: any, index: number) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        setActiveTab(index > 0 ? index - 1 : tabs.length - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        setActiveTab(index < tabs.length - 1 ? index + 1 : 0);
        break;
      case 'Home':
        event.preventDefault();
        setActiveTab(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveTab(tabs.length - 1);
        break;
      default:
        break;
    }
  };

  const containerClass = [
    'tab-container',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClass}>
      <div className="tab-container__nav" role="tablist">
        {tabs.map((tab: any, index: any) => (
          <button
            key={tab.id || index}
            className={`tab-container__tab ${activeTab === index ? 'tab-container__tab--active' : ''
              }`}
            onClick={() => handleTabClick(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            role="tab"
            aria-selected={activeTab === index}
            aria-controls={`tabpanel-${tab.id || index}`}
            id={`tab-${tab.id || index}`}
            tabIndex={activeTab === index ? 0 : -1}
          >
            {tab.icon && <span className="tab-container__icon">{tab.icon}</span>}
            <span className="tab-container__label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="tab-container__content">
        {tabs.map((tab: any, index: number) => (
          <div
            key={tab.id || index}
            className={`tab-container__panel ${activeTab === index ? 'tab-container__panel--active' : ''
              }`}
            role="tabpanel"
            id={`tabpanel-${tab.id || index}`}
            aria-labelledby={`tab-${tab.id || index}`}
            hidden={activeTab !== index}
          >
            {activeTab === index && tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabContainer;