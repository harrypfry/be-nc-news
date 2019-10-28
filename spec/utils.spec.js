const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns empty array when empty array is passed", () => {
    const inputArr = [];
    const actualResult = formatDates(inputArr);
    const expectedResult = [];
    expect(actualResult).to.deep.equal(expectedResult);
  });
  it("Doesn't mutate the original array", () => {
    const inputArr = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const inputArrCopy = [...inputArr];
    formatDates(inputArr);
    expect(inputArr).to.deep.equal(inputArrCopy);
  });
  it("returns correctly formatted array length one when array of length one is passed", () => {
    const inputArr = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const actualResult = formatDates(inputArr);
    const expectedResult = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(inputArr[0].created_at),
        votes: 100
      }
    ];
    expect(actualResult).to.deep.equal(expectedResult);
  });
  it("returns correctly formatted array length greater than one when array of length greater than one is passed", () => {
    const inputArr = [
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: 1416140514171
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: 1163852514171
      }
    ];
    const actualResult = formatDates(inputArr);
    const expectedResult = [
      {
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: new Date(1416140514171)
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: new Date(1289996514171)
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: new Date(1163852514171)
      }
    ];
    expect(actualResult).to.deep.equal(expectedResult);
  });
});

describe.only("makeRefObj", () => {
  it("returns empty object when empty array is passed", () => {
    const inputArr = [];
    const actualResult = makeRefObj(inputArr);
    const expectedResult = {};
    expect(actualResult).to.deep.equal(expectedResult);
  });
  it("returns object with one key-value pair when array of length one is passed", () => {
    const inputArr = [
      {
        article_id: 1,
        title: "Running a Node App",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        votes: 0,
        topic: "coding",
        author: "jessjelly"
      }
    ];
    const actualResult = makeRefObj(inputArr);
    const expectedResult = { 1: "Running a Node App" };
    expect(actualResult).to.deep.equal(expectedResult);
  });
  it("returns object with multiple key-value pairs when array of length greater than one is passed", () => {
    const inputArr = [
      {
        article_id: 1,
        title: "Running a Node App",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        votes: 0,
        topic: "coding",
        author: "jessjelly"
      },
      {
        article_id: 5,
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        body:
          "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.",
        votes: 0,
        topic: "coding",
        author: "jessjelly"
      },
      {
        article_id: 13,
        title: "22 Amazing open source React projects",
        body:
          "This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.",
        votes: 0,
        topic: "coding",
        author: "happyamy2016"
      }
    ];
    const actualResult = makeRefObj(inputArr);
    const expectedResult = {
      1: "Running a Node App",
      5: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
      13: "22 Amazing open source React projects"
    };
    expect(actualResult).to.deep.equal(expectedResult);
  });
  it("the input array should not be mutated", () => {
    const inputArr = [
      {
        article_id: 1,
        title: "Running a Node App",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        votes: 0,
        topic: "coding",
        author: "jessjelly"
      },
      {
        article_id: 5,
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        body:
          "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.",
        votes: 0,
        topic: "coding",
        author: "jessjelly"
      },
      {
        article_id: 13,
        title: "22 Amazing open source React projects",
        body:
          "This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.",
        votes: 0,
        topic: "coding",
        author: "happyamy2016"
      }
    ];
    const inputArrCopy = [...inputArr];
    makeRefObj(inputArr);
    expect(inputArrCopy).to.deep.equal(inputArr);
  });
});

describe("formatComments", () => {});
