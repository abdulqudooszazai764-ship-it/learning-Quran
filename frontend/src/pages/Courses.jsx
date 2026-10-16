const apiCourses = (Array.isArray(res.data?.courses)
  ? res.data.courses
  : []
).filter((course) => {
  const name = String(
    course.name_en || course.name || ''
  ).toLowerCase();

  return !(
    name.includes('hifz') ||
    name.includes('memorization')
  );
});