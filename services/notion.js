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
    console.log(page.properties);
    return {
      id: page.id,
      title: page.properties.이름?.title[0].text.content,
      status: page.properties.태그.status.name,
      // 답안 가져오는 코드 필요
    };
  });
  return interviews;
};
