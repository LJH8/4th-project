let book = [];
let url;
let page = 1;
let total_Page = 0;
const callAPI = async () => {
  url = new URL(
    `https://dapi.kakao.com/v3/search/book?target=title&query="자바스크립트"&size=3`
  );

  books();
};

const books = async () => {
  try {
    let header = new Headers({
      Authorization: "KakaoAK 3c757594484166c54d05924919ba3377",
    });
    url.searchParams.set("page", page);
    let response = await fetch(url, { headers: header });
    if (response.status == 200) {
      let data = await response.json();
      if (data.meta.total_count == 0) {
        throw new Error(errorRender());
      }
      book = data.documents;
      total_count = data.meta.total_count;
      Render();
      pageRender();
    } else {
      throw new Error(response.status);
    }
  } catch (error) {
    console.log("에러", error.message);
  }
};

callAPI();

const Render = () => {
  let RenderHTML = "";
  RenderHTML = book
    .map((item) => {
      return `
        <div class="col-4 book-data">
        <a href="${item.url}" target="_blank">
              <div class="book-content">
                <img src="${
                  item.thumbnail || "다운로드.png"
                }" alt="" class="book-thumbnail">             
                  <h2>${
                    item.title.length > 10
                      ? item.title.substr(0, 10) + "..."
                      : item.title
                  }</h2>
                  <div><strong>${item.authors}</strong></div>              
                <div class="status">${
                  item.status == "" ? (item.status = "판매중지") : item.status
                }</div>
                <span><strong>판매가: ${item.sale_price}원</strong></span>
                <p>${
                  item.contents.length == 0
                    ? (item.contents = "내용 없음")
                    : item.contents.length > 200
                    ? item.contents.substr(0, 200) + "..."
                    : item.contents
                }</p>
              </div>
              </a>
            </div>
            `;
    })
    .join("");

  document.getElementById("show-line").innerHTML = RenderHTML;
};

const search_button = async () => {
  let inputData = document.getElementById("search-book").value;
  url = new URL(
    `https://dapi.kakao.com/v3/search/book?target=title&query="${inputData}"&size=3`
  );

  books();

  page = 1;
};

const enterkey = () => {
  if(window.event.keyCode  == 13)
  {
    search_button()
  }
}

const pageRender = () => {
  let pageHTML = "";
  let page_Group = Math.ceil(page / 5);
  total_Page = Math.ceil(total_count / 3);
  let last_Page = page_Group * 5;
  if (last_Page > total_Page) {
    last_Page = total_Page;
  }

  let first_Page = last_Page - 4 <= 0 ? 1 : last_Page - 4;

  if (page != 1) {
    pageHTML += `<a href="#" onclick="selectPage(${page - 1})">&laquo;</a>`;
  }
  for (let i = first_Page; i <= last_Page; i++) {
    pageHTML += `<a href="#" class="${
      i == page ? "active" : ""
    }" onclick="selectPage(${i})">${i}</a>`;
  }
  if (page != total_Page) {
    pageHTML += `<a href="#" onclick="selectPage(${page + 1})">&raquo;</a>`;
  }
  document.getElementById("pagination").innerHTML = pageHTML;
};

const selectPage = (num) => {
  page = num;

  books();
};

const errorRender = () => {
  let errorHTML = `<div class="no-search">검색 결과가 없습니다.</div>`;
  document.getElementById("show-line").innerHTML = errorHTML;
};
