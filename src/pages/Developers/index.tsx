import React, { useEffect, useRef } from 'react';
import { Linkedin, Github, Mail } from 'lucide-react';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';

const Developers = () => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const developers = [
    {
      id: 1,
      name: "Belal Gamal",
      role: "Frontend Developer",
      image: "/src/Assets/imgs/belal.jpeg",
      linkedin: "https://www.linkedin.com/in/belal-gamal-474/",
      github: "https://github.com/Belal12BG",
      email: "belalgamal474@gmail.com",
      bio: "Passionate about creating intuitive user experiences with React and modern web technologies."
    },
    {
      id: 2,
      name: "Khaled Tamer",
      role: "Full Stack Developer",
      image: "/src/Assets/imgs/Khaled.jpeg",
      linkedin: "https://www.linkedin.com/in/khaled-elnaggar-897154225/",
      github: "https://github.com/Khaled-Tamer-ElNaggar",
      email: "khaled.elnaggar.2004@gmail.com",
      bio: "Versatile developer skilled in both frontend and backend technologies, bridging design and functionality."
    },
    {
      id: 3,
      name: "Mohamed Salem",
      role: "Frontend Developer",
      image: "/src/Assets/imgs/salem.jpg",
      linkedin: "https://www.linkedin.com/in/mohamed-salem-032784327/",
      github: "https://github.com/mohamedsalem60",
      email: "mahmedsalem0101@gmail.com",
      bio: "Passionate about creating intuitive user experiences with React and modern web technologies."
    },
    {
      id: 4,
      name: "Omar Mohamed",
      role: "Backend Developer",
      image: "/src/Assets/imgs/Omar.jpg",
      linkedin: "https://www.linkedin.com/in/omar-elmaghraby-b26b3a228/",
      github: "https://github.com/OmarMaghrabi",
      email: "omarelmaghraby2003@gmail.com",
      bio: "Expert in Python, Flask, and database architecture. Ensures robust and scalable backend systems."
    },
    {
      id: 5,
      name: "Abdelrahamn Emad",
      role: "UI/UX Designer",
      image: "/src/Assets/imgs/Abdelrahamn.jpg",
      linkedin: "https://www.linkedin.com/in/abdelrahman-emad-biomy/",
      github: "https://github.com/Ibrahim-Emad514",
      email: "abdelramanemad514@gmail.com",
      bio: "Ensures product quality and user satisfaction through comprehensive testing and strategic planning."
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-slide-up');
            }, index * 150);
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const handleSocialClick = (url: string, event: React.MouseEvent) => {
    event.preventDefault();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header title="Our Team" />

      <main className="p-4 md:p-6 max-w-screen-xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-violet-900 dark:text-violet-200 mb-6">
            Meet Our <span className="text-violet-600 dark:text-violet-400">Developers</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The passionate team behind Baby Guard AI, dedicated to creating the best 
            pregnancy and infant health tracking experience for families worldwide.
          </p>
        </div>

        {/* Developers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {developers.map((developer, index) => (
            <div
              key={developer.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="developer-card opacity-0 translate-y-8 transition-all duration-700 ease-out"
            >
              <DeveloperCard developer={developer} onSocialClick={handleSocialClick} />
            </div>
          ))}
        </div>

        {/* Team Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-16">
          <h2 className="text-2xl font-bold text-violet-900 dark:text-violet-200 text-center mb-8">
            Team Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">5+</div>
              <div className="text-gray-600 dark:text-gray-300">Years Combined Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">1000+</div>
              <div className="text-gray-600 dark:text-gray-300">Hours of Development</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">100%</div>
              <div className="text-gray-600 dark:text-gray-300">Passion for Excellence</div>
            </div>
          </div>
        </div>
      </main>

      <Navbar />
    </div>
  );
};

const DeveloperCard = ({ developer, onSocialClick }) => {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Profile Image */}
      <div className="relative overflow-hidden">
        <img
          src={developer.image}
          alt={developer.name}
          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="relative p-6">
        <h3 className="text-xl font-bold text-violet-900 dark:text-violet-200 mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
          {developer.name}
        </h3>
        <p className="text-violet-600 dark:text-violet-400 font-medium mb-3">
          {developer.role}
        </p>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
          {developer.bio}
        </p>

        {/* Social Links */}
        <div className="flex space-x-4">
          <button
            onClick={(e) => onSocialClick(developer.linkedin, e)}
            className="flex items-center justify-center w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-full text-violet-600 dark:text-violet-400 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-500 transition-all duration-300 transform hover:scale-110"
            title={`Visit ${developer.name}'s LinkedIn`}
          >
            <Linkedin className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => onSocialClick(developer.github, e)}
            className="flex items-center justify-center w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-full text-violet-600 dark:text-violet-400 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-500 transition-all duration-300 transform hover:scale-110"
            title={`Visit ${developer.name}'s GitHub`}
          >
            <Github className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => onSocialClick(`mailto:${developer.email}`, e)}
            className="flex items-center justify-center w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-full text-violet-600 dark:text-violet-400 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-500 transition-all duration-300 transform hover:scale-110"
            title={`Email ${developer.name}`}
          >
            <Mail className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-violet-200/20 dark:bg-violet-400/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-4 left-4 w-16 h-16 bg-purple-200/20 dark:bg-purple-400/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
};

export default Developers;