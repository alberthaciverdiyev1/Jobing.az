import React from "react";

// Container
import Container from "../common/Container";

// Components

// Icons
import { Search, MapPin, Briefcase } from "lucide-react";

const HeroSection = () => {
  const getCities = async () => {
    const response = await fetch();
    const data = await response.data();
  };

  return (
    <section className="w-full bg-gradient-to-b px-4 flex flex-col items-center mt-16 z-1">
      <Container>
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-left max-w-md">
            Minlərlə iş elanı bir platformada...
          </h1>
          <p className="mt-2 text-left text-gray-600">
            Axtarışa başla, karyera imkanlarını kəşf et
          </p>
        </div>

        <div className="mt-6 bg-white rounded-xl p-4 shadow-md w-full max-w-md flex flex-col gap-3">
          {/* Title Input */}
          <div className="flex items-center border border-orange-400 rounded px-3 py-2">
            <Search className="text-gray-500 mr-2" size={18} />
            <input
              type="text"
              placeholder="Başlıq, şirkət adı və ya şəhər"
              className="w-full outline-none text-sm"
            />
          </div>

          {/* City Dropdown */}
          <div className="flex items-center border border-orange-400 rounded px-3 py-2">
            <MapPin className="text-gray-500 mr-2" size={18} />
            <select className="w-full outline-none text-sm">
              <option>Bütün Şəhərlər</option>
              {/* Add more options as needed */}
              {}
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center border border-orange-400 rounded px-3 py-2">
            <Briefcase className="text-gray-500 mr-2" size={18} />
            <select className="w-full outline-none text-sm">
              <option>Bütün Kateqoriyalar</option>
              {/* Add more options as needed */}
            </select>
          </div>

          {/* Search Button */}
          <button className="bg-[#fe8012] hover:bg-[#f97316] transition text-white font-semibold py-2 rounded w-full">
            Axtar
          </button>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
