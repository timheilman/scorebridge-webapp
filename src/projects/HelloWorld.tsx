// per https://handsonreact.com/docs/react-typescript
export interface Props {
  person: { first: string; last: string };
  logo: { name: string; title: string; path: string };
}

type Fruit = {
  id: number;
  name: string;
};
function FruitListItem(props: { fruit: Fruit }) {
  return <li>{props.fruit.name}</li>;
}

function FruitList(props: { fruits: Fruit[] }) {
  const fruitListItems = props.fruits.map((fruit: Fruit) => (
    <FruitListItem key={fruit.id} fruit={fruit} />
    // <FruitListItem fruit={fruit} />
  ));
  return <ul>{fruitListItems}</ul>;
}

const constFruits: Fruit[] = [
  { id: 1, name: "apple" },
  { id: 2, name: "orange" },
  { id: 3, name: "blueberry" },
  { id: 4, name: "banana" },
  { id: 5, name: "kiwi" },
];

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
    </>
  );
  // return <>Hello, world!</>;
}

export default HelloWorld;
