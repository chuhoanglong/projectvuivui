const url = `https://www.okx.com/priapi/v1/affiliate/game/racer/assess?t=${new Date().getTime()}`;
const headers = {
  Host: "www.okx.com",
  "X-Utc": "7",
  Referer: "https://www.okx.com/mini-app/racer",
  "User-Agent":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  "X-Telegram-Init-Data":
    "query_id=AAG0mu57AgAAALSa7nu1yMi_&user=%7B%22id%22%3A6374202036%2C%22first_name%22%3A%22Ho%C3%A0ng%22%2C%22last_name%22%3A%22Long%22%2C%22language_code%22%3A%22vi%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1728233363&hash=01d95a51c3d4e35ebde14281c928c4f89c4bef58ca0cfbb314cda30fdfe61bfe",
  "X-Site-Info":
    "==QfxojI5RXa05WZiwiIMFkQPx0Rfh1SPJiOiUGZvNmIsIiTWJiOi42bpdWZyJye",
  "X-Cdn": "https://www.okx.com",
  Origin: "https://www.okx.com",
  "Sec-Fetch-Dest": "empty",
  "App-Type": "web",
  "Sec-Fetch-Site": "same-origin",
  "Content-Length": "13",
  "X-Zkdex-Env": "0",
  "X-Id-Group": "2131075014439510005-c-28",
  "X-Locale": "en_US",
  "Accept-Language": "vi-VN,vi;q=0.9",
  Devid: "aaf97b40-9882-40d5-a1e5-56cd588f1cf5",
  Accept: "application/json",
  "Content-Type": "application/json",
  "Accept-Encoding": "gzip, deflate, br",
  "Sec-Fetch-Mode": "cors",
  Cookie:
    "__cf_bm=WkWnyNwZ1m6GUVyfu66p3A6OliNSMRZWSFhWViO3zow-1727604804-1.0.1.1-9_hL8hprWbGoOsFUpvw_SXk5B1osvj4MbFspirmZwvaspNY_E0zc__ATNT.elSMODvt4zdY.eXseOxPa63pqAA",
};

// Hàm thực hiện POST request tới API
async function postToOKXApi({ predict = 1 }) {
  const body = JSON.stringify({
    predict,
  });
  try {
    const currentTime = new Date().getTime();
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });
    const timeAfterRequest = new Date().getTime();
    console.log("Time after request:", timeAfterRequest - currentTime, "ms");

    if (!response.ok) {
      console.error(`HTTP error! status: ${response}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.code !== 0) {
      console.error("detailMsg:", data.detailMsg);
      console.error("error_message:", data.error_message);
      console.error("error_message:", data.error_message);
      return null;
    }
    console.log("Response prevPrice:", parseFloat(data.data.prevPrice));
    console.log("Response currentPrice:", parseFloat(data.data.currentPrice));
    console.log("Response changeRate:", parseFloat(data.data.changeRate));
    console.log("Response won:", data.data.won);
    console.log("Response numChance:", data.data.numChance.toString());
    console.log("Response curCombo:", data.data.curCombo);
    console.log("Response multiplier:", data.data.multiplier);
    console.log("\n====================================\n");
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export { postToOKXApi };
