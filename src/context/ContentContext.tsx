import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import api from '../services/api'; // Import your API service

// Interfaces for structured metadata (TestimonialData, FeatureData, StepData)
export interface TestimonialData {
  name: string;
  location: string;
  rating: number;
  comment: string;
  image: string;
}

export interface FeatureData {
  icon: string;
  title: string;
  description: string;
}

export interface StepData {
  icon: string;
  title: string;
  description: string;
}

// Frontend ContentSection interface (using contentId as primary frontend ID)
export interface ContentSection {
  _id?: string; // From MongoDB (optional on frontend)
  id: string; // Mapped from contentId for consistent frontend access
  contentId: string; // Unique string identifier from backend/defaults
  title: string; // User-friendly title for admin panel
  content: string; // Main text content or description
  type: 'text' | 'image' | 'video' | 'testimonials' | 'features' | 'steps'; // Content type
  metadata?: { // Flexible metadata based on type
    imageUrl?: string;
    videoUrl?: string;
    altText?: string;
    testimonials?: TestimonialData[];
    features?: FeatureData[];
    steps?: StepData[];
  };
  lastUpdatedAt?: string; // Optional: To track freshness from backend
}

// Interface for backend response structure (uses _id)
interface ContentSectionBE {
    _id: string; // MongoDB ObjectId
    contentId: string;
    title: string;
    content: string;
    type: 'text' | 'image' | 'video' | 'testimonials' | 'features' | 'steps';
    metadata?: { /* ... same metadata structure ... */
        imageUrl?: string;
        videoUrl?: string;
        altText?: string;
        testimonials?: TestimonialData[];
        features?: FeatureData[];
        steps?: StepData[];
    };
    lastUpdatedAt?: string;
}

// Define the shape of the context
interface ContentContextType {
  contentSections: ContentSection[]; // Array of frontend-formatted sections
  isLoading: boolean; // Loading state for API calls
  error: string | null; // Error state for API calls
  getContent: (contentId: string) => ContentSection | undefined; // Get section by contentId
  getContentValue: (contentId: string) => string; // Get content string by contentId
  getContentMetadata: (contentId: string) => any; // Get metadata by contentId
  getTestimonials: () => TestimonialData[]; // Helper to get testimonials array
  getFeatures: () => FeatureData[]; // Helper to get features array
  getSteps: () => StepData[]; // Helper to get steps array
  updateContent: (sections: ContentSection[]) => Promise<boolean>; // Function to update content via API
  refreshContent: () => void; // Function to manually refetch content
}

// Create the context
const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Content Provider Component
export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start loading on initial mount
  const [error, setError] = useState<string | null>(null);

  // Function to map backend data (_id, contentId) to frontend format (id = contentId)
  const mapBEToFE = (sectionsBE: ContentSectionBE[]): ContentSection[] => {
    return sectionsBE.map(sectionBE => ({
        ...sectionBE, // Spread all properties from backend object
        id: sectionBE.contentId // Map contentId to frontend 'id' for consistent access
    }));
  };

  // Fetch content data from the backend API
  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    console.log("Fetching content from API...");
    try {
      const response = await api.get('/content'); // GET /api/content endpoint
      if (Array.isArray(response.data)) {
        console.log("Fetched content sections:", response.data.length);
        setContentSections(mapBEToFE(response.data)); // Map and set state
      } else {
        // Handle unexpected response format
        console.error("Invalid content data format received:", response.data);
        throw new Error("Invalid content data format received");
      }
    } catch (err: any) {
      // Handle API errors
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load content';
      console.error('Error fetching content:', err);
      setError(errorMessage);
      setContentSections([]); // Clear content on error
    } finally {
      setIsLoading(false); // Set loading to false whether success or failure
    }
  }, []); // useCallback with empty dependency array ensures it's created once

  // Fetch content when the component mounts
  useEffect(() => {
    fetchContent();
  }, [fetchContent]); // useEffect depends on the stable fetchContent function

  // --- Getter Functions ---

  // Get a specific content section by its contentId
  const getContent = (contentId: string): ContentSection | undefined => {
    return contentSections.find(section => section.contentId === contentId);
  };

  // Get the main 'content' string value for a section by contentId
  const getContentValue = (contentId: string): string => {
    const section = getContent(contentId);
    // Return content or an empty string as a fallback
    return section ? section.content : '';
  };

  // Get the 'metadata' object for a section by contentId
  const getContentMetadata = (contentId: string): any => {
    const section = getContent(contentId);
    // Return metadata or an empty object as a fallback
    return section ? section.metadata : {};
  };

  // Helper to specifically get the testimonials array
  const getTestimonials = (): TestimonialData[] => {
    const section = getContent('testimonialsData'); // Assumes contentId 'testimonialsData' holds the array
    return section?.metadata?.testimonials || []; // Return array or empty array
  };

  // Helper to specifically get the features array
  const getFeatures = (): FeatureData[] => {
    const section = getContent('featuresData'); // Assumes contentId 'featuresData'
    return section?.metadata?.features || [];
  };

  // Helper to specifically get the steps array
  const getSteps = (): StepData[] => {
     const section = getContent('howItWorksData'); // Assumes contentId 'howItWorksData'
     return section?.metadata?.steps || [];
  };

  // --- Update Content Function ---

  // Sends the updated array of content sections to the backend API
  const updateContent = async (updatedSectionsFromComponent: ContentSection[]): Promise<boolean> => {
    // Note: The 'isEditing' flag used in ContentManagement.tsx is NOT part of the ContentSection type
    // We expect updatedSectionsFromComponent to be the clean data ready for the backend.

    setIsLoading(true); // Indicate saving state (can rename isLoading to isBusy if preferred)
    setError(null);
    console.log("Sending content updates to API...");

    try {
      // The admin token should be automatically added by the api service interceptor
      const response = await api.put('/content', updatedSectionsFromComponent); // PUT /api/content with the full array

      if (Array.isArray(response.data)) {
        console.log("Content update successful.");
        setContentSections(mapBEToFE(response.data)); // Update context state with the confirmed data from backend
        return true; // Indicate success
      } else {
         console.error("Invalid response data after update:", response.data);
         throw new Error("Invalid response data after update");
      }
    } catch (err: any) {
      // Handle API errors during update
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save content';
      console.error('Error updating content:', err);
      setError(errorMessage);
      // Don't automatically revert optimistic updates here; let ContentManagement handle it if needed by calling refreshContent
      return false; // Indicate failure
    } finally {
      setIsLoading(false); // Set loading/saving state back to false
    }
  };

  // --- Refresh Function ---

  // Manually trigger a refetch of content data
  const refreshContent = () => {
    console.log("Refreshing content from API...");
    fetchContent();
  };

  // --- Context Value ---

  // Assemble the value provided by the context
  const value: ContentContextType = {
    contentSections,
    isLoading,
    error,
    getContent,
    getContentValue,
    getContentMetadata,
    getTestimonials,
    getFeatures,
    getSteps,
    updateContent,
    refreshContent
  };

  // Provide the context value to children components
  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

// --- Custom Hook ---

// Hook to easily consume the ContentContext
export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (!context) {
    // Ensure the hook is used within a ContentProvider
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};