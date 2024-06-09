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

// 질문 듣기 이벤트 핸들러
document.getElementById("ask-btn").addEventListener("click", () => {
  askQuestion();
});

// 질문듣기(TTS)
function askQuestion(jsonData) {
  var data = {
    voice: { languageCode: "ko-KR" },
    input: {
      text: "안녕하세요", // 말하는지 테스트중입니다
    },
    audioConfig: {
      audioEncoding: "mp3",
    },
  };

  //fetch로 바꿔볼까
  $.ajax({
    type: "POST",
    url: "https://texttospeech.googleapis.com/v1/text:synthesize?key=발급받은_구글_API_KEY",
    data: JSON.stringify(data),
    contentType: "application/json;charset-UTF-8",
    success: function (res) {
      var audioFile = new Audio();
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

window.onload = async () => {
  jsonData = await getDatabasesFromBackend();
};
