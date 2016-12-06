var fs = require('fs');
var obj;
fs.readFile('public/demo.json', 'utf-8', function (err, data) {
 //console.log(data);
  data = JSON.parse(data);
	var base = data["Hoja1"].map(function(a) {console.log(a.detalle_oficina);return (a.detalle_oficina);});
	 console.log(base);

	 base.sort();

    var current = null;
    var cnt = 0;
    for (var i = 0; i < base.length; i++) {
        if (base[i] != current) {
            if (cnt > 10) {
                console.log(current + ' comes --> ' + cnt + ' times<br>');
            }
            current = base[i];
            cnt = 1;
        } else {
            cnt++;
        }
    }
    if (cnt > 10) {
        console.log(current + ' comes --> ' + cnt + ' times');
    }


});
	   
  