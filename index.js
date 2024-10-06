import express from "express";
import moment from "moment";
import { SocketService } from "./socketService.js";
import { postToOKXApi } from "./postToOKXApi.js";

const app = express();
const port = 3000;
const TIME_DELAY = 30;

// Hàm chạy chính
async function main() {
  const socketService = new SocketService();
  socketService.initSocket();
  while (true) {
    // Lấy giá BTC từ socket
    const btcData = await socketService.getPriceBTC();
    console.log("BTC Data:", btcData);
    const response = await postToOKXApi({ predict: btcData.status });

    if (response?.code === 0) {
      if (response.data.numChance === 0) {
        console.log("Hết số lần thử, tạm dừng", TIME_DELAY, "phút");

        socketService.closeSocket();

        const currentTime = new Date().getTime();
        let timeAgoOld = "";
        const mytime = setInterval(() => {
          const timeAgo = moment(currentTime).fromNow();
          if (timeAgoOld !== timeAgo) {
            console.log("Time Waiting:", moment(currentTime).fromNow());
            timeAgoOld = timeAgo;
          }
        }, 1000);
        await new Promise((resolve) => {
          setTimeout(() => {
            clearInterval(mytime);
            resolve(true);
            socketService.initSocket();
            console.log("Đã kết nối lại socket");
          }, TIME_DELAY * 60000);
        });
      }
    } else {
      console.error("Lỗi khi postToOKXApi");
    }

    await new Promise((resolve) => setTimeout(resolve, 4000));
  }
}

app.get("/", (req, res) => {
  res.send("Hello from Node.js on Firebase!");
});

app.listen(port, async () => {
  main();
  console.log(`Server listening on port ${port}`);
});
