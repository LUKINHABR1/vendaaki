import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-64 bg-gray-200 rounded-2xl mb-8 w-full"></div>
      
      {/* Categories Skeleton */}
      <div className="flex gap-4 overflow-hidden mb-10">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="min-w-[100px] h-24 bg-gray-200 rounded-xl"></div>
        ))}
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1,2,3,4,5,6,7,8].map(i => (
          <div key={i} className="bg-white rounded-xl h-64 border border-gray-100">
             <div className="h-40 bg-gray-200 rounded-t-xl"></div>
             <div className="p-4 space-y-3">
               <div className="h-4 bg-gray-200 rounded w-3/4"></div>
               <div className="h-6 bg-gray-200 rounded w-1/2"></div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};