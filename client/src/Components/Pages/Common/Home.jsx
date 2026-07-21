import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Home() {
  const Trusted = [
    "https://cms-images.udemycdn.com/96883mtakkm8/3E0eIh3tWHNWADiHNBmW4j/3444d1a4d029f283aa7d10ccf982421e/volkswagen_logo.svg",
    "https://cms-images.udemycdn.com/96883mtakkm8/2pNyDO0KV1eHXk51HtaAAz/090fac96127d62e784df31e93735f76a/samsung_logo.svg",
    "https://cms-images.udemycdn.com/96883mtakkm8/3YzfvEjCAUi3bKHLW2h1h8/ec478fa1ed75f6090a7ecc9a083d80af/cisco_logo.svg",
    "https://cms-images.udemycdn.com/96883mtakkm8/23XnhdqwGCYUhfgIJzj3PM/77259d1ac2a7d771c4444e032ee40d9e/vimeo_logo_resized-2.svg",
    "https://cms-images.udemycdn.com/96883mtakkm8/1UUVZtTGuvw23MwEnDPUr3/2683579ac045486a0aff67ce8a5eb240/procter_gamble_logo.svg",
    "https://cms-images.udemycdn.com/96883mtakkm8/1GoAicYDYxxRPGnCpg93gi/a8b6190cc1a24e21d6226200ca488eb8/hewlett_packard_enterprise_logo.svg",
    "https://cms-images.udemycdn.com/96883mtakkm8/2tQm6aYrWQzlKBQ95W00G/c7aaf002814c2cde71d411926eceaefa/citi_logo.svg",
    "https://cms-images.udemycdn.com/96883mtakkm8/7guDRVYa2DZD0wD1SyxREP/b704dfe6b0ffb3b26253ec36b4aab505/ericsson_logo.svg",
  ];

  return (
    <section>

      <section
  className="relative h-100 bg-cover bg-center max-md:h-0"
  style={{
    backgroundImage:
      'url("https://img-c.udemycdn.com/notices/banner_carousel_slide/image/e5e9614b-8b2d-48a3-af19-12064716d699.jpg")',
  }}
>
  <div className="absolute top-1/4 left-6 bg-white p-6 shadow-2xl rounded-md w-1/3 hidden md:block">
    <h3 className="font-bold text-3xl">
      Jump into learning <span className="text-[#6d28d2]">for less</span>
    </h3>
    <p className="mt-2 text-gray-700">
      If you’re new to Ademy, courses start at just $10.99.
    </p>
  </div>
</section>

      <Skills />

      <section className="p-5 mt-7">
        <h3 className="text-center text-2xl py-3 mb-2 text-gray-600 max-md:text-lg">
          Trusted by over 17,000 companies and millions of learners
        </h3>
        <div className="flex items-center justify-between px-7 flex-wrap gap-5 max-md:justify-center">
          {Trusted.map((item, i) => (
            <img key={i} src={item} className="size-16" />
          ))}
        </div>
      </section>

      <Courses />
    </section>
  );
}

export default Home;

function Skills() {
  const Topics = [
    {
      pic: "https://plus.unsplash.com/premium_photo-1682795706948-970707507af6?w=600",
      name: "Generative AI",
    },
    {
      pic: "https://images.unsplash.com/photo-1762330915716-69ffffeeee95?w=600",
      name: "IT Certification",
    },
    {
      pic: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
      name: "Data Science",
    },
  ];

  return (
    <section className="p-5 mt-7 w-full h-96 flex items-center 
                        max-md:flex-col max-md:h-auto gap-6">
      <div className="w-1/3 p-4 max-md:w-full">
        <h3 className="text-3xl mb-2 max-md:text-xl">
          Learn essential career and life skills
        </h3>
        <p className="max-md:text-sm">
          Ademy helps you build in-demand skills fast
        </p>
      </div>

      <div className="w-2/3 flex gap-4 max-md:w-full max-md:flex-col">
        {Topics.map((item, i) => (
          <div
            key={i}
            className="relative h-96 w-1/2 flex items-end p-2 text-white rounded-lg shadow-lg
                       max-md:w-full max-md:h-60"
            style={{
              backgroundImage: `url(${item.pic})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-white bg-opacity-50 w-full p-3 text-black">
              {item.name}
              <span className="flex justify-end">
                <FaArrowCircleRight />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Courses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/v1/courses").then((res) => {
      setCourses(res.data.courses);
    });
  }, []);

  return (
    <section className="p-5">
      <h2 className="text-2xl font-bold">
        Skills to transform your career and life
      </h2>
      <h3 className="text-xl text-gray-600 max-md:text-sm">
        Ademy supports your professional development
      </h3>

      <section className="grid grid-cols-4 gap-2.5 px-4 
                          max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        {courses.map((item, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-md"
          >
            <img
              onClick={() => navigate(`/course/${item._id}`)}
              src={item.thumbnail}
              className="h-44 w-full object-cover rounded-xl cursor-pointer"
            />

            <h3 className="line-clamp-2 text-lg font-semibold">
              {item.title}
            </h3>

            <h4 className="text-sm text-gray-500">
              {item.instructorId?.name}
            </h4>

            <div className="flex gap-2 text-xs">
              <span className="border px-2 py-0.5 rounded">
                ⭐ {item.rating || 0}
              </span>
              <span className="border px-2 py-0.5 rounded">
                {item.ratingCount || 0} ratings
              </span>
            </div>

            <div className="mt-auto flex gap-2 items-center">
              <span className="text-lg font-bold text-green-600">
                ${Math.floor(item.price * (1 - item.discount / 100))}
              </span>
              <del className="text-sm text-gray-400">${item.price}</del>
              <span className="text-xs text-red-500">
                {item.discount}% OFF
              </span>
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}
