const interviewEl = document.querySelector("#interviews");

const getDatabasesFromBackend = async () => {
  const res = await fetch("http://localhost:3000/interview");
  const data = await res.json();
  return data;
};

const addInterviewToDom = async () => {
  const interviews = await getDatabasesFromBackend();

  /*
  1개씩 보여주도록 수정 필요
  */
  interviews.forEach((interview) => {
    const div = document.createElement("div");
    div.claseName = "test";
    div.innerHTML = `
    <h3>${interview.title}</h3>
    `;
    interviewEl.appendChild(div);
  });
};

addInterviewToDom();
