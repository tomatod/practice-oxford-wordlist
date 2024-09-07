import { useState, useEffect } from "react";
import { MarkGithubIcon } from "@primer/octicons-react";
import "./App.css";
import { WordListItem } from "../type/type";

/**
	React App
 **/
const App = () => {
  return (
    <>
      <AppHeader />
      <AppContent />
    </>
  );
};
export default App;

const AppHeader = () => {
  return (
    <div className="AppHeader">
      <div className="AppHeaderInner">
        <div className="AppHeaderPageTitle">
          <span>Practice Oxford Wordlist</span>
        </div>
        <div className="AppHeaderMenu">
          <a
            href="https://github.com/tomatod/practice-oxford-wordlist"
            target="_blank"
          >
            <MarkGithubIcon size={24} />
          </a>
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  const [items, setItems] = useState<WordListItem[]>([]);
  useEffect(() => {
    const f = async () => {
      const is: WordListItem[] = await getWordListItemsAsnc();
      setItems(is);
    };
    f();
  }, []);
  return (
    <div className="AppContent">
      <div className="AppContentInner">
        <Description />
        <SearchBar />
        <WordListTable items={items} />
      </div>
    </div>
  );
};

const Description = () => {
  return (
    <div>
      <span>
        This is a web page for learning English vocabularies with Oxford English
        contents, especially Oxford Wordlist. Oxford Wordlist is one of the most
        famous English word list that includes the most frequently used English
        words and you can it on{" "}
        <a href="https://www.oxfordlearnersdictionaries.com/wordlists/oxford3000-5000">
          Oxford Learner's Dictionaries
        </a>
        . You can memorize your learning history of Oxford English contents with
        this web page.
      </span>
    </div>
  );
};

const SearchBar = () => {
  return <div></div>;
};

type WordListTableProps = {
  items: WordListItem[];
};

const WordListTable = (props: WordListTableProps) => {
  const tbodyInner = props.items.map((item: WordListItem) => {
    return (
      <WordListItemTableRecord
        key={item.word + item.wordClass + item.level}
        word={item.word}
        link={item.link}
        wordClass={item.wordClass}
        level={item.level}
        read={item.read}
        got={item.got}
        count={item.count}
      />
    );
  });
  return (
    <div className="WordList">
      <table>
        <thead>
          <tr>
            <th></th>
            <th className="WordListInteraction"></th>
            <th className="WordListInteraction">🖱</th>
            <th className="WordListInteraction">✅</th>
            <th className="WordListInteraction">👀</th>
          </tr>
        </thead>
        <tbody>{tbodyInner}</tbody>
      </table>
    </div>
  );
};

// TODO: use one in type.ts
type WordListItemProps = WordListItem;

const WordListItemTableRecord = (props: WordListItemProps) => {
  const [item, setItem] = useState<WordListItem>({ ...props });
  const onChangeItem = (item: WordListItem) => {
    setItem(item);
    saveDiffOfWordList(item);
  };
  const onChangeReadStatus = (read: boolean) => {
    const newItem = { ...item };
    newItem.read = read;
    onChangeItem(newItem);
  };
  const onChangeGotStatus = (got: boolean) => {
    const newItem = { ...item };
    newItem.got = got;
    onChangeItem(newItem);
  };
  const onClickLink = () => {
    const newItem = { ...item };
    newItem.read = true;
    newItem.count++;
    onChangeItem(newItem);
  };
  return (
    <tr>
      <td>
        <a href={item.link} target="_blank" onClick={() => onClickLink()}>
          {props.word}
        </a>
      </td>
      <td className="WordListInteraction">
        <span className="CefrDecoration">{item.level}</span>
      </td>
      <td className="WordListInteraction">
        <input
          type="checkbox"
          checked={item.read}
          onChange={(e) => onChangeReadStatus(e.target.checked)}
        />
      </td>
      <td className="WordListInteraction">
        <input
          type="checkbox"
          checked={item.got}
          onChange={(e) => onChangeGotStatus(e.target.checked)}
        />
      </td>
      <td className="WordListInteraction">{item.count}</td>
    </tr>
  );
};

/**
	Functions for getting and saving word list.
 **/
const getWordListItemsAsnc = async (): Promise<WordListItem[]> => {
  const itemsRaw: string | null = localStorage.getItem("items");
  if (itemsRaw === null) {
    const items = await getOriginWordListItemsAsnc();
    localStorage.setItem("items", JSON.stringify(items));
    return items;
  }
  return JSON.parse(itemsRaw);
};

const getOriginWordListItemsAsnc = async (): Promise<WordListItem[]> => {
  console.log("try to get clean data.");
  const url = "origin.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log(response);
      throw new Error(`Failed to get original word list data.`);
    }
    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(error.message);
    }
    return [];
  }
};

const saveDiffOfWordList = (newItem: WordListItem) => {
  const items = JSON.parse(localStorage.getItem("items") ?? "");
  const newItems = items.map((oldItem: WordListItem) => {
    if (
      oldItem.word === newItem.word &&
      oldItem.wordClass === newItem.wordClass &&
      oldItem.level === newItem.level
    ) {
      return newItem;
    } else {
      return oldItem;
    }
  });
  localStorage.setItem("items", JSON.stringify(newItems));
};
