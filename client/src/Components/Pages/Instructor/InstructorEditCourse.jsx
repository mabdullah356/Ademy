import React, { useState, useEffect } from 'react';
import {
  FaSave,
  FaTimes,
  FaPlus,
  FaTrash,
  FaEdit,
  FaDollarSign,
  FaPercent,
  FaBook,
  FaCheckCircle,
  FaTag,
  FaUpload,
  FaChevronDown,
  FaChevronUp,
  FaVideo,
  FaClock
} from 'react-icons/fa';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const InstructorEditCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedSection, setSelectedSection] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  const [basicInfo, setBasicInfo] = useState({
    title: '',
    description: '',
    language: '',
    level: '',
    price: 0,
    discount: 0,
    requirements: [],
    topics: [],
    keywords: [],
    isPublished: false,
    thumbnail: ""
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [newSection, setNewSection] = useState({ title: '' });
  const [newLecture, setNewLecture] = useState({
    title: '',
    type: 'video',
    url: '',
    duration: 0,
    isPreview: false
  });

  const [newRequirement, setNewRequirement] = useState('');
  const [newTopic, setNewTopic] = useState('');

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`/api/v1/courses/${id}`);
      setCourse(res.data.course);
      setBasicInfo({
        title: res.data.course.title,
        description: res.data.course.description,
        language: res.data.course.language,
        level: res.data.course.level,
        price: res.data.course.price,
        discount: res.data.course.discount,
        requirements: res.data.course.requirements,
        topics: res.data.course.topics,
        keywords: res.data.course.keywords,
        isPublished: res.data.course.isPublished,
        thumbnail: res.data.course.thumbnail
      });
      setThumbnailPreview(res.data.course.thumbnail);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  const handleBasicInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBasicInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setBasicInfo(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (index) => {
    setBasicInfo(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addTopic = () => {
    if (newTopic.trim()) {
      setBasicInfo(prev => ({
        ...prev,
        topics: [...prev.topics, newTopic]
      }));
      setNewTopic('');
    }
  };

  const removeTopic = (index) => {
    setBasicInfo(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index)
    }));
  };

  const saveBasicInfo = async () => {
    try {
      const formData = new FormData();
      formData.append('title', basicInfo.title);
      formData.append('description', basicInfo.description);
      formData.append('language', basicInfo.language);
      formData.append('level', basicInfo.level);
      formData.append('price', basicInfo.price);
      formData.append('discount', basicInfo.discount);
      formData.append('isPublished', basicInfo.isPublished);
      formData.append('requirements', JSON.stringify(basicInfo.requirements));
      formData.append('topics', JSON.stringify(basicInfo.topics));
      formData.append('keywords', JSON.stringify(basicInfo.keywords));

      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      await axios.patch(`/api/v1/courses/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Basic info updated successfully!');
      fetchCourse();
    } catch (error) {
      console.log(error);
      alert('Failed to update basic info');
    }
  };

  const handleAddSection = async () => {
    if (!newSection.title.trim()) {
      alert('Section title is required!');
      return;
    }
    try {
      await axios.post(`/api/v1/courses/${id}/sections`, {
        title: newSection.title
      });
      alert('Section added successfully!');
      setNewSection({ title: '' });
      fetchCourse();
    } catch (error) {
      console.log(error);
      alert('Failed to add section');
    }
  };

  const handleAddLecture = async (sectionId) => {
    if (!newLecture.title.trim() || !newLecture.type) {
      alert('Title and type are required!');
      return;
    }
    try {
      await axios.post(`/api/v1/courses/${id}/sections/${sectionId}/lectures`, newLecture);
      alert('Lecture added successfully!');
      setNewLecture({
        title: '',
        type: 'video',
        url: '',
        duration: 0,
        isPreview: false
      });
      setSelectedSection(null);
      fetchCourse();
    } catch (error) {
      console.log(error);
      alert('Failed to add lecture');
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  if (!course) return <div className="p-4 sm:p-8 text-center text-sm sm:text-base">Loading...</div>;

  return (
    <section className="px-3 sm:px-4 md:px-6 lg:px-7 py-4 sm:py-5 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
        <div className="w-full sm:w-auto">
          <h2 className="font-bold text-xl sm:text-2xl md:text-3xl text-gray-900 mb-2">Edit Course</h2>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <p className="text-sm sm:text-base text-gray-600 wrap-break-words">{course?.title}</p>
            <span className={`px-2 py-0.5 sm:py-1 rounded text-xs font-medium shrink-0 ${course?.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {course?.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 sm:mb-6 border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-2 sm:gap-4 min-w-max">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-3 sm:px-6 py-2 sm:py-3 font-semibold transition-colors text-sm sm:text-base whitespace-nowrap ${activeTab === 'basic'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab('sections')}
            className={`px-3 sm:px-6 py-2 sm:py-3 font-semibold transition-colors text-sm sm:text-base whitespace-nowrap ${activeTab === 'sections'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Sections
          </button>
          <button
            onClick={() => setActiveTab('lectures')}
            className={`px-3 sm:px-6 py-2 sm:py-3 font-semibold transition-colors text-sm sm:text-base whitespace-nowrap ${activeTab === 'lectures'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Lectures
          </button>
        </div>
      </div>

      {/* Basic Information Tab */}
      {activeTab === 'basic' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <FaEdit className="text-base sm:text-lg" /> Course Details
              </h3>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={basicInfo.title}
                    onChange={handleBasicInfoChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={basicInfo.description}
                    onChange={handleBasicInfoChange}
                    rows={6}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Level *
                    </label>
                    <select
                      name="level"
                      value={basicInfo.level}
                      onChange={handleBasicInfoChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="all">All Levels</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Language *
                    </label>
                    <input
                      type="text"
                      name="language"
                      value={basicInfo.language}
                      onChange={handleBasicInfoChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Course Thumbnail
                  </label>
                  <div className="flex items-center gap-4">
                    {thumbnailPreview && (
                      <img
                        src={thumbnailPreview}
                        alt="Preview"
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-gray-200"
                      />
                    )}
                    <label className="flex flex-col items-center justify-center w-24 h-24 sm:w-32 sm:h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FaUpload className="text-gray-400 mb-2" />
                        <p className="text-[10px] sm:text-xs text-gray-500">Upload Image</p>
                      </div>
                      <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center h-5">
                    <input
                      id="isPublished"
                      name="isPublished"
                      type="checkbox"
                      checked={basicInfo.isPublished}
                      onChange={handleBasicInfoChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="isPublished" className="font-medium text-gray-700 cursor-pointer">
                      Published Status
                    </label>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      {basicInfo.isPublished ? 'This course is visible to students.' : 'This course is currently a draft.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-base sm:text-lg" /> Requirements
              </h3>

              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                {basicInfo.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={req}
                      readOnly
                      className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <button
                      onClick={() => removeRequirement(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg shrink-0"
                    >
                      <FaTrash className="text-sm sm:text-base" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 sm:gap-3">
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Add new requirement"
                  className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={addRequirement}
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shrink-0"
                >
                  <FaPlus className="text-sm sm:text-base" />
                </button>
              </div>
            </div>

            {/* Topics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <FaTag className="text-base sm:text-lg" /> Topics
              </h3>

              <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                {basicInfo.topics.map((topic, index) => (
                  <span key={index} className="inline-flex items-center gap-1.5 sm:gap-2 bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm">
                    {topic}
                    <button
                      onClick={() => removeTopic(index)}
                      className="hover:text-blue-900"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 sm:gap-3">
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Add new topic"
                  className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={addTopic}
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shrink-0"
                >
                  <FaPlus className="text-sm sm:text-base" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Pricing */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <FaDollarSign className="text-base sm:text-lg" /> Pricing
              </h3>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Base Price ($)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm sm:text-base">$</span>
                    </div>
                    <input
                      type="number"
                      name="price"
                      value={basicInfo.price}
                      onChange={handleBasicInfoChange}
                      min="0"
                      step="0.01"
                      className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Discount (%)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPercent className="text-gray-500 text-xs sm:text-sm" />
                    </div>
                    <input
                      type="number"
                      name="discount"
                      value={basicInfo.discount}
                      onChange={handleBasicInfoChange}
                      min="0"
                      max="100"
                      className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-green-50 border border-green-100 rounded-lg">
                  <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-2">Price Preview</h4>
                  <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Price:</span>
                      <span className="font-medium">${basicInfo.price}</span>
                    </div>
                    {basicInfo.discount > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount:</span>
                          <span className="text-red-600">-{basicInfo.discount}%</span>
                        </div>
                        <div className="border-t border-green-200 pt-1.5 sm:pt-2">
                          <div className="flex justify-between">
                            <span className="font-bold">Final Price:</span>
                            <span className="font-bold text-lg sm:text-xl text-green-600">
                              ${(basicInfo.price * (1 - basicInfo.discount / 100)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={saveBasicInfo}
              className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <FaSave className="text-sm sm:text-base" /> Save Basic Information
            </button>
          </div>
        </div>
      )}

      {/* Sections Tab */}
      {activeTab === 'sections' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <FaPlus className="text-base sm:text-lg" /> Add New Section
            </h3>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                value={newSection.title}
                onChange={(e) => setNewSection({ title: e.target.value })}
                placeholder="Section title (e.g., Introduction to React)"
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleAddSection}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
              >
                <FaPlus className="text-sm" /> Add Section
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <FaBook className="text-base sm:text-lg" /> Course Sections ({course?.content?.sections?.length || 0})
            </h3>

            <div className="space-y-2 sm:space-y-3">
              {course?.content?.sections?.map((section) => (
                <div key={section._id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div
                    onClick={() => toggleSection(section._id)}
                    className="p-3 sm:p-4 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex-1 pr-2">
                      <h4 className="font-bold text-base sm:text-lg wrap-break-words">{section.title}</h4>
                      <div className="flex items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-gray-600 flex-wrap">
                        <span>{section.lectures?.length || 0} lectures</span>
                        <span>•</span>
                        <span>{section.lectures?.reduce((total, lec) => total + (lec.duration || 0), 0)}m</span>
                      </div>
                    </div>
                    {expandedSections[section._id] ?
                      <FaChevronUp className="shrink-0 text-sm sm:text-base" /> :
                      <FaChevronDown className="shrink-0 text-sm sm:text-base" />
                    }
                  </div>

                  {expandedSections[section._id] && (
                    <div className="p-3 sm:p-4 bg-white border-t">
                      <h5 className="font-semibold mb-2 text-sm sm:text-base">Lectures:</h5>
                      {section.lectures?.length > 0 ? (
                        <ul className="space-y-2">
                          {section.lectures.map((lecture, idx) => (
                            <li key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm sm:text-base gap-2">
                              <span className="wrap-break-words flex-1">{lecture.title}</span>
                              <span className="text-xs sm:text-sm text-gray-600 shrink-0">{lecture.duration}m</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-xs sm:text-sm">No lectures yet. Add lectures in the Lectures tab.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lectures Tab */}
      {activeTab === 'lectures' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <FaVideo className="text-base sm:text-lg" /> Add New Lecture
            </h3>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Select Section *
                </label>
                <select
                  value={selectedSection || ''}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a section...</option>
                  {course?.content?.sections?.map((section) => (
                    <option key={section._id} value={section._id}>
                      {section.title}
                    </option>
                  ))}
                </select>
              </div>

              {selectedSection && (
                <>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Lecture Title *
                    </label>
                    <input
                      type="text"
                      value={newLecture.title}
                      onChange={(e) => setNewLecture({ ...newLecture, title: e.target.value })}
                      placeholder="e.g., Introduction to Components"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Type *
                      </label>
                      <select
                        value={newLecture.type}
                        onChange={(e) => setNewLecture({ ...newLecture, type: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="video">Video</option>
                        <option value="article">Article</option>
                        <option value="exercise">Exercise</option>
                        <option value="quiz">Quiz</option>
                        <option value="assignment">Assignment</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={newLecture.duration}
                        onChange={(e) => setNewLecture({ ...newLecture, duration: Number(e.target.value) })}
                        min="0"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Video URL
                    </label>
                    <input
                      type="text"
                      value={newLecture.url}
                      onChange={(e) => setNewLecture({ ...newLecture, url: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPreview"
                      checked={newLecture.isPreview}
                      onChange={(e) => setNewLecture({ ...newLecture, isPreview: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isPreview" className="text-xs sm:text-sm font-medium text-gray-700">
                      Allow preview for non-enrolled students
                    </label>
                  </div>

                  <button
                    onClick={() => handleAddLecture(selectedSection)}
                    className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <FaPlus className="text-sm" /> Add Lecture
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-r-from-blue-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white">
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Course Summary</h3>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">{course?.content?.sections?.length || 0}</div>
                <div className="text-xs sm:text-sm opacity-90 mt-1">Sections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">
                  {course?.content?.sections?.reduce((total, section) => total + (section.lectures?.length || 0), 0) || 0}
                </div>
                <div className="text-xs sm:text-sm opacity-90 mt-1">Total Lectures</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">{course?.content?.totalDuration || 0}m</div>
                <div className="text-xs sm:text-sm opacity-90 mt-1">Total Duration</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default InstructorEditCourse;