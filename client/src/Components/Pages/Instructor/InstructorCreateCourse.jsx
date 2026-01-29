import axios from 'axios';
import React, { useState } from 'react';
import { 
  FaPlus, FaTrash, FaUpload, FaVideo, FaFileAlt, FaQuestionCircle,
  FaTasks, FaPlay, FaEye, FaTag, FaDollarSign, FaPercent,
  FaLevelUpAlt, FaGlobe, FaCheckCircle, FaTimes, FaSave
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const InstructorCreateCourse = () => {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({
    title: 'test course',
    description: 'test descriptions',
    thumbnail: 'https://cdn.pixabay.com/photo/2025/12/31/21/24/21-24-02-186_1280.jpg',
    level: 'beginner',
    language: 'English',
    price: 1500,
    discount: 12,
    requirements: ['avs','12i3ji'],
    keywords: ['test','test2'],
    topics: ['abc','xyz'],
    isPublished: true,
    content: {
      totalDuration: 0,
      sections: [{
        title: '',
        lectureCount: 0,
        duration: 0,
        lectures: [{
          title: '',
          type: 'video',
          url: '',
          duration: 0,
          isPreview: false
        }]
      }]
    },
    badges: []
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setCourseData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
        setCourseData(prev => ({ ...prev, thumbnail: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleBadge = (badge) => {
    setCourseData(prev => ({
      ...prev,
      badges: prev.badges.includes(badge) ? prev.badges.filter(b => b !== badge) : [...prev.badges, badge]
    }));
  };

  const calculateDiscountedPrice = () => {
    return courseData.discount > 0 ? courseData.price * (1 - courseData.discount / 100) : courseData.price;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/courses/create-new", courseData);
      alert(res.data.message);
      navigate("/instructor-home");
    } catch (error) {
      console.error(error);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <FaFileAlt /> },
    { id: 'pricing', label: 'Pricing', icon: <FaDollarSign /> },
    { id: 'settings', label: 'Settings', icon: <FaCheckCircle /> }
  ];

  const badgeOptions = [
    { value: 'bestseller', label: 'Bestseller', color: 'bg-amber-100 text-amber-800' },
    { value: 'hot', label: 'Hot & New', color: 'bg-red-100 text-red-800' },
    { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
    { value: 'trending', label: 'Trending', color: 'bg-green-100 text-green-800' }
  ];

  const InputField = ({ label, name, value, onChange, type = "text", placeholder, required, className = "" }) => (
    <div>
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">{label} {required && '*'}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );

  const TextAreaField = ({ label, name, value, onChange, rows = 6, placeholder, required }) => (
    <div>
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">{label} {required && '*'}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );

  return (
    <section className="px-3 sm:px-4 md:px-6 lg:px-7 py-4 sm:py-5 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="font-bold text-xl sm:text-2xl md:text-3xl text-gray-900 mb-2">Create New Course</h2>
        <p className="text-sm sm:text-base text-gray-600">Build your course step by step. All fields are required unless marked optional.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg transition-colors ${
                activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
        
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: activeTab === 'basic' ? '25%' : activeTab === 'content' ? '50%' : activeTab === 'pricing' ? '75%' : '100%' }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 border border-gray-100">
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <FaFileAlt className="text-base sm:text-lg" /> Basic Information
            </h3>
            
            <input 
              label="Course Title" 
              name="title" 
              value={courseData.title} 
              onChange={handleBasicChange} 
              placeholder="e.g., Complete Web Development Bootcamp" 
              required 
            />

            <textarea
              label="Course Description"
              name="description"
              value={courseData.description}
              onChange={handleBasicChange}
              placeholder="Describe what students will learn in this course..."
              required
            ></textarea>

            {/* Thumbnail */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Course Thumbnail *</label>
              <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                <div className="md:w-1/3">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 text-center hover:border-blue-400 transition-colors">
                    <input type="file" id="thumbnail" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                    <label htmlFor="thumbnail" className="cursor-pointer">
                      <FaUpload className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                      <p className="text-sm sm:text-base text-gray-600">Upload Thumbnail</p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">Recommended: 1280x720px</p>
                    </label>
                  </div>
                </div>
                {thumbnailPreview && (
                  <div className="md:w-2/3">
                    <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full max-w-md rounded-lg shadow" />
                  </div>
                )}
              </div>
            </div>

            {/* Level & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Difficulty Level *</label>
                <select name="level" value={courseData.level} onChange={handleBasicChange} className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="all">All Levels</option>
                </select>
              </div>
              <input label="Language" name="language" value={courseData.language} onChange={handleBasicChange} placeholder="e.g., English" className='px-3 py-3 my-3' required />
            </div>

            {/* Requirements */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">Requirements</label>
                <button type="button" onClick={() => addArrayItem('requirements')} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs sm:text-sm">
                  <FaPlus className="text-xs" /> Add Requirement
                </button>
              </div>
              {courseData.requirements.map((req, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input type="text" value={req} onChange={(e) => handleArrayChange('requirements', index, e.target.value)} className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Basic programming knowledge" />
                  {courseData.requirements.length > 1 && (
                    <button type="button" onClick={() => removeArrayItem('requirements', index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg shrink-0">
                      <FaTrash className="text-sm" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Topics */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">Topics</label>
                <button type="button" onClick={() => addArrayItem('topics')} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs sm:text-sm">
                  <FaPlus className="text-xs" /> Add Topic
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {courseData.topics.map((topic, index) => topic && (
                  <span key={index} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    <FaTag className="text-xs" />
                    {topic}
                    <button type="button" onClick={() => removeArrayItem('topics', index)} className="ml-1 hover:text-blue-900">
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
              {courseData.topics.map((topic, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input type="text" value={topic} onChange={(e) => handleArrayChange('topics', index, e.target.value)} className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., React, JavaScript, Web Development" />
                </div>
              ))}
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Keywords (for search)</label>
              <input type="text" value={courseData.keywords.join(', ')} onChange={(e) => setCourseData(prev => ({ ...prev, keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k) }))} className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="react, javascript, web development, frontend" />
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Separate keywords with commas</p>
            </div>

            {/* Badges */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Course Badges (Optional)</label>
              <div className="flex flex-wrap gap-2">
                {badgeOptions.map(badge => (
                  <button key={badge.value} type="button" onClick={() => toggleBadge(badge.value)} className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg border transition-colors ${courseData.badges.includes(badge.value) ? `${badge.color} border-transparent` : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200'}`}>
                    <FaCheckCircle className={`text-xs sm:text-sm ${courseData.badges.includes(badge.value) ? 'opacity-100' : 'opacity-0'}`} />
                    {badge.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <FaDollarSign className="text-base sm:text-lg" /> Pricing & Discounts
            </h3>

            {/* Price */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Base Price ($) *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm sm:text-base">$</span>
                </div>
                <input type="number" name="price" value={courseData.price} onChange={handleBasicChange} min="0" step="0.01" className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0.00" required />
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Set 0 for a free course</p>
            </div>

            {/* Discount */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPercent className="text-gray-500 text-xs sm:text-sm" />
                </div>
                <input type="number" name="discount" value={courseData.discount} onChange={handleBasicChange} min="0" max="100" className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0" />
              </div>
            </div>

            {/* Price Preview */}
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 sm:p-6">
              <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Price Preview</h4>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Base Price:</span>
                  <span className="font-medium">${courseData.price.toFixed(2)}</span>
                </div>
                {courseData.discount > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Discount ({courseData.discount}%):</span>
                      <span className="font-medium text-red-600">-${(courseData.price * courseData.discount / 100).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-green-200 pt-2 sm:pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-base sm:text-lg text-gray-900">Final Price:</span>
                        <span className="font-bold text-xl sm:text-2xl text-green-600">${calculateDiscountedPrice().toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                )}
                {courseData.discount === 0 && (
                  <div className="border-t border-green-200 pt-2 sm:pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-base sm:text-lg text-gray-900">Final Price:</span>
                      <span className="font-bold text-xl sm:text-2xl text-green-600">${courseData.price.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <FaCheckCircle className="text-base sm:text-lg" /> Publication Settings
            </h3>

            {/* Publish Status */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-3">
                <div>
                  <h4 className="font-bold text-base sm:text-lg text-gray-900">Publication Status</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Control when your course becomes available to students</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" checked={courseData.isPublished} onChange={(e) => setCourseData(prev => ({ ...prev, isPublished: e.target.checked }))} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className={`p-3 sm:p-4 rounded-lg ${courseData.isPublished ? 'bg-green-50 border border-green-100' : 'bg-yellow-50 border border-yellow-100'}`}>
                <div className="flex items-start gap-2 sm:gap-3">
                  <FaCheckCircle className={`mt-0.5 sm:mt-1 shrink-0 text-sm sm:text-base ${courseData.isPublished ? 'text-green-600' : 'text-yellow-600'}`} />
                  <div>
                    <p className={`font-medium text-sm sm:text-base ${courseData.isPublished ? 'text-green-800' : 'text-yellow-800'}`}>
                      {courseData.isPublished ? 'Course is published and visible to students' : 'Course is in draft mode and only visible to you'}
                    </p>
                    <p className={`text-xs sm:text-sm mt-1 ${courseData.isPublished ? 'text-green-700' : 'text-yellow-700'}`}>
                      {courseData.isPublished ? 'Students can enroll in your course immediately.' : 'You can continue editing. Publish when ready.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Review */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
              <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Course Summary</h4>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Course Title:</span>
                  <span className="font-medium text-right ml-2 ">{courseData.title || 'Not set'}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Description Length:</span>
                  <span className="font-medium">{courseData.description.length} characters</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Sections:</span>
                  <span className="font-medium">{courseData.content.sections.length}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Total Lectures:</span>
                  <span className="font-medium">{courseData.content.sections.reduce((total, section) => total + section.lectures.length, 0)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium capitalize">{courseData.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Final Price:</span>
                  <span className="font-bold text-base sm:text-lg text-green-600">${calculateDiscountedPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 gap-3">
          <div>
            {activeTab !== 'basic' && (
              <button type="button" onClick={() => setActiveTab(tabs[tabs.findIndex(t => t.id === activeTab) - 1].id)} className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Previous
              </button>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button type="button" className="px-4 sm:px-6 py-2 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Save as Draft
            </button>
            
            {activeTab !== 'settings' ? (
              <button type="button" onClick={() => setActiveTab(tabs[tabs.findIndex(t => t.id === activeTab) + 1].id)} className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                Continue
              </button>
            ) : (
              <button type="submit" className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                <FaSave className="text-sm" /> Publish Course
              </button>
            )}
          </div>
        </div>
      </form>
    </section>
  );
};

export default InstructorCreateCourse;