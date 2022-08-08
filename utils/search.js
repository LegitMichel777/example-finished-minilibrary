import { getBooks } from "./database";

export function cutStringToSearchTokens(s) {
    if (s === null || s.length === 0) {
        return [];
    }
    // cut s into "search tokens. basically anything that's not a character or a number is taken as a space and everything separated by spaces is a search token.
    s = s.toLowerCase();
    let isImportantCharacter = (c) => { return c >= 'a' && c <= 'z' || c >= '0' && c <= '9' || c.charCodeAt(0) > 127 || c === '-' };
    let rturn = [];
    let tmp = "";
    for (let i = 0; i < s.length; i++) {
        if (isImportantCharacter(s[i])) {
            tmp += s[i];
        } else {
            if (tmp.length > 0) {
                rturn.push(tmp);
                tmp = "";
            }
        }
    }
    if (tmp.length > 0) {
        rturn.push(tmp);
    }
    return rturn;
}
export async function searchBooks(searchString) {
    let data = await getBooks();
    console.log(data);
    if (data === undefined) {
        return [];
    }
    let result = [];
    let searchTokens = cutStringToSearchTokens(searchString);
    // console.log(searchTokens);
    if (searchTokens.length !== 0) {
        for (let i=0;i<data.length;i++) {
            let currentTokens = [];
            currentTokens.push.apply(currentTokens, (cutStringToSearchTokens(data[i].isbn)));
            currentTokens.push.apply(currentTokens, (cutStringToSearchTokens(data[i].title)));
            currentTokens.push.apply(currentTokens, (cutStringToSearchTokens(data[i].author)));
            currentTokens.push.apply(currentTokens, (cutStringToSearchTokens(data[i].publisher)));
            currentTokens.push.apply(currentTokens, (cutStringToSearchTokens(data[i].borrowedUser)));
            
            // console.log(currentTokens);
            let match = true;
            for (let j=0;j<searchTokens.length;j++) {
                let thisTokenMatch = false;
                // does this search token match any of the entry tokens?
                for (let k=0;k<currentTokens.length;k++) {
                    if (searchTokens[j].length<=currentTokens[k].length) {
                        if (currentTokens[k].substr(0,searchTokens[j].length)===searchTokens[j]) {
                            thisTokenMatch=true;
                            break;
                        }
                    }
                }
                if (!thisTokenMatch) {
                    match=false;
                    break;
                }
            }
            if (match) {
                result.push(data[i]);
            }
        }
    } else if (searchString !== "") {
        result = data;
    }
    const limitItems=50;
    if (result.length>limitItems) {
        result=result.slice(0, limitItems);
    }
    return result;
}