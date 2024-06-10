const dotenv = require("dotenv").config();
const { Client } = require("@notionhq/client");

// Init client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const database_id = process.env.NOTION_DATABASE_ID;

module.exports = async function getDatabases() {
  const payload = {
    path: `databases/${database_id}/query`,
    method: "POST",
  };
  const { results } = await notion.request(payload);

  const interviews = results.map((page) => {
    return {
      title: page.properties.이름.title[0].text.content,
      content: page.properties.내용.rich_text[0].plain_text,
    };
  });
  return interviews;
};
