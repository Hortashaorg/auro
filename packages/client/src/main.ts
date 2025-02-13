export class Client {
  private clientElements: Element[] = [];

  constructor() {
    // Get all elements in the document
    const allElements = document.querySelectorAll("*");

    // Filter elements that have at least one attribute starting with "client-"
    this.clientElements = [...allElements].filter((el) =>
      Array.from(el.attributes).some((attr) => attr.name.startsWith("client-"))
    );
  }

  log() {
    console.log(this.clientElements);
  }
}

const myClient = new Client();
myClient.log();
