import dayjs from "dayjs";
import WebSocket from "ws";

class SocketService {
  constructor() {
    this.url = "wss://wspri.okx.com:8443/ws/v5/ipublic";
    this.options = {
      headers: {
        Upgrade: "websocket",
        Pragma: "no-cache",
        "Sec-WebSocket-Key": "4M28H3PbXXkF91c4SfmEYg==",
        "Sec-Fetch-Site": "cross-site",
        "Sec-WebSocket-Version": "13",
        "Sec-WebSocket-Extensions": "permessage-deflate",
        "Cache-Control": "no-cache",
        "Sec-Fetch-Mode": "websocket",
        Origin: "https://www.okx.com",
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
        Connection: "Upgrade",
        "Sec-Fetch-Dest": "websocket",
      },
    };

    this.ws = new WebSocket(this.url, this.options);
    this.price = 0;
    this.dataPrice = {
      time: dayjs().valueOf(),
      price: 0,
    };
    this.reConnectTime = dayjs();
  }

  getPriceBTC() {
    return new Promise((resolve, reject) => {
      const listDataPrices = [];
      let count = 0;
      const si = setInterval(() => {
        count++;
        // xử lý nếu giá BTC hoặc thời gian không thay đổi thì không push vào mảng listDataPrices
        if (
          listDataPrices.length === 0 ||
          listDataPrices.at(-1).time !== this.dataPrice.time
        ) {
          listDataPrices.push(this.dataPrice);
        }

        // nếu đã lấy được 98 giá thì dừng setInterval và trả về kết quả với mảng giá BTC đã lấy được
        if (count > 98) {
          clearInterval(si);
          const prices = listDataPrices.map((data) => data.price);
          const length = prices.length;
          // Tính hiệu giá giữa giá đầu tiên và giá cuối cùng trong mảng giá BTC
          const differrence = prices.at(-1) - prices[0];
          // status = 1: tăng, status = 0: giảm
          const status = differrence >= 0 ? 1 : 0;
          const rateOfChange = 0;
          const result = {
            prices,
            status,
            length,
            differrence,
            rateOfChange,
          };
          resolve(result);
        }
      }, 50);
    });
  }

  initSocket() {
    this.ws = new WebSocket(this.url, this.options);
    this.reConnectTime = dayjs();
    this.ws.on("open", () => {
      const subscribeMessage = JSON.stringify({
        op: "subscribe",
        args: [{ channel: "tickers", instId: "BTC-USDT" }],
      });
      this.ws.send(subscribeMessage);
    });

    // lắng nghe dữ liệu giá BTC từ server gửi về client qua socket
    this.ws.on("message", (data) => {
      const message = JSON.parse(data);
      if (message.data) {
        const tickerData = message.data[0];
        // giá BTC hiện tại lấy từ server
        const btcPrice = tickerData.last;
        // console.log(`${dayjs().valueOf()} - ${btcPrice}`);

        this.dataPrice = {
          time: dayjs().valueOf(),
          price: btcPrice,
        };
      }
    });
  }

  closeSocket() {
    const diffTime = dayjs().diff(this.reConnectTime);
    if (this.ws && diffTime > 120) {
      this.ws.close();
      this.dataPrice = {
        time: dayjs().valueOf(),
        price: 0,
      };

      console.log("WebSocket connection closed.");
    }
  }
}

export { SocketService };
