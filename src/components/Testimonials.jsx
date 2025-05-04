// src/components/EnhancedTestimonials.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

const EnhancedTestimonials = () => {
  // Updated testimonials focusing on adult learners
  const testimonials = [
    {
      name: "Priya Sharma",
      title: "English Teacher",
      text: "As a language educator for 15 years, I was skeptical about new teaching methods. Shereen ma'am's phonics approach has revolutionized my classroom techniques. My students now grasp pronunciation concepts in half the time!",
      image: "https://img.freepik.com/free-photo/young-beautiful-hispanic-woman-standing-with-arms-crossed-gesture-street_839833-27487.jpg?t=st=1746257858~exp=1746261458~hmac=52533a10fcf84662c202368455fc65540f998efa9190d4839a5d09bbd4af3d7d&w=996"
    },
    {
      name: "Rajesh Kumar",
      title: "Corporate Professional",
      text: "Working in a multinational company, clear communication is essential. The phonics program helped me refine my pronunciation and fluency, giving me the confidence to lead international calls and presentations.",
      image: "https://img.freepik.com/free-photo/business-concept-smiling-thoughtful-handsome-man-standing-white-isolated-background-touching-his-chin-with-hand_1258-80750.jpg?t=st=1746257672~exp=1746261272~hmac=829a0c69b436181db0f94b98e5343d228b5bc220f9571efdebc1f88926908ca6&w=996"
    },
    {
      name: "Meena Desai",
      title: "Homemaker & Tutor",
      text: "After learning phonics from Shereen ma'am, I now confidently teach neighborhood children. It's not just improved my English, but also provided me with a valuable skill to contribute to my community.",
      image: "https://img.freepik.com/free-photo/woman-with-floral-shirt-medium-shot_23-2148286112.jpg?t=st=1746257829~exp=1746261429~hmac=ea2efafdebf98cee24249b3dfa998eaa304e612357be68c5e4df6228d93c8b24&w=900"
    },
    {
      name: "Dr. Vijay Reddy",
      title: "Medical Practitioner",
      text: "Precise communication is critical in my profession. The phonics program helped me articulate complex medical terms with greater clarity, improving my interactions with international colleagues and patients alike.",
      image: "https://img.freepik.com/free-photo/portrait-young-indian-top-manager-t-shirt-tie-crossed-arms-smiling-white-isolated-wall_496169-1513.jpg?t=st=1746257708~exp=1746261308~hmac=005a8e2e81b36464372c0a70e9abae9104827f5b524227ca247a859118dc2e4c&w=996"
    },
    {
      name: "Ananya Sen",
      title: "College Student",
      text: "As an engineering student preparing for global opportunities, I needed to improve my English pronunciation. This program gave me the foundation I needed for confident presentations and interviews with international recruiters.",
      image: "https://img.freepik.com/free-photo/writing-dairy-note-coffee-shop-concept-as-memory-life-woman-coffee-shop-smiling-woman-making-notes-notepad_1153-8262.jpg?t=st=1746257788~exp=1746261388~hmac=cc177c543598ce5aa47b506d9eeef3394705c352f3c47b7c3c7c07ed13bf6acb&w=996"
    },
    {
      name: "Lakshmi Iyer",
      title: "Bank Manager",
      text: "The phonics program helped me refine my communication skills, which has been invaluable in my customer-facing role. I now speak with greater clarity and confidence when addressing clients and colleagues.",
      image: "https://img.freepik.com/premium-photo/beautiful-female-manager-office_249974-22837.jpg?w=740"
    },
    {
      name: "Faisal Khan",
      title: "Software Developer",
      text: "Working in a global tech company requires clear communication. The phonics training helped me articulate technical concepts more effectively in meetings with international teams and during client presentations.",
      image: "https://img.freepik.com/free-photo/portrait-happy-smiling-young-businessman-blue-suit-isolated-white-wall_231208-9208.jpg?t=st=1746257618~exp=1746261218~hmac=cfee2a91776d57fe762880ec219a9fd58b453855a471676d0dc474ddb4e01077&w=740"
    },
    {
      name: "Sunita Patel",
      title: "Small Business Owner",
      text: "As someone who deals with international suppliers, clear communication is essential for my business. The phonics course has significantly improved my confidence in negotiations and business relationships.",
      image: "https://img.freepik.com/free-photo/young-pregnant-woman-with-long-dark-hair-tropical-location_1321-4055.jpg?t=st=1746257930~exp=1746261530~hmac=d48153dc6ef73db7d9a560a92f5f093cb5e2633ba8642f802d961a6b054471e2&w=740"
    }
  ];

  // State for carousel
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);

  // Update width and slides to show on window resize
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    // Set initial values
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigate to previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - slidesToShow : prevIndex - 1
    );
  };

  // Navigate to next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - slidesToShow ? 0 : prevIndex + 1
    );
  };

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, slidesToShow]);

  return (
    <>
      <Navbar />
      <section className="py-12 md:py-24 relative overflow-hidden bg-gradient-to-b from-blue-50 to-teal-100">
        {/* Background elements with education-themed colors */}
        <div className="absolute inset-0 z-0">
          <motion.div
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 20,
            }}
            className="absolute rounded-full bg-gradient-to-r from-blue-300 to-teal-300 w-52 md:w-96 h-52 md:h-96 top-1/4 left-1/4 filter blur-3xl opacity-30 transform -translate-x-1/2 -translate-y-1/2"
          />
          <div className="absolute rounded-full bg-gradient-to-r from-teal-300 to-green-300 w-52 md:w-96 h-52 md:h-96 bottom-0 right-0 filter blur-3xl opacity-30 transform translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 md:mb-16">
            <span className="inline-block px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4 md:mb-6">SUCCESS STORIES</span>
            <div className="inline-block relative mb-4">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-800 relative z-10">Phonics Transformations</h2>
            </div>
            <p className="max-w-3xl mx-auto text-base md:text-lg text-gray-600 mt-4 md:mt-6">
              Discover how our phonics program has empowered professionals, educators, and adults from all walks of life.
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            {/* Carousel Navigation Buttons */}
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 md:-translate-x-5 z-20 bg-white/80 hover:bg-white text-teal-600 p-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1 md:translate-x-5 z-20 bg-white/80 hover:bg-white text-teal-600 p-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Carousel Track */}
            <div className="overflow-hidden px-4">
              <motion.div 
                className="flex transition-all duration-500 ease-in-out"
                animate={{
                  x: `-${(currentIndex * 100) / slidesToShow}%`
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    className={`px-2 md:px-4 flex-shrink-0 w-full sm:w-1/2 lg:w-1/3`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {/* Card with gradient border effect */}
                    <div className="relative group h-full">
                      <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-blue-500 to-green-500 rounded-2xl blur opacity-25 group-hover:opacity-70 transition duration-300"></div>
                      <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl h-full flex flex-col">
                        {/* Top colored bar with pattern */}
                        <div
                          className="h-3"
                          style={{
                            background: `linear-gradient(90deg, rgba(13, 148, 136, 1) ${Math.random() * 20}%, rgba(56, 189, 248, 1) ${Math.random() * 40 + 20}%, rgba(74, 222, 128, 1) ${Math.random() * 30 + 60}%)`
                          }}
                        ></div>

                        <div className="p-5 md:p-8 flex-grow flex flex-col">
                          {/* Book icon instead of quote */}
                          <div className="absolute top-5 md:top-8 right-5 md:right-8 text-teal-200 opacity-30">
                            <svg className="w-10 h-10 md:w-16 md:h-16" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,21L9,18H7A2,2 0 0,1 5,16V4C5,2.89 5.9,2 7,2H21A2,2 0 0,1 23,4V16A2,2 0 0,1 21,18H19L16,21V18H7A1,1 0 0,0 6,17V19H16V21M7,4V16H17V4H7M14,6V12.5L12.5,11.5L11,12.5V6H14" />
                            </svg>
                          </div>

                          {/* Testimonial content */}
                          <div className="mb-4 md:mb-6 flex-grow">
                            <p className="text-gray-600 text-sm md:text-base italic leading-relaxed line-clamp-5 md:line-clamp-none">{testimonial.text}</p>
                          </div>

                          {/* Profile */}
                          <div className="flex items-center mt-auto">
                            <div className="flex-shrink-0 mr-3 md:mr-4">
                              <img 
                                src={testimonial.image} 
                                alt={testimonial.name} 
                                className="h-10 w-10 md:h-14 md:w-14 rounded-full object-cover border-2 border-teal-100"
                              />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm md:text-base">{testimonial.name}</h4>
                              <p className="text-teal-600 text-xs md:text-sm">{testimonial.title}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
          
          {/* Indicator Dots */}
          <div className="flex justify-center mt-6 md:mt-10 space-x-2">
            {[...Array(testimonials.length - slidesToShow + 1)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 md:h-3 rounded-full transition-all ${currentIndex === i ? 'w-6 md:w-8 bg-teal-600' : 'w-2 md:w-3 bg-teal-300'}`}
                aria-label={`Go to testimonial page ${i + 1}`}
              />
            ))}
          </div>
          
          {/* CTA Button */}
          <div className="mt-10 md:mt-16 text-center">
            <motion.button
              onClick={() => window.location.href = "/register"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-2 md:px-8 md:py-3 border border-transparent text-sm md:text-base font-medium rounded-md text-white bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-lg"
            >
              Enroll in Phonics Program
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </div>
        </div>
      </section>
    </>
  );
};

export default EnhancedTestimonials;