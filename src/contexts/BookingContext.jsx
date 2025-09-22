import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch bookings from server
  const fetchBookings = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  const createBooking = async (bookingData) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const newBooking = await response.json();
        setBookings(prev => [newBooking, ...prev]);
        return { success: true, booking: newBooking };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status, additionalData = {}) => {
    try {
      const response = await fetch(`http://localhost:3001/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status, ...additionalData }),
      });

      if (response.ok) {
        const updatedBooking = await response.json();
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId ? updatedBooking : booking
        ));
        return { success: true, booking: updatedBooking };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const acceptBooking = async (bookingId, driverId) => {
    return await updateBookingStatus(bookingId, 'accepted', { driverId });
  };

  const getBookingsByUser = (userId, role) => {
    return bookings.filter(booking => 
      role === 'rider' ? booking.riderId === userId : booking.driverId === userId
    );
  };

  const getBookingById = (bookingId) => {
    return bookings.find(booking => booking.id === bookingId);
  };

  const calculateFare = (distance, vehicleType, city = 'Mumbai') => {
    const baseFares = {
      bike: 50,
      auto: 80,
      hatchback: 120,
      sedan: 150,
      suv: 200,
    };

    const perKmRates = {
      bike: 8,
      auto: 12,
      hatchback: 15,
      sedan: 18,
      suv: 22,
    };

    const baseFare = baseFares[vehicleType] || 100;
    const distanceFare = (distance || 5) * (perKmRates[vehicleType] || 15);
    const subtotal = baseFare + distanceFare;
    const platformFee = Math.round(subtotal * 0.1);
    const total = subtotal + platformFee;

    return {
      baseFare,
      distanceFare,
      platformFee,
      subtotal,
      total,
    };
  };

  const value = {
    bookings,
    loading,
    createBooking,
    updateBookingStatus,
    acceptBooking,
    getBookingsByUser,
    getBookingById,
    calculateFare,
    fetchBookings,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};