const footerData = [
  {
    title: "In-demand Careers",
    links: [
      "Data Scientist",
      "Full Stack Web Developer",
      "Cloud Engineer",
      "Project Manager",
      "Game Developer",
      "All Career Accelerators",
    ],
  },
  {
    title: "Web Development",
    links: ["Web Development", "JavaScript", "React JS", "Angular", "Java"],
  },
  {
    title: "IT Certifications",
    links: [
      "Amazon AWS",
      "AWS Certified Cloud Practitioner",
      "AZ-900: Microsoft Azure Fundamentals",
      "AWS Certified Solutions Architect - Associate",
      "Kubernetes",
    ],
  },
  {
    title: "Leadership",
    links: [
      "Leadership",
      "Management Skills",
      "Project Management",
      "Personal Productivity",
      "Emotional Intelligence",
    ],
  },
  {
    title: "About",
    links: ["About us", "Careers", "Contact us", "Blog", "Investors"],
  },
  {
    title: "Discover Udemy",
    links: [
      "Get the app",
      "Teach on Udemy",
      "Plans and Pricing",
      "Affiliate",
      "Help and Support",
    ],
  },
  {
    title: "Udemy for Business",
    links: ["Udemy Business"],
  },
  {
    title: "Legal & Accessibility",
    links: ["Accessibility statement", "Privacy policy", "Sitemap", "Terms"],
  },
];

const AdemyBusiness = [
  "https://s.udemycdn.com/partner-logos/v4/nasdaq-light.svg",
  "https://s.udemycdn.com/partner-logos/v4/volkswagen-light.svg",
  "https://s.udemycdn.com/partner-logos/v4/netapp-light.svg",
  "https://s.udemycdn.com/partner-logos/v4/eventbrite-light.svg",
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-4 sm:px-8 py-10">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-gray-700 pb-6">
        <h3 className="text-lg sm:text-xl font-bold">
          Top companies choose{" "}
          <span className="text-[#6d28d2]">Ademy Business</span> to build
          in-demand career skills.
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          {AdemyBusiness.map((item, i) => (
            <img key={i} src={item} alt="" className="w-16 sm:w-20" />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 py-8">
        {footerData.slice(0, 4).map((col, idx) => (
          <div key={idx}>
            <h3 className="text-white font-semibold mb-4">{col.title}</h3>
            <ul className="space-y-2 text-sm">
              {col.links.map((link, index) => (
                <li key={index} className="hover:text-white cursor-pointer">
                  {link}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 border-t border-gray-700 pt-8 text-sm">
        {footerData.slice(4).map((col, idx) => (
          <div key={idx}>
            <h3 className="text-white font-semibold mb-4">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((link, index) => (
                <li key={index} className="hover:text-white cursor-pointer">
                  {link}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-10 flex flex-col sm:flex-row justify-between items-center border-t border-gray-700 pt-4 text-sm text-gray-400 gap-2">
        <p>© 2025 Ademy, Inc.</p>
        <p>English</p>
      </div>
    </footer>
  );
};

export default Footer;
