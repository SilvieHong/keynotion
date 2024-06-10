const interviewEl = document.querySelector("#interviews");
const div = document.getElementById("data-display");
const askBtn = document.getElementById("ask-btn");
const answerBtn = document.getElementById("answer-btn");
const nextBtn = document.getElementById("next-btn");
const backBtn = document.getElementById("back-btn");

// JSON 데이터를 불러오기
async function getDatabasesFromBackend() {
  const res = await fetch("http://localhost:3000/interviews");
  const data = await res.json();
  return data;
}
let currentIndex = 0;
let jsonData = [];

// 처음 진입
function initQuestion() {
  getQuestion();
  $("#idx").show();
}

// 다음 클릭 이벤트 핸들러
nextBtn.addEventListener("click", () => {
  getQuestion();
});

// 답안 클릭 이벤트 핸들러
answerBtn.addEventListener("click", () => {
  currentIndex--;
  displayAnswer(jsonData[currentIndex]);
  currentIndex++;
  addBackButton();
});

// 질문 듣기 이벤트 핸들러
askBtn.addEventListener("click", () => {
  askQuestion(jsonData[currentIndex - 1]);
});

// 답안 -> 질문 이벤트 핸들러
backBtn.addEventListener("click", () => {
  currentIndex--;
  getQuestion();
});

// 질문 가져오는 함수
function getQuestion() {
  getIndex();
  showAllButton();
  if (currentIndex < jsonData.length) {
    displayQuestion(jsonData[currentIndex]);
    currentIndex++;
  } else {
    currentIndex = 0;
    initQuestion();
    alert("끝났습니다. 처음으로 돌아갑니다");
  }
}

// 질문듣기(TTS)
function askQuestion(question) {
  var data = {
    voice: { languageCode: "ko-KR" },
    input: {
      text: question.title,
    },
    audioConfig: {
      audioEncoding: "mp3",
    },
  };

  $.ajax({
    type: "POST",
    url: "https://texttospeech.googleapis.com/v1/text:synthesize?key=구글API키",
    data: JSON.stringify(data),
    contentType: "application/json;charset-UTF-8",
    success: function (res) {
      const audioFile = new Audio();
      let audioBlob = base64ToBlob(res.audioContent, "mp3");
      audioFile.src = window.URL.createObjectURL(audioBlob);
      audioFile.playbackRate = 1; //재생속도
      audioFile.play();
    },
    error: function (request, status, error) {
      console.log(request);
      console.log(status);
      console.log(error);
    },
  });
}

function base64ToBlob(base64, fileType) {
  let typeHeader = "data:application/" + fileType + ";base64,";
  let audioSrc = typeHeader + base64;
  let arr = audioSrc.split(",");
  let array = arr[0].match(/:(.*?);/);
  let mime = (array && array.length > 1 ? array[1] : type) || type;
  let bytes = window.atob(arr[1]);
  let ab = new ArrayBuffer(bytes.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], {
    type: mime,
  });
}

// 질문 인덱스 표시하는 함수
function getIndex() {
  $("#idx").text(currentIndex + 1 + " / " + jsonData.length);
}

// 답안을 화면에 표시하는 함수
function displayAnswer(data) {
  div.innerHTML = `
    ${JSON.stringify(data.content)}
    `;
}

// 질문을 화면에 표시하는 함수
function displayQuestion(data) {
  div.innerHTML = `
    ${JSON.stringify(data.title)}
    `;
}

// 모든 버튼 보여주기
function showAllButton() {
  $("#next-btn").show();
  $("#ask-btn").show();
  $("#answer-btn").show();
  $("#back-btn").hide();
}

// 질문버튼 보이기
function addBackButton() {
  $("#ask-btn").hide();
  $("#answer-btn").hide();
  $("#back-btn").show();
}
window.onload = async () => {
  jsonData = await getDatabasesFromBackend();
};
