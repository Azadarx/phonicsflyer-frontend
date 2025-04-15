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
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        {Array(15).fill().map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              repeat: Infinity,
              duration: Math.random() * 10 + 20,
              delay: Math.random() * 5
            }}
            className="absolute rounded-full"
            style={{
              background: `linear-gradient(45deg, rgba(124, 58, 237, ${Math.random() * 0.2 + 0.1}), rgba(236, 72, 153, ${Math.random() * 0.2 + 0.1}))`,
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              filter: 'blur(40px)',
              transform: `translate(-50%, -50%)`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">TRANSFORMATIONS</span>
          <div className="inline-block relative mb-4">
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute bottom-2 left-0 h-4 bg-pink-200 opacity-70 rounded z-0"
            ></motion.span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 relative z-10">Success Stories</h2>
          </div>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 mt-6">
            Real people, real results. See how our masterclass has transformed lives and careers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="relative z-10"
            >
              {/* Card with gradient border effect */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
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
                        <path d="M11 3C8.85 3 6.95 3.44 5.3 4.32C3.65 5.19 2.4 6.39 1.55 7.92C0.7 9.43 0.24 11.05 0.1 12.75C0.03 13.74 0 15.12 0 17C0 18.29 0.28 19.39 0.83 20.31C1.39 21.23 2.17 21.94 3.16 22.44C4.15 22.94 5.27 23.22 6.5 23.27C7.76 23.32 9.11 23.25 10.55 23.06C10.87 23.02 11.2 22.97 11.55 22.91C11.97 22.84 12.4 22.75 12.87 22.63C12.87 21.93 12.75 21.07 12.5 20.06C12.27 19.06 11.84 18.03 11.22 16.97C10.6 15.93 9.67 14.98 8.42 14.11C7.2 13.26 5.6 12.69 3.62 12.38C3.72 11.08 4.12 9.91 4.8 8.89C5.5 7.85 6.4 7.02 7.5 6.38C8.61 5.75 9.82 5.43 11.1 5.41C12.39 5.41 13.43 5.61 14.22 6C15.03 6.37 15.61 6.9 15.97 7.57C16.34 8.23 16.53 9 16.53 9.86C16.53 10.12 16.5 10.31 16.44 10.44C16.4 10.54 16.34 10.64 16.26 10.72C16.19 10.79 16.09 10.84 15.97 10.88C15.83 10.94 15.69 10.97 15.55 10.97C15.35 10.97 15.09 10.89 14.76 10.72C14.45 10.56 14.09 10.39 13.69 10.22C13.31 10.05 12.91 9.96 12.5 9.94C12.07 9.94 11.7 10.02 11.39 10.19C11.09 10.36 10.85 10.59 10.67 10.88C10.51 11.17 10.42 11.51 10.42 11.91C10.42 12.32 10.54 12.7 10.79 13.03C11.03 13.35 11.36 13.61 11.77 13.81C12.17 14.01 12.61 14.12 13.07 14.14C13.38 14.14 13.71 14.11 14.08 14.06C13.84 14.59 13.77 15.12 13.86 15.66C13.95 16.19 14.21 16.67 14.65 17.09C15.1 17.51 15.74 17.84 16.58 18.09C17.42 18.36 18.5 18.5 19.81 18.52C21.64 18.52 22.85 18.12 23.44 17.34C23.81 16.87 24 16.31 24 15.66C24 15.09 23.85 14.61 23.55 14.22C23.25 13.83 22.84 13.53 22.33 13.31C21.82 13.1 21.23 13 20.56 13C20.73 12.18 21.1 11.45 21.67 10.81C22.24 10.18 22.95 9.67 23.8 9.28C23.9 9.72 23.97 10.14 24 10.53C24.03 10.85 24.04 11.23 24.04 11.66C24.04 12.44 23.9 13.14 23.62 13.77C23.34 14.39 22.91 14.94 22.33 15.41C21.76 15.87 21.04 16.23 20.17 16.5C19.31 16.77 18.3 16.91 17.15 16.91C16.08 16.91 15.21 16.75 14.53 16.44C13.84 16.12 13.45 15.73 13.35 15.28C13.25 14.83 13.31 14.37 13.53 13.91C14.43 14.02 15.28 13.94 16.1 13.69C16.92 13.43 17.62 13.06 18.21 12.56C18.82 12.07 19.28 11.5 19.6 10.84C19.94 10.18 20.11 9.47 20.11 8.72C20.11 7.89 19.92 7.14 19.55 6.47C19.19 5.79 18.69 5.21 18.07 4.72C17.45 4.24 16.76 3.86 16 3.59C15.25 3.32 14.47 3.19 13.67 3.16C13.5 3.16 13.28 3.15 13.02 3.14C12.76 3.13 12.49 3.13 12.2 3.13C12.01 3.13 11.84 3.13 11.7 3.14C11.56 3.15 11.46 3.15 11.39 3.16C11.27 3.16 11.14 3.14 11 3.11V3ZM4.77 21.19C4.12 21.19 3.57 21.07 3.12 20.84C2.67 20.61 2.31 20.3 2.06 19.91C1.82 19.51 1.63 19.07 1.5 18.59C1.37 18.11 1.31 17.64 1.31 17.16C1.31 16.07 1.56 15.02 2.06 14C2.56 12.98 3.28 12.12 4.21 11.41C5.16 10.71 6.26 10.28 7.51 10.12C8.04 10.06 8.56 10.03 9.06 10.03C9.57 10.03 10.07 10.04 10.54 10.06C9.21 11.28 8.12 12.43 7.3 13.5C6.48 14.55 5.89 15.57 5.54 16.56C5.19 17.54 5.01 18.53 5.01 19.53C5.01 19.98 5.04 20.37 5.09 20.69C5.16 21.01 5.19 21.19 5.19 21.25H4.77Z" />
                      </svg>
                    </div>

                    {/* Testimonial text */}
                    <p className="text-gray-600 italic mb-8 relative z-10">"{testimonial.text}"</p>

                    {/* Person info with funky avatar border */}
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-spin-slow"></div>
                        <div className="relative w-12 h-12 p-1 rounded-full bg-white overflow-hidden">
                          <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover rounded-full" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-bold text-gray-800">{testimonial.name}</h3>
                        <p className="text-sm text-purple-600">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to action button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => window.location.href = "/register"}
          >
            <span>Join Them and Transform Your Life</span>
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;