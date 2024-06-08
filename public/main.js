const interviewEl = document.querySelector("#interviews");
const div = document.getElementById("data-display");

// JSON 데이터를 불러오기
async function getDatabasesFromBackend() {
  const res = await fetch("http://localhost:3000/interviews");
  const data = await res.json();
  return data;
}

// 데이터를 하나씩 보여줄 인덱스를 저장하는 변수
let currentIndex = 0;
let jsonData = [];

// 다음 클릭 이벤트 핸들러
document.getElementById("next-btn").addEventListener("click", () => {
  if (currentIndex < jsonData.length) {
    displayQuestion(jsonData[currentIndex]);
    currentIndex++;
  } else {
    alert("No more items to display");
  }
});

// 답안 클릭 이벤트 핸들러
document.getElementById("answer-btn").addEventListener("click", () => {
  currentIndex--;
  displayAnswer(jsonData[currentIndex]);
  currentIndex++;
});

function displayAnswer(data) {
  div.innerHTML = `
    ${JSON.stringify(data.content)}
    `;
}

// 데이터를 화면에 표시하는 함수
function displayQuestion(data) {
  div.innerHTML = `
    ${JSON.stringify(data.title)}
    `;
}

window.onload = async () => {
  jsonData = await getDatabasesFromBackend();
};
