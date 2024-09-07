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
  const [keyword, setKeyword] = useState<string>("");
  const [isVisibleReadItem, setVisiblityOfReadItem] = useState<boolean>(true);
  const [isVisibleGotItem, setVisiblityOfGotItem] = useState<boolean>(true);
  const setAndSaveItems = (items: WordListItem[]): void => {
    setItems(items);
    saveWordList(items);
  };
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
        <SearchBar
          isVisibleReadItem={isVisibleReadItem}
          isVisibleGotItem={isVisibleGotItem}
          setKeyword={setKeyword}
          setVisiblityOfReadItem={setVisiblityOfReadItem}
          setVisiblityOfGotItem={setVisiblityOfGotItem}
        />
        <WordListTable
          items={items}
          setItems={setAndSaveItems}
          keyword={keyword}
          isVisibleReadItem={isVisibleReadItem}
          isVisibleGotItem={isVisibleGotItem}
        />
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

type SearchBarProps = {
  isVisibleReadItem: boolean;
  isVisibleGotItem: boolean;
  setKeyword: (keyword: string) => void;
  setVisiblityOfGotItem: (visiblity: boolean) => void;
  setVisiblityOfReadItem: (visiblity: boolean) => void;
};
const SearchBar = (props: SearchBarProps) => {
  const onChangeKeyword = (v: string) => {
    props.setKeyword(v);
  };
  const onChangevisiblityOfGotItem = (v: boolean) => {
    props.setVisiblityOfGotItem(v);
  };
  const onChangevisiblityOfReadItem = (v: boolean) => {
    props.setVisiblityOfReadItem(v);
  };
  return (
    <div className="SearchBar">
      <div className="SearchInput">
        <div className="SearchText">
          <label>
            🔍
            <input
              type="text"
              placeholder="look up words"
              onChange={(e) => onChangeKeyword(e.target.value)}
            />
          </label>
        </div>
        <div className="SearchOptionList">
          <label>
            <input
              type="checkbox"
              onChange={(e) => onChangevisiblityOfGotItem(e.target.checked)}
              checked={props.isVisibleGotItem}
            />
            memorized
          </label>
          <label>
            <input
              type="checkbox"
              onChange={(e) => onChangevisiblityOfReadItem(e.target.checked)}
              checked={props.isVisibleReadItem}
            />
            clicked
          </label>
        </div>
      </div>
    </div>
  );
};

type WordListTableProps = {
  items: WordListItem[];
  keyword: string;
  isVisibleReadItem: boolean;
  isVisibleGotItem: boolean;
  setItems: (items: WordListItem[]) => void;
};

const getNewItems = (() => {
	let items = [];
	return (newItems?: WordListItem[], newItem?: WordListItem) => {
		if(newItems !== undefined) {
			items = ni;
			return items;
		}
		if(newItem !== undefined) {
			items = props.items.map((oldItem) => {
				const newKey = newItem.word + newItem.wordClass + newItem.level;
				const oldKey = oldItem.word + oldItem.wordClass + oldItem.level;
				if(newKey === oldKey) {
					return newItem;
				} else {
					return oldItem;
				}
			});
			return items;	
		}
		return items;
	};
})();
const WordListTable = (props: WordListTableProps) => {
  const setItem = (newItem: WordListItem) => {
    const newItems = props.items.map((oldItem) => {
      const newKey = newItem.word + newItem.wordClass + newItem.level;
      const oldKey = oldItem.word + oldItem.wordClass + oldItem.level;
      if (newKey === oldKey) {
        return newItem;
      } else {
        return oldItem;
      }
    });
    props.setItems(newItems);
  };
  const tbodyInner = props.items.map((item: WordListItem) => {
    let visible = true;
    if (!item.word.startsWith(props.keyword)) visible = false;
    if (!props.isVisibleReadItem && item.read) visible = false;
    if (!props.isVisibleGotItem && item.got) visible = false;
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
        visible={visible}
        setItem={setItem}
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

type WordListItemProps = WordListItem & {
  visible: boolean;
  setItem: (item: WordListItem) => void;
};

const WordListItemTableRecord = (props: WordListItemProps) => {
  if (!props.visible) {
    return <></>;
  }
  const onChangeItem = (item: WordListItem) => {
    props.setItem(item);
  };
  const onChangeReadStatus = (read: boolean) => {
    const newItem: WordListItem = { ...props };
    newItem.read = read;
    onChangeItem(newItem);
  };
  const onChangeGotStatus = (got: boolean) => {
    const newItem: WordListItem = { ...props };
    newItem.got = got;
    onChangeItem(newItem);
  };
  const onClickLink = () => {
    const newItem: WordListItem = { ...props };
    newItem.read = true;
    newItem.count++;
    onChangeItem(newItem);
  };
  return (
    <tr>
      <td>
        <a href={props.link} target="_blank" onClick={() => onClickLink()}>
          {props.word}
        </a>
      </td>
      <td className="WordListInteraction">
        <span className="CefrDecoration">{props.level}</span>
      </td>
      <td className="WordListInteraction">
        <input
          type="checkbox"
          checked={props.read}
          onChange={(e) => onChangeReadStatus(e.target.checked)}
        />
      </td>
      <td className="WordListInteraction">
        <input
          type="checkbox"
          checked={props.got}
          onChange={(e) => onChangeGotStatus(e.target.checked)}
        />
      </td>
      <td className="WordListInteraction">{props.count}</td>
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

const saveWordList = (newItems: WordListItem[]) => {
  localStorage.setItem("items", JSON.stringify(newItems));
};
