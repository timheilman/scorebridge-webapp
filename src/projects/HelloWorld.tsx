const person = { first: "Tim", last: "Heilman" };
const logo = {
  name: "Logo",
  title: "Logo",
  path: "./logo512.png", // by experiment, . corresponds to /public
};
function HelloWorld() {
  return (
    <>
      <img src={logo.path} alt={logo.title} />
      Hello, {person.last}, {person.first}!
      <ul>
        <li>
          <a href="">a</a>
        </li>
        <li>
          <a href="">b</a>
        </li>
        <li>
          <a href="">c</a>
        </li>
      </ul>
    </>
  );
  // return <>Hello, world!</>;
}

export default HelloWorld;
