const navHTML = `
<nav>
    <ul>
        <li><a href="index.html">ホーム</a></li>
        <li><a href="introduction.html">自己紹介</a></li>
        <li><a href="works.html">作品</a></li>
    </ul>
</nav>
`;

const videoNames = ["足を拝借.mp4"];

function prime_factorize(num) {
    factor = {};
    divisor = 2;
    while(num > 1){
        if(num % divisor == 0){
            factor[divisor] = (factor[divisor] || 0) + 1;
            num /= divisor;
        }else{
            divisor++;
        }
        if(divisor * divisor > num) break;
    }
    if(num > 1) factor[num] = (factor[num] || 0) + 1;
    texts = [];
    upper = "⁰¹²³⁴⁵⁶⁷⁸⁹";
    for (const [prime, power] of Object.entries(factor)) {
        text = `${prime}`;
        if(power > 1){
            p = power;
            power_text = "";
            while(p > 0){
                power_text += upper[Math.floor(p % 10)];
                p = Math.floor(p / 10);
            }
            power_text = power_text.split("").reverse().join("");
            text += power_text;
        }
        texts.push(text);
    }
    return texts.join("×");
}

function getYYYYMMDD() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

function todays_factor(){
    var yyyymmdd = getYYYYMMDD();
    var prime_factor = prime_factorize(parseInt(yyyymmdd));
    if(yyyymmdd == prime_factor){
        return `${yyyymmdd}は素数です！`;
    }else{
        return `${yyyymmdd} = ${prime_factor}`;
    }
}

function copy_todays_factor(){
    const message_element = document.getElementById('copy_message');
    if(!navigator.clipboard){
        message_element.innerText = "Copy unavailable";
        return;
    }

    navigator.clipboard.writeText(todays_factor()).then(function(){
        message_element.innerText = "Copied!";
    }, function(){
        message_element.innerText = "Copy failed";
    });
}

window.onload = function() {
    document.getElementById('nav-container').innerHTML = navHTML;

    for(let i=0; i<videoNames.length; i++){
        var element = document.getElementById(`video${i}`);
        if(element == null){
            continue;
        }
        element.innerHTML += `
        <video width="640" height="360" controls>
            <source src="${videoNames[i]}" type="video/mp4">
        </video>
        `;
    }

    setInterval(function(){
        var element = document.getElementById('time');
        if(element != null){
            element.innerText = new Date().toLocaleString({"hour12": false});
        }
    }, 0);

    setInterval(function(){
        var element = document.getElementById('factor');
        if(element != null){
            element.innerText = todays_factor();
        }
    }, 0);
};

