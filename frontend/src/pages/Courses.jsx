
import { useEffect, useState } from 'react';
import client from '../api/client';

const defaultCourses = [
  {
    id: 'nazira',
    title: 'Quran Recitation (Nazira)',
    description:
      'Learn to read the Holy Quran accurately with proper pronunciation and teacher guidance.',
  },
  {
    id: 'hifz',
    title: 'Quran Memorization (Hifz)',
    description:
      'Memorize the Holy Quran gradually with regular revision and personal guidance.',
  },
  {
    id: 'tajweed',
    title: 'Tajweed',
    description:
      'Learn the rules of Quranic pronunciation for correct and beautiful recitation.',
  },
  {
    id: 'hadith',
    title: 'Hadith Studies',
    description:
      'Explore the teachings and traditions of Prophet Muhammad (peace be upon him).',
  },
  {
    id: 'islamic-studies',
    title: 'Islamic Studies',
    description:
      'Develop your understanding of Islamic beliefs, manners, and daily practices.',
  },
  {
    id: 'fiqh',
    title: 'Fiqh and Islamic Law',
    description:
      'Study Islamic jurisprudence and learn about its principles and practical guidance.',
  },
];

export default function Courses() {
  const [courses, setCourses] = useState(defaultCourses);

  useEffect(() => {
    let active = true;

    async function loadCourses() {
      try {
        const res = await client.get('/courses');

        const apiCourses = Array.isArray(res.data?.courses)
          ? res.data.courses
          : Array.isArray(res.data)
            ? res.data
            : [];

        if (active && apiCourses.length > 0) {
          setCourses(apiCourses);
        }
      } catch (error) {
        console.error('Could not load courses from the API:', error);
      }
    }

    loadCourses();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>Our Courses</h1>
          <p>
            Explore Quran and Islamic Studies courses
            designed to help learners grow in knowledge
            and faith.
          </p>

          <div className="hero-actions">
            <a href="/admission" className="btn btn-primary">
              Apply for Admission
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">
            Explore Our Courses
          </h2>

          <div className="grid grid-3">
            {courses.map((course, index) => (
              <article
                className="card"
                key={course.id ?? course._id ?? index}
              >
                <span className="badge badge-active mb-2">
                  Course {index + 1}
                </span>

                <h3>
                  {course.title ??
                    course.name ??
                    course.courseName ??
                    'Islamic Studies'}
                </h3>

                <p>
                  {course.description ??
                    course.details ??
                    'Learn with structured lessons and teacher guidance.'}
                </p>

                <div className="mt-3">
                  <a
                    href="/admission"
                    className="btn btn-primary"
                  >
                    Apply Now
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
