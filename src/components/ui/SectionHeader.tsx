import React from 'react';

interface SectionHeaderProps {
  title: string;
  highlightText?: string;
  description?: string;
  alignment?: 'left' | 'center';
  maxWidth?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  highlightText,
  description,
  alignment = 'center',
  maxWidth = 'max-w-3xl'
}) => {
  const alignmentClass = alignment === 'center' ? 'text-center' : 'text-left';
  const containerClass = alignment === 'center' ? 'mx-auto' : '';

  return (
    <div className={`${alignmentClass} ${maxWidth} ${containerClass} mb-16 animate-on-scroll`}>
      <h2 className="text-4xl md:text-5xl font-poppins font-bold text-text-primary mb-6 leading-tight">
        {title}
        {highlightText && (
          <span className="gradient-text"> {highlightText}</span>
        )}
      </h2>
      {description && (
        <p className="text-xl text-text-secondary leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;