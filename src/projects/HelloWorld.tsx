// per https://handsonreact.com/docs/react-typescript
import { MouseEventHandler } from "react";

export interface Props {
  person: { first: string; last: string };
  logo: { name: string; title: string; path: string };
}

type Fruit = {
  id: number;
  name: string;
};
function FruitListItem(props: { fruit: Fruit }) {
  function handleClick(id: number) {
    console.log(`removed ${id}`);
  }

  return (
    <li onClick={() => handleClick(props.fruit.id)}>{props.fruit.name} </li>
  );
}

function FruitList(props: { fruits: Fruit[] }) {
  return (
    <ul>
      {props.fruits.map((fruit: Fruit) => (
        <FruitListItem key={fruit.id} fruit={fruit} />
      ))}
    </ul>
  );
}
const constFruits: Fruit[] = [
  { id: 1, name: "apple" },
  { id: 2, name: "orange" },
  { id: 3, name: "blueberry" },
  { id: 4, name: "banana" },
  { id: 5, name: "kiwi" },
];

function Button() {
  return <button onClick={handleClick}>Click Me!</button>;
}

function handleClick() {
  console.log("clicked");
}

function HelloWorld({ person, logo }: Props) {
  const { first, last } = person;
  const { path, title } = logo;
  return (
    <>
      <FruitList fruits={constFruits} />
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
      <Button />;
    </>
  );
  // return <>Hello, world!</>;
}

export default HelloWorld;
