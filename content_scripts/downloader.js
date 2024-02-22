(() => {


    if (window.hasRun) {
        return;
    }
    window.hasRun = true;


    function downloadFile(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename + ".txt");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    function genScript(fileName, idxScript){
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(idxScript));
        element.setAttribute('download', fileName + ".js");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    
    // Data templated to file
    // Downloader + idxScript called 
    function useTemplate(title, authors, pDate, tDate, paras, publisher) {
        var tags = prompt('Please enter tags, format: [ "tag1", "tag2", ... ] ', '["untagged"]');
        var notes = prompt('Please enter notes/comments/etc. DO NOT USE QUOTATION MARKS', "");
        var textBlob = `Title:\n${title}` + `\n\nPublisher:\n${publisher}` + `\n\nAuthors:\n${JSON.stringify(authors)}` + `\n\nDate Published:\n${pDate}` + `\nDate Added:\n${tDate}\n\nArticle Text:\n`;
        paras.forEach(p => {
            textBlob += p.innerText + '\n\n';
        })
        
        const artIdx = `{ "title": "${title}.txt", "publisher": "${publisher}", "authors": ${JSON.stringify(authors)}, "dates": { "published": "${pDate}", "added":"${tDate}"}, "notes": "${notes}", "keywords": ${tags}}`
        const idxScript = `const sendIdx = async () => { const response = await fetch("http://localhost:4000/news/article", { method: "POST", body: JSON.stringify(${artIdx}), headers: { "Content-type": "application/json; charset=UTF-8"}});if(!response.ok){ console.log("Didn't post"); }else { console.log('Posted') }; } \nsendIdx();`;
        const fileName = new Date().toJSON().slice(0, 19);

        downloadFile(title, textBlob);
        genScript(fileName, idxScript);
    }

    // txt file formating --FIXME
    function useHuffTemplate(title, authors, pDate, tDate, paras, publisher) {
        var textBlob = `Title:\n${title}` + `\n\nPublisher:\n${publisher}` + `\n\nAuthors:\n${JSON.stringify(authors)}` + `\n\nDate Published:\n${pDate}` + `\nDate Added:\n${tDate}\n\nArticle Text:\n`;
        paras.forEach(p => {
            textBlob += p.innerText + '\n\n';
        })
        textBlob += `\n\n\nTitle: ${title}` + `\nPublisher: ${publisher}` + `\nAuthors: ${JSON.stringify(authors)}` + `\nDate Published: ${pDate}` + `\nDate Added: ${tDate}` + `\nNotes:\nKeywords:`;
        console.log(textBlob)
    }


    // NYT (dec 2023)
    function nytParser() {
        const title = document.querySelector("meta[property='og:title']").getAttribute("content");
        var authors = []
        document.querySelectorAll("span[itemprop='name']").forEach(author => {
            authors.push(author.textContent)
        });
        const pDate = document.querySelector("meta[property='article:published_time']").getAttribute("content").slice(0, 10);
        const tDate = new Date().toJSON().slice(0, 10)
        const paras = document.querySelectorAll("p.evys1bk0")
        publisher = "New York Times"
        useTemplate(title, authors, pDate, tDate, paras, publisher);
    }


    //Washington Post (dec 2023)
    function washingtonPostParser() {
        const title = document.querySelector("meta[property='og:title']").getAttribute("content");
        var authors = []
        document.querySelectorAll("a[rel='author']").forEach(author => {
            authors.push(author.textContent)
        });
        const pDate = document.querySelector("meta[property='article:published_time']").getAttribute("content").slice(0, 10);
        const tDate = new Date().toJSON().slice(0, 10)
        const paras = document.querySelectorAll("div.article-body")
        publisher = "Washington Post"
        useTemplate(title, authors, pDate, tDate, paras, publisher);
    }


    // New Yorker (dec 2023)
    function nyerParser() {
        const title = document.querySelector("meta[property='og:title']").getAttribute("content");
        var authors = []
        document.querySelectorAll("a.byline__name-link").forEach(author => {
            authors.push(author.textContent)
        });
        const pDate = document.querySelector("meta[property='article:published_time']").getAttribute("content").slice(0, 10);
        const tDate = new Date().toJSON().slice(0, 10)
        const paras = document.querySelectorAll("div.body__inner-container > p");
        publisher = 'New Yorker';
        useTemplate(title, authors, pDate, tDate, paras, publisher);
    }


    // Financial Times (dec 2023)
    function financialTimesParser() {
        const title = document.querySelector("meta[property='og:title']").getAttribute("content");
        var authors = [];
        document.querySelectorAll("a[data-trackable='author']").forEach(author => {
            authors.push(author.textContent);
        });
        const pDate = document.querySelector("meta[property='article:published_time']").getAttribute("content").slice(0, 10);
        const tDate = new Date().toJSON().slice(0, 10);
        paras = document.querySelectorAll("article.n-content-body > p");
        publisher = 'Financial Times'
        useTemplate(title, authors, pDate, tDate, paras, publisher);
    }


    // Atlantic (dec 2023)
    // p tags don't work with legacy html?  --check
    function atlanticParser() {
        const title = document.querySelector("meta[property='og:title']").getAttribute("content");
        var authors = [];
        document.querySelectorAll("a[data-event-element='author']").forEach(author => {
            authors.push(author.textContent);
        });
        const pDate = document.querySelector("meta[property='article:published_time']").getAttribute("content").slice(0, 10);
        const tDate = new Date().toJSON().slice(0, 10);
        paras = document.querySelectorAll("section[data-event-module='article body'] > p");
        publisher = 'Atlantic'
        useTemplate(title, authors, pDate, tDate, paras, publisher);
    }


    // Politico (dec 2023)
    function politicoParser() {
        const title = document.querySelector("meta[property='og:title']").getAttribute("content");
        var authors = [];
        document.querySelectorAll("p.story-meta__authors > span > a").forEach(author => {
            authors.push(author.textContent);
        });
        const pDate = document.querySelector("p.story-meta__timestamp > time").getAttribute('datetime').slice(0, 10);
        const tDate = new Date().toJSON().slice(0, 10);
        paras = document.querySelectorAll("p.story-text__paragraph");
        publisher = 'Politico'
        useTemplate(title, authors, pDate, tDate, paras, publisher);
    }


    // Mother Jones (dec 2023)
    function motherJonesParser() {
        const title = document.querySelector("meta[property='og:title']").getAttribute("content");
        var authors = [];
        var aEls = document.querySelectorAll('span.byline > a[rel="author"]');
        aEls.forEach(author => {
            authors.push(author.innerText);
        });
        const pDate = document.querySelector("meta[property='article:published']").getAttribute("content").slice(0, 10);
        const tDate = new Date().toJSON().slice(0, 10);
        paras = document.querySelectorAll("div[id='fullwidth-body'] > p");
        publisher = 'Mother Jones';
        useTemplate(title, authors, pDate, tDate, paras, publisher);
    }


    // Tablet (jan 2024)
    function tabletParser() {
        const title = document.querySelector("meta[property='og:title']").getAttribute("content");
        var authors = [];
        const pDate = document.querySelector("meta[property='article:published_time']").getAttribute("content").slice(0, 10);
        const tDate = new Date().toJSON().slice(0, 10);
        paras = document.getElementsByClassName("BlockContent");
        publisher = 'Tablet'
        var textBlob = `Title:\n${title}` + `\n\nPublisher:\n${publisher}` + `\n\nAuthors:\n${JSON.stringify(authors)}` + `\n\nDate Published:\n${pDate}` + `\nDate Added:\n${tDate}\n\nArticle Text:\n`;
        for (const child of paras) {
            textBlob += child.innerText + '\n\n';
        }
        textBlob += `\n\n\nTitle: ${title}` + `\nPublisher: ${publisher}` + `\nAuthors: ${JSON.stringify(authors)}` + `\nDate Published: ${pDate}` + `\nDate Added: ${tDate}` + `\nNotes:\nKeywords:`
        alert('Add authors.')
        downloadFile(title, textBlob)
    }


    // Huffpost (jan 2024)
    // single author
    // doesnt work, use console.log in template function instead
    function huffpostParser() {
        msg = "doesnt work, use console.log in template function";
        alert('?');
        const title = document.querySelector("meta[property='og:title']").getAttribute("content");
        var authors = [];
        authors.push(document.querySelector("div.entry__byline__author > a > span").innerText);
        // console.log(authors)
        // aEls.forEach(author => {
        //     authors.push(author.innerText);
        // });
        const pDate = document.querySelector("meta[property='article:published_time']").getAttribute("content").slice(0, 10);
        const tDate = new Date().toJSON().slice(0, 10);
        paras = document.querySelectorAll("div.primary-cli > p");
        // paras.forEach(p => {
        //     console.log(p.innerText);
        // })
        publisher = 'Huffpost';
        useHuffTemplate(title, authors, pDate, tDate, paras, publisher);
    }



    //MIDDLE EAST

    // New Line Mag (jan 2024)
    function newLineMagParser() {
        const title = document.querySelector("meta[property='og:title']").getAttribute("content");
        var authors = [];
        var aEls = document.querySelectorAll("a[rel='author']");
        var aPic = true;
        aEls.forEach(author => {
            if (!aPic) {
                authors.push(author.innerText);
            }
            aPic = !aPic;
        });
        const pDate = document.querySelector("meta[property='article:published_time']").getAttribute("content").slice(0, 10);
        const tDate = new Date().toJSON().slice(0, 10);
        paras = document.querySelectorAll('div.content > p')
        publisher = 'New Lines Magazine';
        useTemplate(title, authors, pDate, tDate, paras, publisher);
    }


    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "download") {
            switch (message.siteName) {
                case "NYT":
                    nytParser();
                    break;
                case "WashPost":
                    washingtonPostParser();
                    break;
                case "NYer":
                    nyerParser();
                    break;
                case "FinT":
                    financialTimesParser();
                    break;
                case "Atlantic":
                    atlanticParser();
                    break;
                case "Politico":
                    politicoParser();
                    break;
                case "Tablet":
                    tabletParser();
                    break;
                case "MotherJ":
                    motherJonesParser();
                    break;
                case "Huffpost":
                    huffpostParser();
                    break;
                case "NLsMag":
                    newLineMagParser();
                    break;
                default:
                    alert('Error, site not included')
            }
        } else {
            //error!  --FIXME
        }
    });
})();
