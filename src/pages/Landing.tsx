import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  MapPin, 
  Users, 
  BarChart3,
  CheckCircle,
  Clock,
  Shield,
  Smartphone
} from 'lucide-react';

const Landing: React.FC = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Digital Logbook',
      description: 'Keep track of daily activities and learning experiences with our intuitive digital logbook system.'
    },
    {
      icon: MapPin,
      title: 'GPS Check-in',
      description: 'Verify attendance at placement locations with automatic GPS tracking and location confirmation.'
    },
    {
      icon: Users,
      title: 'Supervisor Reviews',
      description: 'Streamlined communication between students and supervisors with real-time feedback and approvals.'
    },
    {
      icon: BarChart3,
      title: 'Progress Analytics',
      description: 'Comprehensive reporting and analytics to track placement progress and performance metrics.'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security ensures your data is protected with industry-standard encryption.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Access your placement tracker anywhere, anytime with our responsive mobile-first design.'
    }
  ];

  // const testimonials = [
  //   {
  //     name: 'Sarah Mitchell',
  //     role: 'Computer Science Student',
  //     image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
  //     quote: 'PlacementTracker made managing my internship so much easier. The GPS check-in feature saved me so much time!'
  //   },
  //   {
  //     name: 'Dr. James Wilson',
  //     role: 'Academic Supervisor',
  //     image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
  //     quote: 'The supervisor dashboard gives me complete visibility into student progress. Reviewing and approving logs is now effortless.'
  //   },
  //   {
  //     name: 'Maria Garcia',
  //     role: 'Placement Coordinator',
  //     image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
  //     quote: 'Managing hundreds of students across different placements has never been this organized. The analytics are invaluable.'
  //   }
  // ];

  return (
    <div className="min-h-screen bg-white">   
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Streamline Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                Placement Journey
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              The complete solution for managing student placements, tracking progress, and ensuring success with real-time monitoring and collaboration tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
              >
                Get Started Now
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Successful Placements
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools students, supervisors, and administrators need to manage placements effectively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-8">
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div className="p-8">
              <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Partner Institutions</div>
            </div>
            <div className="p-8">
              <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="p-8">
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Students and Educators
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say about their experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Placement Experience?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of students and educators who trust PlacementTracker for their placement management needs.
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all inline-flex items-center space-x-2 shadow-lg"
          >
            <span>Sign Up Now</span>
            <CheckCircle className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;