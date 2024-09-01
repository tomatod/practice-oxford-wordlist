import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { WordListItem } from "../type/type";

// Function starts here
async function getOriginData() {
  const response = await fetch(
    "https://www.oxfordlearnersdictionaries.com/wordlists/oxford3000-5000",
  );
  const body = await response.text();
  const $ = cheerio.load(body);
  const wordList: WordListItem[] = [];
  $(".top-g > li[data-ox3000]").map((_, el) => {
    const word = $(el).attr("data-hw") ?? "";
    const link = "https://www.oxfordlearnersdictionaries.com/" + $(el).find("a").attr("href") ?? "";
    const wordClass = $(el).find("span[class='pos']").text() ?? "";
    const level = $(el).attr("data-ox5000") ?? "";
    const wordListItem: WordListItem = {
      word: word,
      link: link,
      wordClass: wordClass,
      level: level,
      read: false,
      got: false,
      count: 0,
    };
    wordList.push(wordListItem);
  });
  const json: string = JSON.stringify(wordList);
  console.log(json);
}
getOriginData();
