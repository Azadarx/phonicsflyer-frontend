// src/components/Testimonials.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Priya S.",
      title: "Marketing Professional",
      text: "The masterclass was eye-opening! I gained practical tools to manage my stress and improve my work-life balance. Highly recommended!",
      image: "https://media.istockphoto.com/id/1987655119/photo/smiling-young-businesswoman-standing-in-the-corridor-of-an-office.jpg?s=612x612&w=0&k=20&c=5N_IVGYsXoyj-H9vEiZUCLqbmmineaemQsKt2NTXGms="
    },
    {
      name: "Rahul M.",
      title: "Entrepreneur",
      text: "Inspiring Shereen's approach to holistic success helped me identify blind spots in my business strategy. My revenue has grown 40% since applying her methods.",
      image: "https://static.vecteezy.com/system/resources/previews/049/174/246/non_2x/a-smiling-young-indian-man-with-formal-shirts-outdoors-photo.jpg"
    },
    {
      name: "Aisha K.",
      title: "HR Manager",
      text: "This masterclass gave me the confidence to ask for a promotion and improve my relationships with colleagues. The ROI on this small investment was incredible!",
      image: "https://www.shutterstock.com/image-photo/portrait-young-adult-indian-woman-260nw-2387090027.jpg"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-purple-50 to-indigo-100">
      {/* Reduced to just 2 background elements with minimal animation */}
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
          className="absolute rounded-full bg-gradient-to-r from-purple-300 to-pink-300 w-96 h-96 top-1/4 left-1/4 filter blur-3xl opacity-30 transform -translate-x-1/2 -translate-y-1/2"
        />
        <div className="absolute rounded-full bg-gradient-to-r from-indigo-300 to-violet-300 w-96 h-96 bottom-0 right-0 filter blur-3xl opacity-30 transform translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">TRANSFORMATIONS</span>
          <div className="inline-block relative mb-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 relative z-10">Success Stories</h2>
          </div>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 mt-6">
            Real people, real results. See how our masterclass has transformed lives and careers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative z-10 hover:-translate-y-3 transition-transform duration-300"
            >
              {/* Card with gradient border effect - simplified */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-70 transition duration-300"></div>
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl">
                  {/* Top colored bar with random pattern */}
                  <div
                    className="h-3"
                    style={{
                      background: `linear-gradient(90deg, rgba(124, 58, 237, 1) ${Math.random() * 20}%, rgba(167, 139, 250, 1) ${Math.random() * 40 + 20}%, rgba(236, 72, 153, 1) ${Math.random() * 30 + 60}%)`
                    }}
                  ></div>

                  <div className="p-8">
                    {/* Quote icon */}
                    <div className="absolute top-8 right-8 text-purple-200 opacity-30">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>

                    {/* Testimonial content */}
                    <div className="mb-6">
                      <p className="text-gray-600 italic leading-relaxed">{testimonial.text}</p>
                    </div>

                    {/* Profile */}
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-4">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="h-14 w-14 rounded-full object-cover border-2 border-purple-100"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                        <p className="text-purple-600 text-sm">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* CTA Button */}
        <div className="mt-16 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg"
          >
            Join Our Next Masterclass
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;