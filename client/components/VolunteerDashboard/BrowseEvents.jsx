import { useState, useEffect } from "react";
import { Search, Filter, Calendar, MapPin, Clock } from "lucide-react";
import { EventCard } from "./EventCard";
import { EventDetailView } from "./EventDetailView";

export function BrowseEvents({ allEvents: initialAllEvents, onRefresh }) {
  const [allEvents, setAllEvents] = useState(initialAllEvents);
  const [filteredEvents, setFilteredEvents] = useState(initialAllEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [enrolling, setEnrolling] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDateFilter, setSelectedDateFilter] = useState("any"); // 'any', 'upcoming', 'today', 'this_week'

  // Update allEvents when initialAllEvents prop changes (e.g., from parent refresh)
  useEffect(() => {
    setAllEvents(initialAllEvents);
  }, [initialAllEvents]);

  const handleEnroll = async (eventId, eventName) => {
    setEnrolling(eventId);
    // Simulate API call
    setTimeout(() => {
      alert(`Successfully enrolled in "${eventName}"!`);
      setEnrolling(null);
      setShowDetail(false); // Close detail view after enrolling
      onRefresh(); // Refresh parent data
    }, 1000);
  };

  const filterEvents = () => {
    let filtered = allEvents;

    // Filter by search term (event name or skills)
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (event.required_skills &&
            event.required_skills
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by location
    if (locationTerm) {
      filtered = filtered.filter((event) =>
        event.event_location.toLowerCase().includes(locationTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (event) => event.event_category === selectedCategory
      );
    }

    // Filter by date
    const now = new Date();
    switch (selectedDateFilter) {
      case "upcoming":
        filtered = filtered.filter((event) => new Date(event.start_time) > now);
        break;
      case "today":
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.start_time);
          return eventDate.toDateString() === now.toDateString();
        });
        break;
      case "this_week":
        const startOfWeek = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - now.getDay()
        );
        const endOfWeek = new Date(
          startOfWeek.getFullYear(),
          startOfWeek.getMonth(),
          startOfWeek.getDate() + 7
        );
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.start_time);
          return eventDate >= startOfWeek && eventDate < endOfWeek;
        });
        break;
      default:
        // 'any' - no date filtering
        break;
    }

    setFilteredEvents(filtered);
  };

  useEffect(() => {
    filterEvents();
  }, [
    searchTerm,
    locationTerm,
    selectedCategory,
    selectedDateFilter,
    allEvents,
  ]);

  const categories = [
    ...new Set(allEvents.map((event) => event.event_category)),
  ];

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    setShowDetail(true);
  };

  const handleBackToBrowse = () => {
    setSelectedEvent(null);
    setShowDetail(false);
  };

  return (
    <div className="space-y-6">
      {!showDetail && (
        <>
          {/* Main Search Bar */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full relative">
                <label htmlFor="search-events" className="sr-only">
                  Find Events (Name, Skill)
                </label>
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  id="search-events"
                  placeholder="Event name, skill"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div className="md:w-px h-10 bg-gray-700 hidden md:block" />{" "}
              {/* Vertical Divider */}
              <div className="flex-1 w-full relative">
                <label htmlFor="search-location" className="sr-only">
                  Location
                </label>
                <MapPin
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  id="search-location"
                  placeholder="Location"
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <button
                onClick={filterEvents}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
              >
                <Search size={20} />
                <span className="sr-only">Search</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Browse All Events</h2>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-lg font-medium">
                {filteredEvents.length} Events Found
              </span>

              <div className="relative">
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={16}
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 appearance-none cursor-pointer"
                  aria-label="Filter by Category"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={16}
                />
                <select
                  value={selectedDateFilter}
                  onChange={(e) => setSelectedDateFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 appearance-none cursor-pointer"
                  aria-label="Filter by Date"
                >
                  <option value="any">Any Date</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="today">Today</option>
                  <option value="this_week">This Week</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.event_id}
                event={event}
                onClick={handleCardClick}
              />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                No Events Found
              </h3>
              <p className="text-gray-400">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </>
      )}

      {showDetail && selectedEvent && (
        <EventDetailView
          event={selectedEvent}
          onBack={handleBackToBrowse}
          onEnroll={handleEnroll}
          enrolling={enrolling}
        />
      )}
    </div>
  );
}
