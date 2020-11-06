import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { parseHTML } from 'k6/html';


export let options = {
  stages: [
    { duration: '30s', target: 800 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
    { duration: '2m', target: 800 }, // stay at 100 users for 10 minutes
    { duration: '30s', target: 0 }, // ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
    'logged in successfully': ['p(99)<1500'], // 99% of requests must complete below 1.5s
  },
};

const base="http://localhost/ta/m";

export default () => {
    const res = http.get(base);
    const doc = parseHTML(res.body);
    let c=0;
    console.log("\n\ntotal\n\n",c);
    doc.find("link").toArray().filter(x=>x.attr("href")).filter(i=>!i.attr("href").match(/\/ta\//)).forEach(function (item) {
	let nurl=item.attr("href").replace(/^\./,base);
	let r=http.get(nurl);
	if(r.timings.duration/1000>1)
        	console.log("link",nurl,String(r.timings.duration/1000),"seconds");

	c++;
        // make http gets for it
        // or added them to an array and make one batch request
     });

    doc.find("img").toArray().filter(x=>x.attr("src")).filter(i=>!i.attr("src").match(/\/ta\//)).forEach(function (item) {
	let nurl=item.attr("src").replace(/^\./,base);
	let r=http.get(nurl);
	if(r.timings.duration/1000>1)
        	console.log("img",nurl,String(r.timings.duration/1000),"seconds");
	c++;
    });
    doc.find("script").toArray().filter(x=>x.attr("src")).filter(i=>!i.attr("src").match(/\/ta\//))
		.forEach(function (item) {
			if(item.attr("src")){
				let nurl=item.attr("src").replace(/^\./,base);
				let r=http.get(nurl);
				if(r.timings.duration/1000>1)
        				console.log("script",nurl,String(r.timings.duration/1000),"seconds");
				c++;
			}
    });

    console.log("\n\ntotal\n\n",c);
    sleep(10+Math.random() * 10);
};

