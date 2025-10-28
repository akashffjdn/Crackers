import React, { useState, useEffect } from 'react';
import {
    FaEdit,
    FaSave,
    FaUndo,
    FaImage,
    FaVideo,
    FaPlus,
    FaTrash,
    FaStar,
    FaUser,
    FaCog,
    FaList,
    FaShieldAlt,
    FaTruck,
    FaPhone,
    FaCertificate,
    FaClipboardList,
    FaPaperPlane,
    FaTrophy,
    FaBuilding,
    FaHome,
    FaInfoCircle,
    FaComments,
    FaFile,
    FaBars,
    FaAlignCenter
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout'; //
import { useContent, ContentSection, TestimonialData, FeatureData, StepData } from '../../context/ContentContext'; //
import LoadingSpinner from '../../components/LoadingSpinner'; //

const ContentManagement: React.FC = () => {
    // Get state and update function from context
    const { contentSections, updateContent, isLoading, error, refreshContent } = useContent(); //
    const [localSections, setLocalSections] = useState<ContentSection[]>([]); //
    // Add isEditing property locally
    const [localSectionsWithEdit, setLocalSectionsWithEdit] = useState<(ContentSection & { isEditing: boolean })[]>([]); //
    const [selectedCategory, setSelectedCategory] = useState('all'); //
    const [isSaving, setIsSaving] = useState(false); // Local saving state for button feedback

    // Sync local state with context state when context updates
    useEffect(() => {
        // Initialize local state with isEditing set to false for each section
        setLocalSectionsWithEdit(contentSections.map(s => ({ ...s, isEditing: false }))); //
    }, [contentSections]); //

    const categories = [ //
        { id: 'all', name: 'All Content', icon: <FaFile /> }, //
        { id: 'header', name: 'Header', icon: <FaBars /> }, //
        { id: 'hero', name: 'Hero Section', icon: <FaHome /> }, //
        { id: 'about', name: 'About Us', icon: <FaInfoCircle /> }, //
        { id: 'features', name: 'Features', icon: <FaCog /> }, //
        { id: 'howitworks', name: 'How It Works', icon: <FaList /> }, //
        { id: 'testimonials', name: 'Testimonials', icon: <FaComments /> }, //
        { id: 'footer', name: 'Footer', icon: <FaAlignCenter /> }, //
        { id: 'company', name: 'Company Info', icon: <FaBuilding /> }, //
        { id: 'policies', name: 'Policies', icon: <FaFile /> }, //
        // Add CTA category if needed
        { id: 'cta', name: 'CTA Section', icon: <FaPhone /> } //
    ];

    // Filtering logic based on contentId prefixes or specific IDs
    const filteredSections = localSectionsWithEdit.filter(section => { //
        if (selectedCategory === 'all') return true; //
        if (selectedCategory === 'header') return ['companyName', 'companyTagline', 'supportPhone', 'headerAnnouncement'].includes(section.contentId); //
        if (selectedCategory === 'hero') return ['heroTitle', 'heroSubtitle', 'heroRatingText', 'heroCtaPrimary', 'heroCtaSecondary', 'heroStat1Number', 'heroStat1Label', 'heroStat2Number', 'heroStat2Label', 'heroStat3Number', 'heroStat3Label', 'heroSpecialOffer', 'heroImage'].includes(section.contentId); //
        if (selectedCategory === 'about') return ['aboutTitle', 'aboutContent', 'aboutFeature1', 'aboutFeature2', 'aboutFeature3', 'aboutFeature4', 'aboutButtonText', 'aboutBadgeText', 'aboutImage'].includes(section.contentId); //
        if (selectedCategory === 'features') return ['featuresSection', 'featuresSubtitle', 'featuresData'].includes(section.contentId); //
        if (selectedCategory === 'howitworks') return ['howItWorksSection', 'howItWorksData'].includes(section.contentId); //
        if (selectedCategory === 'testimonials') return ['testimonialsSection', 'testimonialsSubtitle', 'testimonialsData'].includes(section.contentId); //
        if (selectedCategory === 'footer') return ['footerCompanyDescription', 'footerNewsletterTitle', 'footerNewsletterDescription', 'footerCopyright'].includes(section.contentId); //
        if (selectedCategory === 'company') return ['companyPhone', 'companyEmail', 'companyAddress'].includes(section.contentId); //
        if (selectedCategory === 'policies') return ['shippingPolicy', 'returnPolicy'].includes(section.contentId); //
        if (selectedCategory === 'cta') return ['cta-title', 'cta-subtitle', 'cta-offer', 'cta-primary-button', 'cta-secondary-button', 'cta-contact-info'].includes(section.contentId); //
        return false; //
    });

    const handleEdit = (contentId: string) => { //
        setLocalSectionsWithEdit(prevSections => //
            prevSections.map(section => //
                section.contentId === contentId ? { ...section, isEditing: true } : section //
            )
        );
    };

    const handleCancel = (contentId: string) => { //
        // Find original data from context to revert changes
        const originalSection = contentSections.find(s => s.contentId === contentId); //
        setLocalSectionsWithEdit(prevSections => //
            prevSections.map(section => //
                section.contentId === contentId ? { ...(originalSection || section), isEditing: false } : section // Revert or keep current if original not found //
            )
        );
    };

    // Modified handleSave to use context's updateContent
    const handleSave = async (contentId: string, newContent: string, metadata?: any, newTitle?: string) => { //
        setIsSaving(true); //
        const updatedLocalSections = localSectionsWithEdit.map(section => //
            section.contentId === contentId //
                ? {
                    ...section, //
                    content: newContent, //
                    title: newTitle || section.title, // Update title if provided //
                    metadata: { ...section.metadata, ...metadata }, //
                    isEditing: false //
                }
                : section //
        );
        // Update local state immediately for responsiveness
        setLocalSectionsWithEdit(updatedLocalSections); //

        // Prepare data for the context update (without local 'isEditing')
        const sectionsToUpdateContext = updatedLocalSections.map(({ isEditing, ...rest }) => rest); //

        // Call the context function to handle the API call
        const success = await updateContent(sectionsToUpdateContext); // Pass the updated array without isEditing //

        if (!success) { //
            alert('Failed to save content. Please try again.'); //
            // Revert local state if save failed by refreshing from context
            refreshContent(); // Refetch to get consistent data //
        }
        setIsSaving(false); //
    };

    const handleDelete = async (contentId: string) => { //
        if (window.confirm('Are you sure you want to delete this custom content section? Only custom sections can be deleted.')) { //
            // Basic check if it looks like a custom ID
            if (!contentId.startsWith('custom-')) { //
                alert("Default content sections cannot be deleted."); //
                return; //
            }

            setIsSaving(true); // Reuse saving state //
            // TODO: Implement backend API call for deletion
            // Example: await api.delete(`/content/${contentId}`);
            console.warn(`API call to DELETE /api/content/${contentId} not implemented.`); //

            // Update local state optimistically or after API success
            const updatedLocalSections = localSectionsWithEdit.filter(section => section.contentId !== contentId); //
            setLocalSectionsWithEdit(updatedLocalSections); //

            // Also update the context state (or refetch)
             const sectionsToUpdateContext = updatedLocalSections.map(({ isEditing, ...rest }) => rest); //
            await updateContent(sectionsToUpdateContext); // This sends the filtered list to backend //
            setIsSaving(false); //
        }
    };

    const addNewSection = async () => { //
        // TODO: Implement backend API call for creation first, then update state
        console.warn("API call to POST /api/content for creating new section not implemented."); //
        alert("Adding new custom sections via API is not yet implemented."); //

        // --- TEMPORARY: Local Add Only (will be overwritten on refresh) ---
        const tempNewSection = { //
            _id: `temp-${Date.now()}`, // Temporary frontend ID //
            id: `custom-${Date.now()}`, //
            contentId: `custom-${Date.now()}`, //
            title: 'New Temp Section (Unsaved)', //
            content: 'Enter content here...', //
            type: 'text' as const, //
            isEditing: true // Start in edit mode //
        };
        setLocalSectionsWithEdit(prev => [...prev, tempNewSection]); //
        alert("Temporarily added section. Save changes via an existing section to persist."); //
        // --- End TEMPORARY ---
    };

    // Editor Components (Need local state management for edits)

    const TestimonialsEditor: React.FC<{ section: ContentSection & { isEditing: boolean } }> = ({ section }) => { //
        const [editTestimonials, setEditTestimonials] = useState<TestimonialData[]>(section.metadata?.testimonials || []); //
        const [editTitle, setEditTitle] = useState(section.title); // Use section.title //
        const [editContent, setEditContent] = useState(section.content); // Store section's main content (e.g., "What Our Customers Say") //

        const addTestimonial = () => setEditTestimonials(prev => [...prev, { name: 'New Customer', location: 'City', rating: 5, comment: 'Enter testimonial here...', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }]); //
        const updateTestimonial = (index: number, field: keyof TestimonialData, value: string | number) => setEditTestimonials(prev => prev.map((t, i) => i === index ? { ...t, [field]: value } : t)); //
        const deleteTestimonial = (index: number) => { //
            if (window.confirm('Delete this testimonial?')) { //
                setEditTestimonials(prev => prev.filter((_, i) => i !== index)); //
            }
        };
        // Call the parent component's handleSave with updated title, content, and metadata
        const saveTestimonials = () => handleSave(section.contentId, editContent, { testimonials: editTestimonials }, editTitle); //

        if (!section.isEditing) { //
            // View Mode JSX
            return (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"> {/* */}
                    <div className="flex items-center justify-between mb-4"> {/* */}
                        <div className="flex items-center space-x-3"> {/* */}
                            <div className="bg-green-100 p-3 rounded-lg"><FaComments className="text-green-600 text-xl" /></div> {/* */}
                            <div> {/* */}
                                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3> {/* */}
                                <p className="text-sm text-gray-500">Manage customer testimonials</p> {/* */}
                            </div>
                        </div>
                        <button onClick={() => handleEdit(section.contentId)} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"> <FaEdit /> <span>Edit</span> </button> {/* */}
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg mb-4"> <p className="text-gray-800 font-medium mb-1">{section.content}</p> <p className="text-sm text-gray-600">{section.metadata?.testimonials?.length || 0} testimonials</p> </div> {/* */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* */}
                        {section.metadata?.testimonials?.slice(0, 3).map((testimonial, index) => ( /* ... testimonial preview card ... */ //
                             <div key={index} className="border rounded-lg p-3 bg-gray-50 text-xs"> <div className="flex items-center mb-1"> <img src={testimonial.image} alt={testimonial.name} className="w-8 h-8 rounded-full mr-2"/> <div> <h4 className="font-semibold">{testimonial.name}</h4> <p className="text-gray-500">{testimonial.location}</p> </div> </div> <div className="flex mb-1">{[...Array(testimonial.rating)].map((_, i) => <FaStar key={i} className="text-yellow-400"/>)}</div> <p className="line-clamp-2">"{testimonial.comment}"</p> </div> //
                         ))} {/* */}
                    </div>
                </div>
            );
        }

        // Edit Mode JSX
        return (
             <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-green-200"> {/* */}
                <div className="space-y-6"> {/* */}
                    {/* Input for the main section title (e.g., "What Our Customers Say") */}
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label><input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"/></div> {/* */}
                    {/* Input for the subtitle/content (e.g., "Don't just take our word...") */}
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Subtitle/Description</label><textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"/></div> {/* */}

                    <div> {/* */}
                        <div className="flex items-center justify-between mb-4"> <h4 className="text-md font-medium text-gray-900">Testimonials List</h4> <button onClick={addTestimonial} className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center space-x-1"><FaPlus/><span>Add</span></button> </div> {/* */}
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2"> {/* */}
                            {editTestimonials.map((testimonial, index) => ( /* ... testimonial edit form fields ... */ //
                                <div key={index} className="border rounded-lg p-3 bg-gray-50 space-y-2 relative"> <button onClick={() => deleteTestimonial(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><FaTrash size={12}/></button> <div className="grid grid-cols-2 gap-2"><input type="text" placeholder="Name" value={testimonial.name} onChange={(e) => updateTestimonial(index, 'name', e.target.value)} className="px-2 py-1 border rounded text-sm"/> <input type="text" placeholder="Location" value={testimonial.location} onChange={(e) => updateTestimonial(index, 'location', e.target.value)} className="px-2 py-1 border rounded text-sm"/></div> <select value={testimonial.rating} onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value))} className="w-full px-2 py-1 border rounded text-sm"><option value={5}>5 Stars</option><option value={4}>4 Stars</option><option value={3}>3 Stars</option><option value={2}>2 Stars</option><option value={1}>1 Star</option></select> <input type="url" placeholder="Image URL" value={testimonial.image} onChange={(e) => updateTestimonial(index, 'image', e.target.value)} className="w-full px-2 py-1 border rounded text-sm"/> <textarea placeholder="Comment" value={testimonial.comment} onChange={(e) => updateTestimonial(index, 'comment', e.target.value)} rows={2} className="w-full px-2 py-1 border rounded text-sm"/> </div> //
                             ))} {/* */}
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 pt-4 border-t"> {/* */}
                         <button onClick={saveTestimonials} disabled={isSaving} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"><FaSave/><span>Save Changes</span></button> {/* */}
                         <button onClick={() => handleCancel(section.contentId)} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button> {/* */}
                    </div>
                </div>
            </div>
        );
    };

    const FeaturesEditor: React.FC<{ section: ContentSection & { isEditing: boolean } }> = ({ section }) => { //
        const [editFeatures, setEditFeatures] = useState<FeatureData[]>(section.metadata?.features || []); //
        const [editTitle, setEditTitle] = useState(section.title); //
        const [editContent, setEditContent] = useState(section.content); // Use section.content for subtitle //

        const iconOptions = [ //
            { value: 'FaShieldAlt', label: 'Shield (Security)', icon: <FaShieldAlt /> }, //
            { value: 'FaTruck', label: 'Truck (Delivery)', icon: <FaTruck /> }, //
            { value: 'FaPhone', label: 'Phone (Support)', icon: <FaPhone /> }, //
            { value: 'FaCertificate', label: 'Certificate (Quality)', icon: <FaCertificate /> } //
        ];

        const addFeature = () => setEditFeatures(prev => [...prev, { icon: 'FaShieldAlt', title: 'New Feature', description: 'Enter description...' }]); //
        const updateFeature = (index: number, field: keyof FeatureData, value: string) => setEditFeatures(prev => prev.map((f, i) => i === index ? { ...f, [field]: value } : f)); //
        const deleteFeature = (index: number) => { //
             if (window.confirm('Delete this feature?')) { //
                setEditFeatures(prev => prev.filter((_, i) => i !== index)); //
             }
         };
        // Call parent handleSave with updated title, content (subtitle), and metadata
        const saveFeatures = () => handleSave(section.contentId, editContent, { features: editFeatures }, editTitle); //

        if (!section.isEditing) { //
            // View Mode JSX
             return (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"> {/* */}
                    <div className="flex items-center justify-between mb-4"> {/* */}
                        <div className="flex items-center space-x-3"> {/* */}
                             <div className="bg-purple-100 p-3 rounded-lg"><FaCog className="text-purple-600 text-xl" /></div> {/* */}
                            <div> {/* */}
                                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3> {/* */}
                                <p className="text-sm text-gray-500">Manage feature highlights</p> {/* */}
                            </div>
                        </div>
                         <button onClick={() => handleEdit(section.contentId)} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"> <FaEdit /> <span>Edit</span> </button> {/* */}
                    </div>
                     <div className="p-4 bg-gray-50 rounded-lg mb-4"> <p className="text-gray-800 font-medium mb-1">{section.content}</p> <p className="text-sm text-gray-600">{section.metadata?.features?.length || 0} features</p> </div> {/* */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* */}
                         {section.metadata?.features?.map((feature, index) => ( /* ... feature preview card ... */ //
                              <div key={index} className="border rounded-lg p-3 bg-gray-50 text-xs flex items-start space-x-2"> <div className="mt-0.5">{iconOptions.find(opt => opt.value === feature.icon)?.icon || <FaCog />}</div> <div> <h4 className="font-semibold">{feature.title}</h4> <p className="text-gray-600">{feature.description}</p> </div> </div> //
                          ))} {/* */}
                    </div>
                </div>
            );
        }

        // Edit Mode JSX
        return (
             <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-purple-200"> {/* */}
                <div className="space-y-6"> {/* */}
                    {/* Input for the main section title (e.g., "Why Choose Us?") */}
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label><input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"/></div> {/* */}
                    {/* Input for the subtitle/content */}
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Subtitle/Description</label><textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"/></div> {/* */}

                    <div> {/* */}
                        <div className="flex items-center justify-between mb-4"> <h4 className="text-md font-medium text-gray-900">Features List</h4> <button onClick={addFeature} className="px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm flex items-center space-x-1"><FaPlus/><span>Add</span></button> </div> {/* */}
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2"> {/* */}
                            {editFeatures.map((feature, index) => ( /* ... feature edit form fields ... */ //
                                <div key={index} className="border rounded-lg p-3 bg-gray-50 space-y-2 relative"> <button onClick={() => deleteFeature(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><FaTrash size={12}/></button> <div className="grid grid-cols-2 gap-2"><select value={feature.icon} onChange={(e) => updateFeature(index, 'icon', e.target.value)} className="px-2 py-1 border rounded text-sm">{iconOptions.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select> <input type="text" placeholder="Title" value={feature.title} onChange={(e) => updateFeature(index, 'title', e.target.value)} className="px-2 py-1 border rounded text-sm"/></div> <textarea placeholder="Description" value={feature.description} onChange={(e) => updateFeature(index, 'description', e.target.value)} rows={2} className="w-full px-2 py-1 border rounded text-sm"/> </div> //
                             ))} {/* */}
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 pt-4 border-t"> {/* */}
                        <button onClick={saveFeatures} disabled={isSaving} className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"><FaSave/><span>Save Changes</span></button> {/* */}
                        <button onClick={() => handleCancel(section.contentId)} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button> {/* */}
                    </div>
                </div>
            </div>
        );
    };

    const StepsEditor: React.FC<{ section: ContentSection & { isEditing: boolean } }> = ({ section }) => { //
        const [editSteps, setEditSteps] = useState<StepData[]>(section.metadata?.steps || []); //
        const [editTitle, setEditTitle] = useState(section.title); // Use section.title //
        const [editContent, setEditContent] = useState(section.content); // Store main content if needed, though type 'steps' might not use it //

        const stepIconOptions = [ //
            { value: 'FaClipboardList', label: 'Clipboard (Browse)', icon: <FaClipboardList /> }, //
            { value: 'FaPaperPlane', label: 'Paper Plane (Order)', icon: <FaPaperPlane /> }, //
            { value: 'FaTrophy', label: 'Trophy (Enjoy)', icon: <FaTrophy /> } //
        ];

        const addStep = () => setEditSteps(prev => [...prev, { icon: 'FaClipboardList', title: 'New Step', description: 'Enter description...' }]); //
        const updateStep = (index: number, field: keyof StepData, value: string) => setEditSteps(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s)); //
        const deleteStep = (index: number) => { //
             if (window.confirm('Delete this step?')) { //
                setEditSteps(prev => prev.filter((_, i) => i !== index)); //
            }
         };
        // Call parent handleSave with updated title, content, and metadata
        const saveSteps = () => handleSave(section.contentId, editContent, { steps: editSteps }, editTitle); //

        if (!section.isEditing) { //
            // View Mode JSX
            return (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"> {/* */}
                    <div className="flex items-center justify-between mb-4"> {/* */}
                        <div className="flex items-center space-x-3"> {/* */}
                            <div className="bg-indigo-100 p-3 rounded-lg"><FaList className="text-indigo-600 text-xl" /></div> {/* */}
                            <div> {/* */}
                                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3> {/* */}
                                <p className="text-sm text-gray-500">Manage process steps (e.g., How It Works)</p> {/* */}
                            </div>
                        </div>
                        <button onClick={() => handleEdit(section.contentId)} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"> <FaEdit /> <span>Edit</span> </button> {/* */}
                    </div>
                     <div className="p-4 bg-gray-50 rounded-lg mb-4"> <p className="text-gray-800 font-medium mb-1">{section.content}</p> <p className="text-sm text-gray-600">{section.metadata?.steps?.length || 0} steps</p> </div> {/* */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* */}
                        {section.metadata?.steps?.map((step, index) => ( /* ... step preview card ... */ //
                            <div key={index} className="border rounded-lg p-3 bg-gray-50 text-xs flex items-start space-x-2"> <div className="mt-0.5">{stepIconOptions.find(opt => opt.value === step.icon)?.icon || <FaList />}</div> <div> <h4 className="font-semibold">{step.title}</h4> <p className="text-gray-600">{step.description}</p> </div> </div> //
                         ))} {/* */}
                    </div>
                </div>
            );
        }

        // Edit Mode JSX
        return (
             <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-indigo-200"> {/* */}
                <div className="space-y-6"> {/* */}
                    {/* Input for the main section title (e.g., "How It Works") */}
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label><input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/></div> {/* */}
                    {/* Optional: Input for main content if used */}
                     <div><label className="block text-sm font-medium text-gray-700 mb-1">Section Description (Optional)</label><textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/></div> {/* */}

                    <div> {/* */}
                        <div className="flex items-center justify-between mb-4"> <h4 className="text-md font-medium text-gray-900">Steps List</h4> <button onClick={addStep} className="px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm flex items-center space-x-1"><FaPlus/><span>Add</span></button> </div> {/* */}
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2"> {/* */}
                             {editSteps.map((step, index) => ( /* ... step edit form fields ... */ //
                                 <div key={index} className="border rounded-lg p-3 bg-gray-50 space-y-2 relative"> <button onClick={() => deleteStep(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><FaTrash size={12}/></button> <div className="grid grid-cols-2 gap-2"><select value={step.icon} onChange={(e) => updateStep(index, 'icon', e.target.value)} className="px-2 py-1 border rounded text-sm">{stepIconOptions.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select> <input type="text" placeholder="Title" value={step.title} onChange={(e) => updateStep(index, 'title', e.target.value)} className="px-2 py-1 border rounded text-sm"/></div> <textarea placeholder="Description" value={step.description} onChange={(e) => updateStep(index, 'description', e.target.value)} rows={2} className="w-full px-2 py-1 border rounded text-sm"/> </div> //
                              ))} {/* */}
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 pt-4 border-t"> {/* */}
                        <button onClick={saveSteps} disabled={isSaving} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"><FaSave/><span>Save Changes</span></button> {/* */}
                        <button onClick={() => handleCancel(section.contentId)} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button> {/* */}
                    </div>
                </div>
            </div>
        );
    };


    // Generic Editor for Text, Image, Video
    const ContentEditor: React.FC<{ section: ContentSection & { isEditing: boolean } }> = ({ section }) => { //
        const [editContent, setEditContent] = useState(section.content); //
        const [editTitle, setEditTitle] = useState(section.title); //
        const [editMetadata, setEditMetadata] = useState(section.metadata || {}); //

        // Handle special types first
        if (section.type === 'testimonials') return <TestimonialsEditor section={section} />; //
        if (section.type === 'features') return <FeaturesEditor section={section} />; //
        if (section.type === 'steps') return <StepsEditor section={section} />; //

        const getContentTypeIcon = () => { //
            switch (section.type) { //
                case 'image': return <FaImage className="text-blue-600" />; //
                case 'video': return <FaVideo className="text-purple-600" />; //
                default: return <FaFile className="text-green-600" />; //
            }
        };
        const getContentTypeColor = () => { //
            switch (section.type) { //
                case 'image': return 'bg-blue-100'; //
                case 'video': return 'bg-purple-100'; //
                default: return 'bg-green-100'; //
            }
        };
        const getSectionDescription = () => { //
             // Descriptions based on contentId
            if (section.contentId === 'companyName') return 'Company brand name displayed in header'; //
            if (section.contentId === 'companyTagline') return 'Tagline shown below company name'; //
            if (section.contentId === 'supportPhone') return 'Customer support phone number'; //
            if (section.contentId === 'headerAnnouncement') return 'Top banner announcement message'; //
            if (section.contentId === 'heroTitle') return 'Main hero section title'; //
            if (section.contentId === 'heroSubtitle') return 'Hero section description text'; //
            if (section.contentId === 'heroRatingText') return 'Customer rating display text'; //
            if (section.contentId === 'heroCtaPrimary') return 'Primary call-to-action button text'; //
            if (section.contentId === 'heroCtaSecondary') return 'Secondary call-to-action button text'; //
            if (section.contentId === 'heroStat1Number') return 'First statistic number display'; //
            if (section.contentId === 'heroStat1Label') return 'First statistic label text'; //
            if (section.contentId === 'heroStat2Number') return 'Second statistic number display'; //
            if (section.contentId === 'heroStat2Label') return 'Second statistic label text'; //
            if (section.contentId === 'heroStat3Number') return 'Third statistic number display'; //
            if (section.contentId === 'heroStat3Label') return 'Third statistic label text'; //
            if (section.contentId === 'heroSpecialOffer') return 'Special offer badge text'; //
            if (section.contentId === 'aboutTitle') return 'About section main title'; //
            if (section.contentId === 'aboutContent') return 'About section main content'; //
            if (section.contentId.startsWith('aboutFeature')) return 'About section feature point'; //
            if (section.contentId === 'aboutButtonText') return 'About section button text'; //
            if (section.contentId === 'aboutBadgeText') return 'About section badge text'; //
             if (section.contentId === 'footerCompanyDescription') return 'Company description in footer'; //
            if (section.contentId === 'footerNewsletterTitle') return 'Newsletter section title in footer'; //
            if (section.contentId === 'footerNewsletterDescription') return 'Newsletter section description'; //
            if (section.contentId === 'footerCopyright') return 'Copyright text in footer'; //
            if (section.contentId === 'companyPhone') return 'Company contact phone number'; //
            if (section.contentId === 'companyEmail') return 'Company contact email address'; //
            if (section.contentId === 'companyAddress') return 'Company physical address'; //
            if (section.contentId === 'shippingPolicy') return 'Shipping policy text'; //
            if (section.contentId === 'returnPolicy') return 'Return policy text'; //
            if (section.contentId.startsWith('cta-')) return 'Call To Action section text'; //
            // Default descriptions based on type
            if (section.type === 'image') return 'Image content'; //
            if (section.type === 'video') return 'Video content'; //
            return 'Text content'; // Default for text or unknown //
        };


        if (!section.isEditing) { //
            // View Mode JSX for Text, Image, Video
             return (
                 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"> {/* */}
                     <div className="flex items-center justify-between mb-4"> {/* */}
                         <div className="flex items-center space-x-3"> {/* */}
                             <div className={`p-3 rounded-lg ${getContentTypeColor()}`}>{getContentTypeIcon()}</div> {/* */}
                             <div> {/* */}
                                 <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3> {/* */}
                                 <p className="text-sm text-gray-500">{getSectionDescription()}</p> {/* */}
                             </div>
                         </div>
                         <div className="flex items-center space-x-2"> {/* */}
                             <button onClick={() => handleEdit(section.contentId)} className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"><FaEdit/><span>Edit</span></button> {/* */}
                             {section.contentId.startsWith('custom-') && (<button onClick={() => handleDelete(section.contentId)} className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 text-sm"><FaTrash/><span>Del</span></button>)} {/* */}
                         </div>
                     </div>
                     {/* Display Content based on type */}
                     {section.type === 'text' && <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap text-gray-800">{section.content}</div>} {/* */}
                     {section.type === 'image' && section.metadata?.imageUrl && (<div> <div className="p-4 bg-gray-50 rounded-lg mb-2"><strong>Desc:</strong> {section.content}</div> <img src={section.metadata.imageUrl} alt={section.metadata.altText || section.title} className="max-h-48 w-auto rounded border"/> <p className="text-xs text-gray-500 mt-1"><strong>Alt:</strong> {section.metadata.altText || 'N/A'}</p> <p className="text-xs text-gray-400 break-all"><strong>URL:</strong> {section.metadata.imageUrl}</p> </div>)} {/* */}
                     {section.type === 'video' && section.metadata?.videoUrl && (<div> <div className="p-4 bg-gray-50 rounded-lg mb-2"><strong>Desc:</strong> {section.content}</div> <video src={section.metadata.videoUrl} controls className="max-h-48 w-auto rounded border"/> <p className="text-xs text-gray-400 break-all mt-1"><strong>URL:</strong> {section.metadata.videoUrl}</p> </div>)} {/* */}
                </div>
             );
        }

        // Edit Mode JSX for Text, Image, Video
        return (
             <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-blue-200"> {/* */}
                 <div className="space-y-4"> {/* */}
                     <div><label className="block text-sm font-medium text-gray-700 mb-1">Admin Title</label><input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/></div> {/* */}
                     {section.type === 'text' && (<div><label className="block text-sm font-medium text-gray-700 mb-1">Content</label><textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={5} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>)} {/* */}
                     {section.type === 'image' && (<div className="space-y-3"> <div><label className="block text-sm font-medium text-gray-700 mb-1">Image Description (for admin)</label><input type="text" value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/></div> <div><label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label><input type="url" value={editMetadata.imageUrl || ''} onChange={(e) => setEditMetadata(p=>({...p, imageUrl: e.target.value}))} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/></div> <div><label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label><input type="text" value={editMetadata.altText || ''} onChange={(e) => setEditMetadata(p=>({...p, altText: e.target.value}))} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/></div> {editMetadata.imageUrl && <img src={editMetadata.imageUrl} alt="Preview" className="max-h-32 mt-2 rounded border"/>} </div>)} {/* */}
                     {section.type === 'video' && (<div className="space-y-3"> <div><label className="block text-sm font-medium text-gray-700 mb-1">Video Description (for admin)</label><input type="text" value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/></div> <div><label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label><input type="url" value={editMetadata.videoUrl || ''} onChange={(e) => setEditMetadata(p=>({...p, videoUrl: e.target.value}))} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/></div> {editMetadata.videoUrl && <video src={editMetadata.videoUrl} controls className="max-h-32 mt-2 rounded border"/>} </div>)} {/* */}
                     <div className="flex items-center space-x-3 pt-4 border-t"> {/* */}
                         <button onClick={() => handleSave(section.contentId, editContent, editMetadata, editTitle)} disabled={isSaving} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"><FaSave/><span>Save</span></button> {/* */}
                         <button onClick={() => handleCancel(section.contentId)} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button> {/* */}
                    </div>
                 </div>
            </div>
        );
    };

    // --- Main Render Logic ---
    return (
        <AdminLayout> {/* */}
            <div className="space-y-6"> {/* */}
                {/* Header */}
                 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between"> {/* */}
                    <div> {/* */}
                        <h1 className="text-3xl font-bold text-gray-900">Content Management</h1> {/* */}
                        <p className="text-gray-600 mt-1">Manage all website content sections</p> {/* */}
                    </div>
                     {/* Add button - disabled state might be needed during saving */}
                     <button
                        onClick={addNewSection} //
                        disabled={isSaving || isLoading} // Disable while loading/saving //
                        className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mt-4 lg:mt-0 disabled:opacity-50" //
                     >
                        <FaPlus /> {/* */}
                        <span>Add Custom Section</span> {/* */}
                    </button>
                </div>

                {/* Loading State */}
                {isLoading && !isSaving && ( // Show main loading only if not saving //
                    <div className="p-6 bg-white rounded-lg shadow-sm text-center"> {/* */}
                        <LoadingSpinner text="Loading content..." /> {/* */}
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && ( //
                    <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg"> {/* */}
                        Error: {error} {/* */}
                        <button onClick={refreshContent} className="ml-4 px-2 py-1 border border-red-300 rounded text-sm hover:bg-red-100">Retry</button> {/* */}
                    </div>
                )}

                {/* Render filters and content only when not loading and no error */}
                {!isLoading && !error && ( //
                    <>
                        {/* Category Filter */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"> {/* */}
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Section</h3> {/* */}
                            <div className="flex flex-wrap gap-3"> {/* */}
                                {categories.map(category => ( //
                                    <button
                                        key={category.id} //
                                        onClick={() => setSelectedCategory(category.id)} //
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${ //
                                            selectedCategory === category.id //
                                                ? 'bg-red-600 text-white' //
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200' //
                                        }`}
                                    >
                                        {category.icon} {/* */}
                                        <span>{category.name}</span> {/* */}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Sections */}
                        <div className="space-y-6"> {/* */}
                            {filteredSections.map(section => ( //
                                <ContentEditor key={section.contentId} section={section} /> // Use contentId as key //
                            ))}
                        </div>

                        {/* Empty State for Filters */}
                        {filteredSections.length === 0 && ( //
                            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200"> {/* */}
                                <div className="text-gray-400 mb-4"><FaEdit className="text-5xl mx-auto" /></div> {/* */}
                                <h3 className="text-xl font-medium text-gray-900 mb-2">No content sections found</h3> {/* */}
                                <p className="text-gray-600 mb-6">No sections match the filter: <strong>{categories.find(c=>c.id===selectedCategory)?.name || selectedCategory}</strong></p> {/* */}
                                <button onClick={() => setSelectedCategory('all')} className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">Show All Content</button> {/* */}
                            </div>
                        )}
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default ContentManagement;