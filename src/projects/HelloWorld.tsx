function HelloWorld(props: {
  person: { first: string; last: string };
  logo: { name: string; title: string; path: string };
}) {
  const { first, last } = props.person;
  const { path, title } = props.logo;
  return (
    <>
      <img src={path} alt={title} />
      Hello, {last}, {first}!
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
