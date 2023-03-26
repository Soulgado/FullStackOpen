const Header = ({ course }) => <h1>{course}</h1>

const Part = ({ part }) => 
  <li>
    {part.name} {part.exercises}
  </li>

const Total = ({ parts }) => {
  const total = parts.reduce((previous, current) => previous + current.exercises, 0);
  return <strong>Total of {total} exercise</strong>;
}

const Content = ({ parts }) => {
  return (
    <ul>
      {parts.map(part =>
        <Part key={part.id} part={part} />)}
    </ul>
  );
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course;