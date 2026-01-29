import React from 'react';
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ id, title, children, className }) => {
  return (
    <section id={id} className={cn("py-20 md:py-32 border-b border-gray-100 dark:border-gray-800", className)}>
      <div className="container px-4 md:px-6 relative">
        <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A1F44] dark:text-white tracking-tight mb-4 leading-tight">
            {title}
          </h2>
          <div className="h-1.5 w-24 bg-[#00E5A8] mx-auto rounded-full"></div>
        </div>
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;