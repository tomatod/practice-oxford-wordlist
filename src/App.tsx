import { useState, useEffect } from "react";
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
  const setAndSaveItems = (items: WordListItem[]) => {
    setItems(items);
    saveWordListItems(items);
  };
  return (
    <div className="AppContent">
      <div className="AppContentInner">
        <Description />
        <SearchBar />
        <WordListTable items={items} setItems={setAndSaveItems} />
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
  setItems: (items: WordListItem[]) => void;
};

const WordListTable = (props: WordListTableProps) => {
  const tbodyInner = props.items.map((item: WordListItem) => {
    const setItem = (item: WordListItem) => {
      const newItems = props.items.map((old) => {
        if (old.word + old.wordClass + old.level === item.word + item.wordClass + item.level) {
          return item;
        } else {
          return old;
        }
      });
      props.setItems(newItems);
    };
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
        setItem={setItem}
      />
    );
  });
  return (
    <div className="WordList">
      <table>
        <thead>
          <tr>
            <th>word</th>
            <th>level</th>
            <th>read</th>
            <th>got</th>
            <th>count</th>
          </tr>
        </thead>
        <tbody>{tbodyInner}</tbody>
      </table>
    </div>
  );
};

// TODO: use one in type.ts
type WordListItemProps = WordListItem & {
  setItem: (item: WordListItem) => void;
};

const WordListItemTableRecord = (props: WordListItemProps) => {
  const item = { ...props };
  const onChangeReadStatus = (read: boolean) => {
    item.read = read;
    props.setItem(item);
  };
  const onChangeGotStatus = (got: boolean) => {
    item.got = got;
    props.setItem(item);
  };
  const onClickLink = () => {
    item.read = true;
    item.count++;
    props.setItem(item);
  };
  return (
    <tr>
      <td>
        <a href={item.link} target="_blank" onClick={() => onClickLink()}>
          {props.word}
        </a>
      </td>
      <td>{item.level}</td>
      <td>
        <input
          type="checkbox"
          checked={item.read}
          onChange={(e) => onChangeReadStatus(e.target.checked)}
        />
      </td>
      <td>
        <input
          type="checkbox"
          checked={item.got}
          onChange={(e) => onChangeGotStatus(e.target.checked)}
        />
      </td>
      <td>{item.count}</td>
    </tr>
  );
};

/**
	Functions for getting and saving word list.
 **/
const getWordListItemsAsnc = async (): Promise<WordListItem[]> => {
  const rawItems = localStorage.getItem("items");
  if (rawItems === null) return getOriginWordListItemsAsnc();
  return JSON.parse(rawItems);
};

const getOriginWordListItemsAsnc = async (): Promise<WordListItem[]> => {
  console.log("try to get clean data.");
  const url = "/origin.json";
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

const saveWordListItems = (items: WordListItem[]) => {
  localStorage.setItem("items", JSON.stringify(items));
};
