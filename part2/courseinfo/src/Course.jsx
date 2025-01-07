const Header = ({ title }) => {
  return <h1>{title}</h1>;
};

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
};

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((part) => (
        <Part key={part.name} part={part} />
      ))}
    </>
  );
};

const Sum = ({ parts }) => {
  return (
    <strong>
      {" "}
      total of{" "}
      {parts.reduce((total, part) => {
        return total + part.exercises;
      }, 0)}{" "}
      exercises
    </strong>
  );
};

const Course = ({ courses }) => {
  return (
    <>
      {courses.map((course) => (
        <div key={course.name}>
          <Header title={course.name} />
          <Content parts={course.parts} />
          <Sum parts={course.parts} />
        </div>
      ))}
    </>
  );
};

export default Course;
