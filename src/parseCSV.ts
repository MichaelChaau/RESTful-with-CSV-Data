export function parseCSV(input: string) {
  // use promise for error handling
  return new Promise((resolve, reject) => {

    // split string into array by line
    const lines = input.split("\n");
    let parsedlines: string[][] = [];
    let result = "";

    // no data error
    if (lines.length < 2) return reject("Invalid data");

    // parse lines, goes over each line
    for (let i = 0; i < lines.length; i++) {
      const wordsArray = lines[i].split(`,`);
      parsedlines.push([]);

      // merge words because commas in the string of a single cell 
      let startingWord = false;
      let endingWord = false;
      let mergedWord = "";
      for (let wordIndex = 0; wordIndex < wordsArray.length; wordIndex++) {
        let word = wordsArray[wordIndex];

        // find starting word if string starts with a quote
        if (word.charAt(0) === '"' && word.charAt(word.length - 1) !== '"') {
          startingWord = true;
          word = word.replace('"', "");
        }

        // words after starting word
        if (startingWord && word.charAt(0) !== '"') {
          // try to find ending word
          if (word.charAt(word.length - 1) === '"') {
            word = word.replace('"', "");
            endingWord = true;
            // console.log(word);
          }
        }

        // add word that is not starting or ending word (ex. first name, middle name, last name)
        if (!startingWord && !endingWord) {
          parsedlines[i].push(word.replace('"', "").replace('"', ""));
        }

        // add merged word
        if (startingWord || endingWord) {
          if (!endingWord) {
            word = word + ",";
          }

          mergedWord += word;

          if (endingWord) {
            endingWord = false;
            startingWord = false;
            parsedlines[i].push(mergedWord);
            mergedWord = "";
          }
        }
      }
    }

    console.log(parsedlines);

    // construct result
    for (let i = 0; i < parsedlines.length; i++) {
      for (let j = 0; j < parsedlines[i].length; j++) {
        result += "[" + parsedlines[i][j] + "] ";
      }
      result += "\n";
    }

    //returns data in promise
    resolve(result);
  });
}