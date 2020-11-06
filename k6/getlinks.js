import http from "k6/http";
import {parseHTML} from "k6/html";
import { check, group, sleep } from 'k6';

const base="http://localhost/ta/m";

export default function() {
    sleep (10);
    console.log("\n\ntotal\n\n");
    sleep (10);
    console.log("\n\ntotal\n\n");
    const res = http.get(base);
    const doc = parseHTML(res.body);
    let c=0;
    console.log("\n\ntotal\n\n",c);
    doc.find("link").toArray().filter(i=>!i.attr("href").match(/\/ta\//)).forEach(function (item) {
	let nurl=item.attr("href").replace(/^\./,base);
	let r=http.get(nurl);
        console.log("link",nurl);
	c++;
        // make http gets for it
        // or added them to an array and make one batch request
     });

    doc.find("img").toArray().filter(i=>!i.attr("src").match(/\/ta\//)).forEach(function (item) {
	let nurl=item.attr("src").replace(/^\./,base);
	let r=http.get(nurl);
        console.log("img",nurl);
	c++;
    });
    doc.find("script").toArray().filter(i=>!i.attr("src").match(/\/ta\//))
		.forEach(function (item) {
			if(item.attr("src")){
				let nurl=item.attr("src").replace(/^\./,base);
				console.log(nurl);
				let r=http.get(nurl);
        			console.log("script",nurl);
				c++;
			}
    });

    console.log("\n\ntotal\n\n",c);
    return;
}
