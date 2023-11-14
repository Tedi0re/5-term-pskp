const http = require('http');
const xmldoc = require('xmldoc');

const PORT = 5000;

const filterNumber = function (value) {
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
        return numericValue;
    }
    return NaN;
};


const server = http.createServer(async (req, res) => {
    if(req.method === 'POST'){
        let body = '';
        req.on('data', (chunk)=>{
            body += chunk.toString();
        });

        await new Promise((resolve)=>{
            req.on('end', resolve);
        })

        body = new xmldoc.XmlDocument(body);
        let m_arr = body.childrenNamed("m");
        let x_arr = body.childrenNamed("x");
        let m_concat = "";
        let x_sum = 0;

        for (const mArrElement of m_arr) {
            m_concat += mArrElement.attr.value;
        }
        for (const xArrElement of x_arr) {
            x_sum +=parseInt(xArrElement.attr.value);
        }

        let answer = `` +
            `<response id=\"${Math.floor(Math.random()*100)}\" request = \"${body.attr.id}\">\n`+
            `\t<sum element = \"x\" result = \"${x_sum}\"/>\n`+
            `\t<concat element = \"m\" result = \"${m_concat}\"/>\n`+
            `</response>`;
        res.writeHead(200, {"Content-Type":"application/xml; charset=utf-8"});
        res.write(answer);
    } else {
        res.writeHead(405, {'Allow':'POST'});
    }
    res.end();
});

server.listen(PORT, "localhost", (err)=>{
    err ? console.log(err) : console.log(`http://localhost:${PORT}/`);
})
