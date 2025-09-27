import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate,Link } from 'react-router-dom';
import { Car, Shield, Clock, Star, Menu, X, MapPin, Phone, Mail, ChevronDown, Users, Award, TrendingUp } from 'lucide-react';

const LandingPage = () => {
  const { user, login, register } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [userType, setUserType] = useState('rider');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Redirect if already logged in
  if (user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  const handleAuth = async (formData) => {
    setIsLoading(true);
    setError('');

    const email = formData.get('email');
    const password = formData.get('password');

    try {
      if (authMode === 'login') {
        const result = await login(email, password);
        if (!result.success) {
          setError(result.error || 'Login failed');
        }
      } else {
        const registerData = {
          email,
          password,
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          role: userType,
          city: formData.get('city'),
          state: formData.get('state'),
          phoneNumber: formData.get('phoneNumber'),
        };

        const result = await register(registerData);
        if (result.success) {
          setAuthMode('login');
          setError('Registration successful! Please login.');
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Something went wrong. Please try again.');
    }

    setIsLoading(false);
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Regular Rider",
      content: "Nomad Cabs has transformed my daily commute. The drivers are professional and the app is so easy to use!",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      name: "Mike Chen",
      role: "Driver Partner",
      content: "Being a Nomad Cabs driver has given me the flexibility I needed. Great earning potential and excellent support.",
      rating: 5,
      avatar: "👨‍🚗"
    },
    {
      name: "Emily Rodriguez",
      role: "Business Traveler",
      content: "Reliable, safe, and affordable. I use Nomad Cabs for all my business trips. Highly recommended!",
      rating: 5,
      avatar: "👩‍💻"
    }
  ];

  const faqs = [
    {
      question: "How do I book a ride with Nomad Cabs?",
      answer: "Simply open our app, enter your pickup and destination, choose your vehicle type, and confirm your booking. A driver will be assigned to you within minutes."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash, UPI, credit/debit cards, and digital wallet payments. You can choose your preferred payment method during booking."
    },
    {
      question: "How can I become a driver with Nomad Cabs?",
      answer: "Register through our app as a driver, submit your documents (license, vehicle RC, insurance), and once verified, you can start accepting rides."
    },
    {
      question: "Is it safe to ride with Nomad Cabs?",
      answer: "Yes, all our drivers undergo thorough background verification. We also provide real-time tracking, emergency contacts, and 24/7 customer support."
    },
    {
      question: "Can I schedule rides in advance?",
      answer: "Yes, you can schedule rides up to 7 days in advance. Just select your preferred date and time during booking."
    },
    {
      question: "What are your operating hours?",
      answer: "Nomad Cabs operates 24/7 in all our service areas. You can book a ride anytime, anywhere within our coverage zones."
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Safety First",
      description: "All drivers verified with background checks. Real-time tracking and emergency support.",
      color: "text-blue-400"
    },
    {
      icon: Clock,
      title: "Always On Time",
      description: "Quick pickups and reliable service. Schedule rides in advance for your convenience.",
      color: "text-purple-400"
    },
    {
      icon: Star,
      title: "5-Star Experience",
      description: "Professional drivers, clean vehicles, and exceptional customer service every time.",
      color: "text-cyan-400"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built by the community, for the community. Join thousands of satisfied users.",
      color: "text-green-400"
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized for excellence in transportation services and customer satisfaction.",
      color: "text-yellow-400"
    },
    {
      icon: TrendingUp,
      title: "Growing Fast",
      description: "Expanding to new cities every month. Be part of our growth story.",
      color: "text-red-400"
    }
  ];

  const stats = [
    { label: "Happy Riders", value: "50K+", color: "text-blue-400" },
    { label: "Verified Drivers", value: "5K+", color: "text-purple-400" },
    { label: "Cities Covered", value: "25+", color: "text-cyan-400" },
    { label: "Rides Completed", value: "1M+", color: "text-green-400" }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-400" />
              <Link to = "/"><span className="ml-2 text-xl font-bold">Nomad Cabs</span></Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#home" className="px-3 py-2 text-sm font-medium hover:text-blue-400 transition-colors">Home</a>
                <a href="#about" className="px-3 py-2 text-sm font-medium hover:text-blue-400 transition-colors">About</a>
                <a href="#services" className="px-3 py-2 text-sm font-medium hover:text-blue-400 transition-colors">Services</a>
                <a href="#testimonials" className="px-3 py-2 text-sm font-medium hover:text-blue-400 transition-colors">Testimonials</a>
                <a href="#contact" className="px-3 py-2 text-sm font-medium hover:text-blue-400 transition-colors">Contact</a>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-gray-400 hover:text-white"
              >
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden glass-effect">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#home" className="block px-3 py-2 text-base font-medium hover:text-blue-400">Home</a>
              <a href="#about" className="block px-3 py-2 text-base font-medium hover:text-blue-400">About</a>
              <a href="#services" className="block px-3 py-2 text-base font-medium hover:text-blue-400">Services</a>
              <a href="#testimonials" className="block px-3 py-2 text-base font-medium hover:text-blue-400">Testimonials</a>
              <a href="#contact" className="block px-3 py-2 text-base font-medium hover:text-blue-400">Contact</a>
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full text-left bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg font-medium transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className=" mt-10 pt-16 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Your Journey,
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {' '}Our Priority
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Experience seamless rides with Nomad Cabs. Safe, reliable, and affordable transportation 
                at your fingertips. Book now and travel with confidence.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setUserType('rider');
                    setShowAuthModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
                >
                  Book a Ride
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setUserType('driver');
                    setShowAuthModal(true);
                  }}
                  className="border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                >
                  Drive with Us
                </button>
              </div>

              {/* Test Credentials */}
              {/* <div className="glass-effect p-6 rounded-lg mt-8">
                <h3 className="text-lg font-semibold mb-4 text-blue-400">🔧 Test Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-2">
                    <p className="font-medium text-green-400">Admin Access</p>
                    <p>admin@nomadcabs.com</p>
                    <p>admin123</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-blue-400">Rider Access</p>
                    <p>rider@test.com</p>
                    <p>rider123</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-purple-400">Driver Access</p>
                    <p>driver@test.com</p>
                    <p>driver123</p>
                  </div>
                </div>
              </div> */}
            </div>

            <div className="relative">
              <div className="animate-float">
                <div className="text-9xl opacity-20 text-blue-400">🚗</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Nomad Cabs?</h2>
            <p className="text-xl text-gray-300">Experience the difference with our premium features</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="glass-effect p-8 rounded-xl card-hover text-center">
                  <Icon className={`w-12 h-12 ${feature.color} mx-auto mb-4`} />
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">About Nomad Cabs</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Founded with a vision to revolutionize urban transportation, Nomad Cabs connects riders 
                with professional drivers across the city. We believe in making every journey safe, 
                comfortable, and affordable.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Our platform empowers drivers with flexible earning opportunities while providing riders 
                with reliable transportation solutions. With cutting-edge technology and a commitment to 
                excellence, we're redefining the ride-hailing experience.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">50K+</div>
                  <div className="text-gray-300">Happy Riders</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">5K+</div>
                  <div className="text-gray-300">Verified Drivers</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="glass-effect p-8 rounded-xl">
                <div className="text-8xl opacity-30 text-blue-400 text-center">🚕</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-300">Real feedback from our amazing community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-effect p-8 rounded-xl card-hover">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-300">Find answers to common questions about our service</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-effect rounded-xl overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-700/30 transition-colors"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-300">We're here to help you 24/7</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-effect p-8 rounded-xl text-center card-hover">
              <MapPin className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-300">123 Tech Street<br />Innovation City, IC 12345</p>
            </div>

            <div className="glass-effect p-8 rounded-xl text-center card-hover">
              <Phone className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">+1 (555) 123-4567<br />24/7 Support</p>
            </div>

            <div className="glass-effect p-8 rounded-xl text-center card-hover">
              <Mail className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">support@nomadcabs.com<br />Quick Response</p>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-effect p-8 rounded-xl w-full max-w-md relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6">
              {authMode === 'login' ? 'Welcome Back' : 'Join Nomad Cabs'}
            </h2>

            {authMode === 'login' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Login as:</label>
                <div className="flex gap-2">
                  {['rider', 'driver', 'admin'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setUserType(type)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        userType === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {authMode === 'register' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Register as:</label>
                <div className="flex gap-2">
                  {['rider', 'driver'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setUserType(type)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        userType === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAuth(formData);
              }}
              className="space-y-4"
            >
              {authMode === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      name="firstName"
                      type="text"
                      placeholder="First Name"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none"
                    />
                    <input
                      name="lastName"
                      type="text"
                      placeholder="Last Name"
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <input
                    name="phoneNumber"
                    type="tel"
                    placeholder="Phone Number"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      name="city"
                      type="text"
                      placeholder="City"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none"
                    />
                    <input
                      name="state"
                      type="text"
                      placeholder="State"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </>
              )}
              
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none"
              />

              {error && (
                <div className={`text-sm text-center p-3 rounded-lg ${
                  error.includes('successful') ? 'text-green-400 bg-green-900/20' : 'text-red-400 bg-red-900/20'
                }`}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  authMode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setError('');
                }}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                {authMode === 'login' 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Sign in'
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <Car className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">Nomad Cabs</span>
              </div>
              <p className="text-gray-300">
                Your trusted ride-hailing partner for safe, reliable, and affordable transportation.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#about" className="block text-gray-300 hover:text-white transition-colors">About Us</a>
                <a href="#services" className="block text-gray-300 hover:text-white transition-colors">Services</a>
                <a href="#contact" className="block text-gray-300 hover:text-white transition-colors">Contact</a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">Help Center</a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">Safety</a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-300">
                <p>+91 123-4567</p>
                <p>support@nomadcabs.com</p>
                <p>123 Tech Street, Innovation City</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Nomad Cabs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;