import React from 'react';
import img1 from './foto/330194.jpg'
import img2 from './foto/1244.jpg'
import img3 from './foto/toto.jpg'

const teamData = [
  {
    name: 'Jimly Nur Arif',
    role: 'Programmer',
    imgSrc: img2,
  },
  {
    name: 'Ahmad Thoriq Saputra',
    role: 'Web Developer',
    imgSrc: img1,
  },
  {
    name: 'Rafif Ardhinto',
    role: 'Programmer',
    imgSrc: img3,
  },
];

const OurTeam = () => {
  return (
    <section className="">
      <div className="flex flex-wrap justify-center py-8 text-center h-[600px] ">
        <h1 className="w-full text-4xl text-green-800 font-bold">Meet The Team</h1>
      <div className="flex flex-wrap">
        {teamData.map((member, index) => (
          <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 p-2 ">
            <div 
                className="
                    bg-white 
                    shadow-lg p-12 
                    rounded 
                    cursor-pointer
                    transition 
                    duration-300 
                    w-[300px]
                    h-[400px]
                    ease-in-out transform hover:bg-gradient-to-b hover:from-green-400 hover:via-green-400 hover:to-green-500 hover:text-white
                    ">
                        <div className="w-[200px] aspect-square bg-green-200 p-2 rounded-full mx-auto mb-4">
                            <img src={member.imgSrc} alt={member.name} className="w-full h-full rounded-full object-cover object-center" />
                        </div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="font-light text-uppercase mb-4">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default OurTeam;
